import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-rosa',
  templateUrl: './modal-rosa.component.html',
  styleUrls: ['./modal-rosa.component.scss'],
})
export class ModalRosaComponent implements OnInit {
  @Input() historial: any;
  @Input() numRose: number;
  constructor(
    public modalController: ModalController
  ) { }

  ngOnInit() {
  }

  async dismiss() {
    await this.modalController.dismiss({
      dismissed: true,
    });
  }
}
