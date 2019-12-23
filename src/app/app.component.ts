import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { DbService } from './services/db.service';
import { LoginService } from './services/login.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private db : DbService,
    private loginService : LoginService,
    private router : Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {

      //iniciar bd
      this.db.initDatabase(); 

      this.loginService.cargar_storage().then(
        ()=>{
          if(this.loginService.token){
            console.log("home");
            this.router.navigate(['home']);
          }else{
            console.log("Login");
            this.router.navigate(['login']);
          }
        }
      ).catch();

      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
