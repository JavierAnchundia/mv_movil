import { Component, Input, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import {
  ToastController,
  LoadingController,
  AlertController,
} from "@ionic/angular";
import { Plugins, CameraResultType } from "@capacitor/core";
import { HomenajeImagenService } from "src/app/services/homenaje_imagen/homenaje-imagen.service";
import { Storage } from "@ionic/storage";
import { DatePipe } from "@angular/common";
import { HomenajesService } from "src/app/services/homenajes/homenajes.service";
const { Camera } = Plugins;
import INFO_SESION from "src/app/config/infoSesion";

@Component({
  selector: "app-modal-imagen",
  templateUrl: "./modal-imagen.component.html",
  styleUrls: ["./modal-imagen.component.scss"],
})
export class ModalImagenComponent implements OnInit {
  @Input() difunto: any;

  imagen: any = [];
  mensajeImagenForm: FormGroup;
  validarImagen: boolean = true;
  constructor(
    private alertController: AlertController,
    private formBuilder: FormBuilder,
    public modalController: ModalController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private service_homenaje: HomenajeImagenService,
    private storage: Storage,
    public datepipe: DatePipe,
    private homenaje: HomenajesService
  ) {}

  ngOnInit() {
    this.mensajeImagenForm = this.formBuilder.group({
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
   * Funcion se activa con el boton envair del formulario
   */
  async submit() {
    if (this.imagen.length === 0) {
      this.imagenAlert("Por favor escoja una imagen...", "Alerta Imagen");
    } else {
      await this.showMensajeLoading("idMensaje");
      this.postImagen();
    }
  }

  /**
   * Crea un nombre para la foto cargada, ya que el plugin de capacitor obtiene la imagen formato base64
   */
  crearNombreArchivo() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".png";
    return newFileName;
  }

  /**
   * Activa la funcion de capturar foto
   */
  async seleccionarImagen() {
    await this.capturarFoto();
  }

  /**
   * Permite contactar con la camara del propio dispositivo para cargar ya sea una imagen de galeria
   * o para tomar una foto
   */
  async capturarFoto() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      saveToGallery: true,
    }).then(async (resp) => {
      this.validarImagen = false;
      let imageUrl = (await "data:image/png;base64,") + resp.base64String;
      this.imagen = [
        {
          path: imageUrl,
          nombre: this.crearNombreArchivo(),
        },
      ];
    });
  }

  /**
   * Permite eliminar la imagen cargada
   */
  eliminarImagen() {
    this.validarImagen = true;
    this.imagen = [];
    this.presentToast("Se ha eliminado la imagen...", "bottom", "warning");
  }

  /**
   * Permite enviar los datos de la publicacion con la imagen como archivo a la base de datos
   * Llama a la funcion de postImagen del servicio de ImagenService.ts para enviar la informacion al backend
   */
  async postImagen() {
    let nombre = await this.imagen[0].nombre;
    let img_base64 = await this.imagen[0].path;
    let imagenData = await new FormData();
    imagenData.append("nombre_file", nombre);
    imagenData.append("mensaje", this.mensajeImagenForm.value.mensaje);
    imagenData.append("img_base64", img_base64);
    this.storage.get(INFO_SESION.TOKEN_KEY).then((token) => {
      this.service_homenaje
        .postImagen(imagenData, token)
        .toPromise()
        .then(
          (resp) => {
            this.storage.get(INFO_SESION.IDUSER).then((id) => {
              let fecha = this.getFechaPublicacion();
              let id_imagen = resp["id_imagen"];
              const homenajePost = new FormData();
              homenajePost.append("id_usuario", id);
              homenajePost.append("id_difunto", this.difunto.id_difunto);
              homenajePost.append("fecha_publicacion", fecha as string);
              homenajePost.append("estado", "True");
              homenajePost.append("likes", "0");
              homenajePost.append("id_imagecontent", id_imagen);
              this.homenaje.postHomenajeGeneral(homenajePost, token).subscribe(
                async (resp: any) => {
                  this.validarImagen = true;
                  this.imagen = [];
                  await this.dismissMensajeLoading("idMensaje");
                  await this.dismiss();
                  await this.presentToast(
                    "Se ha subido con éxito...",
                    "middle",
                    "success"
                  );
                  // await this.imagenAlert('Se ha subido con éxito', 'Publicación');
                  this.cargarMuro();
                },
                async (error) => {
                  this.validarImagen = true;
                  this.imagen = [];
                  await this.dismissMensajeLoading("idMensaje");
                  await this.dismiss();
                  await this.imagenAlert(
                    "Error al subir la publicación, intente otra vez...",
                    "Publicación"
                  );
                }
              );
            });
          },
          async (error) => {
            this.validarImagen = true;
            this.imagen = [];
            await this.dismissMensajeLoading("idMensaje");
            await this.dismiss();
            await this.imagenAlert(
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
  async imagenAlert(mensaje, titulo) {
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
   * Se encarga de cerrar el modal de imagen
   */
  async dismiss() {
    await this.modalController.dismiss({
      dismissed: true,
    });
  }
}
