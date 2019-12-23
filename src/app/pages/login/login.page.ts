import { Component, OnInit, NgZone } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { ToastController, NavController } from '@ionic/angular';
import { LoginService } from 'src/app/services/login.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  account = {
    usuario:'',
    nombre: '',
    email: '',
    password: ''
  };
 conectado: boolean=true;

  constructor(
    private network: Network,
    private zone: NgZone,
    private toastCtrl: ToastController,
    private loginService: LoginService,
    private navCtrl: NavController,
  ) { }

  ngOnInit() {

     //COMPRUEBA CONEXION A INTERNET
     if(this.network.type == "none" || this.network.type == "unknown"){
      this.avisaDesconexion();
    }

    let disconnectSubscription = this.network.onDisconnect().subscribe(() =>{
      if(this.conectado){
        this.avisaDesconexion();
      }
    });

    let connectSubscription = this.network.onConnect().subscribe(() =>{
      setTimeout(()=>{
        if(!this.conectado){
          this.avisaConexion();
        }
      }, 3000)
    });
  }

   /**
   * AVISA QUE EL DISPOSITIVO NO TIENE CONEXION
   */
  avisaDesconexion(){
    this.conectado = false;
    /*let alert = this.alertCtrl.create({
      title: "Problema de red",
      subTitle: "No tenemos red",
      buttons: ["OK"]
    })
    alert.present();*/
  }

  /**
   * AVISA QUE EL DISPOSITIVO TIENE CONEXION
   */
  avisaConexion(){
    this.conectado = true;
    /*let alert = this.alertCtrl.create({
      title: "Estado de red",
      subTitle: "Nos hemos conectado a la red",
      buttons: ["OK"]
    })
    alert.present();*/
  }

  login(){

    if(this.conectado===true){
      this.loginC();
    }else{
      this.loginBD();
    }
  } 

  async loginC(){
    this.zone.run(async () => {
      if(this.account.usuario==="" ||this.account.password===""){
        this.presentToast("CAMPOS VACIOS");
        return;
     
     }
        
    
  
     const valido= await this.loginService.login(this.account.usuario, this.account.password);
  
     console.log(valido);
     if(valido){
       this.navCtrl.navigateRoot('/home', {animated:true});
  
     }else{
      console.log("no");
      this.presentToast("ERROR REGISTRO");
     }
    });
  
    

  }
  async loginBD(){
    this.zone.run(async () => {
      if(this.account.usuario==="" ||this.account.password===""){
        this.presentToast("CAMPOS VACIOS");
        return;
     
     }
        
    
  
     const valido= await this.loginService.loginBD(this.account.usuario, this.account.password);
  
     console.log(valido);
     if(valido){
       this.navCtrl.navigateRoot('/home', {animated:true});
  
     }else{
      console.log("no");
      this.presentToast("ERROR REGISTRO");
     }
    });
  
    

  }

  async presentToast(msg) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 5000
    });
    toast.present();
  }
}
