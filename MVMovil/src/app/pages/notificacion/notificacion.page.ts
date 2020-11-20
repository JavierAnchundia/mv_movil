import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageNotificationService } from 'src/app/services/fcm/storage-notification.service'

@Component({
  selector: 'app-notificacion',
  templateUrl: './notificacion.page.html',
  styleUrls: ['./notificacion.page.scss'],
})
export class NotificacionPage implements OnInit {

  notificaciones: any = [];
  message: String = "";
  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private _storageFcm: StorageNotificationService,
  ) { }

  ngOnInit() {
      
  }
  ionViewDidEnter(){
    this.cargarData();
  }
  async cargarData(){
    await this._storageFcm.getListNotificationFcm().then(
      (lista) =>{
        this.notificaciones = lista.reverse();
      }
    )
  }
}
