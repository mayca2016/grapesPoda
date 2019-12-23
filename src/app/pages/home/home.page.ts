import { Component, NgZone } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ActionSheetController, NavController, AlertController, ToastController, LoadingController } from '@ionic/angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { DbService } from 'src/app/services/db.service';
import { Network } from '@ionic-native/network/ngx';
import { HttpService } from 'src/app/services/http.service';
import { MenuService } from 'src/app/services/menu.service';
import { FotosService } from 'src/app/services/fotos.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  nombre:   any;
  usuario:  any;
  fecha:    any;
  enviado=0;

  constructor(
    private storage     : Storage,
    private actionSheet : ActionSheetController,
    private zone        : NgZone,
    private navCtrl     : NavController,
    private alertCtrl   : AlertController,
    private barcodeScanner : BarcodeScanner,
    private db: DbService,
    private network:    Network,
    private toastCtrl:  ToastController,
    private http:       HttpService,
    private loadingCtrl:  LoadingController,
    private menuService: MenuService,
    private fotoService: FotosService
  ) {

    this.storage.get('usuario').then(
      (val)=>{
        console.log("Nombre"+val);
        this.nombre=val;
      }
    );
    this.storage.get('idusuario').then(
      (val)=>{
        console.log("Nombre"+val);
        this.usuario=val;
      }
    );

    let fech =new Date().toISOString();
    let fecha=  fech.split('T');
    this.fecha  = fecha[0];

    this.comprobarEnvios();


  }
  ionViewWillEnter(){
    console.log("envios");

    this.comprobarEnvios();
  }

  /**
   *
   * Abrir poda
   * @param {*} id
   * @param {*} pos
   * @memberof HomePage
   */
  async conteo(opcion) {
    const alert = await this.alertCtrl.create({
      header: 'CONTEO!',
      message: 'Método Lectura.',
      buttons: [
        {
          text: 'QR',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
            this.scan(opcion)
          }
        }, {
          text: 'PLANTA',
          handler: () => {
            this.zone.run(async () => {

              this.navCtrl.navigateForward(['/selector/'+opcion], {animated:true});
            });
         
   
          }
        }
      ]
    });

    await alert.present();
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
   * LECTURA QR
   * @param opcion 
   */
  scan(opcion){
      
    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Barcode data', barcodeData);
      console.log('Barcode data', barcodeData['text']);
      let dato = {
        planta: barcodeData['text'],
        parcela: 0 ,
        idApp:0   }
      this.zone.run(async () => {

        this.navCtrl.navigateForward(['/'+opcion+'/'+JSON.stringify(dato)+'/0'], {animated:true});
      });
      }).catch(err => {
      console.log('Error', err);
      });
  }

  /**
   * COMPROBAR SI HAY DESCARGAS PENDIENTES
   */
  comprobarEnvios(){
    //conteo_poda
    console.log("comproba");
    let sql= "SELECT id_conteoAPP, enviado FROM conteo_poda WHERE enviado=0";
    this.db.devolverTabla(sql).then(
      (poda)=>{
        console.log(poda);
        if(Object.keys(poda).length>0){
          this.enviado=this.enviado+1;
        }
        let sql= "SELECT id_foto FROM fotos_poda WHERE enviado=0";
        this.db.devolverTabla(sql).then(
          (fotos)=>{
            if(Object.keys(fotos).length>0){
              this.enviado=this.enviado+1;
              console.log("Enviado2"+this.enviado);
            }
            
          }
        ).catch(
          (error)=>{
            console.log("Error fotospoda"+JSON.stringify(error));
          }
        );

      }
    ).catch(
      (error)=>{
        console.log("Error conteopoda"+JSON.stringify(error));
      }
    );
    
  }

  /**
   * DESCARGA PENDIENTES
   */
  async descarga(){
    console.log("descarga");

    if(this.network.type == "none" || this.network.type == "unknown"){
    
      this.presentToast("NO HAY CONEXIÓN");

    }else{
      const loading = await this.loadingCtrl.create({
      message: "SUBIENDO DATOS AL SERVIDOR"
     });
      await loading.present();
      let sql= "SELECT * FROM conteo_poda WHERE enviado =0"
      this.db.devolverTabla(sql).then(
        (poda)=>{
          console.log(poda);
            this.http.postInsertar(poda,`conteoPodaTodos`).then(
              ()=>{
                let sql= "SELECT * FROM fotos_poda WHERE enviado IS NOT 1";
                this.db.devolverTabla(sql).then(
                  (fotos)=>{
                    this.http.postInsertar(fotos,`fotosPoda`).then(
                      ()=>{
                        this.db.modificarEnvioTodos(`conteo_poda`).then(
                          ()=>{
                            this.db.modificarEnvioTodos(`fotos_poda`).then(
                              ()=>{
                                this.enviado=0;
                                console.log("fin");
                                loading.dismiss();
                                this.fotoService.descarga(fotos);
                              }
                            ).catch(
                              (error)=>{
                                loading.dismiss();
                                console.log("Error fotospoda envio"+JSON.stringify(error));
                              }
                            );
                          }
                        ).catch(
                          (error)=>{
                            loading.dismiss();
                            console.log("Error conteopoda envio"+JSON.stringify(error));
                          }
                        );
                      }
                    ).catch(
                      (error)=>{
                        loading.dismiss();
                        console.log("Error fotospoda http"+JSON.stringify(error));
                      }
                    );
                    
                  }
                ).catch(
                  (error)=>{
                    loading.dismiss();
                    console.log("Error  fotospoda"+JSON.stringify(error));
                  }
                );
              }
            ).catch(
              (error)=>{
                loading.dismiss();
                console.log("error hhtp  conteopoda"+JSON.stringify(error));
                
              }
            );
        
           

        }
      ).catch(
        (error)=>{
          loading.dismiss();
        console.log("erro conteo_poda"+JSON.stringify(error))
        }
      );
      }
    
  }

  async presentToast(msg) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 5000
    });
    toast.present();
  }

  historial(opcion){
    this.zone.run(async () => {

      this.navCtrl.navigateForward(['/'+opcion], {animated:true});
    });
  }
}
