import { Component, Input, OnInit } from "@angular/core";
import { AlertController, ModalController } from "@ionic/angular";
import URL_SERVICIOS from "src/app/config/config";

@Component({
  selector: "app-modal-detalle",
  templateUrl: "./modal-detalle.component.html",
  styleUrls: ["./modal-detalle.component.scss"],
})
export class ModalDetalleComponent implements OnInit {
  @Input() paquete: any;
  url_backend: string = "";

  constructor(
    public modalController: ModalController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.url_backend = URL_SERVICIOS.url_backend;
  }

  /**
   * Función es llamada por boton de comprar en el modal
   */
  comprarPaquete() {
    let message = "Opción de compra no disponible por el momento";
    let title = "";
    this.mostarAlert(message, title);
  }

  /**
   * Muesta un alerta con informacion que se desea mostar al usaurio
   * @param title Titulo que se desea mostar
   * @param message Mensaje que se desea mostar
   */
  async mostarAlert(message, title) {
    const alert = await this.alertController.create({
      cssClass: "controlerAlert",
      header: title,
      message: message,
      buttons: [{ text: "OK", cssClass: "colorTextButton" }],
    });
    await alert.present();
  }

  /**
   * Se encarga de cerrar el modal
   */
  async dismiss() {
    await this.modalController.dismiss({
      dismissed: true,
    });
  }
}
