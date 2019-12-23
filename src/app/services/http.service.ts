import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

import { Http, URLSearchParams, RequestOptions} from '@angular/http';
import { LoadingController } from '@ionic/angular';
import { map } from 'rxjs/operators';

const URL = 'https://app.moyca.net/grapespga/RestServerPoda/';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    private http : Http,
    private httpC : HttpClient,
    private loading: LoadingController
  ) { }

  public obtenerDatos(script){

    return this.httpC.get(URL+script);

  }

  async  post(datos, direccion){
    let url = URL+direccion;
    let data = new URLSearchParams();
    data.append('data',JSON.stringify(datos));

    return  await new Promise(resolve=>{
      this.http.post(url, data).subscribe(
        data=>{
          console.log(data);
          console.log("statu"+data['statusText']);
          if(data['statusText']=="Created"){
            const obj= (data['_body'] as any);
            const obj_json= JSON.parse(obj);
            console.log(obj_json['insertado']);
            console.log(obj_json['datos']);
            resolve(obj_json['insertado']);
            /*this.id=obj_json['id'];
            this.insertado=obj_json['insertado'];
            if(this.id===null){
              resolve(false);
            }else{
              resolve(this.id);
            }*/
          }else{
            resolve(false);
            console.log("error");
          }
         
        },
      )
    })
  }

  async  postInsertar(datos, direccion){
    let url = URL+direccion;
    let data = new URLSearchParams();
    data.append('data',(JSON.stringify(datos)));

    return  await new Promise(resolve=>{
      this.http.post(url, data).subscribe(
        data=>{
          console.log(data);
          console.log("statu"+data['statusText']);
          if(data['statusText']=="Created"){
            const obj= (data['_body'] as any);
            const obj_json= JSON.parse(obj);
            console.log(obj_json['id']);
            resolve(obj_json['id']);
            /*this.id=obj_json['id'];
            this.insertado=obj_json['insertado'];
            if(this.id===null){
              resolve(false);
            }else{
              resolve(this.id);
            }*/
            resolve(true);

          }else{
            resolve(false);
            console.log("error");
          }
         
        },
      )
    })
  }
 
}
