import { Injectable } from '@angular/core';
import { Camera, CameraOptions,PictureSourceType } from '@ionic-native/camera/ngx';
import { File, FileEntry } from '@ionic-native/file/ngx';
import { Events, ToastController } from '@ionic/angular';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { DbService } from './db.service';
import { Base64 } from '@ionic-native/base64/ngx';
import { Platform } from '@ionic/angular';
import { reject } from 'q';
import { FilePath } from '@ionic-native/file-path/ngx';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FotosService {

  private opcion;
  private idApp;
  private fecha;
  private usuario;
  private idplanta;
  private imagen;
  private formulario: FormData;
  private stack_aux: any[] = [];
  dirPath:any;
  constructor(
    private camera: Camera,
    private file: File,
    private webview: WebView,
    private db : DbService,
    private toastController: ToastController,
    private base : Base64,
    private platform: Platform,
    private filePath: FilePath,
    private http: HttpClient, 
    
  ) { }

  

 
 
  async foto(opcion,idApp, fecha, usuario, idplanta, sourceType){
    this.opcion = opcion;
    this.idApp = idApp;
    this.fecha = fecha;
    this.usuario = usuario;
    this.idplanta = idplanta;

    console.log(sourceType);
    if(sourceType==='camara'){
      sourceType=this.camera.PictureSourceType.CAMERA
    }else{
      sourceType=this.camera.PictureSourceType.PHOTOLIBRARY
    }

    var options: CameraOptions = {
      quality: 50,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true,
      encodingType: this.camera.EncodingType.PNG,
      targetWidth:300
  };

  this.camera.getPicture(options).then(imagePath => {
      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
          this.filePath.resolveNativePath(imagePath)
              .then(filePath => {
                  let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
                  let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
                  this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
              });
      } else {
          var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
          var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
          this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }
  });
 
  }

  copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(success => {
        this.guardarImagen(newFileName, namePath,currentName);
    }, error => {
       console.log("Errro copiar imagen");
    });
}

createFileName() {
  var d = new Date(),
      n = d.getTime(),
      newFileName = this.opcion+"_"+n + ".png";
  return newFileName;
}

  guardarImagen(imag,direc,name){

   //const blob= this.b64toBlob(imag, 'image/jpg',512);
   let filePath = this.file.dataDirectory + imag;
   let resPath = this.pathForImage(filePath);
   let imagen = direc+name;

   console.log(name);

    if(this.opcion==="poda"){
      
     
      let sql = "INSERT INTO fotos_poda (id_App,  id_planta, id_usuario, fecha,fotoNombre, fotoPath,fotoFile,imagen, enviado) VALUES (?,?,?,?,?,?,?,?,?)";
      let dato =[this.idApp, this.idplanta, this.usuario, this.fecha,imag,resPath,filePath,name,0];
      this.db.insertar1(sql,dato).then(
        ()=>{
          console.log("Imagen insertada");
          this.presentToast("IMAGEN INSERTADA");
        }
      ).catch(
        ()=>{
          console.log("Error insertar imagne");
        }
      );

    }
  }

  pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      let converted = this.webview.convertFileSrc(img);
      return converted;
    }
  }

  async presentToast(text) {
    const toast = await this.toastController.create({
        message: text,
        position: 'bottom',
        duration: 3000
    });
    toast.present();
  }
  
  deleteImage(imgEntry) {
    console.log(this.file.externalCacheDirectory);
    console.log(this.file.cacheDirectory);

   
  
        console.log(imgEntry);
        var correctPath = imgEntry.fotoFile.substr(0, imgEntry.fotoFile.lastIndexOf('/') + 1);
        //var correctPath= 'file:///data/data/io.grapes.pga/cache/';
        var correctPath2 = this.file.cacheDirectory
      console.log(correctPath2);
      this.file.removeFile(correctPath, imgEntry.fotoNombre).then(res => {
        this.presentToast('File removed.');
    }).catch(
      (error)=>{
        console.log("error eleiminar"+JSON.stringify(error));
      }
    );
        this.file.removeFile(this.file.externalCacheDirectory, imgEntry.fotoImagen).then(res => {
            this.presentToast('File removed2.');
        }).catch(
          (error)=>{
            console.log("error eleiminar2"+JSON.stringify(error));
          }
        );
    
  }
 
  
 
  async descarga(imagenes){
    return  await new Promise(resolve=>{
      for (let i = 0; i < imagenes.length; i++){
        console.log(imagenes[i]['fotoFile']);
        this.file.resolveLocalFilesystemUrl(imagenes[i]['fotoFile'])
          .then(entry => {
              ( < FileEntry > entry).file(file => this.readFile(file))
             
          })
          .catch(err => {
              this.presentToast('Error while reading file.');
          });
      }
    });
  }

  async startUpload(imgEntry) {
    return  await new Promise(resolve=>{
      this.file.resolveLocalFilesystemUrl(imgEntry)
      .then(entry => {
          ( < FileEntry > entry).file(file => this.readFile(file))
      })
      .catch(err => {
          this.presentToast('Error while reading file.');
      });
    });
   
  }
  readFile(file: any) {
    const reader = new FileReader();
    reader.onload = () => {
        const formData = new FormData();
        const imgBlob = new Blob([reader.result], {
            type: file.type
        });
        formData.append('file', imgBlob, file.name);
        this.uploadImageData(formData);
    };
    reader.readAsArrayBuffer(file);
  }
  async uploadImageData(formData: FormData) {
   
  
    this.http.post("https://app.moyca.net/uploads/upload.php", formData)
        .pipe(
            finalize(() => {
                
            })
        )
        .subscribe(res => {
            if (res['success']) {
                this.presentToast('File upload complete.')
            } else {
                this.presentToast('File upload failed.')
            }
        });
  }

}
