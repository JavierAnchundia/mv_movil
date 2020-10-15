import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastController, Platform, LoadingController, AlertController } from "@ionic/angular";
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { HomenajesService } from 'src/app/services/homenajes/homenajes.service'
import { DatePipe } from '@angular/common';
import { Storage } from '@ionic/storage';
import { HomenajeVideoService } from 'src/app/services/homenaje_video/homenaje-video.service'

const IDUSER = 'id_usuario';
const TOKEN_KEY = 'access_token';

@Component({
  selector: 'app-modal-video',
  templateUrl: './modal-video.component.html',
  styleUrls: ['./modal-video.component.scss'],
})
export class ModalVideoComponent implements OnInit {
  @Input() difunto: any;

  safeUrl: SafeUrl;
  video = [];
  mensajeVideoForm: FormGroup;
  archivo: File = null;
  url = "";
  file_video: File = null;

  constructor(
    private alertController: AlertController,
    public modalController: ModalController,
    private formBuilder: FormBuilder,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private storage: Storage,
    public datepipe: DatePipe,
    private homenaje: HomenajesService,
    private homenaje_video: HomenajeVideoService
  ) { }

  ngOnInit() {
    this.mensajeVideoForm = this.formBuilder.group({
      mensaje: ['', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(200)])]
    });
  }

  selectFile(event) {
    this.file_video = event.target.files[0];
    if(this.file_video.size <= 10485760){
      let data = new FormData()
      data.append("audio", this.file_video)
      this.video = [{
        path: 'assets/muro_difunto/video-file.png',
        nombre: event.target.files[0].name
      }]
    }
    else{
      this.video = [];
      this.videoAlert('El tamaño del video es pesado', 'Alerta Video');
    }
  }
  
  eliminarVideo(){
    this.video = [];
    this.presentToast("Se ha eliminado el video...", 'bottom', "warning")
  }

  async submit(){
    if(this.video.length === 0){
      this.videoAlert('Por favor escoja un video...', 'Alerta Video');
    }
    else{
      await this.showMensajeLoading('idMensaje');
      this.postVideo();
    }
  }

  async postVideo(){
    
    let videoData = await new FormData();
    videoData.append('video', this.file_video);
    videoData.append('mensaje', this.mensajeVideoForm.value.mensaje);

    this.storage.get(TOKEN_KEY).then(
      (token)=>{
        this.homenaje_video.postVideo(videoData, token).toPromise().then(
          (resp) => {
            this.storage.get(IDUSER).then(
              (id) => { 
                console.log(id)
                let fecha = this.getFechaPublicacion();
                let id_video = resp['id_video']
                const homenajePost = new FormData();
                homenajePost.append('id_usuario', id);
                homenajePost.append('id_difunto', this.difunto.id_difunto);
                homenajePost.append('fecha_publicacion', fecha as string);
                homenajePost.append('estado', 'True');
                homenajePost.append('likes', '0');
                homenajePost.append('id_videocontent', id_video);
                this.homenaje.postHomenajeGeneral(homenajePost, token).subscribe(
                  async (resp: any) => {
                    await this.dismissMensajeLoading('idMensaje');
                    await this.dismiss()
                    await this.presentToast("Se ha subido con éxito...", 'middle', "success")
                    // await this.videoAlert('Se ha subido con éxito', 'Publicación');
                    this.cargarMuro();
                  },
                  async (error)=>{
                    await this.dismissMensajeLoading('idMensaje');
                    await this.dismiss()
                    await this.videoAlert('Error al subir la publicación, intente otra vez...', 'Publicación');
                  }
                )
              }
            ) 
          },
          async (error)=>{
            await this.dismissMensajeLoading('idMensaje');
            await this.dismiss()
            await this.videoAlert('Error al subir la publicación, intente otra vez...', 'Publicación');
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

  async videoAlert(mensaje, titulo) {
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
