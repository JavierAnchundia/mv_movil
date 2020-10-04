import { Component, OnInit } from '@angular/core';
import { ModalTextoComponent } from './modal-texto/modal-texto.component'
import { ModalImagenComponent } from './modal-imagen/modal-imagen.component'
import { ModalController } from '@ionic/angular';
import { ModalVideoComponent } from './modal-video/modal-video.component'
import { ModalAudioComponent } from './modal-audio/modal-audio.component'
@Component({
  selector: 'app-muro-difunto',
  templateUrl: './muro-difunto.page.html',
  styleUrls: ['./muro-difunto.page.scss'],
})
export class MuroDifuntoPage implements OnInit {

  constructor(
    public modalController: ModalController
  ) { }

  ngOnInit() {
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
      cssClass: 'my-custom-class'
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
