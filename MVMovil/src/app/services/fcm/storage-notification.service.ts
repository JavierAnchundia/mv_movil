import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import INFO_SESION from 'src/app/config/infoSesion';

@Injectable({
  providedIn: 'root'
})
export class StorageNotificationService {

  constructor(
    private storage: Storage,
  ) { }

  private _setNumberNotification = new Subject<boolean>();
  updateNumNP$ = this._setNumberNotification.asObservable();

  set_NP(state: boolean){
    this._setNumberNotification.next(state);
  }

  async setListNotificationFcm(message_body, extra_message){
    // await this.storage.remove(STORAGE_NOTIFICATION)
    let arrayNotification = [];
    let getNotifications = await this.getListNotificationFcm();
    if(getNotifications != null){
      for(let notificacion in getNotifications){
        arrayNotification.push(getNotifications[notificacion]);
      }
    }
    await arrayNotification.push({
      message_body: message_body,
      extra_message: extra_message,
      time_recibido: new Date().getTime(),
      tipo: "fcm"
    });
    this.storage.set(INFO_SESION.STORAGE_NOTIFICATION, arrayNotification).then();
  }

  async getListNotificationFcm(){
    return await this.storage.get(INFO_SESION.STORAGE_NOTIFICATION).then(
      (lista)=>{
        if(lista){
          return lista;
        }
        else{
          return null
        }
      }
    );
  }

  async removeNotification(){
    let timeNow = new Date().getTime();
    let listaNP = await this.getListNotificationFcm();
    let newListNP = []
    for(let notificacion in listaNP){
      let tiempo = await listaNP[notificacion].time_recibido;
      let diferenciaDia = timeNow - tiempo;
      let dia = await diferenciaDia / (1000*60*60*24);
      if(dia <= 1.2){
        newListNP.push(listaNP[notificacion]);
      }
    }
    this.storage.set(INFO_SESION.STORAGE_NOTIFICATION, newListNP).then();
  }
}
