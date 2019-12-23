import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Http , URLSearchParams} from '@angular/http';
import { environment } from 'src/environments/environment.prod';
import { DbService } from './db.service';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  token: string;
  idusuario: any;
  usuario: any;
  grupo: any;
  constructor(
    private storage: Storage,
    private http: Http,
    private db: DbService
  ) { }

  async cargar_storage(){
    let promesa = new Promise( (resolve, reject)=>{
      
      this.storage.ready()
        .then(()=>{
          this.storage.get("token")
            .then( token =>{
              if(token ){
                this.token= token;
              }
              
            })

            this.storage.get("idusuario")
            .then( idusuario =>{
              if(idusuario ){
                this.idusuario= idusuario;
                console.log( "usuario"+this.idusuario);
              }
              resolve();
            })
        })
      
    
  });

  return promesa;
  }

  login(username:string, password:string){
    let url = URL+'login';
    let data = new URLSearchParams();
    data.append("username", username);
    data.append("password", password);

    return new Promise(resolve=>{
      this.http.post(url,data).subscribe(
        data=>{
          console.log(data);
          if(data['ok']){
            const obj= (data['_body'] as any);
            const obj_json= JSON.parse(obj);
            console.log(obj_json['id_usuario']);
            if(obj_json['id_usuario']){
              console.log(obj_json['nombre']);
              this.usuario=obj_json['nombre'];
              this.idusuario=obj_json['id_usuario'];
              this.grupo = obj_json['grupo'];
              this.guardarStorage(obj_json['token'],obj_json['nombre'],obj_json['id_usuario'], obj_json['grupo']).then(
              ()=>{
                console.log("SEsión creada");
                this.storage.get("usuario").then(val=>{
                  console.log(val);
                });
                resolve(true);
              }
              ).catch(
                ()=>{
                  console.log("Error crear sesión");
                  resolve(false);
                }
              );
             
            }else{
              resolve(false);
            }
           
          }else{
            this.storage.clear();
            resolve(false);
          }
          /*const obj= (data['_body'] as any);
          const obj_json= JSON.parse(obj);
          console.log(obj_json['id_usuario']);
          this.validaToken*/
        },
      )
    })
      
  }

  loginBD(username:string, password:string){
  

    return new Promise(resolve=>{
      let sql = "SELECT * FROM usuario WHERE username='"+username+"' and password='"+password+"'";
      this.db.devolverTabla(sql).then(
        (usuario)=>{
          if(Object.keys(usuario).length>0){
            this.usuario=usuario[0]['username'];
              this.idusuario=usuario[0]['id_usuario'];
              this.grupo = usuario[0]['idgrupo'];
            this.guardarStorage("",usuario[0]['username'],usuario[0]['id_usuario'], usuario[0]['idgrupo']).then(
              ()=>{
                console.log("SEsión creada");
                this.storage.get("usuario").then(val=>{
                  console.log(val);
                });
                resolve(true);
              }
              ).catch(
                ()=>{
                  console.log("Error crear sesión");
                  resolve(false);
                }
              );
          }else{
            console.log("Error crear sesión");
            resolve(false);
          }
        }
      ).catch(
        (error)=>{
          console.log("Error"+JSON.stringify(error));
        }
      );
     
    })
      
  }
  guardarStorage(token, usuario,idusuario,grupo){

    return new Promise(resolve=>{
      //GUARDO EN STORAGE
      this.storage.set('token',token);
      this.storage.set('usuario',usuario);
      this.storage.set('idusuario',idusuario);
      this.storage.set('grupo',grupo);
      resolve(true);
    })
    

  }

  async cerrarSesion(){
    
    this.storage.clear();
    

  }
 
}
