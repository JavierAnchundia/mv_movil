import { Component, Input, OnInit } from '@angular/core';
import { HomenajesService } from 'src/app/services/homenajes/homenajes.service'
import { DatePipe } from '@angular/common';
import { Storage } from '@ionic/storage';
import { HomenajeVideoService } from 'src/app/services/homenaje_video/homenaje-video.service'
import { HomenajeAudioService } from 'src/app/services/homenaje_audio/homenaje-audio.service'
import { HomenajeImagenService } from 'src/app/services/homenaje_imagen/homenaje-imagen.service'
import { HomenajeTextoService } from 'src/app/services/homenaje_texto/homenaje-texto.service'
import URL_SERVICIOS from 'src/app/config/config';
import { AlertController, ToastController } from '@ionic/angular';

const IDUSER = 'id_usuario';

@Component({
  selector: 'app-content-publicaciones',
  templateUrl: './content-publicaciones.component.html',
  styleUrls: ['./content-publicaciones.component.scss'],
})
export class ContentPublicacionesComponent implements OnInit {
  @Input() difunto_datos: any;
  lista_publicaciones: any = []
  url_backend: string = URL_SERVICIOS.url_backend;
  idUser: number;
  constructor(
    private serv_h_video: HomenajeVideoService,
    private serv_h_audio: HomenajeAudioService,
    private serv_h_imagen: HomenajeImagenService,
    private serv_h_texto: HomenajeTextoService,
    private serv_h_general: HomenajesService,
    private storage: Storage,
    private alertController: AlertController,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.cargarIdUser();
    this.getHomenajes();
    this.serv_h_general.muroMensaje$.subscribe(
      message => {
        if(message == "cargar"){
          this.getHomenajes();
        }
      }
    )
  }

  cargarIdUser(){
    this.storage.get(IDUSER).then(
      (id) => { 
        this.idUser = id;
      }
    )
  }
  
  getHomenajes() {
    this.serv_h_general.getHomenajesDifunto(this.difunto_datos.id_difunto).subscribe(
      (resp: any) => {
        console.log(resp)
        this.lista_publicaciones = resp;
        this.lista_publicaciones.reverse();
      })
  }

  deleteVideo(video){
    this.alertaConfirmar('el video', 'video', video['id_video']);
  }

  deleteAudio(audio){
    this.alertaConfirmar('el audio', 'audio', audio['id_audio']);
  }
  deleteImage(image){
    this.alertaConfirmar('la imagen', 'image', image['id_imagen']);
  }
  deleteTexto(texto){
    this.alertaConfirmar('el mensaje', 'texto', texto['id_mensaje']);
  }

  async alertaConfirmar(tipoFile, publicacion, id) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      // header: 'Confirm!',
      message: '<strong>¿Está seguro que desea eliminar ' + tipoFile+'?</strong>',
      buttons: [
        {
          text: 'Sí',
          handler: () => {
            if(publicacion == 'audio'){
              this.serv_h_audio.deleteAudio(id).subscribe(
                (resp)=> {
                  this.getHomenajes();
                  this.borradoExito('Se ha eliminado con éxito la publicación', "success");
                },
                (error) =>{
                  this.borradoExito('No se ha podido eliminar la publicación', "danger");
                }
              )
            }
            else if(publicacion == 'video'){
              this.serv_h_video.deleteVideo(id).subscribe(
                (resp)=> {
                  this.getHomenajes();
                  this.borradoExito('Se ha eliminado con éxito la publicación', "success");
                },
                (error) =>{
                  this.borradoExito('No se ha podido eliminar la publicación', "danger");
                }
              )
            }
            else if(publicacion == 'image'){
              this.serv_h_imagen.deleteImagen(id).subscribe(
                (resp)=> {
                  this.getHomenajes();
                  this.borradoExito('Se ha eliminado con éxito la publicación', "success");
                },
                (error) =>{
                  this.borradoExito('No se ha podido eliminar la publicación', "danger");
                }
              )
            }
            else if(publicacion == 'texto'){
              this.serv_h_texto.deleteTexto(id).subscribe(
                (resp)=> {
                  this.getHomenajes();
                  this.borradoExito('Se ha eliminado con éxito la publicación', "success");
                },
                (error) =>{
                  this.borradoExito('No se ha podido eliminar la publicación', "danger");
                }
              )
            }
          }
        },
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }
      ]
    });
    await alert.present();
  }

  async borradoExito(message, color) {
    const toast = await this.toastController.create({
      message: message,
      position: 'bottom',
      duration: 1500,
      color: color
    });
    toast.present();
  }
}
