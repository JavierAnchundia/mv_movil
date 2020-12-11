import { Component, OnInit } from "@angular/core";
import { Plugins } from "@capacitor/core";
const { App } = Plugins;

@Component({
  selector: "app-sobre-nosotros",
  templateUrl: "./sobre-nosotros.page.html",
  styleUrls: ["./sobre-nosotros.page.scss"],
})
export class SobreNosotrosPage implements OnInit {
  latCamposanto: number = -2.0508396;
  lngCamposanto: number = -79.8998371;
  constructor() {}

  ngOnInit() {}

  openMap() {
    let pointCamposanto = this.latCamposanto + "," + this.lngCamposanto;
    let url = "https://maps.google.com/?q=" + pointCamposanto;
    window.open(url);
  }

  async openFacebook() {
    await App.canOpenUrl({
      url: "https://www.facebook.com/bryan.tutivenacosta/",
    });
    await App.openUrl({
      url: "https://www.facebook.com/bryan.tutivenacosta/",
    });
  }
}
