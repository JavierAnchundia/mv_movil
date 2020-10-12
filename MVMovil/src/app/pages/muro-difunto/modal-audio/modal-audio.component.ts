import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastController, Platform, LoadingController, AlertController } from "@ionic/angular";
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { HomenajesService } from 'src/app/services/homenajes/homenajes.service'
import { DatePipe } from '@angular/common';
import { Storage } from '@ionic/storage';
import { HomenajeAudioService } from 'src/app/services/homenaje_audio/homenaje-audio.service';

const IDUSER = 'id_usuario';
const TOKEN_KEY = 'access_token';

@Component({
  selector: 'app-modal-audio',
  templateUrl: './modal-audio.component.html',
  styleUrls: ['./modal-audio.component.scss'],
})
export class ModalAudioComponent implements OnInit {
  @Input() difunto: any;
  safeUrl: SafeUrl;
  audio = [];
  mensajeAudioForm: FormGroup;
  archivo: File = null;
  url = "";
  file_audio: File = null;

  constructor(
    private alertController: AlertController,
    public modalController: ModalController,
    private formBuilder: FormBuilder,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private storage: Storage,
    public datepipe: DatePipe,
    private homenaje: HomenajesService,
    private homenaje_audio: HomenajeAudioService
  ) { }

  ngOnInit() {
    this.mensajeAudioForm = this.formBuilder.group({
      mensaje: ['', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(200)])]
    });
  }

  selectFile(event) {
    this.file_audio = event.target.files[0];
    let data = new FormData()
    data.append("audio", this.file_audio)
    this.audio = [{
      path: 'assets/muro_difunto/audio-file.png',
      nombre: event.target.files[0].name
    }]
  }

  async submit(){
    if(this.audio.length === 0){
      this.audioAlert('Por favor escoja un audio...', 'Alerta Audio');
    }
    else{
      await this.showMensajeLoading('idMensaje');
      this.postAudio();
    }
  }

  eliminarAudio(){
    this.audio = [];
    this.presentToast("Se ha eliminado el audio...", 'bottom', 'warning')
  }

  async postAudio(){
    
    let audioData = await new FormData();
    audioData.append('audio', this.file_audio);
    audioData.append('mensaje', this.mensajeAudioForm.value.mensaje);

    this.storage.get(TOKEN_KEY).then(
      (token)=>{
        this.homenaje_audio.postAudio(audioData, token).toPromise().then(
          (resp) => {
            this.storage.get(IDUSER).then(
              (id) => { 
                console.log(id)
                let fecha = this.getFechaPublicacion();
                let id_audio = resp['id_audio']
                const homenajePost = new FormData();
                homenajePost.append('id_usuario', id);
                homenajePost.append('id_difunto', this.difunto.id_difunto);
                homenajePost.append('fecha_publicacion', fecha as string);
                homenajePost.append('estado', 'True');
                homenajePost.append('likes', '0');
                homenajePost.append('id_audiocontent', id_audio);
                this.homenaje.postHomenajeGeneral(homenajePost, token).subscribe(
                  async (resp: any) => {
                    await this.dismissMensajeLoading('idMensaje');
                    await this.dismiss()
                    await this.presentToast("Se ha subido con éxito...", 'middle', 'success')
                    // await this.audioAlert('Se ha subido con éxito', 'Publicación');
                    this.cargarMuro();
                  },
                  async (error)=>{
                    await this.dismissMensajeLoading("idMensaje");
                    await this.dismiss()
                    await this.audioAlert('Error al subir la publicación, intente otra vez...', 'Publicación');
                  }
                )
              }
            ) 
          },
          async (error)=>{
            await this.dismissMensajeLoading("idMensaje");
            await this.dismiss();
            await this.audioAlert('Error al subir la publicación, intente otra vez...', 'Publicación');
          }
        )
      }
    )
    
  }

  cargarMuro(){
    this.homenaje.sendMessage('cargar');
  }
  getFechaPublicacion() {
    let date = new Date();
    let latest_date = this.datepipe.transform(date, 'yyyy-MM-dd HH:mm');
    return latest_date;
  }

  async audioAlert(mensaje, titulo) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: titulo,
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }

  async presentToast(text, position, color) {
    const toast = await this.toastController.create({
      message: text,
      position: position,
      duration: 900,
      color: color,
    });
    toast.present();
  }

  // mostrar subir imagen controller
  async showMensajeLoading(idLoading) {
    const loading = await this.loadingController.create({
      id: idLoading,
      cssClass: 'my-custom-class',
      message: 'Publicando mensaje...'
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
