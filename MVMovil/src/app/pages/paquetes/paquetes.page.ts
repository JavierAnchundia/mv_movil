import { Component, OnInit } from "@angular/core";
import {
  AlertController,
  LoadingController,
  ModalController,
} from "@ionic/angular";
import { PaquetesService } from "src/app/services/paquetes/paquetes.service";
import { environment } from "src/environments/environment";
import URL_SERVICIOS from "src/app/config/config";
import { ModalDetalleComponent } from "./modal-detalle/modal-detalle.component";
@Component({
  selector: "app-paquetes",
  templateUrl: "./paquetes.page.html",
  styleUrls: ["./paquetes.page.scss"],
})
export class PaquetesPage implements OnInit {
  id_camposanto: any;
  lista_paquetes: any = [];
  url_backend: string = "";
  constructor(
    private _paquetes: PaquetesService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    public modalController: ModalController
  ) {}

  ngOnInit() {
    this.url_backend = URL_SERVICIOS.url_backend;
    this.id_camposanto = environment.camposanto.idCamposanto;
    this.obtenerListaPaquetes(this.id_camposanto);
  }

  async obtenerListaPaquetes(id) {
    await this.showPaqueteLoading("id_paquete");
    this._paquetes.getPaquetes(id).subscribe(
      (data) => {
        this.dismissPaqueteLoading("id_paquete");
        this.lista_paquetes = data;
        this.lista_paquetes.reverse();
      },
      (error) => {
        this.dismissPaqueteLoading("id_paquete");
      }
    );
  }

  goPaquete(paquete) {
    this.cargarModalDetalle(paquete);
  }

  /**
   * Muestra un loading controller mientras se consulta el listado de paquetes
   * @param idLoading id del loading controller
   */
  async showPaqueteLoading(idLoading) {
    const loading = await this.loadingController.create({
      id: idLoading,
      cssClass: "colorloading",
      message: "Cargando paquetes...",
    });
    return await loading.present();
  }

  /**
   * Oculta el loading controller cuando ha retornado alguna informacion
   * @param idLoading id del loading controller
   */
  async dismissPaqueteLoading(idLoading) {
    return await this.loadingController.dismiss(null, null, idLoading);
  }

  async cargarModalDetalle(paquete: any) {
    const modal = await this.modalController.create({
      component: ModalDetalleComponent,
      cssClass: "my-custom-class",
      componentProps: {
        paquete: paquete,
      },
    });
    return await modal.present();
  }
}
