import { Component } from "@angular/core";
import { Platform } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { FcmService } from "src/app/services/fcm/fcm.service";
import { StorageNotificationService } from "src/app/services/fcm/storage-notification.service";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private fcm: FcmService,
    private _storageFcm: StorageNotificationService
  ) {
    this.initializeApp();
  }
  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.fcm.initFCM();
      this._storageFcm.removeNotification();
      this._storageFcm.set_NP(true);
    });
  }
}
