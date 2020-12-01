import { Component, OnInit } from "@angular/core";
import { NavigationExtras, Router } from "@angular/router";
import { AlertController, LoadingController } from "@ionic/angular";
import { environment } from "../../../environments/environment";
import { Storage } from "@ionic/storage";
import INFO_SESION from "src/app/config/infoSesion";
import { FavoritosService } from "src/app/services/favoritos/favoritos.service";

@Component({
  selector: "app-favoritos",
  templateUrl: "./favoritos.page.html",
  styleUrls: ["./favoritos.page.scss"],
})
export class FavoritosPage implements OnInit {
  idCamposanto: number;
  lista_resultados: any = [];
  idUser: any;
  token: any;

  constructor(
    private router: Router,
    private storage: Storage,
    private _favoritos: FavoritosService,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.idCamposanto = environment.camposanto.idCamposanto;
    this.cargarfavoritos();
    this._favoritos.updateInfoFav$.subscribe((info) => {
      if (info == "recargar") {
        this.cargarfavoritos();
        this._favoritos.recarga_Info_Fav("null");
      }
    });
  }

  /**
   * Se encarga de llamar a la funcion obtener favoritos del Servicio Favoritos,
   * permite cargar los favoritos de un usuario solo si este ha iniciado sesión
   */
  async cargarfavoritos() {
    this.showFavoritosLoading("id_favoritos");
    this.storage.get(INFO_SESION.IDUSER).then((id_user) => {
      if (id_user) {
        this.storage.get(INFO_SESION.TOKEN_KEY).then((token) => {
          if (token) {
            this._favoritos.obtenerFavoritos(id_user, token).subscribe(
              (data) => {
                this.dismissFavoritosLoading("id_favoritos");
                this.lista_resultados = data;
                this.lista_resultados.reverse();
              },
              (error) => {
                this.dismissFavoritosLoading("id_favoritos");
                this.alertErrorLoadFavorite();
              }
            );
          }
        });
      } else {
        this.dismissFavoritosLoading("id_favoritos");
      }
    });
  }

  /**
   * Permite cambiar a la ventana de muro del difunto
   * @param difunto es un objeto que contiene la informacion del difunto
   */
  cargar_muro(difunto) {
    let navigationExtras: NavigationExtras = { state: { difunto: difunto } };
    this.router.navigate(["muro-difunto"], navigationExtras);
  }

  /**
   * Abre un mensaje de alerta de que no se ha podido cargar los perfiles favoritos de
   * un usuario
   */
  async alertErrorLoadFavorite() {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      message: "No se ha podido cargar los difuntos",
      buttons: ["OK"],
    });
    await alert.present();
  }

  /**
   * Muestra un loading controller mientras se consulta el listado de favoritos al server
   * @param idLoading id del loading controller
   */
  async showFavoritosLoading(idLoading) {
    const loading = await this.loadingController.create({
      id: idLoading,
      cssClass: "colorloading",
      message: "Cargando favoritos...",
    });
    return await loading.present();
  }

  /**
   * Oculta el loading controller cuando ha retornado alguna informacion del backend
   * @param idLoading id del loading controller
   */
  async dismissFavoritosLoading(idLoading) {
    return await this.loadingController.dismiss(null, null, idLoading);
  }
}
