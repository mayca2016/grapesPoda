import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { DbService } from 'src/app/services/db.service';
import { MatSelect } from '@angular/material/select';
import { FotosService } from 'src/app/services/fotos.service';
import { IonSegment, AlertController, LoadingController, ToastController, NavController, ActionSheetController } from '@ionic/angular';
import { Network } from '@ionic-native/network/ngx';
import { HttpService } from 'src/app/services/http.service';
import { loadingController } from '@ionic/core';
import { MenuService } from 'src/app/services/menu.service';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker/ngx';
import { DomSanitizer } from '@angular/platform-browser';



export interface Conteo {
  id_planta: number;
  id_usuario: number;
  fecha: string;
  uveros: number;
  brocadas: number;
  t1: number;
  t2: number;
  t3: number;
  t4: number;
  ybrocadas: number;
  marcada: number;
  valoracion: number;
  id_conteoApp: number;
  enviado: number;
  observacion: string;
  
  

}

@Component({
  selector: 'app-poda',
  templateUrl: './poda.page.html',
  styleUrls: ['./poda.page.scss'],
})
export class PodaPage implements OnInit {

  @ViewChild(IonSegment,{ static: true }) segment: IonSegment
  
  fecha: any;
  fechaActual: any;
  usuario: any;
  idPlanta: any;
  idParcela: any;
  idApp: any;
  productor: string;
  variedad: string;
  localidad: string;
  fincaparcela: string;
  identificacion: string;
  anyo: string;
  galeria=[];
  valorSegmento="conteo";
  total=0;
  fotos:any;

  
  public conteoForm: FormGroup;
  protected conteo: Conteo; 
  protected datos: any;
  protected image: string = null;
  protected imagenes:any;


  constructor(
    private activatedRoute: ActivatedRoute,
    private storage : Storage,
    private formBuilderService : FormBuilder,
    private db: DbService,
    private route:  Router,
    private fotoService: FotosService,
    private alertCtrl: AlertController,
    private network: Network,
    private http:   HttpService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private zone: NgZone,
    private navCtrl: NavController,
    private actionSheet: ActionSheetController,
    private menuService: MenuService,
    private imagePicker: ImagePicker,
    private sanitizer:DomSanitizer
    
    
  ) { }

  ngOnInit() {

   this.activatedRoute.paramMap.subscribe( 
      (val)=>{
        console.log(val.get('id'));
        let dato = val.get('id');
        console.log(JSON.parse(dato));
       let dat = JSON.parse(dato);
       this.idParcela =(dat['parcela']);
       this.idPlanta =dat['planta'];
       this.idApp = dat['idApp']
       this.fechaActual = new Date().toISOString();
       this.fecha = this.fechaActual.split("T");

       /** COMPROBAR SI ES CONTEO NUEVO O EDICIÓN */
       this.conteoForm = this.formBuilderService.group({
        id_planta:[this.idPlanta],
        uveros:[0],
        brocadas:[0],
        t1:[2],
        t2:[0],
        t3:[0],
        t4:[0],
        ybrocadas:[0],
        marcada:[false],
        valoracion:[0],
        observacion:[],
      
      })
       if(this.idApp!=0){
         this.cargarFormulario(this.idApp).then(
           () =>{
             let marcada;
           if(this.conteo.marcada==0){
             marcada = false;
           }else{
             marcada = true;
           }
            this.conteoForm = this.formBuilderService.group({
              id_planta:[this.idPlanta],
              uveros:[this.conteo.uveros],
              brocadas:[this.conteo.brocadas],
              t1:[this.conteo.t1],
              t2:[this.conteo.t2],
              t3:[this.conteo.t3],
              t4:[this.conteo.t4],
              ybrocadas:[this.conteo.ybrocadas],
              marcada:[marcada],
              valoracion:[this.conteo.valoracion],
              observacion:[this.conteo.observacion]
            })

            
           this.cargarFotos();
           this.total=this.conteo.uveros+ this.conteo.brocadas+this.conteo.t1+this.conteo.t2+this.conteo.t3+this.conteo.t4+ this.conteo.ybrocadas;
           }
         
           
         );
       }else{

        this.comprobarConteo(this.fecha, this.idPlanta).then(
          (id)=>{
            console.log(id)
            if(id === false){
              this.conteoForm = this.formBuilderService.group({
                id_planta:[this.idPlanta],
                uveros:[0],
                brocadas:[0],
                t1:[0],
                t2:[0],
                t3:[0],
                t4:[0],
                ybrocadas:[0],
                marcada:[false],
                valoracion:[0],
                observacion:[]
              })
              this.total=this.conteo.uveros+ this.conteo.brocadas+this.conteo.t1+this.conteo.t2+this.conteo.t3+this.conteo.t4+ this.conteo.ybrocadas;
            }else{
              this.cargarFormulario(id).then(
                () =>{
                  let marcada;
                  if(this.conteo.marcada==0){
                    marcada = false;
                  }else{
                    marcada = true;
                  }

                 this.conteoForm = this.formBuilderService.group({
                   id_planta:[this.idPlanta],
                   uveros:[this.conteo.uveros],
                   brocadas:[this.conteo.brocadas],
                   t1:[this.conteo.t1],
                   t2:[this.conteo.t2],
                   t3:[this.conteo.t3],
                   t4:[this.conteo.t4],
                   ybrocadas:[this.conteo.ybrocadas],
                   marcada:[marcada],
                   valoracion:[this.conteo.valoracion],
                   observacion:[this.conteo.observacion],
                 })
     
                 this.total=this.conteo.uveros+ this.conteo.brocadas+this.conteo.t1+this.conteo.t2+this.conteo.t3+this.conteo.t4+ this.conteo.ybrocadas;
                 this.cargarFotos();
                }
              
              );
            }
          
          }
        ).catch(
          ()=>{
            //no hay conteo
            this.conteoForm = this.formBuilderService.group({
              id_planta:[this.idPlanta],
              uveros:[0],
              brocadas:[0],
              t1:[0],
              t2:[0],
              t3:[0],
              t4:[0],
              ybrocadas:[0],
              marcada:[false],
              valoracion:[0],
              observacion:[]
            })
          }
       
          );
       

          this.conteoForm.valueChanges.subscribe(datos => {
            // Lo que desees hacer
          console.log("prueba");
              });
       }

      
      this.cargarDatos(this.idParcela).then(
          ()=>{
           
          }
        ).catch();
        
        
       
  
        this.storage.get('idusuario').then(
          (val)=>{
            console.log("Nombre"+val);
            this.usuario=val;
          }
        );
        

        this.conteoForm.valueChanges.subscribe(datos => {
          // Lo que desees hacer
        console.log("prueba");
            });

      }
    );
  }

    /**
   * MENU
   */
  async menu() {
   
    const actionSheet = await this.actionSheet.create({
      header: 'Opciones',
      buttons: this.menuService.createButtons()
     
    });
    await actionSheet.present();
   
  
  }

  /**
   * RECOGER DATOS CONTEO ANTERIOR
   * @param id 
   */
  async cargarFormulario(id){
    console.log(id);
    let sql="SELECT * FROM conteo_poda WHERE id_conteoAPP="+id;

    await this.db.devolverTabla(sql).then(
      (datos)=>{
        console.log(datos[0])
          this.conteo = datos[0];
        
      }
    ).catch(
      error =>{
        console.log("Error devolver tabla planta"+JSON.stringify(error));
      }
    );

  }
  
  /**
   * COMPROBAR SI HAY CONTEO EN ESA PLANTA ESE DIA
   * @param fecha 
   * @param id 
   */
  async comprobarConteo(fecha, id){

    return new Promise((resolve, reject) => {
      let sql="SELECT * FROM conteo_poda WHERE id_planta="+this.idPlanta+" and fecha LIKE '"+this.fecha[0]+"%'";

      this.db.devolverTabla(sql).then(
        (datos)=>{
          if(datos.length>0){
            console.log("existe");
            this.idApp = datos[0]['id_conteoAPP'];
            resolve(datos[0]['id_conteoAPP']);
          }else{
            resolve(false);
          }
          
        }
      ).catch(
        error =>{
          console.log("Error devolver tabla planta"+JSON.stringify(error));
          resolve(false);
        }
      );
    }); 
    

  }

  /**
   * RECOGER DATOS INFORMACION PARCELA
   * @param id 
   */
  async cargarDatos(id){

    if(id==0){
      
      let sql="SELECT id_parcela FROM plantas WHERE id_planta="+this.idPlanta;

      await this.db.devolverTabla(sql).then(
        (idParc)=>{

            let idPar = idParc[0]['id_parcela'];
            let sql="SELECT nombre, descripción,localidad,fincaparcela, identificacion,anyo FROM parcelas WHERE id_parcela="+idPar;

            this.db.devolverTabla(sql).then(
              (datos)=>{
                  this.datos = datos;
                  console.log(datos[0]['nombre']);
                  this.productor= datos[0]['nombre'];
                  this.variedad= datos[0]['descripción'];
                  this.localidad= datos[0]['localidad'];
                  this.fincaparcela = datos[0]['fincaparcela'];
                  this.identificacion = datos[0]['identficiacion'];
                  this.anyo = datos[0]['anyo'];
              }
            ).catch(
              error =>{
                console.log("Error devolver tabla planta"+JSON.stringify(error));
              }
            );
        }
      ).catch(
        error =>{
          console.log("Error devolver tabla planta"+JSON.stringify(error));
        }
      );
    }else{
      let sql="SELECT nombre, descripción,localidad,fincaparcela, identificacion,anyo FROM parcelas WHERE id_parcela="+id;

      await this.db.devolverTabla(sql).then(
        (datos)=>{
            this.datos = datos;
            console.log(datos[0]['nombre']);
            this.productor= datos[0]['nombre'];
            this.variedad= datos[0]['descripción'];
            this.localidad= datos[0]['localidad'];
            this.fincaparcela = datos[0]['fincaparcela'];
            this.identificacion = datos[0]['identficiacion'];
            this.anyo = datos[0]['anyo'];

        }
      ).catch(
        error =>{
          console.log("Error devolver tabla planta"+JSON.stringify(error));
        }
      );
    }
   
   
  }

  /**
   * CAPTURA UNA FOTO
   */
  foto(tipo){
    if(this.idApp==0){
      //GUARDAMOS LOS DATOS
      let datosConteo = this.conteoForm.value;
      let marcada;
      if(this.conteoForm.value.marcada ==false){
        marcada=0;
      }else{
        marcada=1
      }
      let insertRows = [];
      insertRows.push(["INSERT INTO conteo_poda (id_planta, id_usuario, fecha, uveros, brocadas, t1, t2, t3, t4, ybrocadas, marcada, valoracion,enviado) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)",
      [this.idPlanta ,this.usuario,this.fechaActual, datosConteo.uveros, datosConteo.brocadas, datosConteo.t1, datosConteo.t2, datosConteo.t3, datosConteo.t4, datosConteo.ybrocadas,marcada, datosConteo.valoracion,0]]);
      
      this.db.insertar(insertRows).then(
        ()=>{
           console.info("Insertado Conteo");
           //retorna id_conteo
           let sql = "SELECT id_conteoAPP FROM conteo_poda ORDER BY id_conteoApp DESC";
           this.db.devolverTabla(sql).then(
             (dato)=>{
               console.log(dato[0]['id_conteoAPP']);
               this.idApp=dato[0]['id_conteoAPP'];
               this.fotoService.foto('poda',dato[0]['id_conteoAPP'], this.fechaActual, this.usuario, this.idPlanta,tipo)
              
            }
           ).catch(
            (error)=>{
              console.log("Error conteo"+JSON.stringify(error));
              }
            );
          }
      ).catch(
        (error)=>{
          console.log("Error conteo"+JSON.stringify(error));
      }
      );
    }else{
       //MODIFICAMOS DATOS
       this.db.modficarConteoPoda(this.idApp,this.conteoForm.value).then(
        ()=>{
          console.log("modificado");
          console.log("appmodificar"+this.idApp);
            this.fotoService.foto('poda',this.idApp, this.fechaActual, this.usuario, this.idPlanta,tipo)
          
        }
      ).catch(
       (error)=>{
         console.log("Error  modificar conteo"+JSON.stringify(error));
        
     }
      );
    }

  }

 

  /**
   * CARGAR FOTOS TABLA
   */
  cargarFotos(){
    console.log(this.idApp+"imagenes");
    this.galeria=[];
    if(this.idApp !=0){
      let sql="SELECT * FROM fotos_poda WHERE id_App="+this.idApp;
      this.db.devolverTabla(sql).then(
        (datos)=>{
          
         
          for(var i=0; i<Object.keys(datos).length;i++){
            console.log(datos[i]);
          
            
            this.galeria.push({
              id:datos[i]['id_foto'],
              fotoNombre:datos[i]['fotoNombre'],
              fotoPath:datos[i]['fotoPath'],
              fotoFile:datos[i]['fotoFile'],
              fotoImagen:datos[i]['imagen']
            })
            
          }
          console.log(this.galeria[0]);
        }
      ).catch(
        (error)=>{
          console.log("error fotos"+JSON.stringify(error));
        }
      );
    }
   
  }

  async enviar(){
    const loading = await this.loadingCtrl.create({
      message: "Subiendo CONTEO al Servidor"
    });
    await loading.present();
    
   await this.insertar().then(
     ()=>{
       //COMPROBAR CONEXIÓN
       if(this.network.type == "none" || this.network.type == "unknown"){
         //no hay conexión
         console.log("no hay");
         this.presentToast("NO HAY CONEXIÓN");
         this.zone.run(async () => {

          this.navCtrl.navigateForward(['/home'], {animated:true});
          
        });
         loading.dismiss();
       }else{
       
        let sql= "SELECT * FROM conteo_poda WHERE id_conteoAPP="+this.idApp;
            this.db.devolverTabla(sql).then(
              (data) =>{
                console.log(data[0]);
                this.http.postInsertar(data[0], `/conteoPoda`).then(
                  (data) =>{
                    console.log("id"+data);
                    if(data!=null){
                      let sql = "SELECT * FROM fotos_poda WHERE id_App="+this.idApp;
                      this.db.devolverTabla(sql).then(
                        (imagenes)=>{
                          console.log("image"+JSON.stringify(imagenes));
                          this.http.postInsertar(imagenes,`fotosPoda`).then(
                           (data)=>{
                            console.log("id"+data);
                           
                            
                            this.db.modificarEnvio('conteo_poda','id_conteoAPP',this.idApp,1).then(
                              ()=>{
                               
                                this.db.modificarEnvio('fotos_poda','id_App',this.idApp,1).then(
                                  ()=>{
                                    loading.dismiss();
                                    this.fotoService.descarga(imagenes);
                                    this.zone.run(async () => {

                                      this.navCtrl.navigateForward(['/home'], {animated:true});
                                      
                                    });
                                  }
                                ).catch(
                                  (error)=>{
                                    loading.dismiss();
                                    console.log("Error modificar poda"+JSON.stringify(error));
                                  }
                                );
                              }
                            ).catch(
                              (error)=>{
                                loading.dismiss();
                                console.log("Error modificar poda"+JSON.stringify(error));
                              }
                            );
                            loading.dismiss();

                           }
                          ).catch(
                            (error) =>{
                              loading.dismiss();
                              console.log("Error http"+JSON.stringify(error));
                            }
                          );
                        }
                      ).catch(
                        (error) =>{
                          loading.dismiss();
                          console.log("Error http"+JSON.stringify(error));
                        }
                      );

                     
                    }
                    loading.dismiss();
                  }
                ).catch(
                  (error) =>{
                    loading.dismiss();
                    console.log("Error http"+JSON.stringify(error));
                  }
                )
              }
            ).catch(
              (error) =>{
                loading.dismiss();
                console.log("Error http"+JSON.stringify(error));
              }
            );
       }
     }
   ).catch();
    
  }

  insertar(){
    return new Promise((resolve, reject) => {

      if(this.idApp == 0){
        //INSERTAMOS LOS DATOS
        let datosConteo = this.conteoForm.value;
        let insertRows = [];
        insertRows.push(["INSERT INTO conteo_poda (id_planta, id_usuario, fecha, uveros, brocadas, t1, t2, t3, t4, ybrocadas, marcada, valoracion,enviado) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [this.idPlanta ,this.usuario,this.fechaActual, datosConteo.uveros, datosConteo.brocadas, datosConteo.t1, datosConteo.t2, datosConteo.t3, datosConteo.t4, datosConteo.ybrocadas,datosConteo.marcada, datosConteo.valoracion,0]]);
        
        this.db.insertar(insertRows).then(
          ()=>{
             console.info("Insertado Conteo");
             let sql = "SELECT id_conteoAPP FROM conteo_poda ORDER BY id_conteoApp DESC";
             this.db.devolverTabla(sql).then(
               (id)=>{
                 console.log("ID"+id[0]['id_conteoAPP']);
                 this.idApp=id[0]['id_conteoAPP'];
                resolve(true);
               }
             ).catch(
               ()=>{
               }
             );
            
            }
        ).catch(
          (error)=>{
            console.log("Error conteo"+JSON.stringify(error));
            resolve(false);
        }
        );
      }else{
        //MODIFICAMOS DATOS
       this.db.modficarConteoPoda(this.idApp, this.conteoForm.value).then(
         ()=>{
           console.log(this.idApp);
           console.log(this.conteoForm.value);
           console.log("modificado");
          resolve(true);
         }
       ).catch(
        (error)=>{
          console.log("Error  modificar conteo"+JSON.stringify(error));
          resolve(false);
      }
       );
      }
    });
  }

  /**
  * EVENTO CAMBIO PESTAÑA
  * @param ev 
  */
 segmentChanged(ev: any) {
  this.valorSegmento= ev.detail.value;
  
  console.log(this.valorSegmento);
  console.log('Segment changed', ev);
  if(this.valorSegmento ==="fotos"){
    this.galeria=[];
    this.cargarFotos();
  }
}

async eliminar(img,pos,id) {
  const alert = await this.alertCtrl.create({
    header: 'Confirm!',
    message: 'Va a eliminar una imagen',
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel',
        cssClass: 'secondary',
        handler: (blah) => {
          console.log('Confirm Cancel: blah');
        }
      }, {
        text: 'Eliminar',
        handler: () => {
          console.log('Confirm Okay');
          this.galeria.splice(pos,1);
          console.log(img);
          let sql="DELETE FROM fotos_poda WHERE id_foto="+id;
          this.fotoService.deleteImage(img);
          this.db.borrarTabla(sql).then(
             ()=>{
                    console.log("SE ha elimindo");
              this.galeria.splice(pos,1);
              this.fotoService.deleteImage(img);
          }
          ).catch(
            ()=>{
             console.log("No se ha elminado la imagen");
            }
          );
         
        }
      }
    ]
  });

  await alert.present();
}

sumar(){
  console.log("sumar");
  this.total = this.conteoForm.value.uveros+ this.conteoForm.value.brocadas+this.conteoForm.value.t1+this.conteoForm.value.t2+this.conteoForm.value.t3+this.conteoForm.value.t4+ this.conteoForm.value.ybrocadas;
}
async presentToast(msg) {
  const toast = await this.toastCtrl.create({
    message: msg,
    duration: 5000
  });
  toast.present();
}



}
