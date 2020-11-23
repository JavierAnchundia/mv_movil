import { Component, OnInit } from "@angular/core";
import { NavigationExtras, Router } from "@angular/router";
import { StorageNotificationService } from "src/app/services/fcm/storage-notification.service";
import { ChangeDetectorRef } from "@angular/core";

@Component({
  selector: "app-notificacion",
  templateUrl: "./notificacion.page.html",
  styleUrls: ["./notificacion.page.scss"],
})
export class NotificacionPage implements OnInit {
  notificaciones: any = [];
  message: String = "";
  constructor(
    private router: Router,
    private _storageFcm: StorageNotificationService,
    private cRef: ChangeDetectorRef
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
    await this._storageFcm.getListNotificationFcm().then((lista) => {
      this.notificaciones = lista.reverse();
      this.cRef.detectChanges();
    });
  }

  /**
   * Permite cambiar de pantalla a la del muro del difunto
   * @param difunto es el objecto con los datos del difunto
   */
  goMuroDifunto(difunto) {
    let navigationExtras: NavigationExtras = { state: { difunto: difunto } };
    this.router.navigate(["muro-difunto"], navigationExtras);
  }
}
