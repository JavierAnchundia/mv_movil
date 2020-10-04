import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MuroDifuntoPage } from './muro-difunto.page';

const routes: Routes = [
  {
    path: '',
    component: MuroDifuntoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MuroDifuntoPageRoutingModule {}
