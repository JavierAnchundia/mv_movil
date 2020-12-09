import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "../services/auth/auth.service";
import { AlertController } from "@ionic/angular";
import { Facebook, FacebookLoginResponse } from "@ionic-native/facebook/ngx";
import { LoadingController } from "@ionic/angular";
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage implements OnInit {
  showSpinner: Boolean = false;
  token: String;
  userID: String;
  credentialsForm: FormGroup;
  showPassword: boolean = false;
  passwordToggle: String = "eye";
  difunto: any = null;
  constructor(
    private formBuilder: FormBuilder,
    private _authService: AuthService,
    private alertController: AlertController,
    private facebook: Facebook,
    private loadingController: LoadingController,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.queryParams.subscribe((params) => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.difunto = this.router.getCurrentNavigation().extras.state.difunto;
      } else {
        this.difunto = null;
      }
    });
  }

  ngOnInit() {
    this.credentialsForm = this.formBuilder.group({
      username: ["", [Validators.required]],
      password: ["", [Validators.required]],
    });
  }
  /**
   * Permite cambiar el icono de mostrar u ocultar la contraseña
   */
  togglePassword(): void {
    this.showPassword = !this.showPassword;
    if (this.passwordToggle == "eye") {
      this.passwordToggle = "eye-off";
    } else {
      this.passwordToggle = "eye";
    }
  }

  /***
   * Encargada de encansuplar las credenciales del usaurio para llamar a la función del servicio
   * Auth para iniciar sesión
   */
  async onSubmit() {
    await this.showAuthLoading("idAuth");
    await this._authService.login(this.credentialsForm.value).subscribe(
      (resp) => {
        if (resp) {
          this.dismissAuthLoading("idAuth");
          if (this.difunto != null) {
            let navigationExtras: NavigationExtras = {
              state: { difunto: this.difunto },
            };
            this.router.navigate(["muro-difunto"], navigationExtras);
          } else {
            this.router.navigate(["/inicio"]);
          }
        }
      },
      (error) => {
        this.dismissAuthLoading("idAuth");
        this.loginAlert();
      }
    );
  }

  /**
   * Cambia a la ventana de registro
   */
  register() {
    if (this.difunto) {
      let navigationExtras: NavigationExtras = {
        state: { difunto: this.difunto },
      };
      this.router.navigate(["/register"], navigationExtras);
    } else {
      this.router.navigate(["/register"]);
    }
  }

  /**
   * Esta función permite llamar autenticarse con la API de FACEFOOK, obtiene el token id del usuario
   * access_token es enviado al backend para que internamente obtenga la informacion del usuario, lo
   * guarde en la Base de datos y retorne un token
   */
  async signIn(): Promise<void> {
    // this.showSpinner = true;
    await this.showAuthLoading("idAuth");
    await this.facebook
      .login(["email", "public_profile"])
      .then((response: FacebookLoginResponse) => {
        let access_token = {
          access_token: response.authResponse.accessToken,
        };
        this._authService.crearUsuarioFB(access_token).subscribe(
          (resp) => {
            if (resp) {
              this._authService.recarga_Info("recargar");
              this.dismissAuthLoading("idAuth");
              if (this.difunto != null) {
                let navigationExtras: NavigationExtras = {
                  state: { difunto: this.difunto },
                };
                this.router.navigate(["muro-difunto"], navigationExtras);
              } else {
                this.router.navigate(["/inicio"]);
              }
            }
          },
          (error) => {
            this.dismissAuthLoading("idAuth");
            this.facebbookAlert();
          }
        );
      });
    await this.facebook.logEvent(this.facebook.EVENTS.EVENT_NAME_ADDED_TO_CART);
  }

  /**
   * Permite cambiar a la ventana de recuperar contraseña
   */
  goRecuperarContrasena() {
    this.router.navigate(["/recuperar-contrasena"]);
  }

  /**
   * Muestra un Loadingcontroller de authenticando usuario
   * @param idLoading contiene el id del controlador que se ejecutar al momento de dar click en el boton login
   */
  async showAuthLoading(idLoading) {
    const loading = await this.loadingController.create({
      id: idLoading,
      cssClass: "colorloading",
      message: "Autenticando credenciales...",
    });
    return await loading.present();
  }

  /**
   * Oculta el Loading controller de autenticando usuario
   * @param idLoading contiene el id del controlador que se ejecutar al momento de dar click en el boton login
   */
  async dismissAuthLoading(idLoading) {
    return await this.loadingController.dismiss(null, null, idLoading);
  }

  /**
   * Abre un Mensaje de Alerta de que las crendenciales son incorrectas
   */
  async loginAlert() {
    const alert = await this.alertController.create({
      cssClass: "controlerAlert",
      header: "Alerta Login",
      message: "Credenciales Incorrectas.",
      buttons: [{ text: "OK", cssClass: "colorTextButton" }],
    });
    await alert.present();
  }

  /**
   * Abre un Mensaje de Alerta de que las crendenciales son incorrectas para la
   * autenticacion con FACEBOOK
   */
  async facebbookAlert() {
    const alert = await this.alertController.create({
      cssClass: "controlerAlert",
      header: "Alerta Facebook",
      message: "No es posible autenticarse con facebook",
      buttons: [{ text: "OK", cssClass: "colorTextButton" }],
    });
    await alert.present();
  }
}
