import { Component, Input, OnInit } from "@angular/core";
import { HomenajesService } from "src/app/services/homenajes/homenajes.service";
import { Storage } from "@ionic/storage";
import { HomenajeVideoService } from "src/app/services/homenaje_video/homenaje-video.service";
import { HomenajeAudioService } from "src/app/services/homenaje_audio/homenaje-audio.service";
import { HomenajeImagenService } from "src/app/services/homenaje_imagen/homenaje-imagen.service";
import { HomenajeTextoService } from "src/app/services/homenaje_texto/homenaje-texto.service";
import URL_SERVICIOS from "src/app/config/config";
import {
  AlertController,
  LoadingController,
  ToastController,
} from "@ionic/angular";
import INFO_SESION from "src/app/config/infoSesion";

@Component({
  selector: "app-content-publicaciones",
  templateUrl: "./content-publicaciones.component.html",
  styleUrls: ["./content-publicaciones.component.scss"],
})
export class ContentPublicacionesComponent implements OnInit {
  @Input() difunto_datos: any;
  lista_publicaciones: any = [];
  url_backend: string = URL_SERVICIOS.url_backend;
  idUser: number;
  spinnerState: boolean = false;
  constructor(
    private serv_h_video: HomenajeVideoService,
    private serv_h_audio: HomenajeAudioService,
    private serv_h_imagen: HomenajeImagenService,
    private serv_h_texto: HomenajeTextoService,
    private serv_h_general: HomenajesService,
    private storage: Storage,
    private alertController: AlertController,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.cargarIdUser();
    this.getHomenajes();
    this.serv_h_general.muroMensaje$.subscribe((message) => {
      if (message == "cargar") {
        this.getHomenajes();
        this.cargarIdUser();
      }
    });
  }
  /**
   * Obtiene el id del usuario guardado en el storage del dispositivo
   */
  cargarIdUser() {
    this.storage.get(INFO_SESION.IDUSER).then((id) => {
      this.idUser = id;
    });
  }

  /**
   * Permite cargar los homenajes que pertenecen a un perfil del difunto
   */
  async getHomenajes() {
    this.spinnerState = await true;
    await this.serv_h_general
      .getHomenajesDifunto(this.difunto_datos.id_difunto)
      .subscribe(
        async (resp: any) => {
          this.spinnerState = await false;
          this.lista_publicaciones = resp;
          this.lista_publicaciones.reverse();
        },
        (error) => {
          this.spinnerState = false;
        }
      );
  }

  /**
   * Permite abrir un mensaje con video de alerta confirmando si desea eliminar la publicacion
   * @param video id del video la publicacion a eliminar
   */
  deleteVideo(video) {
    this.alertaConfirmar("el video", "video", video["id_video"]);
  }

  /**
   * Permite abrir un mensaje con audio de alerta confirmando si desea eliminar la publicacion
   * @param audio id del audio la publicacion a eliminar
   */
  deleteAudio(audio) {
    this.alertaConfirmar("el audio", "audio", audio["id_audio"]);
  }

  /**
   * Permite abrir un mensaje con imagen de alerta confirmando si desea eliminar la publicacion
   * @param image id de la imagen de la publicacion a eliminar
   */
  deleteImage(image) {
    this.alertaConfirmar("la imagen", "image", image["id_imagen"]);
  }

  /**
   * Permite abrir un mensaje con texto de alerta confirmando si desea eliminar la publicacion
   * @param texto id del texto de la publicacion a eliminar
   */
  deleteTexto(texto) {
    this.alertaConfirmar("el mensaje", "texto", texto["id_mensaje"]);
  }

  /**
   * Funcion permite cargar el ALert Controller para confirmar si se desea eliminar o no una publicacion
   * @param tipoFile indica el mensaje a mostrar en el alert
   * @param publicacion indica que tipo de publicacion va a eliminar para contactar al metodo del respectico servicio
   * ya sea Audio, Imagen, Texto, Video Service
   * @param id contienen el id de la publicacion a elimnar
   */
  async alertaConfirmar(tipoFile, publicacion, id) {
    const alert = await this.alertController.create({
      cssClass: "controlerAlert",
      message:
        "<strong>¿Está seguro que desea eliminar " + tipoFile + "?</strong>",
      buttons: [
        {
          text: "Sí",
          cssClass: "colorTextButton",
          handler: () => {
            this.showPublicacionesLoading(
              "id_delete_publi",
              "Eliminando publicación..."
            );
            if (publicacion == "audio") {
              this.serv_h_audio.deleteAudio(id).subscribe(
                async (resp) => {
                  await this.dismissPublicacionesLoading("id_delete_publi");
                  this.getHomenajes();
                  this.borradoExito(
                    "Se ha eliminado con éxito la publicación",
                    "success"
                  );
                },
                (error) => {
                  this.dismissPublicacionesLoading("id_delete_publi");
                  this.borradoExito(
                    "No se ha podido eliminar la publicación",
                    "danger"
                  );
                }
              );
            } else if (publicacion == "video") {
              this.serv_h_video.deleteVideo(id).subscribe(
                async (resp) => {
                  await this.dismissPublicacionesLoading("id_delete_publi");
                  this.getHomenajes();
                  this.borradoExito(
                    "Se ha eliminado con éxito la publicación",
                    "success"
                  );
                },
                (error) => {
                  this.dismissPublicacionesLoading("id_delete_publi");
                  this.borradoExito(
                    "No se ha podido eliminar la publicación",
                    "danger"
                  );
                }
              );
            } else if (publicacion == "image") {
              this.serv_h_imagen.deleteImagen(id).subscribe(
                async (resp) => {
                  await this.dismissPublicacionesLoading("id_delete_publi");
                  this.getHomenajes();
                  this.borradoExito(
                    "Se ha eliminado con éxito la publicación",
                    "success"
                  );
                },
                (error) => {
                  this.dismissPublicacionesLoading("id_delete_publi");
                  this.borradoExito(
                    "No se ha podido eliminar la publicación",
                    "danger"
                  );
                }
              );
            } else if (publicacion == "texto") {
              this.serv_h_texto.deleteTexto(id).subscribe(
                async (resp) => {
                  await this.dismissPublicacionesLoading("id_delete_publi");
                  this.getHomenajes();
                  this.borradoExito(
                    "Se ha eliminado con éxito la publicación",
                    "success"
                  );
                },
                (error) => {
                  this.dismissPublicacionesLoading("id_delete_publi");
                  this.borradoExito(
                    "No se ha podido eliminar la publicación",
                    "danger"
                  );
                }
              );
            }
          },
        },
        {
          text: "No",
          role: "cancel",
          cssClass: "colorTextButton",
          handler: (blah) => {},
        },
      ],
    });
    await alert.present();
  }

  /**
   * Permite activar el toast
   * @param message Contienen informacion a mostrar
   * @param color Contiene el texto del color del background del toast
   */
  async borradoExito(message, color) {
    const toast = await this.toastController.create({
      message: message,
      position: "bottom",
      duration: 1500,
      color: color,
    });
    toast.present();
  }

  /**
   * Muestra un loading controller mientras se consulta el listado de publicaciones al server
   * @param idLoading id del loading controller
   */
  async showPublicacionesLoading(idLoading, message) {
    const loading = await this.loadingController.create({
      id: idLoading,
      cssClass: "colorloading",
      message: message,
    });
    return await loading.present();
  }

  /**
   * Oculta el loading controller cuando ha retornado alguna informacion del backend
   * @param idLoading id del loading controller
   */
  async dismissPublicacionesLoading(idLoading) {
    return await this.loadingController.dismiss(null, null, idLoading);
  }
}
