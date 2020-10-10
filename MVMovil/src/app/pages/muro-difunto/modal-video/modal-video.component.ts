import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastController, Platform, LoadingController, AlertController } from "@ionic/angular";
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { HomenajeImagenService } from 'src/app/services/homenaje_imagen/homenaje-imagen.service';

@Component({
  selector: 'app-modal-video',
  templateUrl: './modal-video.component.html',
  styleUrls: ['./modal-video.component.scss'],
})
export class ModalVideoComponent implements OnInit {
  safeUrl: SafeUrl;
  video = [];
  mensajeVideoForm: FormGroup;
  archivo: File = null;
  url = "";
  constructor(
    private alertController: AlertController,
    public modalController: ModalController,
    private formBuilder: FormBuilder,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private service_homenaje: HomenajeImagenService
  ) { }

  ngOnInit() {
    this.mensajeVideoForm = this.formBuilder.group({
      mensaje: ['', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(200)])]
    });
  }

  selectFile(event) {
    const file = event.target.files[0];
    let data = new FormData()
    data.append("audio", file)
    // this.service_homenaje.post_homenaje(data).then()
  }
  selectMp3(event){
    const file = event.target.files[0];
    let data = new FormData()
    data.append("video", file)
    // this.service_homenaje.post_homenaje(data).then()
    
  }

  async submit(){
    if(this.video.length === 0){
      this.faltaVideoAlert();
    }
    else{
      
      // await this.showMensajeLoading('idMensaje');
      console.log(this.mensajeVideoForm.value.mensaje);
    }
  }

  crearNombreArchivo() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".mp4";
    return newFileName;
  }

  async presentToast(text) {
    const toast = await this.toastController.create({
      message: text,
      position: "bottom",
      duration: 20000,
    });
    toast.present();
  }

  async faltaVideoAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Alerta Imagen',
      message: 'Por favor escoja un  video..',
      buttons: ['OK']
    });
    await alert.present();
  }

  async dismiss() {
    await this.modalController.dismiss({
      'dismissed': true
    });
  }

}
