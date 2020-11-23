import { Component, Input, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import {
  ToastController,
  LoadingController,
  AlertController,
} from "@ionic/angular";
import { HomenajesService } from "src/app/services/homenajes/homenajes.service";
import { DatePipe } from "@angular/common";
import { Storage } from "@ionic/storage";
import { HomenajeTextoService } from "src/app/services/homenaje_texto/homenaje-texto.service";
import INFO_SESION from "src/app/config/infoSesion";

@Component({
  selector: "app-modal-texto",
  templateUrl: "./modal-texto.component.html",
  styleUrls: ["./modal-texto.component.scss"],
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
  ) {}

  ngOnInit() {
    this.mensajeTextoForm = this.formBuilder.group({
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
   * Funcion se activa con el boton enviar del formulario
   */
  async submit() {
    await this.showMensajeLoading("idMensaje");
    this.postTexto();
  }

  /**
   * Permite enviar los datos de la publciacion a la base de datos
   * Llama a la funcion de textoAudio del servicio de TextoService.ts para enviar la informacion al backend
   */
  async postTexto() {
    let textoData = await new FormData();
    textoData.append("mensaje", this.mensajeTextoForm.value.mensaje);

    this.storage.get(INFO_SESION.TOKEN_KEY).then((token) => {
      this.homenaje_texto
        .postTexto(textoData, token)
        .toPromise()
        .then(
          (resp) => {
            this.storage.get(INFO_SESION.IDUSER).then((id) => {
              let fecha = this.getFechaPublicacion();
              let id_mensaje = resp["id_mensaje"];
              const homenajePost = new FormData();
              homenajePost.append("id_usuario", id);
              homenajePost.append("id_difunto", this.difunto.id_difunto);
              homenajePost.append("fecha_publicacion", fecha as string);
              homenajePost.append("estado", "True");
              homenajePost.append("likes", "0");
              homenajePost.append("id_textcontent", id_mensaje);
              this.homenaje.postHomenajeGeneral(homenajePost, token).subscribe(
                async (resp: any) => {
                  await this.dismissMensajeLoading("idMensaje");
                  await this.dismiss();
                  await this.presentToast(
                    "Se ha subido con éxito...",
                    "middle",
                    "success"
                  );
                  // await this.textoAlert('Se ha subido con éxito', 'Publicación');
                  this.cargarMuro();
                },
                async (error) => {
                  await this.dismissMensajeLoading("idMensaje");
                  await this.dismiss();
                  await this.textoAlert(
                    "Error al subir la publicación, intente otra vez...",
                    "Publicación"
                  );
                }
              );
            });
          },
          async (error) => {
            await this.dismissMensajeLoading("idMensaje");
            await this.dismiss();
            await this.textoAlert(
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
  async textoAlert(mensaje, titulo) {
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
   * Se encarga de cerrar el modal de texto
   */
  async dismiss() {
    await this.modalController.dismiss({
      dismissed: true,
    });
  }
}
