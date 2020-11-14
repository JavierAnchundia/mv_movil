import { Component } from '@angular/core';

import { MenuController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/auth/auth.service';
import { Router } from '@angular/router';
import { FcmService } from 'src/app/services/fcm/fcm.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private auth: AuthService,
    private router: Router,
    private menu: MenuController,
    private fcm: FcmService,
  ) {
    
    this.initializeApp();
  }
  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.fcm.initFCM();
      // this.auth.authenticationState.subscribe(
      //   state => {
      //     if(state){
      //       this.menu.enable(true)
      //       this.router.navigate(['inicio'])
      //     }
      //     else{
      //       this.router.navigate(['login'])
      //     }
      //   }
      // );
    });
  }
}
