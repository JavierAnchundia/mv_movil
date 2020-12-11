import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { SobreNosotrosPageRoutingModule } from "./sobre-nosotros-routing.module";

import { SobreNosotrosPage } from "./sobre-nosotros.page";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SobreNosotrosPageRoutingModule,
  ],
  declarations: [SobreNosotrosPage],
  providers: [],
})
export class SobreNosotrosPageModule {}
