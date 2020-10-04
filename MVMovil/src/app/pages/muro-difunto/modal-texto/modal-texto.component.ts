import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-texto',
  templateUrl: './modal-texto.component.html',
  styleUrls: ['./modal-texto.component.scss'],
})
export class ModalTextoComponent implements OnInit {

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
