import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MuroDifuntoPageRoutingModule } from './muro-difunto-routing.module';

import { MuroDifuntoPage } from './muro-difunto.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MuroDifuntoPageRoutingModule
  ],
  declarations: [MuroDifuntoPage]
})
export class MuroDifuntoPageModule {}
