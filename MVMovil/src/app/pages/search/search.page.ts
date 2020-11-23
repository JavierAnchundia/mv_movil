import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, FormControl } from "@angular/forms";
import { NavController, Platform } from "@ionic/angular";
import { NavigationExtras, Router } from "@angular/router";
import { SectorService } from "src/app/services/sector/sector.service";
import { TiposepulturaService } from "src/app/services/tiposepultura/tiposepultura.service";
import { environment } from "../../../environments/environment";
import { AlertController } from "@ionic/angular";
import { DifuntoService } from "src/app/services/difunto/difunto.service";
import { LoadingController } from "@ionic/angular";

@Component({
  selector: "app-search",
  templateUrl: "./search.page.html",
  styleUrls: ["./search.page.scss"],
})
export class SearchPage implements OnInit {
  searchFG: FormGroup;
  id;
  lista_sector: any;
  lista_sepultura: any;
  sepulturaOption: any;
  sectorOption: string;
  showSpinner: Boolean = false;
  lista_resultados: any = [];
  id_camposanto: number = environment.camposanto.idCamposanto;

  constructor(
    public formBuilder: FormBuilder,
    public router: Router,
    public _sector: SectorService,
    public _sepultura: TiposepulturaService,
    public navCtrl: NavController,
    private alertController: AlertController,
    private _difunto: DifuntoService,
    private platform: Platform,
    private loadingController: LoadingController
  ) {
    this.searchFG = new FormGroup({
      nombres: new FormControl(""),
      apellidos: new FormControl(""),
      tipoSepultura: new FormControl(""),
      sector: new FormControl(""),
      fechaDefuncion: new FormControl(""),
      noLapida: new FormControl(""),
    });

    this.platform.backButton.subscribeWithPriority(10, () => {
      this.router.navigate(["inicio"]);
    });
  }

  ngOnInit() {
    this.id = environment.camposanto.idCamposanto;
    this.cargarSector();
    this.cargarSepultura();
  }

  /**
   * Permite encapsular la informacion
   * @param value objecto con los datos del formulario
   */
  async onSubmit(value) {
    await this.showSearchLoading("id_search");
    this.cargarResultados(value);
  }

  /**
   * Permite validar que campos son nulos y cuales no para enviar al backend y rertorne el
   * listado de difuntos con dicho match
   * @param value objecto con los datos del formulario
   */
  async cargarResultados(value) {
    if (value.nombres == "") {
      value.nombres = null;
    }
    if (value.apellidos == "") {
      value.apellidos = null;
    }
    await this._difunto
      .getDifuntos(this.id_camposanto, value.nombres, value.apellidos)
      .toPromise()
      .then(
        (resp: any) => {
          // this.showSpinner = false;
          this.dismissSearchLoading("id_search");
          this.lista_resultados = resp;
          if (this.lista_resultados == 0) {
            this.noFoundAlert();
          } else {
            let navigationExtras: NavigationExtras = {
              state: { listaFallecidos: this.lista_resultados },
            };
            this.router.navigate(["search-results"], navigationExtras);
          }
        },
        (error) => {
          this.dismissSearchLoading("id_search");
          this.noFoundAlert();
        }
      );
  }

  /**
   * Muestra un loading controller mientras se consulta el listado de difuntos al server
   * @param idLoading id del loading controller
   */
  async showSearchLoading(idLoading) {
    const loading = await this.loadingController.create({
      id: idLoading,
      cssClass: "colorloading",
      message: "Cargando difuntos...",
    });

    return await loading.present();
  }

  /**
   * Oculta el loading controller cuando ha retornado alguna informacion del backend
   * @param idLoading id del loading controller
   */
  async dismissSearchLoading(idLoading) {
    return await this.loadingController.dismiss(null, null, idLoading);
  }

  /**
   * Muestra un alert controller cuando no se ha obtenido resultados del match de difuntos
   */
  async noFoundAlert() {
    const alert = await this.alertController.create({
      cssClass: "alertControllerSearch",
      message:
        '<div class="alertImg"><img src="assets/bad-search.png"></div><div class="alertLabel"><ion-label>No se encontraron coicidencias</ion-label></div>',
      buttons: [{ text: "X", cssClass: "colorTextButton" }],
    });
    await alert.present();
  }

  /**
   * Se carga el listado del sectores que posee el camposanto
   */
  cargarSector() {
    this._sector.getSector(this.id).subscribe((resp: any) => {
      this.lista_sector = resp;
    });
  }

  /**
   * Se carga el listado de los tipos de sepulturas del camposanto
   */
  cargarSepultura() {
    this._sepultura.getSepultura(this.id).subscribe((resp: any) => {
      this.lista_sepultura = resp;
    });
  }

  /**
   * Permite guardar el tipo de sepultura seleccionado
   * @param value nombre de la sepultura escogida
   */
  onChangeSepultura(value) {
    this.sepulturaOption = value;
  }

  /**
   * Permite guardar la seleccion del sector
   * @param value nombre del sector escogida
   */
  onChangeSector(value) {
    this.sectorOption = value;
  }
}
