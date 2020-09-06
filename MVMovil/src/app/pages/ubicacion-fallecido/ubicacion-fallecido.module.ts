import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { UbicacionFallecidoPageRoutingModule } from "./ubicacion-fallecido-routing.module";

import { UbicacionFallecidoPage } from "./ubicacion-fallecido.page";
import { AgmCoreModule } from "@agm/core";
import { environment } from "../../../environments/environment";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { GeolocalizacionService } from '../../services/geolocalizacion/geolocalizacion.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UbicacionFallecidoPageRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: environment.api_key,
      libraries: ["places", "drawing", "geometry"],
    }),
  ],
  declarations: [UbicacionFallecidoPage],
  providers: [Geolocation, GeolocalizacionService],
})
export class UbicacionFallecidoPageModule {}
