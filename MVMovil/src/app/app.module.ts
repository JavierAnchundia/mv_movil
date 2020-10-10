import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { AgmCoreModule } from "@agm/core";
import { environment } from "./../environments/environment";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { HttpClientModule } from '@angular/common/http';
import { Storage, IonicStorageModule } from '@ionic/storage';
import { JwtModule, JWT_OPTIONS } from "@auth0/angular-jwt";
import { DatePipe } from '@angular/common'
import { Facebook } from '@ionic-native/facebook/ngx';
import { Keyboard } from '@ionic-native/keyboard/ngx';

export function jwtOptionsFactory(storage) {
  return {
    tokenGetter: () => {
      return storage.get('access_token');
    },
    whitelistedDomains: ['127.0.0.1:8000']
  }
}

@NgModule({
  declarations: [AppComponent],
  entryComponents: [AppComponent],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(
      // {
      // scrollPadding: false,
      // scrollAssist: false,
      // }
    ), 
    AppRoutingModule,
    HttpClientModule,
    AgmCoreModule.forRoot({
      apiKey: environment.api_key,
      libraries: ["places", "drawing", "geometry"],
    }),
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps: [Storage],
      }
    }),
    IonicStorageModule.forRoot(),
  ],
  providers: [
    Keyboard,
    Geolocation,
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Facebook,
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
