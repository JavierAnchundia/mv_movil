import { Component, ViewChild } from "@angular/core";
import { IonRouterOutlet, Platform } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { FcmService } from "src/app/services/fcm/fcm.service";
import { StorageNotificationService } from "src/app/services/fcm/storage-notification.service";
import { Location } from "@angular/common";
import { Plugins } from "@capacitor/core";
const { App } = Plugins;

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent {
  @ViewChild(IonRouterOutlet, { static: true }) routerOutlet: IonRouterOutlet;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private fcm: FcmService,
    private _storageFcm: StorageNotificationService,
    private location: Location
  ) {
    this.initializeApp();
    this.backButton();
  }
  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      // this.splashScreen.hide();
      this.fcm.initFCM();
      this._storageFcm.removeNotification();
      this._storageFcm.set_NP(true);
      this.splashScreen.hide();
    });
  }

  backButton() {
    if (this.platform.is("android")) {
      this.platform.backButton.subscribeWithPriority(10, () => {
        if (!this.routerOutlet.canGoBack()) {
          App.exitApp();
        } else {
          this.location.back();
        }
      });
    }
  }
}
