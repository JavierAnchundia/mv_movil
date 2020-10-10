import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MuroDifuntoPageRoutingModule } from './muro-difunto-routing.module';
import { ContentPublicacionesComponent } from './content-publicaciones/content-publicaciones.component'
import { MuroDifuntoPage } from './muro-difunto.page';
import { ModalImagenComponent } from './modal-imagen/modal-imagen.component'
import { ModalVideoComponent } from './modal-video/modal-video.component'
import { ModalAudioComponent } from './modal-audio/modal-audio.component'
import { ModalTextoComponent } from './modal-texto/modal-texto.component'
import { DatePipe } from '@angular/common'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MuroDifuntoPageRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    MuroDifuntoPage,
    ContentPublicacionesComponent,
    ModalImagenComponent,
    ModalVideoComponent,
    ModalAudioComponent,
    ModalTextoComponent
    
  ],
  providers: [
    DatePipe
  ]
})
export class MuroDifuntoPageModule {}
