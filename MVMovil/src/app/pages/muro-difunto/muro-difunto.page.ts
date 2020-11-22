import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalTextoComponent } from './modal-texto/modal-texto.component'
import { ModalImagenComponent } from './modal-imagen/modal-imagen.component'
import { AlertController, MenuController, ModalController } from '@ionic/angular';
import { ModalVideoComponent } from './modal-video/modal-video.component'
import { ModalAudioComponent } from './modal-audio/modal-audio.component'
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { HomenajesService } from 'src/app/services/homenajes/homenajes.service';
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { ToastController, LoadingController } from "@ionic/angular";
import { Platform } from '@ionic/angular';
import { GeolocalizacionService } from 'src/app/services/geolocalizacion/geolocalizacion.service';
import { Storage } from '@ionic/storage';
import { DatePipe } from '@angular/common';
import { DifuntoService } from 'src/app/services/difunto/difunto.service';
import { ModalRosaComponent } from './modal-rosa/modal-rosa.component';
import { AuthService } from 'src/app/services/auth/auth.service';
import INFO_SESION from 'src/app/config/infoSesion';
import { FavoritosService } from 'src/app/services/favoritos/favoritos.service';

@Component({
  selector: 'app-muro-difunto',
  templateUrl: './muro-difunto.page.html',
  styleUrls: ['./muro-difunto.page.scss'],
})
export class MuroDifuntoPage implements OnInit {
  @ViewChild("fab") fab;
  difunto: any = []
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
    private menu: MenuController,
    private _serviceAuth: AuthService,
    private _favoritos: FavoritosService,
  )
  {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.difunto = this.router.getCurrentNavigation().extras.state.difunto;
        this.checkUserLogin();
      }
    });
    this.setCurrentPosition();
    this.cargarPuntosPoligono();
    this.cargarHistorialRosas();
    this._serviceAuth.authenticationState.subscribe(
      state => {
        if(state){
          this.verificarStateSave();
        }
      }
    );
    this.verificarStateSave();
  }

  checkUserLogin(){
    this.storage.get(INFO_SESION.TOKEN_KEY).then(
      (token)=>{
        if(token){
          this.homenaje.sendMessage('cargar');
        }
        else{
          this.publicarToast("Para publicar contenido en el muro y dejar rosa es necesario que inicie sesión", 2500, "top", "warning");
        }
      }
    )
  }

  validateSesionMuro(){
    this.storage.get(INFO_SESION.TOKEN_KEY).then(
      (token)=>{
        if(!token){
          this.fab.close();
          this.loginMessageAlertMuro('Por favor inicie sesión o registrese para poder publicar');
        }
      }
    )
  }

  async cargarPuntosPoligono(){
    await this.service_geo.getListGeolocalizacion(this.difunto.id_camposanto).toPromise().then(
      (resp)=> {
        for(let r in resp){
          this.puntos_polygon.push([resp[r].latitud, resp[r].longitud])
        }
      }
    )
  }

  async validarPoligono(lati, lon){
    let x = lati, y = lon;
    let inside = false;
    for (let i = 0, j = this.puntos_polygon.length - 1; i < this.puntos_polygon.length; j = i++) {
        let xi = this.puntos_polygon[i][0], yi = this.puntos_polygon[i][1];
        let xj = this.puntos_polygon[j][0], yj = this.puntos_polygon[j][1];
        
        let intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return await inside
  }

  async setCurrentPosition() {
    await this.platform.ready().then(()=>{
      this.geolocation.getCurrentPosition().then((resp) => {
        this.lat = resp.coords.latitude;
        this.lng = resp.coords.longitude;
      })
      .catch((error) => {
        console.log("Error getting location", error);
      });
    })
  }

  cargar_mapa(){
    let navigationExtras: NavigationExtras = { state: { difunto: this.difunto} };
    this.router.navigate(['ubicacion-fallecido'], navigationExtras);
  }
  async addRose(){
    await this.postRegistroUserRose();
  }

  async cargarHistorialRosas(){
    await this.homenaje.getLogRosas(this.difunto.id_difunto).subscribe((resp: any) => {
      this.historial_rosas = resp.reverse();
    })
  }

  async postContRose(){
    await this.homenaje.dejarRosa(this.difunto.id_difunto).toPromise().then(
      async (resp)=>{
        await this.presentToast("Ha dejado una rosa al difunto", 600, 'middle', 'success');
        this.getDatosDifunto();
        this.cargarHistorialRosas();
      }
    )
  }

  async postRegistroUserRose(){
    await this.storage.get(INFO_SESION.TOKEN_KEY).then(
      (token)=>{
        if(token){
          this.presentToast("Dejando Rosa!!!", 500, 'top', 'secondary');
          this.storage.get(INFO_SESION.IDUSER).then(
            (id) => { 
              const log = new FormData();
              let fecha = this.getFechaPublicacion();
              let id_usuario = id;
              log.append('id_difunto', this.difunto.id_difunto);
              log.append('id_usuario', id_usuario);
              log.append('fecha_publicacion', fecha);
              this.homenaje.postRegistroRosa(log, token).toPromise().then(
                (resp)=>{
                  this.postContRose();
                },
                (error) =>{
                  this.presentToast("No se ha podido dejar la rosa...", 500, 'bottom', 'danger');
                }
              )
            }
          )
        } 
        else{
          this.loginMessageAlertMuro('Por favor inicie sesión o registrese para poder publicar');
        }
      }
    )
  }
  
  async getDatosDifunto(){
    await this.service_difunto.getDifuntoByID(this.difunto.id_difunto).toPromise().then(
      (resp)=>{
        this.difunto = resp
      }
    )
  }

  verificarStateSave(){
    this.storage.get(INFO_SESION.IDUSER).then(
      (id_user)=>{
        if(id_user){
          this.storage.get(INFO_SESION.TOKEN_KEY).then(
            (token) => {
              if(token){
                this._favoritos.loadFavoritos(id_user, token).subscribe(
                  (listaFavoritos)=>{
                    for(let favorito in listaFavoritos){
                      if(listaFavoritos[favorito].id_difunto == this.difunto.id_difunto){
                        this.is_save = true;
                        this.assetGuardado = "assets/page-muro/GUARDADO.png";
                      }
                    } 
                  },
                  (error)=>{
                    this.is_save = false;
                    this.assetGuardado = "assets/page-muro/GUARDAR.png";
                  }
                );
              }
            }
          )
        }
      }
    );
  }

  favoritoAction(){
    this.storage.get(INFO_SESION.IDUSER).then(
      (id_user)=>{
        if(id_user){
          this.storage.get(INFO_SESION.TOKEN_KEY).then(
            (token) => {
              if(token){
                if(!this.is_save){
                  this.favoritoState('Está seguro que desea continuar?', this.is_save);
                }
                else{
                  this.favoritoState('Está seguro que desea eliminar de sus favoritos?', this.is_save);
                }
              }
              else{
                this.loginMessageAlertMuro('Por favor inicie sesión o registrese para poder guardar a favoritos');
              }
            }
          )
        }
        else{
          this.loginMessageAlertMuro('Por favor inicie sesión o registrese para poder guardar a favoritos');
        }
      }
    )
  }

  async favoritoState(message, estado) {
    const alert = await this.alertController.create({
      cssClass: 'controlerAlert',
      message: message,
      buttons: [
        {
          text: 'Sí',
          cssClass: 'colorTextButton',
          handler: () => {
            if(estado){
              this.deleteFavorito();
            }
            else{
              this.postFavorito();
            }
          }
        },
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'colorTextButton',
          handler: () => {
          }
        }
      ]
    });

    await alert.present();
  }

  postFavorito(){
    this.storage.get(INFO_SESION.IDUSER).then(
      (id_user)=>{
        if(id_user){
          const favorito = new FormData();
          favorito.append("id_usuario", id_user as string);
          favorito.append("id_difunto", this.difunto.id_difunto as string);
          favorito.append("estado", "True");
          this.storage.get(INFO_SESION.TOKEN_KEY).then(
            token => {
              if(token){
                this._favoritos.agregarFavorito(favorito, token).subscribe(
                  (data)=>{
                    this.is_save = true;
                    this.assetGuardado = "assets/page-muro/GUARDADO.png";
                    this.presentToast("Perfil se ha agregado a sus favoritos", 2000, "middle", "dark");
                    this._favoritos.recarga_Info_Fav("recargar");
                    this.service_difunto.recarga_Lista_Difunto("recargar");
                  },
                  (error)=>{
                    this.presentToast("Error al agregar el perfil a favoritos", 2000, "bottom", "danger");
                  }
                );
              }
            }
          );
        }
      }
    );
  }
  

  deleteFavorito(){
    this.storage.get(INFO_SESION.TOKEN_KEY).then(
      token => {
        if(token){
          this.storage.get(INFO_SESION.IDUSER).then(
            (id_user)=>{
              if(id_user){
                this._favoritos.removeFavorito(id_user, this.difunto.id_difunto, token).subscribe(
                  (data)=>{
                    this.is_save = false;
                    this.assetGuardado = "assets/page-muro/GUARDAR.png";
                    this.presentToast("Se ha eliminado el perfil de sus favoritos", 2000, "middle", "dark");
                    this._favoritos.recarga_Info_Fav("recargar");
                    this.service_difunto.recarga_Lista_Difunto("recargar");
                  },
                  (error)=>{
                    this.presentToast("Error al eliminar el perfil de favoritos", 2000, "bottom", "danger");
                  }
                );
              }
            }
          );
        }
      }
    )
  }

  cambiarPageInicio(){
    this.router.navigate(["/inicio"]);
  }
  
  async modalTexto() {
    let validacion = await this.validarPoligono(this.lat, this.lng);
    // if(validacion == false){
    //   await this.ubicacionAlert();
    // }
    // else{
      const modal = await this.modalController.create({
        component: ModalTextoComponent,
        cssClass: 'my-custom-class',
        componentProps: {
          'difunto': this.difunto
        }
      });
      return await modal.present();
    // }
  }

  async modalImagen() {
    let validacion = await this.validarPoligono(this.lat, this.lng);
    // if(validacion == false){
    //   await this.ubicacionAlert();
    // }
    // else{
      const modal = await this.modalController.create({
        component: ModalImagenComponent,
        cssClass: 'my-custom-class',
        componentProps: {
          'difunto': this.difunto
        }
      });
      return await modal.present();
    // }
  }

  async modalVideo() {
    let validacion = await this.validarPoligono(this.lat, this.lng);
    // if(validacion == false){
    //   await this.ubicacionAlert();
    // }
    // else{
      const modal = await this.modalController.create({
        component: ModalVideoComponent,
        cssClass: 'my-custom-class',
        componentProps: {
          'difunto': this.difunto
        }
      });
      return await modal.present();
    // }
  }

  async modalAudio() {
    let validacion = await this.validarPoligono(this.lat, this.lng);
    // if(validacion == false){
    //   await this.ubicacionAlert();
    // }
    // else{
      const modal = await this.modalController.create({
        component: ModalAudioComponent,
        cssClass: 'my-custom-class',
        componentProps: {
          'difunto': this.difunto
        }
      });
      return await modal.present();
    // }
  }

  async modalHistorialRosas() {
    const modal = await this.modalController.create({
      component: ModalRosaComponent,
      cssClass: 'modalRosas',
      componentProps: {
        'historial': this.historial_rosas,
        'numRose' : this.difunto.num_rosas
      }
    });
    return await modal.present();
  }

  async loginMessageAlertMuro(message) {
    const alert = await this.alertController.create({
      cssClass: 'controlerAlert',
      // header: 'Confirm!',
      message: '<strong>'+message+'</strong>',
      buttons: [
        {
          text: 'Login',
          cssClass: 'colorTextButton',
          handler: () => {
            let navigationExtras: NavigationExtras = { state: { difunto: this.difunto} };
            this.router.navigate(['login'], navigationExtras);
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'colorTextButton',
          handler: () => {
            
          }
        }
      ]
    });

    await alert.present();
  }

  async ubicacionAlert() {
    const alert = await this.alertController.create({
      cssClass: 'controlerAlert',
      header: 'Alerta Ubicación',
      message: 'Usted no se encuentra dentro del área del camposanto para publicar!!',
      buttons: [{ text:'OK', cssClass: 'colorTextButton'}]
    });
    await alert.present();
  }

  getFechaPublicacion() {
    let date = new Date();
    let latest_date = this.datepipe.transform(date, 'yyyy-MM-dd HH:mm');
    return latest_date;
  }

  async presentToast(text, tiempo, position, color) {
    const toast = await this.toastController.create({
      message: text,
      position: position,
      duration: tiempo,
      color: color,
    });
    await toast.present();
  }

  async publicarToast(text, tiempo, position, color) {
    const toast = await this.toastController.create({
      message: text,
      position: position,
      duration: tiempo,
      color: color,
      buttons: [{
          text: 'ok',
          role: 'cancel',
          handler: () => {}
        }
      ]
    });
    await toast.present();
  }

  // mostrar subir imagen controller
  async showMensajeLoading(idLoading) {
    const loading = await this.loadingController.create({
      id: idLoading,
      cssClass: 'colorloading',
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
