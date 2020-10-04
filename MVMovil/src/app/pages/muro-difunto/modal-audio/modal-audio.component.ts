import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-audio',
  templateUrl: './modal-audio.component.html',
  styleUrls: ['./modal-audio.component.scss'],
})
export class ModalAudioComponent implements OnInit {

  constructor(
    public modalController: ModalController
  ) { }

  ngOnInit() {}

  async dismiss() {
    await this.modalController.dismiss({
      'dismissed': true
    });
  }
}
