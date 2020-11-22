import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AlertController, MenuController, Platform } from '@ionic/angular';
import { environment } from '../../../environments/environment'
import { Storage } from '@ionic/storage';
import INFO_SESION from 'src/app/config/infoSesion';
import { FavoritosService } from 'src/app/services/favoritos/favoritos.service';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.page.html',
  styleUrls: ['./favoritos.page.scss'],
})
export class FavoritosPage implements OnInit {

  idCamposanto: number;
  lista_resultados: any = [];
  idUser: any;
  token: any;

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private storage: Storage,
    private _favoritos: FavoritosService,
    private alertController: AlertController,
    private _auth: AuthService,
  ) { }

  ngOnInit() {
    this.idCamposanto = environment.camposanto.idCamposanto;
    this.cargarfavoritos();
    this._favoritos.updateInfoFav$.subscribe(
      (info)=>{
        if(info == "recargar"){
          this.cargarfavoritos();
          this._favoritos.recarga_Info_Fav("null");
        }
      }
    )
  }

  async cargarfavoritos(){
    this.storage.get(INFO_SESION.IDUSER).then(
      (id_user)=>{
        if(id_user){
          this.storage.get(INFO_SESION.TOKEN_KEY).then(
            (token) => {
              if(token){
                this._favoritos.obtenerFavoritos(id_user, token).subscribe(
                  (data)=>{
                    this.lista_resultados = data;
                  },
                  (error)=>{
                    this.alertErrorLoadFavorite();
                  }
                );
              }
            }
          )
        }
      }
    );
  }

  cargar_muro(difunto){
    let navigationExtras: NavigationExtras = { state: { difunto: difunto} };
    this.router.navigate(['muro-difunto'], navigationExtras);
  }

  async alertErrorLoadFavorite() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      message: 'No se ha podido cargar los difuntos',
      buttons: ['OK']
    });
    await alert.present();
  }
}
