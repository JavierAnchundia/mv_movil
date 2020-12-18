import { Component, OnInit } from "@angular/core";
import { ToastController, AlertController } from "@ionic/angular";
import { Router } from "@angular/router";
import { Platform } from "@ionic/angular";
import { MenuController } from "@ionic/angular";
import { StorageNotificationService } from "src/app/services/fcm/storage-notification.service";
import { FcmService } from "src/app/services/fcm/fcm.service";
import { ChangeDetectorRef } from "@angular/core";
import { Storage } from "@ionic/storage";
import INFO_SESION from "src/app/config/infoSesion";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-inicio",
  templateUrl: "./inicio.page.html",
  styleUrls: ["./inicio.page.scss"],
})
export class InicioPage implements OnInit {
  validateBadge: boolean = false;
  numNotificationPush: any = 0;
  urlWhatsapp: string = "";

  constructor(
    private router: Router,
    private platform: Platform,
    private menu: MenuController,
    public toastController: ToastController,
    private _storageFcm: StorageNotificationService,
    private _fcm: FcmService,
    private cRef: ChangeDetectorRef,
    private alertController: AlertController,
    private storage: Storage
  ) {
    this.menu.enable(true);
  }

  ngOnInit() {
    this._storageFcm.updateNumNP$.subscribe(async (estado) => {
      if (estado) {
        let data = await this._fcm.getNumNotification();
        this.actualizarEstado(data.value, true);
      } else {
        this.actualizarEstado(0, false);
      }
    });
    this.openWhatsapp();
  }

  goPaquetes() {
    this.router.navigate(["/paquetes"]);
  }

  /**
   * Permite actualizar el estado del icono de notificaciones
   * @param numero valor para setear el ion-badge de notifiaciones
   * @param estado booelan para mostar u oculatar el ion-badge
   */
  actualizarEstado(numero, estado) {
    this.numNotificationPush = numero;
    this.validateBadge = estado;
    this.cRef.detectChanges();
  }

  /**
   * Permite abrir whatsapp en el teléfono con el numero celular del camposanto
   */
  openWhatsapp() {
    let numberPhone = "593" + environment.camposanto.telefono;
    this.urlWhatsapp = "https://wa.me/" + numberPhone;
  }

  /**
   * Permite cambiar a la ventana de buscar difuntos
   */
  goSearch() {
    this.router.navigate(["/search"]);
  }

  /**
   * Permite cambiar a ventana de favoritos solo si el usuario ha inciado sesion
   */
  goFavoritos() {
    this.storage.get(INFO_SESION.TOKEN_KEY).then((token) => {
      if (token) {
        this.router.navigate(["/favoritos"]);
      } else {
        this.loginMessageAlertMuro(
          "Por favor inicie sesión o registrese para ver sus favoritos"
        );
      }
    });
  }

  /**
   * Permite cambiar a la ventana de notificaciones
   */
  goNotification() {
    this._storageFcm.set_NP(false);
    this._fcm.setNumNotification("0");
    this.router.navigate(["/notificacion"]);
  }

  /**
   * Permite abrir un Alert controller mostrando que si no ha iniciado sesion no podra acceder a
   * la pantalla de favoritos
   * @param message el id asignado al mensaje de alerta
   */
  async loginMessageAlertMuro(message) {
    const alert = await this.alertController.create({
      cssClass: "controlerAlert",
      message: "<strong>" + message + "</strong>",
      buttons: [
        {
          text: "Login",
          cssClass: "colorTextButton",
          handler: () => {
            this.router.navigate(["login"]);
          },
        },
        {
          text: "Cancelar",
          role: "cancel",
          cssClass: "colorTextButton",
          handler: () => {},
        },
      ],
    });
    await alert.present();
  }
}
