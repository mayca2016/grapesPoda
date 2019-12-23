import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { MenuService } from 'src/app/services/menu.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
})
export class InfoPage implements OnInit {

  constructor(
    private actionSheet: ActionSheetController,
    private menuService: MenuService
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
}
