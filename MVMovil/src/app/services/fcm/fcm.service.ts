import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import URL_SERVICIOS from "src/app/config/config";
import { Platform, ToastController } from "@ionic/angular";
import { Router } from "@angular/router";
import { StorageNotificationService } from "src/app/services/fcm/storage-notification.service";
import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed,
} from "@capacitor/core";

const { PushNotifications, Storage } = Plugins;

@Injectable({
  providedIn: "root",
})
export class FcmService {
  dataNotificacion: any = [];
  constructor(
    private http: HttpClient,
    public platform: Platform,
    public router: Router,
    private _storageFcm: StorageNotificationService,
    private toastController: ToastController
  ) {}

  initFCM() {
    /**
     * Cuando se obtiene los permisos para obtener el token
     */
    PushNotifications.requestPermission().then((result) => {
      if (result.granted) {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        // Show some error
      }
    });

    /**
     * En caso de obtener el token device
     */
    PushNotifications.addListener(
      "registration",
      (token: PushNotificationToken) => {
        this.validarTokenDeviceStorage(token.value);
      }
    );

    /**
     * Error en caso de que no se obtenga el token device
     */
    PushNotifications.addListener("registrationError", (error: any) => {
      alert("Error on registration: " + JSON.stringify(error));
    });

    /**
     * Permite escuchar evento generado cuando llega una notificacion cuando la aplicacion esta abierta
     */
    PushNotifications.addListener(
      "pushNotificationReceived",
      async (notification: PushNotification) => {
        await this.saveNumNewNotification();
        this.dataNotificacion = await notification.data;
        await this.saveNewNotification(this.dataNotificacion);
        this.messageNewNotification();
      }
    );

    /**
     * Permite escuchar evento generado cuando se toca la notificacion
     */
    PushNotifications.addListener(
      "pushNotificationActionPerformed",
      async (notification: PushNotificationActionPerformed) => {
        await this.saveNumNewNotification();
        this.dataNotificacion = await notification.notification.data;
        await this.saveNewNotification(this.dataNotificacion);
        this.router.navigate(["notificacion"]);
      }
    );
  }

  /**
   * Función permite actualizar el contador de notificaciones nuevas
   */
  async saveNumNewNotification() {
    let valor = await this.castNumberPushNotification();
    await this.setNumNotification(valor);
  }

  /**
   * Función permite llamar a la funcion que guarda las notificaciones
   * @param notification es la informacion que llega en la notificacion push
   */
  async saveNewNotification(notification: any) {
    await this._storageFcm.setListNotificationFcm(notification);
    this._storageFcm.set_NP(true);
  }

  /**
   *
   * @param token recibe el token device que es propio del dispositivo móvil
   * @returns promesa de si pudo guardar o no el token en el servidor
   */
  postTokenDevice(token) {
    let platformDevice = "";
    if (this.platform.is("android")) {
      platformDevice = "android";
    } else if (this.platform.is("ios")) {
      platformDevice = "ios";
    }
    let url = URL_SERVICIOS.post_token_device;
    let data = new FormData();
    data.append("token_device", token);
    data.append("plataform", platformDevice);
    return this.http.post(url, data);
  }

  /**
   *
   * @param token recibe el token device
   * @returns true si el token ya esta en el storage device , caso contrario lo guarda
   */
  async validarTokenDeviceStorage(token) {
    let validatToken = await this.getLocalTokeDevice();
    if (validatToken.value) {
      return true;
    } else {
      this.postTokenDevice(token).subscribe((data) => {
        this.setLocalTokenDevice(
          data["token_device"],
          data["id_token_device"],
          null
        );
      });
    }
  }

  /**
   * Obtiene el token device guardado en el storage device
   */
  async getLocalTokeDevice() {
    let value = await Storage.get({ key: "token_fcm" });
    return value;
  }

  /**
   * Guarda el token device en el storage device
   */
  async setLocalTokenDevice(token, id, id_user) {
    await Storage.set({
      key: "token_fcm",
      value: JSON.stringify({
        id: id,
        token: token,
        id_user: id_user,
      }),
    });
  }

  /**
   * Obtiene el número de notificaciones llegadas al dispositivo y que no han sido leiadas
   */
  async getNumNotification() {
    let value = await Storage.get({ key: "num_noti_push" });
    return value;
  }

  /**
   * La funcion permite guardar el numero de notificaciones no leidas en el storage device
   * @param numero es el numero de notificacion no leidas
   */
  async setNumNotification(numero) {
    await Storage.set({
      key: "num_noti_push",
      value: numero,
    });
  }

  /**
   * Funcion permite hacer casting de un numero de string a number y acumular en 1 su valor por
   * notificacion nueva que llega al dispositivo
   * @returns setNumero es el numero acumulado en 1
   */
  async castNumberPushNotification() {
    let oldNum = await this.getNumNotification();
    let setNumero;
    if (!isNaN(Number(oldNum.value))) {
      let sumatoria = (await Number(oldNum.value)) + 1;
      setNumero = await String(sumatoria);
    } else {
      setNumero = await "1";
    }
    return await setNumero;
  }

  async messageNewNotification() {
    const toast = await this.toastController.create({
      message: "Tiene nuevas notificaciones",
      position: "middle",
      duration: 2500,
    });
    toast.present();
  }
}
