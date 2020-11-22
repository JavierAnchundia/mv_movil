import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { StorageNotificationService } from 'src/app/services/fcm/storage-notification.service'
import { ChangeDetectorRef } from '@angular/core';

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
    private cRef: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this._storageFcm.updateNumNP$.subscribe(
      (isState)=>{
        if(isState){
          this.cargarData();
        }
      }
    );
    this.cargarData();
  }
  // ionViewDidEnter(){
  //   this.cargarData();
  // }
  async cargarData(){
    await this._storageFcm.getListNotificationFcm().then(
      (lista) =>{
        this.notificaciones = lista.reverse();
        this.cRef.detectChanges();
      }
    );
    
  }

  goMuroDifunto(difunto){
    let navigationExtras: NavigationExtras = { state: { difunto: difunto} };
    this.router.navigate(['muro-difunto'], navigationExtras);
  }
}
