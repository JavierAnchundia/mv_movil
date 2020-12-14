import { Component, OnInit } from "@angular/core";
import { Plugins } from "@capacitor/core";
import { CamposantoService } from "src/app/services/camposanto/camposanto.service";
import { GeolocalizacionService } from "src/app/services/geolocalizacion/geolocalizacion.service";
import { RedSocialService } from "src/app/services/red-social/red-social.service";
import URL_SERVICIOS from "src/app/config/config";
import { environment } from "src/environments/environment";
const { App, Network } = Plugins;

@Component({
  selector: "app-sobre-nosotros",
  templateUrl: "./sobre-nosotros.page.html",
  styleUrls: ["./sobre-nosotros.page.scss"],
})
export class SobreNosotrosPage implements OnInit {
  latCamposanto: number;
  lngCamposanto: number;
  linkFacebook: string = "";
  linkInstagram: string = "";
  linkTwitter: string = "";
  nombre: string = "";
  direccion: string = "";
  telefono: string = "";
  linkPagina: string = "";
  correo: string = "";
  imagen: string = "";
  url_backend: string = URL_SERVICIOS.url_backend;
  url_image: string;

  constructor(
    private _camposanto: CamposantoService,
    private _geolocalizacion: GeolocalizacionService,
    private _redSocial: RedSocialService
  ) {}

  ngOnInit() {
    this.network();
  }

  async network() {
    let status = await Network.getStatus();
    console.log(status.connected);
    if (!status.connected) {
      this.latCamposanto = environment.camposanto.coordenadas.latitud;
      this.lngCamposanto = environment.camposanto.coordenadas.longitud;
      this.linkFacebook = environment.camposanto.redes.linkFacebook;
      this.nombre = environment.camposanto.nombre;
      this.direccion = environment.camposanto.direccion;
      this.telefono = environment.camposanto.telefono;
      this.linkPagina = environment.camposanto.linkPagina;
      this.correo = environment.camposanto.correo;
      this.url_image = environment.camposanto.imagen;
      this.linkInstagram = environment.camposanto.redes.linkInstagram;
      this.linkTwitter = environment.camposanto.redes.linkTwitter;
    } else {
      let idCamposanto = environment.camposanto.idCamposanto;
      this.loadCamposanto(idCamposanto);
      this.loadGeolocalizacion(idCamposanto);
      this.loadRedSocial(idCamposanto);
    }
  }
  loadGeolocalizacion(id) {
    this._geolocalizacion.getListGeolocalizacion(id).subscribe((data) => {
      this.latCamposanto = data[0]["latitud"];
      this.lngCamposanto = data[0]["longitud"];
    });
  }

  loadRedSocial(id) {
    this._redSocial.getRedes(id).subscribe((data: any) => {
      for (let red of data) {
        if (red["nombre"] == "facebook") {
          this.linkFacebook = red["link"];
        } else if (red["nombre"] == "instagram") {
          this.linkInstagram = red["link"];
        } else if (red["nombre"] == "twitter") {
          this.linkTwitter = red["link"];
        }
      }
    });
  }

  loadCamposanto(id) {
    this._camposanto.getCamposantoByID(id).subscribe((data) => {
      this.nombre = data["nombre"];
      this.direccion = data["direccion"];
      this.telefono = data["telefono"];
      this.imagen = data["logo"];
      this.url_image = this.url_backend + this.imagen;
      this.loadEmpresa(data["id_empresa"]);
    });
  }

  loadEmpresa(id) {
    this._camposanto.getEmpresa(id).subscribe((data) => {
      this.correo = data["correo"];
      this.linkPagina = data["web"];
    });
  }

  openMap() {
    let pointCamposanto = this.latCamposanto + "," + this.lngCamposanto;
    let url = "https://maps.google.com/?q=" + pointCamposanto;
    window.open(url);
  }

  async openFacebook() {
    if (this.linkFacebook != "") {
      await App.canOpenUrl({
        url: this.linkFacebook,
      });
      await App.openUrl({
        url: this.linkFacebook,
      });
    }
  }

  async openTwitter() {
    if (this.linkTwitter != "") {
      await App.canOpenUrl({
        url: this.linkTwitter,
      });
      await App.openUrl({
        url: this.linkTwitter,
      });
    }
  }

  async openInstagram() {
    if (this.linkInstagram != "") {
      await App.canOpenUrl({
        url: this.linkInstagram,
      });
      await App.openUrl({
        url: this.linkInstagram,
      });
    }
  }
}
