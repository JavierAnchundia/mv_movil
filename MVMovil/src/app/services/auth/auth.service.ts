import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Platform, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { JwtHelperService } from "@auth0/angular-jwt";
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import URL_SERVICIOS from 'src/app/config/config';

const TOKEN_KEY = 'access_token';
const REFRESH_TOKEN = 'refresh_token';
const USERNAME = 'username';
const PASSWORD = 'password';
const IDUSER = 'id_usuario';

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
    private helper: JwtHelperService
  ) {
    this.plataform.ready().then(
      () => {
        this.checkToken();
      }
    )
  }

  checkToken(){
    this.storage.get(TOKEN_KEY).then(
      token => {
        if(token){
          let decoded = this.helper.decodeToken(token);
          let isExpired = this.helper.isTokenExpired(token);
          console.log(isExpired);
          console.log('expired',isExpired)
          if(!isExpired){
            this.user = decoded;
            this.authenticationState.next(true);
          }
          else{
            this.storage.get(USERNAME).then(
              username => {
                if(username){
                  this.storage.get(PASSWORD).then(
                    password => {
                      if(password){
                        let credential = {
                          "username" : username,
                          "password" : password 
                        }
                        this.login(credential).subscribe(
                          resp=> {
                            console.log("toekn actualizado")
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
          this.storage.set(TOKEN_KEY, resp['access']);
          // this.storage.remove(TOKEN_KEY);
          this.authenticationState.next(true);
        }
      );
    }
  }

  login(credentials){
    let url = URL_SERVICIOS.token;
    this.storage.set(USERNAME,credentials.username)
    this.storage.set(PASSWORD, credentials.password)
    return this.http.post(url, credentials).pipe(
      tap(
        resp => {
          if(resp['access'] && resp['refresh']){
            this.storage.set(TOKEN_KEY, resp['access'])
            this.storage.set(REFRESH_TOKEN, resp['refresh'])
            let user_id = this.helper.decodeToken(resp['access'])
            this.storage.set(IDUSER, user_id.user_id)
            this.authenticationState.next(true);
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

  async logout(){
    await this.storage.remove(TOKEN_KEY).then(
      () => {
        this.authenticationState.next(false);
        this.storage.remove(TOKEN_KEY).then();
        this.storage.remove(REFRESH_TOKEN).then();
        this.storage.remove(USERNAME).then();
        this.storage.remove(PASSWORD).then();
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
          this.storage.set(TOKEN_KEY, resp['access'])
          this.storage.set(REFRESH_TOKEN, resp['refresh'])
          let user_id = this.helper.decodeToken(resp['access'])
          this.storage.set(IDUSER, user_id.user_id)
          this.authenticationState.next(true);
        }
      )
    )
  }

  getInfoUsuario(url){
    return this.http.get(url);
  }

  getDatosUsuario(){
    let url = URL_SERVICIOS.datosUsuario + this.storage.get('')
  }
  
  getUsersAll(){
    let url = URL_SERVICIOS.obtener_usuarios;
    return this.http.get(url);
  }
  
}
