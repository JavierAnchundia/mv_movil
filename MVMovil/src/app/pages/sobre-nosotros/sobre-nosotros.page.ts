import { Component, OnInit } from "@angular/core";
import { Plugins } from "@capacitor/core";
import { CamposantoService } from 'src/app/services/camposanto/camposanto.service';
import { GeolocalizacionService } from 'src/app/services/geolocalizacion/geolocalizacion.service';
import { RedSocialService } from "src/app/services/red-social/red-social.service";
import URL_SERVICIOS from 'src/app/config/config';
import { environment } from 'src/environments/environment';
const { App } = Plugins;

@Component({
  selector: "app-sobre-nosotros",
  templateUrl: "./sobre-nosotros.page.html",
  styleUrls: ["./sobre-nosotros.page.scss"],
})
export class SobreNosotrosPage implements OnInit {
  latCamposanto: number = -2.0508396;
  lngCamposanto: number = -79.8998371;
  linkFacebook: string = "";
  nombre: string = "";
  direccion: string = "";
  telefono: string = "";
  linkPagina: string = "";
  correo: string = "";
  imagen: string = "";
  url_backend: String = URL_SERVICIOS.url_backend;
  constructor(
    private _camposanto: CamposantoService,
    private _geolocalizacion: GeolocalizacionService,
    private _redSocial: RedSocialService
  ) {}

  ngOnInit() {
    let idCamposanto = environment.camposanto.idCamposanto;
    this.loadCamposanto(idCamposanto);
    this.loadGeolocalizacion(idCamposanto);
    this.loadRedSocial(idCamposanto);
  }

  loadGeolocalizacion(id){
    this._geolocalizacion.getListGeolocalizacion(id).subscribe(
      (data)=>{
        this.latCamposanto = data[0]["latitud"];
        this.lngCamposanto = data[0]["longitud"];
      }
    );
  }

  loadRedSocial(id){
    this._redSocial.getRedes(id).subscribe(
      (data: any)=>{
        for(let red of data){
          if(red['nombre'] == "facebook"){
            this.linkFacebook = red['link']
          }
        }
      }
    )
  }

  loadCamposanto(id){
    this._camposanto.getCamposantoByID(id).subscribe(
      (data)=>{
        this.nombre = data["nombre"];
        this.direccion = data["direccion"];
        this.telefono = data["telefono"];
        this.imagen = data["logo"];
        this.loadEmpresa(data["id_empresa"]);
      }
    )
  }

  loadEmpresa(id){
    this._camposanto.getEmpresa(id).subscribe(
      (data)=>{
        this.correo = data["correo"];
        this.linkPagina = data["web"];
      }
    )
  }

  openMap() {
    let pointCamposanto = this.latCamposanto + "," + this.lngCamposanto;
    let url = "https://maps.google.com/?q=" + pointCamposanto;
    window.open(url);
  }

  async openFacebook() {
    await App.canOpenUrl({
      url: this.linkFacebook,
    });
    await App.openUrl({
      url: this.linkFacebook,
    });
  }
}
