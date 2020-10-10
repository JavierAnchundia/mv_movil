import { Component, Input, OnInit } from '@angular/core';
import { HomenajesService } from 'src/app/services/homenajes/homenajes.service'
import { DatePipe } from '@angular/common';
import { Storage } from '@ionic/storage';
import { HomenajeVideoService } from 'src/app/services/homenaje_video/homenaje-video.service'
import { HomenajeAudioService } from 'src/app/services/homenaje_audio/homenaje-audio.service'
import { HomenajeImagenService } from 'src/app/services/homenaje_imagen/homenaje-imagen.service'
import { HomenajeTextoService } from 'src/app/services/homenaje_texto/homenaje-texto.service'
import URL_SERVICIOS from 'src/app/config/config';

@Component({
  selector: 'app-content-publicaciones',
  templateUrl: './content-publicaciones.component.html',
  styleUrls: ['./content-publicaciones.component.scss'],
})
export class ContentPublicacionesComponent implements OnInit {
  @Input() difunto_datos: any;
  lista_publicaciones: any = []
  url_backend: string = URL_SERVICIOS.url_backend;
  constructor(
    private serv_h_video: HomenajeVideoService,
    private serv_h_audio: HomenajeAudioService,
    private serv_h_imagen: HomenajeImagenService,
    private serv_h_texto: HomenajeTextoService,
    private serv_h_general: HomenajesService,
    private storage: Storage,

  ) { }

  ngOnInit() {
    console.log(this.difunto_datos)
    this.getHomenajes()
    this.serv_h_general.muroMensaje$.subscribe(
      message => {
        if(message == "cargar"){
          this.getHomenajes();
        }
      }
    )
  }

  getHomenajes() {
    this.serv_h_general.getHomenajesDifunto(this.difunto_datos.id_difunto).subscribe(
      (resp: any) => {
        console.log(resp);
        this.lista_publicaciones = resp;
        this.lista_publicaciones.reverse();
        console.log(this.lista_publicaciones)
      })
  }
}
