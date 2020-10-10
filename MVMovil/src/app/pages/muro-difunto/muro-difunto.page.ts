import { Component, OnInit } from '@angular/core';
import { ModalTextoComponent } from './modal-texto/modal-texto.component'
import { ModalImagenComponent } from './modal-imagen/modal-imagen.component'
import { AlertController, ModalController } from '@ionic/angular';
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

const IDUSER = 'id_usuario';
const TOKEN_KEY = 'access_token';

@Component({
  selector: 'app-muro-difunto',
  templateUrl: './muro-difunto.page.html',
  styleUrls: ['./muro-difunto.page.scss'],
})
export class MuroDifuntoPage implements OnInit {
  polygon = [ [ 1, 1 ], [ 1, 2 ], [ 2, 2 ], [ 2, 1 ] ];
  difunto: any = []
  lat: number;
  lng: number;
  puntos_polygon: any = []
  historial_rosas: any = []
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
    private service_difunto: DifuntoService
  )
  {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.difunto = this.router.getCurrentNavigation().extras.state.difunto
      }
      console.log(this.difunto)
    });
    this.setCurrentPosition();
    this.cargarPuntosPoligono();
    this.cargarHistorialRosas();
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
  addRose(){
    this.postRegistroUserRose();
  }

  async cargarHistorialRosas(){
    await this.homenaje.getLogRosas(this.difunto.id_difunto).subscribe((resp: any) => {
      console.log(resp);
      this.historial_rosas = resp.reverse();
    })
  }
  async postContRose(){
    await this.homenaje.dejarRosa(this.difunto.id_difunto).toPromise().then(
      (resp)=>{
        this.getDatosDifunto();
        this.cargarHistorialRosas();
      }
    )
  }
  async postRegistroUserRose(){
    await this.storage.get(TOKEN_KEY).then(
      (token)=>{
        this.storage.get(IDUSER).then(
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
              }
            )
          }
        ) 
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

  async modalTexto() {
    let validacion = await this.validarPoligono(this.lat, this.lng);
    if(validacion == false){
      await this.ubicacionAlert();
    }
    else{
      const modal = await this.modalController.create({
        component: ModalTextoComponent,
        cssClass: 'my-custom-class',
        componentProps: {
          'difunto': this.difunto
        }
      });
      return await modal.present();
    }
  }

  async modalImagen() {
    let validacion = await this.validarPoligono(this.lat, this.lng);
    if(validacion == false){
      await this.ubicacionAlert();
    }
    else{
      const modal = await this.modalController.create({
        component: ModalImagenComponent,
        cssClass: 'my-custom-class',
        componentProps: {
          'difunto': this.difunto
        }
      });
      return await modal.present();
    }
  }

  async modalVideo() {
    let validacion = await this.validarPoligono(this.lat, this.lng);
    if(validacion == false){
      await this.ubicacionAlert();
    }
    else{
      const modal = await this.modalController.create({
        component: ModalVideoComponent,
        cssClass: 'my-custom-class',
        componentProps: {
          'difunto': this.difunto
        }
      });
      return await modal.present();
    }
  }

  async modalAudio() {
    let validacion = await this.validarPoligono(this.lat, this.lng);
    if(validacion == false){
      await this.ubicacionAlert();
    }
    else{
      const modal = await this.modalController.create({
        component: ModalAudioComponent,
        cssClass: 'my-custom-class',
        componentProps: {
          'difunto': this.difunto
        }
      });
      return await modal.present();
    }
  }

  async modalHistorialRosas() {
    const modal = await this.modalController.create({
      component: ModalRosaComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        'historial': this.historial_rosas
      }
    });
    return await modal.present();
  }

  async ubicacionAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Alerta Ubicación',
      message: 'Usted no se encuentra dentro del área del camposanto para publicar!!',
      buttons: ['OK']
    });
    await alert.present();
  }

  getFechaPublicacion() {
    let date = new Date();
    let latest_date = this.datepipe.transform(date, 'yyyy-MM-dd');
    return latest_date;
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
