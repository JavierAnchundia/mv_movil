import { Component, Input, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";
import URL_SERVICIOS from "src/app/config/config";

@Component({
  selector: "app-modal-detalle",
  templateUrl: "./modal-detalle.component.html",
  styleUrls: ["./modal-detalle.component.scss"],
})
export class ModalDetalleComponent implements OnInit {
  @Input() paquete: any;
  url_backend: string = "";

  constructor(public modalController: ModalController) {}

  ngOnInit() {
    this.url_backend = URL_SERVICIOS.url_backend;
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
