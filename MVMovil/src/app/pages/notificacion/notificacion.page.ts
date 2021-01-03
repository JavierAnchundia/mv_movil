import { Component, OnInit } from "@angular/core";
import { NavigationExtras, Router } from "@angular/router";
import { StorageNotificationService } from "src/app/services/fcm/storage-notification.service";
import { ChangeDetectorRef } from "@angular/core";
import { AlertController, LoadingController } from "@ionic/angular";
import { NotificacionesService } from "src/app/services/notificaciones/notificaciones.service";
import { environment } from "src/environments/environment";

interface notificacionI {
  title: string;
  message: string;
  type: string;
  difunto: any;
}

@Component({
  selector: "app-notificacion",
  templateUrl: "./notificacion.page.html",
  styleUrls: ["./notificacion.page.scss"],
})
export class NotificacionPage implements OnInit {
  notificaciones: notificacionI[] = [];
  message: String = "";
  spinnerState: boolean = true;
  noticacion: notificacionI;
  notificacionesStored: notificacionI[] = [];
  idCamposanto: number;

  constructor(
    private router: Router,
    private _storageFcm: StorageNotificationService,
    private cRef: ChangeDetectorRef,
    private loadingController: LoadingController,
    private _notificacion: NotificacionesService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.idCamposanto = environment.camposanto.idCamposanto;
    this._storageFcm.updateNumNP$.subscribe((isState) => {
      if (isState) {
        this.cargarNotificaciones();
      }
    });
    this.cargarNotificaciones();
  }

  async cargarNotificaciones() {
    await this.cargarData();
    await this.obtenerListNotificacion(this.idCamposanto);
  }
  /**
   * Funcion permite cargar del storage del dispositivo de las notificaciones push que han llegado
   */
  async cargarData() {
    this.spinnerState = await true;
    this.notificacionesStored = [];
    await this._storageFcm
      .getListNotificationFcm()
      .then((lista) => {
        lista.reverse();
        for (let notifi of lista) {
          this.noticacion = {
            title: notifi.title,
            message: notifi.message,
            type: notifi.tipo,
            difunto: notifi.difunto,
          };
          this.notificacionesStored.push(this.noticacion);
        }
        this.spinnerState = false;
        this.cRef.detectChanges();
      })
      .catch((error) => {
        this.spinnerState = false;
      });
  }

  async obtenerListNotificacion(id) {
    this.spinnerState = await true;
    this.notificaciones = [];
    await this._notificacion.getNotificaciones(id).subscribe(
      (data: any) => {
        data.reverse();
        for (let notifi of data) {
          this.noticacion = {
            title: notifi.titulo,
            message: notifi.mensaje,
            type: notifi.tipo,
            difunto: "",
          };
          this.notificaciones.push(this.noticacion);
        }
        this.spinnerState = false;
        this.cRef.detectChanges();
      },
      (error) => {
        this.spinnerState = false;
      }
    );
  }

  goPaquete() {
    this.router.navigate(["paquetes"]);
  }

  openTip(title, message) {
    this.tipAlert(title, message);
  }

  /**
   * Permite cambiar de pantalla a la del muro del difunto
   * @param difunto es el objecto con los datos del difunto
   */
  goMuroDifunto(difunto) {
    let navigationExtras: NavigationExtras = { state: { difunto: difunto } };
    this.router.navigate(["muro-difunto"], navigationExtras);
  }

  /**
   * Muestra un loading controller mientras se consulta el listado de notificaciones al storage device
   * @param idLoading id del loading controller
   */
  async showNotificacionLoading(idLoading) {
    const loading = await this.loadingController.create({
      id: idLoading,
      cssClass: "colorloading",
      message: "Cargando notificaciones...",
    });
    return await loading.present();
  }

  /**
   * Oculta el loading controller cuando ha retornado alguna informacion
   * @param idLoading id del loading controller
   */
  async dismissNotificacionLoading(idLoading) {
    return await this.loadingController.dismiss(null, null, idLoading);
  }

  async tipAlert(title, message) {
    const alert = await this.alertController.create({
      cssClass: "controlerAlert",
      header: title,
      message: message,
      buttons: [
        {
          text: "Ok",
          cssClass: "colorTextButton",
          handler: () => {},
        },
      ],
    });
    await alert.present();
  }
}
