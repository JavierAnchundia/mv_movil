import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Camera, CameraOptions, PictureSourceType } from "@ionic-native/Camera/ngx";
import { ToastController, Platform, LoadingController, AlertController } from "@ionic/angular";
import { File, FileEntry } from "@ionic-native/File/ngx";
import { WebView } from "@ionic-native/ionic-webview/ngx";
import { Storage } from "@ionic/storage";
import { FilePath } from "@ionic-native/file-path/ngx";

import { finalize } from "rxjs/operators";

const STORAGE_KEY = "my_images";

@Component({
  selector: "app-modal-imagen",
  templateUrl: "./modal-imagen.component.html",
  styleUrls: ["./modal-imagen.component.scss"],
})
export class ModalImagenComponent implements OnInit {
  imagen = [];
  mensajeImagenForm: FormGroup;

  constructor(
    private alertController: AlertController,
    private formBuilder: FormBuilder,
    public modalController: ModalController,
    private camera: Camera,
    private file: File,
    private webview: WebView,
    private toastController: ToastController,
    private storage: Storage,
    private plt: Platform,
    private ref: ChangeDetectorRef,
    private filePath: FilePath,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.mensajeImagenForm = this.formBuilder.group({
      mensaje: ['', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(200)])]
    });
  }

  async submit(){
    if(this.imagen.length === 0){
      this.faltaImagenAlert();
    }
    else{
      
      // await this.showMensajeLoading('idMensaje');
      console.log(this.mensajeImagenForm.value.mensaje);
    }
  }

  cargarImagen(imgEntry) {
    this.file.resolveLocalFilesystemUrl(imgEntry.filePath)
        .then(entry => {
            ( < FileEntry > entry).file(file => this.leerImageDir(file))
        })
        .catch(err => {
            this.presentToast('Error al leer la imagen...');
        });
  }
 
  leerImageDir(file: any) {
      const reader = new FileReader();
      reader.onload = () => {
          const formData = new FormData();
          const imgBlob = new Blob([reader.result], {
              type: file.type
          });
          formData.append("mensaje", this.mensajeImagenForm.value.mensaje)
          formData.append('imagen', imgBlob, file.name);
          this.subirMensajeImagenPost(formData);
      };
      reader.readAsArrayBuffer(file);
  }

  subirMensajeImagenPost(formData: FormData){

  }

  crearNombreArchivo() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }

  crearPathImagen(img) {
    if (img === null) {
      return "";
    } else {
      let converted = this.webview.convertFileSrc(img);
      return converted;
    }
  }

  async seleccionarImagen() {
    await this.obtenerImagen(this.camera.PictureSourceType.PHOTOLIBRARY);
  }

  async tomarImagen(){
    await this.obtenerImagen(this.camera.PictureSourceType.CAMERA);
  }

  obtenerImagen(sourceType: PictureSourceType) {
    var options: CameraOptions = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true,
    };

    this.camera.getPicture(options).then((imagePath) => {
      if (
        this.plt.is("android") &&
        sourceType === this.camera.PictureSourceType.PHOTOLIBRARY
      ) {
        this.filePath.resolveNativePath(imagePath).then((filePath) => {
          let correctPath = filePath.substr(0, filePath.lastIndexOf("/") + 1);
          let currentName = imagePath.substring(
            imagePath.lastIndexOf("/") + 1,
            imagePath.lastIndexOf("?")
          );
          this.copiarFile_localDir(
            correctPath,
            currentName,
            this.crearNombreArchivo()
          );
        });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf("/") + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf("/") + 1);
        this.copiarFile_localDir(
          correctPath,
          currentName,
          this.crearNombreArchivo()
        );
      }
    });
  }

  copiarFile_localDir(namePath, currentName, newFileName) {
    this.file
      .copyFile(namePath, currentName, this.file.dataDirectory, newFileName)
      .then(
        (success) => {
          this.actualizarImagen(newFileName);
        },
        (error) => {
          this.presentToast(
            "Error al gaurdar imagen en el directorio de la App...!"
          );
        }
      );
  }

  actualizarImagen(name) {
    this.storage.remove(STORAGE_KEY).then((resp) => {
      let correctPath = this.imagen[0].filePath.substr(
        0,
        this.imagen[0].filePath.lastIndexOf("/") + 1
      );
      this.file.removeFile(correctPath, this.imagen[0].name).then();
      this.imagen = [];
    });
    this.storage.get(STORAGE_KEY).then(async (images) => {
      let newImages = [name];
      this.storage.set(STORAGE_KEY, JSON.stringify(newImages));
      let filePath = this.file.dataDirectory + name;
      let resPath = await this.crearPathImagen(filePath);
      let newEntry = {
        name: name,
        path: resPath,
        filePath: filePath,
      };
      this.imagen = [newEntry, ...this.imagen];
      this.ref.detectChanges();
    });
  }

  eliminarImagen(imgEntry) {
    this.storage.remove(STORAGE_KEY).then((resp) => {
      let correctPath = imgEntry.filePath.substr(
        0,
        imgEntry.filePath.lastIndexOf("/") + 1
      );
      this.file.removeFile(correctPath, imgEntry.name).then((res) => {
        this.presentToast("Se ha eliminado la imagen...");
        this.imagen = [];
      });
    });
  }

  async faltaImagenAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Alerta Imagen',
      message: 'Por favor escoja una imagen.',
      buttons: ['OK']
    });
    await alert.present();
  }

  async presentToast(text) {
    const toast = await this.toastController.create({
      message: text,
      position: "bottom",
      duration: 3000,
    });
    toast.present();
  }

  // mostrar subir imagen controller
  async showMensajeLoading(idLoading) {
    const loading = await this.loadingController.create({
      id: idLoading,
      cssClass: 'my-custom-class',
      message: 'Autenticando credenciales...'
    });
    
    return await loading.present();
  }

  // ocultar loading controller
  async dismissMensajeLoading(idLoading){
    return await this.loadingController.dismiss(null, null, idLoading);
  }

  async dismiss() {
    await this.modalController.dismiss({
      dismissed: true,
    });
  }
}
