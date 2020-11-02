import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { HomenajesService } from 'src/app/services/homenajes/homenajes.service';
import { Storage } from '@ionic/storage';
import URL_SERVICIOS from 'src/app/config/config';

const IMAGE_USER = "image_user";
const FIRST_NAME = "first_name";
const LAST_NAME = "last_name";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  ocultar: boolean = false;
  defaultImage: String = "assets/page-muro/AVATAR.png";
  imageProfile: String = "";
  first_name: String = "";
  last_name: String = "";
  urlBackend: String = URL_SERVICIOS.url_backend;

  constructor(
    private _authService: AuthService,
    private router: Router,
    private menu: MenuController,
    private homenaje: HomenajesService,
    private auth: AuthService,
    private storage: Storage,
  ) { }

  ngOnInit() {
    this.auth.authenticationState.subscribe(
      state => {
        if(state){
          this.cargarInfoUser();
          this.ocultar = true;
        }
        else{
          this.first_name = "";
          this.last_name = "";
          this.imageProfile = this.defaultImage;
          this.ocultar = false;
        }
      }
    )
    this.auth.updateInfo$.subscribe(
      (message) => {
         if(message == "recargar"){
          this.cargarInfoUser();
          this.auth.recarga_Info('null');
         }
       }
     )
  }

  goPerfil(){
    this.menu.close();
    this.router.navigate(['/perfil']);
  }
  cargarInfoUser(){
    this.storage.get(IMAGE_USER).then(
      imagen => {
        console.log(imagen)
        if(imagen){
          this.imageProfile = this.urlBackend+imagen;
        }
      }
    )
    this.storage.get(FIRST_NAME).then(
      fname => {
        console.log(fname)
        if(fname){
          this.first_name = fname;
        }
      }
    )
    this.storage.get(LAST_NAME).then(
      lname => {
        console.log(lname)
        if(lname){
          this.last_name = lname;
        }
      }
    )
  }

  login(){
    this.router.navigate(['/login'])
  }
  
  logoutSesion(){
    this._authService.logout().then(
      (resp) => { 
        this.menu.close();
        this.homenaje.sendMessage('null');
        // this.menu.enable(false);
        this.router.navigate(["/inicio"]);
      }
    );
  }
}
