import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { MuroDifuntoPageRoutingModule } from "./muro-difunto-routing.module";
import { ContentPublicacionesComponent } from "./content-publicaciones/content-publicaciones.component";
import { MuroDifuntoPage } from "./muro-difunto.page";
import { ModalImagenComponent } from "./modal-imagen/modal-imagen.component";
import { ModalVideoComponent } from "./modal-video/modal-video.component";
import { ModalAudioComponent } from "./modal-audio/modal-audio.component";
import { ModalTextoComponent } from "./modal-texto/modal-texto.component";
import { DatePipe } from "@angular/common";
import { ModalRosaComponent } from "./modal-rosa/modal-rosa.component";
import { ComponentsModule } from "src/app/components/components.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MuroDifuntoPageRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
  ],
  declarations: [
    MuroDifuntoPage,
    ContentPublicacionesComponent,
    ModalImagenComponent,
    ModalVideoComponent,
    ModalAudioComponent,
    ModalTextoComponent,
    ModalRosaComponent,
  ],
  providers: [Geolocation, DatePipe],
})
export class MuroDifuntoPageModule {}
