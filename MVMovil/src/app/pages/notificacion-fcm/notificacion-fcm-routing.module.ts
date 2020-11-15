import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotificacionFcmPage } from './notificacion-fcm.page';

const routes: Routes = [
  {
    path: '',
    component: NotificacionFcmPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotificacionFcmPageRoutingModule {}
