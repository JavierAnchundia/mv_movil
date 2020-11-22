import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Platform, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { JwtHelperService } from "@auth0/angular-jwt";
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import URL_SERVICIOS from 'src/app/config/config';
import INFO_SESION from 'src/app/config/infoSesion';
import { FcmService } from 'src/app/services/fcm/fcm.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public user: Observable<any>;
  authenticationState = new BehaviorSubject(false);

  constructor(
    private storage: Storage,
    private http: HttpClient,
    private plataform: Platform,
    private helper: JwtHelperService,
    private _fcm: FcmService,
  ) {
    this.plataform.ready().then(
      () => {
        this.checkToken();
      }
    )
  }

  private _recargarInfo = new Subject<string>();
  updateInfo$ = this._recargarInfo.asObservable();

  recarga_Info(message: string){
    this._recargarInfo.next(message);
  }

  checkToken(){
    this.storage.get(INFO_SESION.TOKEN_KEY).then(
      token => {
        if(token){
          let decoded = this.helper.decodeToken(token);
          let isExpired = this.helper.isTokenExpired(token);
          if(!isExpired){
            this.user = decoded;
            this.delayAuth(1500);
          }
          else{
            this.storage.get(INFO_SESION.IS_FACEBOOK).then(
              (is_facebook)=>{
                if(is_facebook){
                  this.logout();
                }
                else{
                  this.storage.get(INFO_SESION.USERNAME).then(
                    username => {
                      if(username){
                        this.storage.get(INFO_SESION.PASSWORD).then(
                          password => {
                            if(password){
                              let credential = {
                                "username" : username,
                                "password" : password 
                              }
                              this.login(credential).subscribe()
                            }
                          }
                        )
                      }
                    }
                  )
                }
              }
            )
          }
        }
      }
    )
  };

  async refresh_token(refresh){
    if(refresh){
      let url = URL_SERVICIOS.refresh_token;
      let refresh_token = {
        "refresh": refresh
      }
      await this.http.post(url, refresh_token).toPromise().then(
        (resp) => {
          this.storage.set(INFO_SESION.TOKEN_KEY, resp['access']);
          this.authenticationState.next(true);
        }
      );
    }
  }

  login(credentials){
    let url = URL_SERVICIOS.token;
    this.storage.set(INFO_SESION.USERNAME,credentials.username)
    this.storage.set(INFO_SESION.PASSWORD, credentials.password)
    return this.http.post(url, credentials).pipe(
      tap(
        resp => {
          if(resp['access'] && resp['refresh']){
            this.storage.set(INFO_SESION.TOKEN_KEY, resp['access']);
            this.storage.set(INFO_SESION.REFRESH_TOKEN, resp['refresh']);
            let user_id = this.helper.decodeToken(resp['access']);
            this.storage.set(INFO_SESION.IDUSER, user_id.user_id);
            this.updateTokenDevice(user_id.user_id);
            this.getInfoUser(user_id.user_id, resp['access']).toPromise().then(
              (resp)=>{
                this.storage.set(INFO_SESION.FIRST_NAME, resp['first_name']);
                this.storage.set(INFO_SESION.LAST_NAME, resp['last_name']);
                this.storage.set(INFO_SESION.IS_FACEBOOK, false);
                if(resp['image_perfil'] != null){
                  this.storage.set(INFO_SESION.IMAGE_USER, resp['image_perfil']);
                }
              }
            );
            this.delay(2000);
            this.delayAuth(1000);
          }
        }
      ),
      catchError(e => {
        console.log(e.error.msg);
        throw new Error(e);
      })
    )
  };

  register(credentials){
    let url = URL_SERVICIOS.users;
    return this.http.post(url, credentials, {observe: 'response'}).pipe(
      tap(resp =>{
        console.log(resp);
      }),
      catchError(e => {
        console.log(e.error.msg);
        throw new Error(e);
      })
    );
  }
  
  getInfoUser(id, token){
    let url = URL_SERVICIOS.get_user_by_id + id +'/'
    let httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer '+ token,
      })
    };
    return this.http.get(url, httpOptions);      
  }

  putInfoUser(token, username, datosUser){
    let url = URL_SERVICIOS.datosUsuario + username + "/";
    let httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer '+ token,
      })
    };
    return this.http.put(url, datosUser, httpOptions);
  }

  async logout(){
    await this.storage.remove(INFO_SESION.TOKEN_KEY).then(
      () => {
        this.authenticationState.next(false);
        this.storage.remove(INFO_SESION.TOKEN_KEY).then();
        this.storage.remove(INFO_SESION.REFRESH_TOKEN).then();
        this.storage.remove(INFO_SESION.USERNAME).then();
        this.storage.remove(INFO_SESION.PASSWORD).then();
        this.storage.remove(INFO_SESION.IDUSER).then();
        this.storage.remove(INFO_SESION.IMAGE_USER).then();
        this.storage.remove(INFO_SESION.IS_FACEBOOK).then();
      }
    )
  };

  isAuthenticated(){
    return this.authenticationState.value;
  };

  crearUsuarioFB(access_token){
    let url = URL_SERVICIOS.get_token_facebook;
    return this.http.post(url, access_token).pipe(
      tap(
        resp => {
          this.storage.set(INFO_SESION.TOKEN_KEY, resp['access']).then();
          this.storage.set(INFO_SESION.REFRESH_TOKEN, resp['refresh']).then();
          this.storage.set(INFO_SESION.IS_FACEBOOK, true).then();
          let user_id = this.helper.decodeToken(resp['access']);
          this.storage.set(INFO_SESION.IDUSER, user_id.user_id);
          this.updateTokenDevice(user_id.user_id);
          this.getInfoUser(user_id.user_id, resp['access']).toPromise().then(
            (resp)=>{
              if(resp['username'] != null){
                this.storage.set(INFO_SESION.USERNAME,resp['username']).then();
              }
              if(resp['first_name'] != null){
                this.storage.set(INFO_SESION.FIRST_NAME, resp['first_name']).then();
              }
              if(resp['last_name'] != null){
                this.storage.set(INFO_SESION.LAST_NAME, resp['last_name']).then();
              }
              if(resp['image_perfil'] != null){
                this.storage.set(INFO_SESION.IMAGE_USER, resp['image_perfil']).then();
              }
            }
          );
          this.delay(2000);
          this.delayAuth(1000);
        }
      )
    )
  }

  getInfoUsuario(url){
    return this.http.get(url);
  }

  
  getUsersAll(){
    let url = URL_SERVICIOS.obtener_usuarios;
    return this.http.get(url);
  }
  
  uploadImageProfile(id, data){
    let url = URL_SERVICIOS.update_image_profile + id +"/";
    return this.http.put(url, data);
  }

  delay(ms: number) {
    return new Promise( 
      resolve => setTimeout((resolve)=>{
        this.recarga_Info("recargar");
      }, ms) 
    );
  }

  delayAuth(ms: number) {
    return new Promise( 
      resolve => setTimeout((resolve)=>{
        this.authenticationState.next(true);
      }, ms) 
    );
  }

  sendEmail(email, id_camp){
    let url = URL_SERVICIOS.enviar_email_password + email + "/" + id_camp + "/";
    return this.http.get(url);
  }

  async updateTokenDevice(id_User){
    let storageTokenDevice = await this._fcm.getLocalTokeDevice();
    let parseData = JSON.parse(storageTokenDevice.value);
    if(!parseData.id_user){
      let url = URL_SERVICIOS.api_token_device + parseData.id + "/";
      const dataTokenDevice = new FormData();
      dataTokenDevice.append("token_device", parseData.token);
      dataTokenDevice.append("id_user", id_User);
      this.http.put(url, dataTokenDevice).subscribe(
        (data)=>{
          this._fcm.setLocalTokenDevice(data['token_device'], data['id_token_device'], data["id_user"]);
        }
      )
    }
  }
}
