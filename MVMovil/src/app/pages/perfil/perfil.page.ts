import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
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
import { LoadingController } from "@ionic/angular";
import { Plugins, CameraResultType, CameraSource } from "@capacitor/core";
import { Storage } from "@ionic/storage";
import URL_SERVICIOS from "src/app/config/config";
import INFO_SESION from "src/app/config/infoSesion";

const { Camera } = Plugins;

@Component({
  selector: "app-perfil",
  templateUrl: "./perfil.page.html",
  styleUrls: ["./perfil.page.scss"],
})
export class PerfilPage implements OnInit {
  urlBackend: String = URL_SERVICIOS.url_backend;

  usuarioRegistro: Usuario;
  registrationFormGroup: FormGroup;
  passwordFormGroup: FormGroup;
  idCamposanto: number;
  showSpinner: Boolean = false;
  isFacebook: boolean = false;
  showPassword: boolean = false;
  passwordToggle: String = "eye";
  showConfiPassword: boolean = false;
  passwordConfiToggle: String = "eye";
  userDetalle: any = [];
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
  numericNumberReg = "[0-9]*";

  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    private _authService: AuthService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private route: ActivatedRoute,
    private storage: Storage
  ) {
    this.idCamposanto = environment.camposanto.idCamposanto;
    this.formValidator();
  }

  ngOnInit() {
    this.recargarPerfil();
    this.id = environment.camposanto.idCamposanto;
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
            Validators.minLength(6),
            Validators.maxLength(20),
          ]),
        ],
        repeatPassword: [
          "",
          Validators.compose([
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
        genero: new FormControl(""),
        direccion: new FormControl(
          "",
          Validators.compose([Validators.minLength(5)])
        ),
        telefono: new FormControl(
          "",
          Validators.compose([
            Validators.maxLength(10),
            Validators.minLength(9),
            Validators.pattern(this.numericNumberReg),
          ])
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
   * Se encarga de llenar los campos del formulario con los datos del perfil
   */
  recargarPerfil() {
    this.storage.get(INFO_SESION.IMAGE_USER).then((imagen) => {
      if (imagen) {
        this.imagePerfil = this.urlBackend + imagen;
      }
    });
    this.storage.get(INFO_SESION.TOKEN_KEY).then((token) => {
      if (token) {
        this.storage.get(INFO_SESION.IDUSER).then((id) => {
          if (id) {
            this._authService
              .getInfoUser(id, token)
              .toPromise()
              .then((resp) => {
                this.userDetalle = resp;
                this.registrationFormGroup.controls["nombres"].setValue(
                  resp["first_name"]
                );
                this.registrationFormGroup.controls["apellidos"].setValue(
                  resp["last_name"]
                );
                this.registrationFormGroup.controls["username"].setValue(
                  resp["username"]
                );
                this.registrationFormGroup.controls["email"].setValue(
                  resp["email"]
                );
                if (resp["direccion"] != null) {
                  this.registrationFormGroup.controls["direccion"].setValue(
                    resp["direccion"]
                  );
                }
                if (resp["genero"] != null) {
                  this.registrationFormGroup.controls["genero"].setValue(
                    resp["genero"]
                  );
                }
                if (resp["telefono"] != null) {
                  this.registrationFormGroup.controls["telefono"].setValue(
                    resp["telefono"]
                  );
                }
                if (resp["is_facebook"]) {
                  this.isFacebook = true;
                }
                this.obtenerUsuarios();
              });
          }
        });
      }
    });
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
      telefono: datosForm["telefono"],
      direccion: datosForm["direccion"],
      genero: datosForm["genero"],
      tipo_usuario: "uf",
      idcamposanto: this.idCamposanto,
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
      message: "Actualizando datos...",
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
   * Muestra Alert controller con mensaje de que ya se ha guardado con exito los datos
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
   * Permite pedir la confirmacion de si desea continuar con la actualizacion del perfil
   * @param usuario objecto con datos del usaurio
   */
  async confirmarRegistroAlert(usuario) {
    const alert = await this.alertController.create({
      cssClass: "controlerAlert",
      message: "Desea continuar con la actualización de los datos?",
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
            delete this.userDetalle["image_perfil"];
            if (usuario["genero"] == "") {
              delete this.userDetalle["genero"];
            } else {
              this.userDetalle["genero"] = usuario["genero"];
            }
            if (usuario["direccion"] == "") {
              delete this.userDetalle["direccion"];
            } else {
              this.userDetalle["direccion"] = usuario["direccion"];
            }
            if (usuario["telefono"] == "") {
              delete this.userDetalle["telefono"];
            } else {
              this.userDetalle["telefono"] = usuario["telefono"];
            }
            if (usuario["password"] == "") {
              delete this.userDetalle["password"];
            } else {
              this.userDetalle["password"] = usuario["password"];
            }
            this.userDetalle["is_facebook"] = this.userDetalle["is_facebook"];
            this.userDetalle["is_active"] = true;
            this.userDetalle["first_name"] = usuario["first_name"];
            this.userDetalle["last_name"] = usuario["last_name"];
            this.userDetalle["username"] = usuario["username"];
            this.userDetalle["email"] = usuario["email"];
            this.storage.get(INFO_SESION.TOKEN_KEY).then((token) => {
              if (token) {
                this.storage.get(INFO_SESION.USERNAME).then((username) => {
                  if (username) {
                    this._authService
                      .putInfoUser(token, username, this.userDetalle)
                      .subscribe(
                        async (resp) => {
                          this.dismissRegisterLoading("register_load");

                          this.storage
                            .set(INFO_SESION.FIRST_NAME, resp["first_name"])
                            .then((fname) => {
                              this.storage
                                .set(INFO_SESION.LAST_NAME, resp["last_name"])
                                .then((lname) => {
                                  this._authService.recarga_Info("recargar");
                                });
                            });
                          if (!this.defaultImage) {
                            await this.uploadImage(
                              resp["id"],
                              resp["image_perfil"]
                            );
                          }
                          if (!resp["is_facebook"]) {
                            this.storage
                              .get(INFO_SESION.PASSWORD)
                              .then((password) => {
                                if (password) {
                                  if (
                                    resp["username"] !== username ||
                                    resp["password"] !== password
                                  ) {
                                    this.storage.set(
                                      INFO_SESION.USERNAME,
                                      resp["username"]
                                    );
                                    this.storage.set(
                                      INFO_SESION.PASSWORD,
                                      resp["password"]
                                    );
                                  }
                                }
                              });
                          } else {
                            this.storage.set(
                              INFO_SESION.USERNAME,
                              resp["username"]
                            );
                          }
                          this.successSaveProfile();
                        },
                        (error) => {
                          this.dismissRegisterLoading("register_load");
                          this.registerAlert();
                        }
                      );
                  }
                });
              }
            });
          },
        },
      ],
    });
    await alert.present();
  }

  async successSaveProfile() {
    const alert = await this.alertController.create({
      cssClass: "controlerAlert",
      message: "Se ha actualizado con éxito sus datos",
      buttons: [
        {
          text: "Ok",
          cssClass: "colorTextButton",
          handler: () => {
            this.router.navigate(["/inicio"]);
          },
        },
      ],
    });

    await alert.present();
  }

  /**
   * Permite actualizar la imagen de perfil
   * @param id del usuario que desea cambiar la imagen de perfil
   * @param imgDelete es el objeto imagen a actualizar
   */
  uploadImage(id, imgDelete) {
    let data = new FormData();
    data.append("img_base64", this.imageUpload as string);
    data.append("nombre_file", this.nameFile as string);
    data.append("is_active", "true");
    if (imgDelete !== null) {
      data.append("delete_img", imgDelete);
    }
    this._authService
      .uploadImageProfile(id, data)
      .toPromise()
      .then((resp) => {
        this.storage
          .set(INFO_SESION.IMAGE_USER, resp["image_perfil"])
          .then((imag) => {
            this._authService.recarga_Info("recargar");
          });
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
      if (this.lista_usuarios[i]["username"] != this.userDetalle["username"]) {
        this.usernameLista.push(this.lista_usuarios[i]["username"]);
      }
      if (
        this.lista_usuarios[i]["id_camposanto"] == this.id &&
        this.lista_usuarios[i]["email"] != this.userDetalle["email"]
      ) {
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
