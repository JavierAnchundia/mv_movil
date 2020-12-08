import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { Paquetes1PageRoutingModule } from "./paquetes-routing.module";

import { PaquetesPage } from "./paquetes.page";
import { ComponentsModule } from "src/app/components/components.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Paquetes1PageRoutingModule,
    ComponentsModule,
  ],
  declarations: [PaquetesPage],
})
export class Paquetes1PageModule {}
