import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
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
import { HomenajeAudioService } from "src/app/services/homenaje_audio/homenaje-audio.service";
import INFO_SESION from "src/app/config/infoSesion";

@Component({
  selector: "app-modal-audio",
  templateUrl: "./modal-audio.component.html",
  styleUrls: ["./modal-audio.component.scss"],
})
export class ModalAudioComponent implements OnInit {
  @Input() difunto: any;
  safeUrl: SafeUrl;
  audio = [];
  mensajeAudioForm: FormGroup;
  archivo: File = null;
  url = "";
  file_audio: File = null;
  validarAudio: boolean = true;
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
  ) {}

  ngOnInit() {
    this.mensajeAudioForm = this.formBuilder.group({
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
    this.file_audio = event.target.files[0];
    if (this.file_audio.size <= 10485760) {
      let data = new FormData();
      data.append("audio", this.file_audio);
      this.audio = [
        {
          path: "assets/page-muro/modal/AUDIO.png",
          nombre: event.target.files[0].name,
        },
      ];
      this.validarAudio = false;
    } else {
      this.audio = [];
      this.audioAlert("El tamaño del audio es pesado", "Alerta audio");
    }
  }

  /**
   * Funcion se activa con el boton enviar del formulario
   */
  async submit() {
    if (this.audio.length === 0) {
      this.audioAlert("Por favor escoja un audio...", "Alerta Audio");
    } else {
      await this.showMensajeLoading("idMensaje");
      this.postAudio();
    }
  }

  /**
   * Permite eliminar el audio cargado
   */
  eliminarAudio() {
    this.validarAudio = true;
    this.audio = [];
    this.presentToast("Se ha eliminado el audio...", "bottom", "warning");
  }

  /**
   * Permite enviar los datos de la publciacion con el audio como archivo a la base de datos
   * Llama a la funcion de postAudio del servicio de AudioService.ts para enviar la informacion al backend
   */
  async postAudio() {
    let audioData = await new FormData();
    audioData.append("audio", this.file_audio);
    audioData.append("mensaje", this.mensajeAudioForm.value.mensaje);

    this.storage.get(INFO_SESION.TOKEN_KEY).then((token) => {
      this.homenaje_audio
        .postAudio(audioData, token)
        .toPromise()
        .then(
          (resp) => {
            this.storage.get(INFO_SESION.IDUSER).then((id) => {
              let fecha = this.getFechaPublicacion();
              let id_audio = resp["id_audio"];
              const homenajePost = new FormData();
              homenajePost.append("id_usuario", id);
              homenajePost.append("id_difunto", this.difunto.id_difunto);
              homenajePost.append("fecha_publicacion", fecha as string);
              homenajePost.append("estado", "True");
              homenajePost.append("likes", "0");
              homenajePost.append("id_audiocontent", id_audio);
              this.homenaje.postHomenajeGeneral(homenajePost, token).subscribe(
                async (resp: any) => {
                  this.validarAudio = true;
                  this.audio = [];
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
                  this.validarAudio = true;
                  this.audio = [];
                  await this.dismissMensajeLoading("idMensaje");
                  await this.dismiss();
                  await this.audioAlert(
                    "Error al subir la publicación, intente otra vez...",
                    "Publicación"
                  );
                }
              );
            });
          },
          async (error) => {
            this.validarAudio = true;
            this.audio = [];
            await this.dismissMensajeLoading("idMensaje");
            await this.dismiss();
            await this.audioAlert(
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
  async audioAlert(mensaje, titulo) {
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
   * Se encarga de cerrar el modal de audio
   */
  async dismiss() {
    await this.modalController.dismiss({
      dismissed: true,
    });
  }
}
