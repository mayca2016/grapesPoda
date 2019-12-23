import { Component, OnInit, NgZone } from '@angular/core';
import { MenuService } from 'src/app/services/menu.service';
import { ActionSheetController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
})
export class HistorialPage implements OnInit {

  constructor(
    private menuService : MenuService,
    private actionSheet : ActionSheetController,
    private zone: NgZone,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
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

  historial(opcion){
    this.zone.run(async () => {

      this.navCtrl.navigateForward(['/'+opcion], {animated:true});
    });
  }
}
