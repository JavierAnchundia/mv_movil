import { Component, OnInit, ViewChild } from "@angular/core";
import { ModalTextoComponent } from "./modal-texto/modal-texto.component";
import { ModalImagenComponent } from "./modal-imagen/modal-imagen.component";
import { AlertController, ModalController } from "@ionic/angular";
import { ModalVideoComponent } from "./modal-video/modal-video.component";
import { ModalAudioComponent } from "./modal-audio/modal-audio.component";
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";
import { HomenajesService } from "src/app/services/homenajes/homenajes.service";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { ToastController, LoadingController } from "@ionic/angular";
import { Platform } from "@ionic/angular";
import { GeolocalizacionService } from "src/app/services/geolocalizacion/geolocalizacion.service";
import { Storage } from "@ionic/storage";
import { DatePipe } from "@angular/common";
import { DifuntoService } from "src/app/services/difunto/difunto.service";
import { ModalRosaComponent } from "./modal-rosa/modal-rosa.component";
import { AuthService } from "src/app/services/auth/auth.service";
import INFO_SESION from "src/app/config/infoSesion";
import { FavoritosService } from "src/app/services/favoritos/favoritos.service";

@Component({
  selector: "app-muro-difunto",
  templateUrl: "./muro-difunto.page.html",
  styleUrls: ["./muro-difunto.page.scss"],
})
export class MuroDifuntoPage implements OnInit {
  @ViewChild("fab") fab;
  difunto: any = [];
  lat: number;
  lng: number;
  puntos_polygon: any = [];
  historial_rosas: any = [];
  is_save: boolean = false;
  assetGuardado: any = "assets/page-muro/GUARDAR.png";
  constructor(
    public modalController: ModalController,
    private route: ActivatedRoute,
    private router: Router,
    private homenaje: HomenajesService,
    private platform: Platform,
    private geolocation: Geolocation,
    private service_geo: GeolocalizacionService,
    private alertController: AlertController,
    private storage: Storage,
    private toastController: ToastController,
    private loadingController: LoadingController,
    public datepipe: DatePipe,
    private service_difunto: DifuntoService,
    private _serviceAuth: AuthService,
    private _favoritos: FavoritosService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.difunto = this.router.getCurrentNavigation().extras.state.difunto;
        this.obtenerDatosDifunto(this.difunto["id_difunto"]);
        this.checkUserLogin();
      }
    });
    this.setCurrentPosition();
    this.cargarPuntosPoligono();
    this.cargarHistorialRosas();
    this._serviceAuth.authenticationState.subscribe((state) => {
      if (state) {
        this.verificarStateSave();
      }
    });
    this.verificarStateSave();
  }

  /**
   * Permite obtener los datos del difunto
   * @param id del difunto
   */
  obtenerDatosDifunto(id) {
    this.service_difunto.getDifuntoByID(id).subscribe((data) => {
      this.difunto = data;
    });
  }
  /**
   * Verifica que si no existe sesión de usuario llama al método publicar Toast para mostrar mensaje
   */
  checkUserLogin() {
    this.storage.get(INFO_SESION.TOKEN_KEY).then((token) => {
      if (token) {
        this.homenaje.sendMessage("cargar");
      } else {
        this.publicarToast(
          "Para publicar contenido en el muro y dejar rosa es necesario que inicie sesión",
          2500,
          "top",
          "warning"
        );
      }
    });
  }

  /**
   * Permite validar que si no ha iniciado sesion se cierre el ion-fab
   */
  validateSesionMuro() {
    this.storage.get(INFO_SESION.TOKEN_KEY).then((token) => {
      if (!token) {
        this.fab.close();
        this.loginMessageAlertMuro(
          "Por favor inicie sesión o registrese para poder publicar"
        );
      }
    });
  }

  /**
   * Permite cargar los puntos del poligono que conforma el camposanto donde esta localizado
   * el difunto
   */
  async cargarPuntosPoligono() {
    await this.service_geo
      .getListGeolocalizacion(this.difunto.id_camposanto)
      .toPromise()
      .then((resp) => {
        for (let r in resp) {
          this.puntos_polygon.push([resp[r].latitud, resp[r].longitud]);
        }
      });
  }

  /**
   * Funcion permite validar si el usuario esta dentro o fuera del camposanto
   * @param lati valor de la latitud del usuario
   * @param lon valor de la longitud del usuario
   */
  async validarPoligono(lati, lon) {
    let x = lati,
      y = lon;
    let inside = false;
    for (
      let i = 0, j = this.puntos_polygon.length - 1;
      i < this.puntos_polygon.length;
      j = i++
    ) {
      let xi = this.puntos_polygon[i][0],
        yi = this.puntos_polygon[i][1];
      let xj = this.puntos_polygon[j][0],
        yj = this.puntos_polygon[j][1];

      let intersect =
        yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }
    return await inside;
  }

  /**
   * Permite obtener la posición actual a través de la geolocalziación del dispositivo
   */
  async setCurrentPosition() {
    await this.platform.ready().then(() => {
      this.geolocation
        .getCurrentPosition()
        .then((resp) => {
          this.lat = resp.coords.latitude;
          this.lng = resp.coords.longitude;
        })
        .catch((error) => {
          console.log(error);
        });
    });
  }
  /**
   * Pemite cambiar a la ventana del mapa para ubicar al fallecido
   */
  cargar_mapa() {
    let navigationExtras: NavigationExtras = {
      state: { difunto: this.difunto },
    };
    this.router.navigate(["ubicacion-fallecido"], navigationExtras);
  }

  /**
   * LLama a la funcion de agregar rosa
   */
  async addRose() {
    await this.postRegistroUserRose();
  }

  /**
   * Permite cargar el historial de rosas que han dejado otros usuarios
   */
  async cargarHistorialRosas() {
    await this.homenaje
      .getLogRosas(this.difunto.id_difunto)
      .subscribe((resp: any) => {
        this.historial_rosas = resp.reverse();
      });
  }

  /**
   * Se encarga de llamar a la función dejarRosa del servicio Homenaje
   */
  async postContRose() {
    await this.homenaje
      .dejarRosa(this.difunto.id_difunto)
      .toPromise()
      .then(async (resp) => {
        await this.presentToast(
          "Ha dejado una rosa al difunto",
          600,
          "middle",
          "success"
        );
        this.getDatosDifunto();
        this.cargarHistorialRosas();
      });
  }

  /**
   * Permite crear el registro en la base de datos del usaurio que dejo una rosa en el
   * perfil de un difunto
   * Llama a la funcion postRegistroRosa del Servicio homanejes
   */
  async postRegistroUserRose() {
    await this.storage.get(INFO_SESION.TOKEN_KEY).then((token) => {
      if (token) {
        this.presentToast("Dejando Rosa!!!", 500, "top", "secondary");
        this.storage.get(INFO_SESION.IDUSER).then((id) => {
          const log = new FormData();
          let fecha = this.getFechaPublicacion();
          let id_usuario = id;
          log.append("id_difunto", this.difunto.id_difunto);
          log.append("id_usuario", id_usuario);
          log.append("fecha_publicacion", fecha);
          this.homenaje
            .postRegistroRosa(log, token)
            .toPromise()
            .then(
              (resp) => {
                this.postContRose();
              },
              (error) => {
                this.presentToast(
                  "No se ha podido dejar la rosa...",
                  500,
                  "bottom",
                  "danger"
                );
              }
            );
        });
      } else {
        this.loginMessageAlertMuro(
          "Por favor inicie sesión o registrese para poder publicar"
        );
      }
    });
  }

  /**
   * Permite obtener la informacion del difunto
   */
  async getDatosDifunto() {
    await this.service_difunto
      .getDifuntoByID(this.difunto.id_difunto)
      .toPromise()
      .then((resp) => {
        this.difunto = resp;
      });
  }

  /**
   * Permite identificar si el usuario tiene guardado el perfil de difunto como favoritos
   * Permite actualizar el estado de guardado o no del perfil
   */
  verificarStateSave() {
    this.storage.get(INFO_SESION.IDUSER).then((id_user) => {
      if (id_user) {
        this.storage.get(INFO_SESION.TOKEN_KEY).then((token) => {
          if (token) {
            this._favoritos.loadFavoritos(id_user, token).subscribe(
              (listaFavoritos) => {
                for (let favorito in listaFavoritos) {
                  if (
                    listaFavoritos[favorito].id_difunto ==
                    this.difunto.id_difunto
                  ) {
                    this.is_save = true;
                    this.assetGuardado = "assets/page-muro/GUARDADO.png";
                  }
                }
              },
              (error) => {
                this.is_save = false;
                this.assetGuardado = "assets/page-muro/GUARDAR.png";
              }
            );
          }
        });
      }
    });
  }

  /**
   * Permite confirmar si desea continuar con la eliminacion o agregacion del perfil en favoritos
   */
  favoritoAction() {
    this.storage.get(INFO_SESION.IDUSER).then((id_user) => {
      if (id_user) {
        this.storage.get(INFO_SESION.TOKEN_KEY).then((token) => {
          if (token) {
            if (!this.is_save) {
              this.favoritoState(
                "Está seguro que desea continuar?",
                this.is_save
              );
            } else {
              this.favoritoState(
                "Está seguro que desea eliminar de sus favoritos?",
                this.is_save
              );
            }
          } else {
            this.loginMessageAlertMuro(
              "Por favor inicie sesión o registrese para poder guardar a favoritos"
            );
          }
        });
      } else {
        this.loginMessageAlertMuro(
          "Por favor inicie sesión o registrese para poder guardar a favoritos"
        );
      }
    });
  }

  /**
   * Abre un Alert Controller con el mensaje de confirmacion ya sea de eliminar o guardar el perfil
   * @param message Contiene informacion que se desea mostar
   * @param estado true para eliminar favorito y false para guardar
   */
  async favoritoState(message, estado) {
    const alert = await this.alertController.create({
      cssClass: "controlerAlert",
      message: message,
      buttons: [
        {
          text: "Sí",
          cssClass: "colorTextButton",
          handler: () => {
            if (estado) {
              this.deleteFavorito();
            } else {
              this.postFavorito();
            }
          },
        },
        {
          text: "No",
          role: "cancel",
          cssClass: "colorTextButton",
          handler: () => {},
        },
      ],
    });
    await alert.present();
  }

  /**
   * Se encarga de llamar la funcion agregar favorito del servicio agregarFavorito
   * Encapsula el id del usuario y difunto para gaurdar en la base de datos
   */
  postFavorito() {
    this.storage.get(INFO_SESION.IDUSER).then((id_user) => {
      if (id_user) {
        const favorito = new FormData();
        favorito.append("id_usuario", id_user as string);
        favorito.append("id_difunto", this.difunto.id_difunto as string);
        favorito.append("estado", "True");
        this.storage.get(INFO_SESION.TOKEN_KEY).then((token) => {
          if (token) {
            this._favoritos.agregarFavorito(favorito, token).subscribe(
              (data) => {
                this.is_save = true;
                this.assetGuardado = "assets/page-muro/GUARDADO.png";
                this.presentToast(
                  "Perfil se ha agregado a sus favoritos",
                  2000,
                  "middle",
                  "dark"
                );
                this._favoritos.recarga_Info_Fav("recargar");
                this.service_difunto.recarga_Lista_Difunto("recargar");
              },
              (error) => {
                this.presentToast(
                  "Error al agregar el perfil a favoritos",
                  2000,
                  "bottom",
                  "danger"
                );
              }
            );
          }
        });
      }
    });
  }

  /**
   * Se encarga de llamar la funcion eliminar favorito del servicio agregarFavorito
   * Encapsula el id del usuario y difunto para gaurdar en la base de datos
   */
  deleteFavorito() {
    this.storage.get(INFO_SESION.TOKEN_KEY).then((token) => {
      if (token) {
        this.storage.get(INFO_SESION.IDUSER).then((id_user) => {
          if (id_user) {
            this._favoritos
              .removeFavorito(id_user, this.difunto.id_difunto, token)
              .subscribe(
                (data) => {
                  this.is_save = false;
                  this.assetGuardado = "assets/page-muro/GUARDAR.png";
                  this.presentToast(
                    "Se ha eliminado el perfil de sus favoritos",
                    2000,
                    "middle",
                    "dark"
                  );
                  this._favoritos.recarga_Info_Fav("recargar");
                  this.service_difunto.recarga_Lista_Difunto("recargar");
                },
                (error) => {
                  this.presentToast(
                    "Error al eliminar el perfil de favoritos",
                    2000,
                    "bottom",
                    "danger"
                  );
                }
              );
          }
        });
      }
    });
  }

  /**
   * Permite cambiar a la pantalla de inicio
   */
  cambiarPageInicio() {
    this.router.navigate(["/inicio"]);
  }

  /**
   * Abre el modal para publicar Texto en el perfil
   */
  async modalTexto() {
    let validacion = await this.validarPoligono(this.lat, this.lng);
    // if(validacion == false){
    //   await this.ubicacionAlert();
    // }
    // else{
    const modal = await this.modalController.create({
      component: ModalTextoComponent,
      cssClass: "my-custom-class",
      componentProps: {
        difunto: this.difunto,
      },
    });
    return await modal.present();
    // }
  }

  /**
   * Abre el modal para publicar una imagen en el perfil
   */
  async modalImagen() {
    let validacion = await this.validarPoligono(this.lat, this.lng);
    // if(validacion == false){
    //   await this.ubicacionAlert();
    // }
    // else{
    const modal = await this.modalController.create({
      component: ModalImagenComponent,
      cssClass: "my-custom-class",
      componentProps: {
        difunto: this.difunto,
      },
    });
    return await modal.present();
    // }
  }

  /**
   * Abre el modal para publicar un video en el perfil
   */
  async modalVideo() {
    let validacion = await this.validarPoligono(this.lat, this.lng);
    // if(validacion == false){
    //   await this.ubicacionAlert();
    // }
    // else{
    const modal = await this.modalController.create({
      component: ModalVideoComponent,
      cssClass: "my-custom-class",
      componentProps: {
        difunto: this.difunto,
      },
    });
    return await modal.present();
    // }
  }

  /**
   * Abre el modal para publicar un audio en el perfil
   */
  async modalAudio() {
    let validacion = await this.validarPoligono(this.lat, this.lng);
    // if(validacion == false){
    //   await this.ubicacionAlert();
    // }
    // else{
    const modal = await this.modalController.create({
      component: ModalAudioComponent,
      cssClass: "my-custom-class",
      componentProps: {
        difunto: this.difunto,
      },
    });
    return await modal.present();
    // }
  }

  /**
   * Abre el modal paraver quienes han dejado rosas en el perfil
   */
  async modalHistorialRosas() {
    const modal = await this.modalController.create({
      component: ModalRosaComponent,
      cssClass: "modalRosas",
      componentProps: {
        historial: this.historial_rosas,
        numRose: this.difunto.num_rosas,
      },
    });
    return await modal.present();
  }

  /**
   * Permite abrir un Alert controller para mostar en caso de que no haya iniciado sesion
   * @param message contiene informacion que se quiere mostrar
   */
  async loginMessageAlertMuro(message) {
    const alert = await this.alertController.create({
      cssClass: "controlerAlert",
      // header: 'Confirm!',
      message: "<strong>" + message + "</strong>",
      buttons: [
        {
          text: "Login",
          cssClass: "colorTextButton",
          handler: () => {
            let navigationExtras: NavigationExtras = {
              state: { difunto: this.difunto },
            };
            this.router.navigate(["login"], navigationExtras);
          },
        },
        {
          text: "Cancelar",
          role: "cancel",
          cssClass: "colorTextButton",
          handler: () => {},
        },
      ],
    });
    await alert.present();
  }

  /**
   * Permite abrir un alert controller de que si no esta dentro del camposanto no puede publicar en el muro
   */
  async ubicacionAlert() {
    const alert = await this.alertController.create({
      cssClass: "controlerAlert",
      header: "Alerta Ubicación",
      message:
        "Usted no se encuentra dentro del área del camposanto para publicar!!",
      buttons: [{ text: "OK", cssClass: "colorTextButton" }],
    });
    await alert.present();
  }

  /**
   * Permite obtener la fecha en un formato en especifico
   */
  getFechaPublicacion() {
    let date = new Date();
    let latest_date = this.datepipe.transform(date, "yyyy-MM-dd HH:mm");
    return latest_date;
  }

  /**
   * Permite mostar un Toast Controller con informacion
   * @param text mensaje a mostrar
   * @param tiempo en ms que durara el mensaje en pantalla
   * @param position indica posicion de donde se mostara el mensaje
   * @param color color de fondo del toast
   */
  async presentToast(text, tiempo, position, color) {
    const toast = await this.toastController.create({
      message: text,
      position: position,
      duration: tiempo,
      color: color,
    });
    await toast.present();
  }

  /**
   * Permite mostar un Toast Controller con informacion con un boton para cerrar el toast
   * @param text mensaje a mostrar
   * @param tiempo en ms que durara el mensaje en pantalla
   * @param position indica posicion de donde se mostara el mensaje
   * @param color color de fondo del toast
   */
  async publicarToast(text, tiempo, position, color) {
    const toast = await this.toastController.create({
      message: text,
      position: position,
      duration: tiempo,
      color: color,
      buttons: [
        {
          text: "ok",
          role: "cancel",
          handler: () => {},
        },
      ],
    });
    await toast.present();
  }
}
