import { Component, OnInit } from "@angular/core";
import {
  Validators,
  FormBuilder,
  FormGroup,
  FormControl,
} from "@angular/forms";
import {
  AlertController,
  LoadingController,
  ToastController,
} from "@ionic/angular";
import { environment } from "src/environments/environment";
import { Plugins, CameraResultType } from "@capacitor/core";
const { Camera } = Plugins;
import INFO_SESION from "src/app/config/infoSesion";
import { DatePipe } from "@angular/common";
import { Storage } from "@ionic/storage";
import { SugerenciasService } from "src/app/services/sugerencias/sugerencias.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-sugerencias",
  templateUrl: "./sugerencias.page.html",
  styleUrls: ["./sugerencias.page.scss"],
})
export class SugerenciasPage implements OnInit {
  form_sugerencia: FormGroup;
  idCamposanto: any;
  imagen: any = [];
  validarImagen: boolean = true;
  constructor(
    public formBuilder: FormBuilder,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private storage: Storage,
    public datepipe: DatePipe,
    private _sugerencia: SugerenciasService,
    private router: Router
  ) {}

  ngOnInit() {
    this.idCamposanto = environment.camposanto.idCamposanto;
    this.form_sugerencia = this.formBuilder.group({
      mensaje: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(200),
        ])
      ),
    });
  }

  enviarSugerencia() {
    this.postImagen();
  }

  /**
   * Crea un nombre para la foto cargada, ya que el plugin de capacitor obtiene la imagen formato base64
   */
  crearNombreArchivo() {
    const d = new Date();
    const n = d.getTime();
    const newFileName = n + ".png";
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
   * Obtiene la fecha dado un formato
   */
  getFechaPublicacion() {
    const date = new Date();
    const latest_date = this.datepipe.transform(date, "yyyy-MM-dd");
    return latest_date;
  }

  /**
   * Permite enviar sugerencias con imagen de manera opcional como archivo a la base de datos
   * Llama a la funcion de postImagen del servicio de SugerenciaService.ts para enviar la informacion al backend
   */
  async postImagen() {
    await this.showMensajeLoading("idMensaje");
    const sugerenciaData = await new FormData();
    const fecha = this.getFechaPublicacion();
    sugerenciaData.append("mensaje", this.form_sugerencia.value.mensaje);
    sugerenciaData.append("fecha_emision", fecha as string);
    sugerenciaData.append("id_camposanto", this.idCamposanto);
    if (this.imagen.length !== 0) {
      const nombre = await this.imagen[0].nombre;
      const img_base64 = await this.imagen[0].path;
      sugerenciaData.append("nombre_file", nombre);
      sugerenciaData.append("img_base64", img_base64);
    }
    await this.storage.get(INFO_SESION.TOKEN_KEY).then(
      (token) => {
        this.storage.get(INFO_SESION.IDUSER).then((id) => {
          sugerenciaData.append("id_usuario", id);
          this._sugerencia.postSugerencia(sugerenciaData, token).subscribe(
            async (data) => {
              this.validarImagen = true;
              this.imagen = [];
              await this.dismissMensajeLoading("idMensaje");
              this.form_sugerencia.reset();
              this.router.navigate(["/inicio"]);
              await this.presentToast(
                "Se ha subido con éxito...",
                "middle",
                "success"
              );
            },
            async (error) => {
              this.validarImagen = true;
              this.imagen = [];
              await this.dismissMensajeLoading("idMensaje");
              await this.imagenAlert(
                "Error al subir la sugerencia, intente otra vez...",
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
        await this.imagenAlert(
          "Error al subir la sugerencia, intente otra vez...",
          "Publicación"
        );
      }
    );
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
      message: "Enviando sugerencia...",
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
}
