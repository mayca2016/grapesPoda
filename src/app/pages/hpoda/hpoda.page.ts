import { Component, OnInit, NgZone } from '@angular/core';
import { DbService } from 'src/app/services/db.service';
import { NavController, AlertController, LoadingController, ActionSheetController } from '@ionic/angular';
import { Network } from '@ionic-native/network/ngx';
import { HttpService } from 'src/app/services/http.service';
import { MenuService } from 'src/app/services/menu.service';
import { FotosService } from 'src/app/services/fotos.service';

@Component({
  selector: 'app-hpoda',
  templateUrl: './hpoda.page.html',
  styleUrls: ['./hpoda.page.scss'],
})
export class HpodaPage implements OnInit {

  private conteos=[];
  constructor(
    private db: DbService,
    private zone: NgZone,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private network: Network,
    private loadingCtrl: LoadingController,
    private http: HttpService,
    private actionSheet: ActionSheetController,
    private menuService: MenuService,
    private fotoService: FotosService
  ) { }

  ngOnInit() {
    this.cargarHistorial();
  }

  /**
   * CARGAR LISTADO
   */
  cargarHistorial(){
    
    console.log("historial");
    let sql = "SELECT id_conteoAPP,fecha, id_planta, enviado FROM conteo_poda ORDER BY fecha, id_conteoAPP DESC" ;
    this.db.devolverTabla(sql).then(
      (conteos)=>{
        conteos.forEach(element => {
          let sql = "SELECT id_parcela FROM plantas WHERE id_planta="+element['id_planta'];
          this.db.devolverTabla(sql).then(
            (plantas)=>{
              let sql = "SELECT fincaparcela, identificacion, nombre,descripción FROM parcelas WHERE id_parcela ="+plantas[0]['id_parcela'];
              this.db.devolverTabla(sql).then(
                (parcela)=>{
                  this.conteos.push({
                    idApp:          element['id_conteoAPP'],
                    fecha:          element['fecha'],       
                    productor:      parcela[0]['nombre'],
                    fincaparcela:   parcela[0]['fincaparcela'],
                    identificacion: parcela[0]['identificacion'],
                    idPlanta:       element['id_planta'],
                    enviado:        element['enviado'],
                    idParcela:      plantas[0]['id_parcela']
                })
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
        });
      }
    ).catch(
      (error)=>{
        console.log("Error conteo"+JSON.stringify(error));
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
   * VER CONTEO
   * @param idPlanta 
   * @param idApp 
   * @param idParcela 
   */
  ver(idPlanta, idApp, idParcela){

    let dato = {
      planta: idPlanta,
      parcela: idParcela ,
      idApp:idApp  }

    this.zone.run(async () => {

      this.navCtrl.navigateForward(['/poda/'+JSON.stringify(dato)+'/idApp'], {animated:true});
    });
  }

   /**
   * ELIMINAR ENVIADOS
   */
  async eliminarEnviados() {
    const alert = await this.alertCtrl.create({
      header: 'Confirm!',
      message: 'Va a eliminar datos',
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
           
          let sql="DELETE FROM conteo_poda WHERE enviado=1";
          this.db.borrarTabla(sql).then(
            ()=>{
              let sql2="SELECT * FROM fotos_poda WHERE enviado=1"
              this.db.devolverTabla(sql2).then(
                (datos)=>{
                  datos.forEach(element => {
                    this.fotoService.deleteImage(element);
                    let sql3 = "DELETE  FROM fotos_poda WHERE id_foto="+element['id_foto'];
                    this.db.borrarTabla(sql3).then(
                      ()=>{
                        
                      
                      }
                    ).catch(
                      (error) =>{
                        console.log("errro"+ JSON.stringify(error));
                      }
                    );
                  });
                  
                }
              ).catch(
                (error) =>{
                  console.log("errro"+ JSON.stringify(error));
                }
              );
            }
          ).catch(
            (error) =>{
              console.log("errro"+ JSON.stringify(error));
            }
          );
         

         
   
          }
        }
      ]
    });

    await alert.present();
  }

     /**
   * ELIMINAR ENVIADOS
   */
  async eliminarTodos() {
    const alert = await this.alertCtrl.create({
      header: 'Confirm!',
      message: 'Va a eliminar datos',
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
           
          let sql="DELETE FROM conteo_poda";
          this.db.borrarTabla(sql).then(
            ()=>{
              let sql = "SELECT * FROM fotos_poda";
              this.db.devolverTabla(sql).then(
                (imagenes)=>{
                  imagenes.forEach(element => {
                    this.fotoService.deleteImage(imagenes);
                  });
                  let sql3 = "DELETE  FROM fotos_poda";
                this.db.borrarTabla(sql3).then(
                ()=>{
                          
                        
                        }
              ).catch(
                      (error) =>{
                        console.log("errro"+ JSON.stringify(error));
                      }
                    );
                }
              ).catch(
                (error) =>{
                  console.log("errro"+ JSON.stringify(error));
                }
              );
             
                 
              
            }
          ).catch(
            (error) =>{
              console.log("errro"+ JSON.stringify(error));
            }
          );
         

         
   
          }
        }
      ]
    });

    await alert.present();
  }

   /**
   * ELIMINAR
   * @param id 
   * @param pos 
   */
  async eliminar(id, pos) {
    const alert = await this.alertCtrl.create({
      header: 'Confirm!',
      message: 'Va a eliminar datos',
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
           
          let sql="DELETE FROM conteo_poda WHERE id_conteoAPP="+id;
          this.db.borrarTabla(sql).then(
            ()=>{
              let sql2="SELECT * FROM fotos_poda WHERE id_App="+id;
              this.db.devolverTabla(sql2).then(
                (datos)=>{
                  datos.forEach(element => {
                    this.fotoService.deleteImage(element);
                    let sql3 = "DELETE  FROM fotos_poda WHERE id_foto="+element['id_foto'];
                    this.db.borrarTabla(sql3).then(
                      ()=>{
                        
                        this.conteos.splice(pos,1);
                        this.fotoService.deleteImage(element);
                        
                      }
                    ).catch(
                      (error) =>{
                        console.log("errro"+ JSON.stringify(error));
                      }
                    );
                  });
                  
                }
              ).catch(
                (error) =>{
                  console.log("errro"+ JSON.stringify(error));
                }
              );
            }
          ).catch(
            (error) =>{
              console.log("errro"+ JSON.stringify(error));
            }
          );
         

         
   
          }
        }
      ]
    });

    await alert.present();
  }

  /**
   * SUBIDA CONTEO AL SERVIDOR
   * @param idApp 
   * @param pos 
   */
  async descarga(idApp,pos){

   
    //COMPROBAR CONEXION
    //comprobar la conexion a internet
   if(this.network.type == "none" || this.network.type == "unknown"){
     this.presentAlert('SIN CONEXIÓN', 'No ha conexión a internet.');
    
   }else{
     const loading = await this.loadingCtrl.create({
       message: "Realizando DESCARGA CONTEO PODA"
     });
    await loading.present();
     // si hay conexión
     let sql= "SELECT * FROM conteo_poda WHERE id_conteoAPP="+idApp;
            this.db.devolverTabla(sql).then(
              (data) =>{
                console.log(data[0]);
                this.http.postInsertar(data[0], `/conteoPoda`).then(
                  (data) =>{
                    console.log("id"+data);
                    if(data!=null){
                      let sql = "SELECT * FROM fotos_poda WHERE id_App="+idApp;
                      this.db.devolverTabla(sql).then(
                        (imagenes)=>{
                          console.log("image"+imagenes[0]['imagen']);
                          this.http.postInsertar(imagenes, `/fotosPoda`).then(
                           (data)=>{
                            console.log("id"+data);
                           
                            this.db.modificarEnvio('conteo_poda','id_conteoAPP',idApp,1).then(
                              ()=>{
                               
                                this.db.modificarEnvio('fotos_poda','id_App',idApp,1).then(
                                  ()=>{
                                    loading.dismiss();
                                    this.conteos[pos]['enviado']=1;
                                    this.fotoService.descarga(imagenes);
                                  }
                                ).catch(
                                  (error)=>{
                                    loading.dismiss();
                                    console.log("Error modificar poda"+JSON.stringify(error));
                                    this.conteos[pos]['enviado']=0;
                                  }
                                );
                              }
                            ).catch(
                              (error)=>{
                                loading.dismiss();
                                console.log("Error modificar poda"+JSON.stringify(error));
                                this.conteos[pos]['enviado']=0;
                              }
                            );
                            //loading.dismiss();

                           }
                          ).catch(
                            (error) =>{
                              loading.dismiss();
                              console.log("Error http"+JSON.stringify(error));
                              this.conteos[pos]['enviado']=0;
                            }
                          );
                        }
                      ).catch(
                        (error) =>{
                          loading.dismiss();
                          console.log("Error http"+JSON.stringify(error));
                          this.conteos[pos]['enviado']=0;
                        }
                      );

                     
                    }
                    loading.dismiss();
                  }
                ).catch(
                  (error) =>{
                    loading.dismiss();
                    console.log("Error http"+JSON.stringify(error));
                    this.conteos[pos]['enviado']=0;
                  }
                )
              }
            ).catch(
              (error) =>{
                loading.dismiss();
                console.log("Error http"+JSON.stringify(error));
                this.conteos[pos]['enviado']=0;
              }
            );
       

         

     }
    
   }

   async presentAlert(subtitulo,msg) {
    const alert = await this.alertCtrl.create({
      header: 'Alerta',
      subHeader: subtitulo,
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }

}
