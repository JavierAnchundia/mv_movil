import { Component, OnInit } from '@angular/core';
import { ModalTextoComponent } from './modal-texto/modal-texto.component'
import { ModalImagenComponent } from './modal-imagen/modal-imagen.component'
import { ModalController } from '@ionic/angular';
import { ModalVideoComponent } from './modal-video/modal-video.component'
import { ModalAudioComponent } from './modal-audio/modal-audio.component'
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-muro-difunto',
  templateUrl: './muro-difunto.page.html',
  styleUrls: ['./muro-difunto.page.scss'],
})
export class MuroDifuntoPage implements OnInit {

  difunto: any = []
  constructor(
    public modalController: ModalController,
    private route: ActivatedRoute, 
    private router: Router
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
  }

  cargar_mapa(){
    let navigationExtras: NavigationExtras = { state: { difunto: this.difunto} };
    this.router.navigate(['ubicacion-fallecido'], navigationExtras);
  }

  async modalTexto() {
    const modal = await this.modalController.create({
      component: ModalTextoComponent,
      cssClass: 'my-custom-class'
    });
    return await modal.present();
  }

  async modalImagen() {
    const modal = await this.modalController.create({
      component: ModalImagenComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        'difunto': this.difunto
      }
    });
    return await modal.present();
  }

  async modalVideo() {
    const modal = await this.modalController.create({
      component: ModalVideoComponent,
      cssClass: 'my-custom-class'
    });
    return await modal.present();
  }

  async modalAudio() {
    const modal = await this.modalController.create({
      component: ModalAudioComponent,
      cssClass: 'my-custom-class'
    });
    return await modal.present();
  }
}
