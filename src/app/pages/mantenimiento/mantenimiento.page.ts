import { Component, OnInit, NgZone } from '@angular/core';
import { NavController, ActionSheetController, AlertController, ToastController } from '@ionic/angular';
import { DbService } from 'src/app/services/db.service';
import { HttpService } from 'src/app/services/http.service';
import { Storage } from '@ionic/storage';
import { MenuService } from 'src/app/services/menu.service';

@Component({
  selector: 'app-mantenimiento',
  templateUrl: './mantenimiento.page.html',
  styleUrls: ['./mantenimiento.page.scss'],
})
export class MantenimientoPage implements OnInit {

  private grupo;
  private urlParcela;
  private urlPlanta;

  constructor(
    private zone        : NgZone,
    private navCtrl      : NavController,
    private actionSheet  : ActionSheetController,
    private db           : DbService,
    private http         : HttpService,
    private alertCtrl    : AlertController,
    private toastCtrl    : ToastController,
    private storage      : Storage,
    private menuService : MenuService
  ) { }

  ngOnInit() {
    this.storage.get('grupo').then(
      (val)=>{
        console.log("Grupo"+val);
        this.grupo=val;
       
          this.urlParcela  = 'parcela/'+this.grupo;
          this.urlPlanta  = 'planta/'+this.grupo;
        

        
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
  /***
   * PROCESO CREACIÓN TABLAS(ELIMINACIÓN) 
   * E INSERTAR DATOS API REST
   */
   /**
   * ELIMINAR DE LA BD Y DE LA LISTA
   * @param id 
   * @param pos 
   */
  async descarga(id, pos) {
    const alert = await this.alertCtrl.create({
      header: 'Confirm!',
      message: 'Va a realizar una Carga de DATOS',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'OK',
          handler: () => {
            this.crearTablasCarga();
         
   
          }
        }
      ]
    });

    await alert.present();
  }
  

  /**
   * PROCESO RESETEO TABLAS
   * DE INSERCCION DATOS APP
   */
  async reset(id, pos) {
    const alert = await this.alertCtrl.create({
      header: 'Confirm!',
      message: 'Va a eliminar todos los DATOS.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'OK',
          handler: () => {
            this.crearTablas();
         
   
          }
        }
      ]
    });

    await alert.present();
  }

   /**
   * Elimina- crear e insertar datos
   */
  async crearTablasCarga(){

    
    let sql_usuario ="CREATE TABLE IF NOT EXISTS usuario(id_usuario INTEGER, username TEXT, password TEXT, idgrupo INTEGER)";
    let sql_plantas="CREATE TABLE IF NOT EXISTS plantas(id_planta INTEGER, id_parcela INTEGER)";
    let sql_parcelas ="CREATE TABLE IF NOT EXISTS parcelas(id_parcela INTEGER, anyo INTEGER, fincaparcela INTEGER, identificacion TEXT, nombre TEXT, descripción TEXT, localidad TEXT, descripcion TEXT, grupo INTEGER, id_productor INTEGER)";

    /******   TABLA USUARIO  */
    this.db.comprobarTabla('SELECT * FROM usuario').then(
      ()=>{
        this.db.borrarTabla('DROP TABLE usuario').then(
          ()=>{
            console.log("Tabla usuario eliminado");
            this.db.createTable(sql_usuario).then(
              ()=>{
                console.log("creado usuario");
                /******* CARGAR DATOS USUARIO */
                 this.http.obtenerDatos(`usuario`).subscribe(
                  resp => {
                    console.log(resp);
                    let insertRows = [];
                    if(Object.keys(resp).length>0){
                      for(let i=0; i<Object.keys(resp).length;i++){
                        insertRows.push([
                          "INSERT INTO usuario (id_usuario, username, password) VALUES (?,?,?)",[resp[i].id_usuario, resp[i].username,resp[i].password]
                        ]);
                      }

                      this.db.insertar(insertRows).then(
                        ()=>{
                          console.info("Insertado Usuario");
                          this.presentToast("USUARIOS insertado OK");
                          
                        }
                      ).catch(
                        (error)=>{
                          console.log("Error usuario");
                          this.presentToast("USUARIOS insertado ERROR");
                        }
                      );
                    }
                    
                    
                  }
                );
              }
            ).catch(
              (error)=>{
                console.log("Error insertar Usuario"+JSON.stringify(error));
              }
            );

          }           
        ).catch(
          (error)=>{
            console.log("Error borrar Usuario"+JSON.stringify(error));
          }
        );
      }
    ).catch(
      (error)=>{
        console.log("Error No existe tabla"+JSON.stringify(error));
        this.db.createTable(sql_usuario).then(
          ()=>{
            console.log("creado usuario");
            /******* CARGAR DATOS USUARIO */
             this.http.obtenerDatos(`usuario`).subscribe(
              resp => {
                console.log(resp);
                let insertRows = [];
                if(Object.keys(resp).length>0){
                  for(let i=0; i<Object.keys(resp).length;i++){
                    insertRows.push([
                      "INSERT INTO usuario (id_usuario, username, password, idgrupo) VALUES (?,?,?,?)",[resp[i].id_usuario, resp[i].username,resp[i].password, resp[i].grupo]
                    ]);
                  }

                  this.db.insertar(insertRows).then(
                    ()=>{
                      console.info("Insertado Usuario");
                      
                    }
                  ).catch(
                    (error)=>{
                      console.log("Error usuario");
                    }
                  );
                }
                
                
              }
            );
          }
        ).catch(
          (error)=>{
            console.log("Error insertar Usuario"+JSON.stringify(error));
          }
        );
      }
    );

    

     /******   TABLA PARCELAS  */
     this.db.comprobarTabla('SELECT * FROM parcelas').then(
      ()=>{
        this.db.borrarTabla('DROP TABLE parcelas').then(
          ()=>{
            console.log("Tabla parcelas eliminado");
            this.db.createTable(sql_parcelas).then(
              ()=>{
                console.log("creado parcelas");
                /******* CARGAR DATOS PARCELAS */
                 this.http.obtenerDatos(this.urlParcela).subscribe(
                  resp => {
                    console.log(resp);
                    let insertRows3 = [];
                    if(Object.keys(resp).length>0){
                      for(let i=0; i<Object.keys(resp).length;i++){
                        insertRows3.push([
                          "INSERT INTO parcelas (id_parcela, anyo, fincaparcela, identificacion, nombre, descripción, localidad, descripcion,grupo,id_productor) VALUES (?,?,?,?,?,?,?,?,?,?)",
                          [resp[i].id_parcela, resp[i].anyo, resp[i].fincaparcela, resp[i].identificacion, resp[i].nombre, resp[i].descripción, resp[i].localidad, resp[i].descripcion, resp[i].grupo, resp[i].id_productor]
                        ]);
                      }

                      this.db.insertar(insertRows3).then(
                        ()=>{
                          console.info("Insertado parcela");
                          this.presentToast("PARCELAS insertado OK");
                           /******   TABLA PLANTAS  */
                          this.db.comprobarTabla('SELECT * FROM plantas').then(
                            ()=>{
                              this.db.borrarTabla('DROP TABLE plantas').then(
                                ()=>{
                                  console.log("Tabla plantas eliminado");
                                  this.db.createTable(sql_plantas).then(
                                    ()=>{
                                      console.log("creado plantas");
                                      /******* CARGAR DATOS PLANTA */
                                      this.http.obtenerDatos(this.urlPlanta).subscribe(
                                        resp => {
                                          console.log(resp);
                                          let insertRows2 = [];
                                          if(Object.keys(resp).length>0){
                                           for(let i=0; i<Object.keys(resp).length;i++){
                                              insertRows2.push([
                                                "INSERT INTO plantas (id_planta, id_parcela) VALUES (?,?)",[resp[i].id_planta, resp[i].id_parcela]
                                              ]);
                                            }

                                            this.db.insertar(insertRows2).then(
                                              ()=>{
                                                console.info("Insertado Planta");
                                                this.presentToast("PLANTAS insertado OK");
                                                
                                              }
                                            ).catch(
                                              (error)=>{
                                                console.log("Error planta"+JSON.stringify(error));
                                                this.presentToast("PLANTAS insertado ERROR"+JSON.stringify(error));
                                              }
                                            );
                                          }
                                          
                                          
                                        }
                                      );
                                    }
                                  ).catch(
                                    (error)=>{
                                      console.log("Error insertar planta"+JSON.stringify(error));
                                    }
                                  );

                                }           
                              ).catch(
                                (error)=>{
                                  console.log("Error borrar planta"+JSON.stringify(error));
                                }
                              );
                            }
                          ).catch(
                            (error)=>{
                              console.log("Error No existe tabla"+JSON.stringify(error));
                              this.db.createTable(sql_plantas).then(
                                ()=>{
                                  console.log("creado plantas");
                                  /******* CARGAR DATOS PLANTA */
                                  this.http.obtenerDatos(`planta`).subscribe(
                                    resp => {
                                      console.log(resp);
                                      let insertRows2 = [];
                                      if(Object.keys(resp).length>0){
                                        for(let i=0; i<Object.keys(resp).length;i++){
                                          insertRows2.push([
                                            "INSERT INTO planta (id_planta, id_parcela) VALUES (?,?)",[resp[i].id_planta, resp[i].id_parcela]
                                          ]);
                                        }

                                        this.db.insertar(insertRows2).then(
                                          ()=>{
                                            console.info("Insertado Planta");
                                            
                                          }
                                        ).catch(
                                          (error)=>{
                                            console.log("Error planta"+JSON.stringify(error));
                                          }
                                        );
                                      }
                                      
                                      
                                    }
                                  );
                                }
                              ).catch(
                                (error)=>{
                                  console.log("Error insertar planta"+JSON.stringify(error));
                                }
                              );
                            }
                          );
                          
                        }
                      ).catch(
                        (error)=>{
                          console.log("Error parcela");
                          this.presentToast("PARCELAS insertado ERROR");
                        }
                      );
                    }
                    
                    
                  }
                );
              }
            ).catch(
              (error)=>{
                console.log("Error insertar parcela"+JSON.stringify(error));
              }
            );

          }           
        ).catch(
          (error)=>{
            console.log("Error borrar parcela"+JSON.stringify(error));
          }
        );
      }
    ).catch(
      (error)=>{
        console.log("Error No existe tabla"+JSON.stringify(error));
        this.db.createTable(sql_parcelas).then(
          ()=>{
            console.log("creado parcelas");
            /******* CARGAR DATOS PARCELAS */
             this.http.obtenerDatos(`parcela`).subscribe(
              resp => {
                console.log(resp);
                let insertRows3 = [];
                if(Object.keys(resp).length>0){
                  for(let i=0; i<Object.keys(resp).length;i++){
                    insertRows3.push([
                      "INSERT INTO parcelas (id_parcela, anyo, fincaparcela, identificacion, nombre, descripción, localidad, descripcion,grupo) VALUES (?,?,?,?,?,?,?,?,?)",
                      [resp[i].id_parcela, resp[i].anyo, resp[i].fincaparcela, resp[i].identificacion, resp[i].nombre, resp[i].descripción, resp[i].localidad, resp[i].descripcion, resp[i].grupo]
                    ]);
                  }

                  this.db.insertar(insertRows3).then(
                    ()=>{
                      console.info("Insertado parcela");
                      
                    }
                  ).catch(
                    (error)=>{
                      console.log("Error parcela");
                    }
                  );
                }
                
                
              }
            );
          }
        ).catch(
          (error)=>{
            console.log("Error insertar parcela"+JSON.stringify(error));
          }
        );
      }
    );

  }

  /** ELIMINAR- CREAR  TABLAS RESET */
  async crearTablas(){
    let sql_poda ="CREATE TABLE IF NOT EXISTS conteo_poda(id_conteoAPP INTEGER PRIMARY KEY, id_planta INTEGER, id_usuario INTEGER, fecha TEXT, uveros INTEGER, brocadas INTEGER, t1 INTEGER, t2 INTEGER, t3 INTEGER, t4 INTEGER, ybrocadas INTEGER, marcada INTEGER, valoracion INTEGER,enviado INTEGER, observacion TEXT)";
    let sql_podafotos ="CREATE TABLE IF NOT EXISTS fotos_poda(id_foto INTEGER PRIMARY KEY, id_App INTEGER, id_planta INTEGER, id_usuario INTEGER, fecha TEXT, fotoNombre TEXT, fotoPath TEXT, fotoFile TEXT,imagen TEXT, enviado INTEGER)";

        /***** CONTEO PODA COMPROBAR - ELIMINAR -CREAR */
        await this.db.comprobarTabla("SELECT * FROM conteo_poda").then(
          () =>{
            this.db.borrarTabla("DROP TABLE conteo_poda").then(
              ()=>{
                console.log("Tabla conteo_poda eliminado");
                this.db.createTable(sql_poda).then(
                  () =>{
                    console.log("CREado conteo_poda");
                    this.presentToast("PODA creado OK");
                  }
                ).catch(
                  (error)=>{
                    console.log("No creado conteo_poda "+error);
                    this.presentToast("PODA creado ERROR");
                  }
                );
              }
            ).catch(
              (error) =>{
                console.log("Error borrar conteo_poda"+error);
              }
            );
          }
        ).catch(
          error =>{
            console.log("No existe produconteo_podactor"+error);
            this.db.createTable(sql_poda).then(
              () =>{
                console.log("CREado  conteo_poda");
                this.presentToast("PODA creado OK");
              }
            ).catch(
              (error)=>{
                console.log("No creado  conteo_poda"+error);
                this.presentToast("PODA creado ERROR");
              }
            );
          } 
        );

         /***** FOTOS PODA COMPROBAR - ELIMINAR -CREAR */
         await this.db.comprobarTabla("SELECT * FROM fotos_poda").then(
          () =>{
            this.db.borrarTabla("DROP TABLE fotos_poda").then(
              ()=>{
                console.log("Tabla fotos_poda eliminado");
                this.db.createTable(sql_podafotos).then(
                  () =>{
                    console.log("CREado fotos_poda");
                    this.presentToast("fotos_poda creado OK");
                  }
                ).catch(
                  (error)=>{
                    console.log("No creado fotos_poda "+error);
                    this.presentToast("fotos_poda creado ERROR");
                  }
                );
              }
            ).catch(
              (error) =>{
                console.log("Error borrar contfotos_podaeo_poda"+error);
              }
            );
          }
        ).catch(
          error =>{
            console.log("No existe fotos_poda"+error);
            this.db.createTable(sql_podafotos).then(
              () =>{
                console.log("CREado  fotos_poda");
                this.presentToast("fotos_poda creado OK");
              }
            ).catch(
              (error)=>{
                console.log("No creado  fotos_poda"+error);
                this.presentToast("fotos_poda creado ERROR");
              }
            );
          } 
        );
  }

  async presentToast(msg) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 5000
    });
    toast.present();
  }
}
