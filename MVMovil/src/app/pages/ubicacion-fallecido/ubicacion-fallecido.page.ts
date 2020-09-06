import { Component, OnInit } from "@angular/core";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { Platform } from '@ionic/angular';
import { environment } from '../../../environments/environment'
import { GeolocalizacionService } from '../../services/geolocalizacion/geolocalizacion.service';

@Component({
  selector: "app-ubicacion-fallecido",
  templateUrl: "./ubicacion-fallecido.page.html",
  styleUrls: ["./ubicacion-fallecido.page.scss"],
})
export class UbicacionFallecidoPage implements OnInit {
  zoom = 15;
  latFallecido: any = -1.785856;
  lngFallecido: any = -80.0096256;
  lat: number = -1.885856;
  lng: number = -80.1096256;
  id: Number = environment.camposanto.idCamposanto;


  constructor(
    private platform: Platform,
    private geolocation: Geolocation,
    private _serviceGeo: GeolocalizacionService
    ) 
    {}

  ngOnInit() {
    this.setCurrentPosition();
    this.getGeoDifunto(1);
  }

  getGeoDifunto(id){
    this._serviceGeo.getDifuntoGeolocalizacion(id).subscribe(
      (data)  => {
        this.latFallecido = data.latitud;
        this.lngFallecido = data.longitud;
      }
    )
  }
  async setCurrentPosition() {
    await this.platform.ready().then(()=>{
      this.geolocation.getCurrentPosition().then((resp) => {
        this.lat = resp.coords.latitude;
        this.lng = resp.coords.longitude;
      })
      .catch((error) => {
        console.log("Error getting location", error);
      });
    })
    
    // let watch = this.geolocation.watchPosition();
    // watch.subscribe((data) => {
    //   this.latCurrent = data.coords.latitude;
    //   this.lngCurrent = data.coords.longitude;
    // });
  }
}
