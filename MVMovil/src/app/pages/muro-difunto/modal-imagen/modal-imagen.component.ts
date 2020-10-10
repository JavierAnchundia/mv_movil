import { Component, Input, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastController, Platform, LoadingController, AlertController } from "@ionic/angular";
import { Plugins, CameraResultType } from '@capacitor/core';
import { HomenajeImagenService } from 'src/app/services/homenaje_imagen/homenaje-imagen.service';
import { FilesystemDirectory, FilesystemEncoding } from '@capacitor/core';
import { Storage } from '@ionic/storage';
import { DatePipe } from '@angular/common'
import { HomenajesService } from 'src/app/services/homenajes/homenajes.service'
const { Filesystem } = Plugins;
const { Camera } = Plugins;
const IDUSER = 'id_usuario';
const TOKEN_KEY = 'access_token';

@Component({
  selector: "app-modal-imagen",
  templateUrl: "./modal-imagen.component.html",
  styleUrls: ["./modal-imagen.component.scss"],
})
export class ModalImagenComponent implements OnInit {
  @Input() difunto: any;

  imagen: any = [];
  mensajeImagenForm: FormGroup;

  constructor(
    private alertController: AlertController,
    private formBuilder: FormBuilder,
    public modalController: ModalController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private plt: Platform,
    private service_homenaje: HomenajeImagenService,
    private storage: Storage,
    public datepipe: DatePipe,
    private homenaje: HomenajesService
  ) {}

  ngOnInit() {
    this.mensajeImagenForm = this.formBuilder.group({
      mensaje: ['', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(200)])]
    });
  }

  async submit(){
    if(this.imagen.length === 0){
      this.faltaImagenAlert('Por favor escoja una imagen...', 'Alerta Imagen');
    }
    else{
      await this.showMensajeLoading('idMensaje');
      this.postImagen();
    }
  }

  
  crearNombreArchivo() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".png";
    return newFileName;
  }

  async seleccionarImagen() {
    await this.capturarFoto();
  }

  async capturarFoto() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      saveToGallery: true
    }).then(async (resp) => {
      let imageUrl = await 'data:image/png;base64,'+ resp.base64String;
      // this.img_path = imageUrl;
      this.imagen = [{
        path: imageUrl,
        nombre: this.crearNombreArchivo()
      }]
      this.presentToast("Se ha cargado la imagen...")
    });
    
  }

  eliminarImagen(){
    this.imagen = [];
    this.presentToast("Se ha eliminado la imagen...")
  }

  async postImagen(){
    let nombre = await this.imagen[0].nombre;
    let img_base64 = await this.imagen[0].path 
    let imagenData = await new FormData();
    imagenData.append('nombre_file', nombre);
    imagenData.append('mensaje', this.mensajeImagenForm.value.mensaje)
    imagenData.append("img_base64", img_base64);

    this.storage.get(TOKEN_KEY).then(
      (token)=>{
        this.service_homenaje.postImagen(imagenData, token).toPromise().then(
          (resp) => {
            this.storage.get(IDUSER).then(
              (id) => { 
                console.log(id)
                let fecha = this.getFechaPublicacion();
                let id_imagen = resp['id_imagen']
                const homenajePost = new FormData();
                homenajePost.append('id_usuario', id);
                homenajePost.append('id_difunto', this.difunto.id_difunto);
                homenajePost.append('fecha_publicacion', fecha as string);
                homenajePost.append('estado', 'True');
                homenajePost.append('likes', '0');
                homenajePost.append('id_imagecontent', id_imagen);
                this.homenaje.postHomenajeGeneral(homenajePost, token).subscribe(
                  async (resp: any) => {
                    await this.dismissMensajeLoading('idMensaje');
                    await this.dismiss()
                    await this.faltaImagenAlert('Se ha subido con éxito', 'Publicación');
                  },
                  async (error)=>{
                    await this.dismiss()
                    await this.faltaImagenAlert('Error al subir la publicación, intente otra vez...', 'Publicación');
                  }
                )
              }
            ) 
          },
          async (error)=>{
            await this.dismiss()
            await this.faltaImagenAlert('Error al subir la publicación, intente otra vez...', 'Publicación');
          }
        )
      }
    )
    
  }
  
  getFechaPublicacion() {
    let date = new Date();
    let latest_date = this.datepipe.transform(date, 'yyyy-MM-dd');
    return latest_date;
  }
  async faltaImagenAlert(mensaje, titulo) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: titulo,
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }

  async presentToast(text) {
    const toast = await this.toastController.create({
      message: text,
      position: "bottom",
      duration: 500,
    });
    toast.present();
  }

  // mostrar subir imagen controller
  async showMensajeLoading(idLoading) {
    const loading = await this.loadingController.create({
      id: idLoading,
      cssClass: 'my-custom-class',
      message: 'Publicando mensaje...'
    });
    
    return await loading.present();
  }

  // ocultar loading controller
  async dismissMensajeLoading(idLoading){
    return await this.loadingController.dismiss(null, null, idLoading);
  }

  async dismiss() {
    await this.modalController.dismiss({
      dismissed: true,
    });
  }
}
