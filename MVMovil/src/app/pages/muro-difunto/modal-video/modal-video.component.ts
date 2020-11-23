import { Component, OnInit, Input } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import {
  ToastController,
  LoadingController,
  AlertController,
} from "@ionic/angular";
import { SafeUrl } from "@angular/platform-browser";
import { HomenajesService } from "src/app/services/homenajes/homenajes.service";
import { DatePipe } from "@angular/common";
import { Storage } from "@ionic/storage";
import { HomenajeVideoService } from "src/app/services/homenaje_video/homenaje-video.service";
import INFO_SESION from "src/app/config/infoSesion";

@Component({
  selector: "app-modal-video",
  templateUrl: "./modal-video.component.html",
  styleUrls: ["./modal-video.component.scss"],
})
export class ModalVideoComponent implements OnInit {
  @Input() difunto: any;
  validarVideo: boolean = true;
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
  ) {}

  ngOnInit() {
    this.mensajeVideoForm = this.formBuilder.group({
      mensaje: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(200),
        ]),
      ],
    });
  }

  /**
   * Permite cargar el archivo que se selecciono para publicar
   * @param event contiene informacion del archivo cargado
   */
  selectFile(event) {
    this.file_video = event.target.files[0];
    if (this.file_video.size <= 10485760) {
      let data = new FormData();
      data.append("audio", this.file_video);
      this.video = [
        {
          path: "assets/page-muro/modal/VIDEO.png",
          nombre: event.target.files[0].name,
        },
      ];
      this.validarVideo = false;
    } else {
      this.video = [];
      this.videoAlert("El tamaño del video es pesado", "Alerta Video");
    }
  }

  /**
   * Permite eliminar el audio cargado
   */
  eliminarVideo() {
    this.validarVideo = true;
    this.video = [];
    this.presentToast("Se ha eliminado el video...", "bottom", "warning");
  }

  /**
   * Funcion se activa con el boton enviar del formulario
   */
  async submit() {
    if (this.video.length === 0) {
      this.videoAlert("Por favor escoja un video...", "Alerta Video");
    } else {
      await this.showMensajeLoading("idMensaje");
      this.postVideo();
    }
  }

  /**
   * Permite enviar los datos de la publicacion con el video como archivo a la base de datos
   * Llama a la funcion de postVideo del servicio de VideooService.ts para enviar la informacion al backend
   */
  async postVideo() {
    let videoData = await new FormData();
    videoData.append("video", this.file_video);
    videoData.append("mensaje", this.mensajeVideoForm.value.mensaje);

    this.storage.get(INFO_SESION.TOKEN_KEY).then((token) => {
      this.homenaje_video
        .postVideo(videoData, token)
        .toPromise()
        .then(
          (resp) => {
            this.storage.get(INFO_SESION.IDUSER).then((id) => {
              let fecha = this.getFechaPublicacion();
              let id_video = resp["id_video"];
              const homenajePost = new FormData();
              homenajePost.append("id_usuario", id);
              homenajePost.append("id_difunto", this.difunto.id_difunto);
              homenajePost.append("fecha_publicacion", fecha as string);
              homenajePost.append("estado", "True");
              homenajePost.append("likes", "0");
              homenajePost.append("id_videocontent", id_video);
              this.homenaje.postHomenajeGeneral(homenajePost, token).subscribe(
                async (resp: any) => {
                  this.validarVideo = true;
                  this.video = [];
                  await this.dismissMensajeLoading("idMensaje");
                  await this.dismiss();
                  await this.presentToast(
                    "Se ha subido con éxito...",
                    "middle",
                    "success"
                  );
                  this.cargarMuro();
                },
                async (error) => {
                  this.validarVideo = true;
                  this.video = [];
                  await this.dismissMensajeLoading("idMensaje");
                  await this.dismiss();
                  await this.videoAlert(
                    "Error al subir la publicación, intente otra vez...",
                    "Publicación"
                  );
                }
              );
            });
          },
          async (error) => {
            this.validarVideo = true;
            this.video = [];
            await this.dismissMensajeLoading("idMensaje");
            await this.dismiss();
            await this.videoAlert(
              "Error al subir la publicación, intente otra vez...",
              "Publicación"
            );
          }
        );
    });
  }

  /**
   * Emite un observable para recargar las publicaciones del componente content-publicacion
   */
  cargarMuro() {
    this.homenaje.sendMessage("cargar");
  }

  /**
   * Obtiene la fecha dado un formato
   */
  getFechaPublicacion() {
    let date = new Date();
    let latest_date = this.datepipe.transform(date, "yyyy-MM-dd HH:mm");
    return latest_date;
  }

  /**
   * Abre un Alert Controller
   * @param mensaje contiene la informacion a mostrar en el alert
   * @param titulo contiene el titulo a mostrar en el alert
   */
  async videoAlert(mensaje, titulo) {
    const alert = await this.alertController.create({
      cssClass: "controlerAlert",
      header: titulo,
      message: mensaje,
      buttons: [{ text: "OK", cssClass: "colorTextButton" }],
    });
    await alert.present();
  }

  /**
   *
   * @param text contiene informacion a mostar
   * @param position indica la posicion del toast
   * @param color indicar el color del toast
   */
  async presentToast(text, position, color) {
    const toast = await this.toastController.create({
      message: text,
      position: position,
      duration: 900,
      color: color,
    });
    toast.present();
  }

  /**
   * Se encarga de mostar el Loading Controller
   * @param idLoading indica el codigo asignado al loading controller
   */
  async showMensajeLoading(idLoading) {
    const loading = await this.loadingController.create({
      id: idLoading,
      cssClass: "colorloading",
      message: "Publicando mensaje...",
    });

    return await loading.present();
  }

  /**
   * Se encarga de ocultar el Loading Controller
   * @param idLoading indica el codigo asignado al loading controller
   */
  async dismissMensajeLoading(idLoading) {
    return await this.loadingController.dismiss(null, null, idLoading);
  }

  /**
   * Se encarga de cerrar el modal de video
   */
  async dismiss() {
    await this.modalController.dismiss({
      dismissed: true,
    });
  }
}
