import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SobreNosotrosPage } from './sobre-nosotros.page';

const routes: Routes = [
  {
    path: '',
    component: SobreNosotrosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SobreNosotrosPageRoutingModule {}
