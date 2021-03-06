import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { Platform } from "@ionic/angular";
import { environment } from "src/environments/environment";
import { TiposepulturaService } from "src/app/services/tiposepultura/tiposepultura.service";
import { SectorService } from "src/app/services/sector/sector.service";

@Component({
  selector: "app-ubicacion-fallecido",
  templateUrl: "./ubicacion-fallecido.page.html",
  styleUrls: ["./ubicacion-fallecido.page.scss"],
})
export class UbicacionFallecidoPage implements OnInit {
  zoom = 15;
  latFallecido: any = 0;
  lngFallecido: any = 0;
  lat: number = -1.885856;
  lng: number = -80.1096256;
  id: Number = environment.camposanto.idCamposanto;
  difunto: any = [];
  sector: any = [];
  lista_sector: any = [];
  lista_tip_sep: any = [];
  tipo_sepultura: any = [];

  constructor(
    private platform: Platform,
    private geolocation: Geolocation,
    private router: Router,
    private route: ActivatedRoute,
    private service_sepultura: TiposepulturaService,
    private sercice_sector: SectorService
  ) {
    this.platform.backButton.subscribeWithPriority(30, () => {
      this.router.navigate(["search-results"]);
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.difunto = this.router.getCurrentNavigation().extras.state.difunto;
      }
    });

    this.setCurrentPosition();
    this.getGeoDifunto();
    this.getSector(this.difunto.id_camposanto, this.difunto.id_sector);
    this.getTipoSepultura(
      this.difunto.id_camposanto,
      this.difunto.id_tip_sepultura
    );
  }

  /**
   * Permite obtener el nombre del sector donde esta sepultado el difunto
   * @param id_camposanto contiene el id del camposanto
   * @param id_sector contiene el id del sector donde esta el difunto
   */
  async getSector(id_camposanto, id_sector) {
    await this.sercice_sector.getSector(id_camposanto).subscribe((resp) => {
      for (let sect in resp) {
        if (resp[sect].id_sector == id_sector) {
          this.sector = resp[sect];
        }
      }
    });
  }

  /**
   * Permite obtener el nombre del tipo de sepultura donde esta el difunto
   * @param id_camposanto contiene el id del camposanto
   * @param id_tip_sepultura contiene el id del tipo de sepultura
   */
  getTipoSepultura(id_camposanto, id_tip_sepultura) {
    this.service_sepultura.getSepultura(id_camposanto).subscribe((resp) => {
      for (let tip in resp) {
        if (resp[tip].id_tip_sepultura == id_tip_sepultura) {
          this.tipo_sepultura = resp[tip];
        }
      }
    });
  }

  /**
   * Se cargan las latitudes y longitudes del difunto
   */
  getGeoDifunto() {
    this.latFallecido = this.difunto.latitud;
    this.lngFallecido = this.difunto.longitud;
  }

  /**
   * Se obtiene la posicion actual del usuario para ser cargada en el mapa
   */
  async setCurrentPosition() {
    await this.platform.ready().then(() => {
      this.geolocation
        .getCurrentPosition()
        .then((resp) => {
          this.lat = resp.coords.latitude;
          this.lng = resp.coords.longitude;
        })
        .catch((error) => {
          console.log(error);
        });
    });
  }
}
