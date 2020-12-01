import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";
import {
  Validators,
  FormBuilder,
  FormGroup,
  FormControl,
} from "@angular/forms";
import { RegistrationValidator } from "./registration_validator";
import { Usuario } from "src/app/models/usuario.model";
import { environment } from "src/environments/environment";
import { AuthService } from "src/app/services/auth/auth.service";
import { AlertController } from "@ionic/angular";
import { Platform } from "@ionic/angular";
import { LoadingController } from "@ionic/angular";
import { Plugins, CameraResultType, CameraSource } from "@capacitor/core";

const { Camera } = Plugins;

@Component({
  selector: "app-register",
  templateUrl: "./register.page.html",
  styleUrls: ["./register.page.scss"],
})
export class RegisterPage implements OnInit {
  usuarioRegistro: any;
  registrationFormGroup: FormGroup;
  passwordFormGroup: FormGroup;
  idCamposanto: number;
  showSpinner: Boolean = false;
  showPassword: boolean = false;
  passwordToggle: String = "eye";
  showConfiPassword: boolean = false;
  passwordConfiToggle: String = "eye";
  submitted = false;
  usernameLista: any = [];
  emailLista: any = [];
  lista_usuarios: any = [];
  id: any;
  difunto: any = null;
  defaultImage: boolean = true;
  imagePerfil: String = "assets/AGREGAR_FOTO_PERFIL.png";
  imageUpload: String = "";
  nameFile: String = "";

  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    private _authService: AuthService,
    private alertController: AlertController,
    private platform: Platform,
    private loadingController: LoadingController,
    private route: ActivatedRoute
  ) {
    // this.menu.enable(false);
    //   this.platform.backButton.subscribeWithPriority(0, () => {
    //   this.router.navigate(['login']);
    // });
    this.idCamposanto = environment.camposanto.idCamposanto;
    this.formValidator();
  }

  ngOnInit() {
    this.id = environment.camposanto.idCamposanto;
    this.obtenerUsuarios();
    this.route.queryParams.subscribe((params) => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.difunto = this.router.getCurrentNavigation().extras.state.difunto;
      } else {
        this.difunto = null;
      }
    });
  }

  /**
   * Construye las validaciones dadas en el formulario para actualizar perfil del suaurio
   */
  formValidator() {
    this.passwordFormGroup = this.formBuilder.group(
      {
        password: [
          "",
          Validators.compose([
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(20),
          ]),
        ],
        repeatPassword: [
          "",
          Validators.compose([
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(20),
          ]),
        ],
      },
      { validator: RegistrationValidator.validate.bind(this) }
    );

    this.registrationFormGroup = this.formBuilder.group(
      {
        nombres: new FormControl(
          "",
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(30),
          ])
        ),
        apellidos: new FormControl(
          "",
          Validators.compose([Validators.required, Validators.minLength(2)])
        ),
        username: new FormControl(
          "",
          Validators.compose([Validators.required, Validators.minLength(2)])
        ),
        email: new FormControl(
          "",
          Validators.compose([
            Validators.required,
            Validators.pattern(
              "^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"
            ),
          ])
        ),
        passwordFormGroup: this.passwordFormGroup,
      },
      {
        validator: [this.match_username(), this.match_email()],
      }
    );
  }

  /**
   * Permite escoger una foto del dispositivo para carmbiar el la informacion del perfil del usuario
   */
  async capturarFoto() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      saveToGallery: true,
      source: CameraSource.Photos,
    }).then(async (resp) => {
      this.imagePerfil = (await "data:image/png;base64,") + resp.base64String;
      this.imageUpload = this.imagePerfil;
      this.defaultImage = false;
      this.nameFile = this.crearNombreArchivo();
    });
  }

  /**
   * Crea el nombre del archivo de la imagen
   */
  crearNombreArchivo() {
    let d = new Date(),
      n = d.getTime(),
      newFileName = n + ".png";
    return newFileName;
  }

  /**
   * Permite obtener la informacion  del formulario para encapsularla
   */
  async onSubmitRegisterDetails() {
    this.submitted = true;
    let datosForm = this.registrationFormGroup.value;
    this.usuarioRegistro = {
      first_name: datosForm["nombres"],
      last_name: datosForm["apellidos"],
      email: datosForm["email"],
      username: datosForm["username"],
      password: datosForm["passwordFormGroup"].password,
      telefono: "",
      direccion: "",
      genero: "",
      tipo_usuario: "uf",
      is_active: "true",
      id_camposanto: this.idCamposanto,
    };
    await this.confirmarRegistroAlert(this.usuarioRegistro);
  }

  /**
   * Muestra un loading controller mientras se actualizan los datos
   * @param idLoading es el codigo del loading controller
   */
  async showRegisterLoading(idLoading) {
    const loading = await this.loadingController.create({
      id: idLoading,
      cssClass: "colorloading",
      message: "Registrando datos...",
    });
    return await loading.present();
  }

  /**
   * Oculta loading controller cuando ya se han actualizado los datos
   * @param idLoading es el codigo del loading controller
   */
  async dismissRegisterLoading(idLoading) {
    return await this.loadingController.dismiss(null, null, idLoading);
  }

  /**
   * Muestra Alert controller con mensaje de que ya se ha registrado con exito los datos
   */
  async registerAlert() {
    const alert = await this.alertController.create({
      cssClass: "controlerAlert",
      header: "Alerta Registro",
      message: "Ya existe un usuario con la misma credencial.",
      buttons: [{ text: "OK", cssClass: "colorTextButton" }],
    });
    await alert.present();
  }

  /**
   * Permite pedir la confirmacion de si desea continuar con registro del usuario
   * @param usuario objecto con datos del usaurio
   */
  async confirmarRegistroAlert(usuario) {
    const alert = await this.alertController.create({
      cssClass: "controlerAlert",
      header: "Confirmar!",
      message: "Desea continuar con el registro?",
      buttons: [
        {
          text: "Cancelar",
          role: "cancel",
          cssClass: "colorTextButton",
          handler: (blah) => {
            this.showSpinner = false;
          },
        },
        {
          text: "Aceptar",
          cssClass: "colorTextButton",
          handler: () => {
            this.showRegisterLoading("register_load");
            this._authService.register(usuario).subscribe(
              async (resp) => {
                if (resp.status == 201) {
                  if (!this.defaultImage) {
                    await this.uploadImage(resp.body["id"]);
                  }
                  let userLogin = {
                    username: usuario["username"],
                    password: usuario["password"],
                  };
                  this._authService.login(userLogin).subscribe(() => {
                    this.dismissRegisterLoading("register_load");
                    if (this.difunto != null) {
                      let navigationExtras: NavigationExtras = {
                        state: { difunto: this.difunto },
                      };
                      this.router.navigate(["muro-difunto"], navigationExtras);
                    } else {
                      this.router.navigate(["/inicio"]);
                    }
                  });
                }
              },
              (error) => {
                console.log(error.status);
                this.dismissRegisterLoading("register_load");
                this.registerAlert();
                // this.showSpinner = false;
              }
            );
          },
        },
      ],
    });
    await alert.present();
  }

  /**
   * Permite guardar la imagen en el servidor contactando con la funcion de uploadImageProfile del servicio
   * AuthService.ts
   * @param id del usuario que va a agregar foto de perfil
   */
  uploadImage(id) {
    let data = new FormData();
    data.append("img_base64", this.imageUpload as string);
    data.append("nombre_file", this.nameFile as string);
    this._authService.uploadImageProfile(id, data).toPromise().then();
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

  /**
   * Permite cambiar el icono de mostrar u ocultar repetir la contraseña
   */
  toggleConfiPassword(): void {
    this.showConfiPassword = !this.showConfiPassword;
    if (this.passwordConfiToggle == "eye") {
      this.passwordConfiToggle = "eye-off";
    } else {
      this.passwordConfiToggle = "eye";
    }
  }

  /**
   * Permite obtener todos lo suaurios con su username e email, de esta manera se valida que
   * al escribir un nombre de usaurio o correo este ya no sea utilizado
   */
  async obtenerUsuarios() {
    await this._authService
      .getUsersAll()
      .toPromise()
      .then((data: any[]) => {
        this.lista_usuarios = data;
      });
    for (let i = 0; i < this.lista_usuarios.length; i++) {
      this.usernameLista.push(this.lista_usuarios[i]["username"]);
      if (this.lista_usuarios[i]["id_camposanto"] == this.id) {
        this.emailLista.push(this.lista_usuarios[i]["email"]);
      }
    }
  }

  /**
   * Permite validad que el username ingresado no este ya gaurdado en la base de datos
   */
  match_username() {
    return (formGroup: FormGroup) => {
      let list_username = this.usernameLista;
      const usernameControl = formGroup.controls["username"];
      if (usernameControl.errors && !usernameControl.errors.match_username) {
        return;
      }
      if (list_username.includes(usernameControl.value)) {
        usernameControl.setErrors({ usernameMatch: true });
      } else {
        usernameControl.setErrors(null);
      }
    };
  }

  /**
   * Permite validad que el email ingresado no este ya gaurdado en la base de datos
   */
  match_email() {
    return (formGroup: FormGroup) => {
      let list_correo = this.emailLista;
      const correoControl = formGroup.controls["email"];
      if (correoControl.errors && !correoControl.errors.match_email) {
        return;
      }
      if (list_correo.includes(correoControl.value)) {
        correoControl.setErrors({ correoMatch: true });
      } else {
        correoControl.setErrors(null);
      }
    };
  }
}
