import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastController, Platform, LoadingController, AlertController } from "@ionic/angular";
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { HomenajesService } from 'src/app/services/homenajes/homenajes.service'
import { DatePipe } from '@angular/common';
import { Storage } from '@ionic/storage';
import { HomenajeTextoService } from 'src/app/services/homenaje_texto/homenaje-texto.service'

const IDUSER = 'id_usuario';
const TOKEN_KEY = 'access_token';

@Component({
  selector: 'app-modal-texto',
  templateUrl: './modal-texto.component.html',
  styleUrls: ['./modal-texto.component.scss'],
})
export class ModalTextoComponent implements OnInit {
  @Input() difunto: any;
  mensajeTextoForm: FormGroup;

  constructor(
    private alertController: AlertController,
    public modalController: ModalController,
    private formBuilder: FormBuilder,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private storage: Storage,
    public datepipe: DatePipe,
    private homenaje: HomenajesService,
    private homenaje_texto: HomenajeTextoService
  ) { }

  ngOnInit() {
    this.mensajeTextoForm = this.formBuilder.group({
      mensaje: ['', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(200)])]
    });
  }
  async submit(){
    await this.showMensajeLoading('idMensaje');
    this.postTexto();
  }

  async postTexto(){
    
    let textoData = await new FormData();
    textoData.append('mensaje', this.mensajeTextoForm.value.mensaje);

    this.storage.get(TOKEN_KEY).then(
      (token)=>{
        this.homenaje_texto.postTexto(textoData, token).toPromise().then(
          (resp) => {
            this.storage.get(IDUSER).then(
              (id) => { 
                console.log(id)
                let fecha = this.getFechaPublicacion();
                let id_mensaje = resp['id_mensaje']
                const homenajePost = new FormData();
                homenajePost.append('id_usuario', id);
                homenajePost.append('id_difunto', this.difunto.id_difunto);
                homenajePost.append('fecha_publicacion', fecha as string);
                homenajePost.append('estado', 'True');
                homenajePost.append('likes', '0');
                homenajePost.append('id_textcontent', id_mensaje);
                this.homenaje.postHomenajeGeneral(homenajePost, token).subscribe(
                  async (resp: any) => {
                    await this.dismissMensajeLoading('idMensaje');
                    await this.dismiss()
                    await this.presentToast("Se ha subido con éxito...", 'middle')
                    // await this.textoAlert('Se ha subido con éxito', 'Publicación');
                    this.cargarMuro();
                  },
                  async (error)=>{
                    await this.dismissMensajeLoading('idMensaje');
                    await this.dismiss()
                    await this.textoAlert('Error al subir la publicación, intente otra vez...', 'Publicación');
                  }
                )
              }
            ) 
          },
          async (error)=>{
            await this.dismissMensajeLoading('idMensaje');
            await this.dismiss();
            await this.textoAlert('Error al subir la publicación, intente otra vez...', 'Publicación');
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

  async textoAlert(mensaje, titulo) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: titulo,
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }

  async presentToast(text, position) {
    const toast = await this.toastController.create({
      message: text,
      position: position,
      duration: 900,
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
