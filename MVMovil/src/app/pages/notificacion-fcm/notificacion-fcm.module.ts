import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NotificacionFcmPageRoutingModule } from './notificacion-fcm-routing.module';

import { NotificacionFcmPage } from './notificacion-fcm.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NotificacionFcmPageRoutingModule
  ],
  declarations: [NotificacionFcmPage]
})
export class NotificacionFcmPageModule {}
