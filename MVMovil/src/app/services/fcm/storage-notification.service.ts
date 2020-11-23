import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import { Observable, BehaviorSubject, Subject } from "rxjs";
import INFO_SESION from "src/app/config/infoSesion";

@Injectable({
  providedIn: "root",
})
export class StorageNotificationService {
  constructor(private storage: Storage) {}

  private _setNumberNotification = new Subject<boolean>();
  updateNumNP$ = this._setNumberNotification.asObservable();

  set_NP(state: boolean) {
    this._setNumberNotification.next(state);
  }

  /**
   * Actualiza el storage del dispositivo de la lista de notifiacciones con la nueva notificacion
   * @param data contiene informacion de la notificacion push que llego
   */
  async setListNotificationFcm(data: any) {
    let arrayNotification = [];
    let difunto = null;
    let is_difunto = false;
    let getNotifications = await this.getListNotificationFcm();
    if (getNotifications != null) {
      for (let notificacion in getNotifications) {
        arrayNotification.push(getNotifications[notificacion]);
      }
    }
    if (Object.keys(data).includes("difunto")) {
      difunto = JSON.parse(data.difunto);
      is_difunto = true;
    }
    await arrayNotification.push({
      title: data.title,
      difunto: difunto,
      is_difunto: is_difunto,
      time_recibido: new Date().getTime(),
      tipo: "fcm",
    });
    this.storage
      .set(INFO_SESION.STORAGE_NOTIFICATION, arrayNotification)
      .then();
  }

  /**
   * Obtienen el listado de las notificaciones que existen en el storage device
   */
  async getListNotificationFcm() {
    return await this.storage
      .get(INFO_SESION.STORAGE_NOTIFICATION)
      .then((lista) => {
        if (lista) {
          return lista;
        } else {
          return null;
        }
      });
  }

  /**
   * Remueve las notificaciones del storage device que ya tienen mas de un dia guardadas
   */
  async removeNotification() {
    let timeNow = new Date().getTime();
    let listaNP = await this.getListNotificationFcm();
    let newListNP = [];
    for (let notificacion in listaNP) {
      let tiempo = await listaNP[notificacion].time_recibido;
      let diferenciaDia = timeNow - tiempo;
      let dia = (await diferenciaDia) / (1000 * 60 * 60 * 24);
      if (dia <= 1.0) {
        newListNP.push(listaNP[notificacion]);
      }
    }
    this.storage.set(INFO_SESION.STORAGE_NOTIFICATION, newListNP).then();
  }
}
