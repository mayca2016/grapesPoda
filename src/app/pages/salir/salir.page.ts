import { Component, OnInit, NgZone } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-salir',
  templateUrl: './salir.page.html',
  styleUrls: ['./salir.page.scss'],
})
export class SalirPage implements OnInit {

  constructor(
    private loginService : LoginService,
    private zone : NgZone,
    private navCtrl : NavController
  ) { }

  ngOnInit() {
    this.zone.run(async () => {
      this.loginService.cerrarSesion();
      this.navCtrl.navigateForward(['/login/'], {animated:true});
    });
   
  }

}
