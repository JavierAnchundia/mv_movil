import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MuroDifuntoPageRoutingModule } from './muro-difunto-routing.module';
import { ContentPublicacionesComponent } from './content-publicaciones/content-publicaciones.component'
import { MuroDifuntoPage } from './muro-difunto.page';
import { ModalImagenComponent } from './modal-imagen/modal-imagen.component'
// para carga imagenes
import { Camera } from '@ionic-native/Camera/ngx';
import { File } from '@ionic-native/File/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';

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
    ModalImagenComponent
  ],
  providers: [
    Camera,
    File,
    WebView,
    FilePath
  ]
})
export class MuroDifuntoPageModule {}
