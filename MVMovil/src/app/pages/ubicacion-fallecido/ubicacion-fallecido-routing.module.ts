import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { UbicacionFallecidoPage } from './ubicacion-fallecido.page';

const routes: Routes = [
  {
    path: '',
    component: UbicacionFallecidoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers:[
    Geolocation
  ]
})
export class UbicacionFallecidoPageRoutingModule {}
