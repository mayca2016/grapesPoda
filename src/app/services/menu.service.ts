import { Injectable, NgZone } from '@angular/core';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(
    private zone: NgZone,
    private navCtrl: NavController
  ) { }

  /**
     * Función que crea loa botones
     * del actionSheetControler según 
     * la lista de items
     */
    createButtons() {
      let buttons = [];
    
        let button = {
          text: 'Home',
          icon: 'home',
          handler: () => {
            this.zone.run(async () => {

              this.navCtrl.navigateForward(['/home'], {animated:true});
            });
          }
        }
        buttons.push(button);

       button = {
          text: 'Historial',
          icon: 'list',
          handler: () => {
            this.zone.run(async () => {

              this.navCtrl.navigateForward(['/historial'], {animated:true});
            });
          }
        }
        buttons.push(button);
        button = {
          text: 'Información',
          icon: 'information',
          handler: () => {
            this.zone.run(async () => {

              this.navCtrl.navigateForward(['/info'], {animated:true});
            });
          }
        }
        buttons.push(button);
        button = {
          text: 'Mantenimiento',
          icon: 'hammer',
          handler: () => {
            this.zone.run(async () => {

              this.navCtrl.navigateForward(['/mantenimiento'], {animated:true});
            });
          }
        }
        buttons.push(button);
        button = {
          text: 'Salir',
          icon: 'close',
          handler: () => {
            this.zone.run(async () => {

              this.navCtrl.navigateForward(['/salir'], {animated:true});
            });
          }
        }
        buttons.push(button);
      
      return buttons;
    }
}
