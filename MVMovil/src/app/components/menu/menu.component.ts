import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AlertController, MenuController } from "@ionic/angular";
import { AuthService } from "src/app/services/auth/auth.service";
import { HomenajesService } from "src/app/services/homenajes/homenajes.service";
import { Storage } from "@ionic/storage";
import URL_SERVICIOS from "src/app/config/config";
import INFO_SESION from "src/app/config/infoSesion";

@Component({
  selector: "app-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.scss"],
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
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.auth.authenticationState.subscribe((state) => {
      if (state) {
        this.cargarInfoUser();
        this.ocultar = true;
      } else {
        this.first_name = "";
        this.last_name = "";
        this.imageProfile = this.defaultImage;
        this.ocultar = false;
      }
    });
    this.auth.updateInfo$.subscribe((message) => {
      if (message == "recargar") {
        this.cargarInfoUser();
        this.auth.recarga_Info("null");
      }
    });
  }

  /**
   * Permite cambiar a la pantalla de inicio
   */
  goInicio() {
    this.menu.close();
    this.router.navigate(["/inicio"]);
  }

  /**
   * Permite cambiar a la pestaña de sugerencias, "Se debe validar que este con login"
   */
  async goSugerencias() {
    this.menu.close();
    let estado;
    await this.auth.authenticationState.subscribe((state) => {
      estado = state;
    });
    if (estado) {
      this.router.navigate(["/sugerencias"]);
    } else {
      this.loginMessageAlertMuro(
        "Por favor inicie sesión para enviar una sugerencia"
      );
    }
  }
  /**
   * Permite cambiar a la pantalla de perfil
   */
  goPerfil() {
    this.menu.close();
    this.router.navigate(["/perfil"]);
  }

  /**
   * Permite cambair a la pestaña de sobre nosotros
   */
  goNosotros() {
    this.menu.close();
    this.router.navigate(["/sobre-nosotros"]);
  }
  /**
   * Permite cargar la información del usuario en el menú lateral solo si el usuario
   * ha iniciado sesión
   */
  cargarInfoUser() {
    this.storage.get(INFO_SESION.IMAGE_USER).then((imagen) => {
      if (imagen) {
        this.imageProfile = this.urlBackend + imagen;
      }
    });
    this.storage.get(INFO_SESION.FIRST_NAME).then((fname) => {
      if (fname) {
        this.first_name = fname;
      }
    });
    this.storage.get(INFO_SESION.LAST_NAME).then((lname) => {
      if (lname) {
        this.last_name = lname;
      }
    });
  }

  /**
   * Permite cambiar a la pantalla de login
   */
  login() {
    this.menu.close();
    this.router.navigate(["/login"]);
  }

  /**
   * Permite llamar al servicio auth.ts el cual permite cerrar sesión
   * Al cerrar la sesión se cambia a la pantalla de inicio
   */
  logoutSesion() {
    this._authService.logout().then((resp) => {
      this.menu.close();
      this.homenaje.sendMessage("null");
      this.router.navigate(["/inicio"]);
    });
  }

  /**
   * Permite abrir un Alert controller para mostar en caso de que no haya iniciado sesion
   * @param message contiene informacion que se quiere mostrar
   */
  async loginMessageAlertMuro(message) {
    const alert = await this.alertController.create({
      cssClass: "controlerAlert",
      message: "<strong>" + message + "</strong>",
      buttons: [
        {
          text: "Login",
          cssClass: "colorTextButton",
          handler: () => {
            this.router.navigate(["login"]);
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
}
