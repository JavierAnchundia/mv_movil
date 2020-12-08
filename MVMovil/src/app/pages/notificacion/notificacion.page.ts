import { Component, OnInit } from "@angular/core";
import { NavigationExtras, Router } from "@angular/router";
import { StorageNotificationService } from "src/app/services/fcm/storage-notification.service";
import { ChangeDetectorRef } from "@angular/core";
import { LoadingController } from "@ionic/angular";

@Component({
  selector: "app-notificacion",
  templateUrl: "./notificacion.page.html",
  styleUrls: ["./notificacion.page.scss"],
})
export class NotificacionPage implements OnInit {
  notificaciones: any = [];
  message: String = "";
  spinnerState: boolean = true;
  constructor(
    private router: Router,
    private _storageFcm: StorageNotificationService,
    private cRef: ChangeDetectorRef,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this._storageFcm.updateNumNP$.subscribe((isState) => {
      if (isState) {
        this.cargarData();
      }
    });
    this.cargarData();
  }

  /**
   * Funcion permite cargar del storage del dispositivo de las notificaciones push que han llegado
   */
  async cargarData() {
    this.spinnerState = await true;
    // await this.delay(6000);
    // await this.showNotificacionLoading("id_notificacion");
    await this._storageFcm
      .getListNotificationFcm()
      .then((lista) => {
        this.notificaciones = lista.reverse();
        this.cRef.detectChanges();
        this.spinnerState = false;
        // this.dismissNotificacionLoading("id_notificacion");
      })
      .catch((error) => {
        this.spinnerState = false;
        // this.dismissNotificacionLoading("id_notificacion");
      });
  }

  // delay(ms: number) {
  //   return new Promise((resolve) => setTimeout(resolve, ms));
  // }

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
}
