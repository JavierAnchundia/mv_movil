import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import URL_SERVICIOS from 'src/app/config/config';
import { Storage  } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class HomenajesService {
  private _cargarMuro = new Subject<string>();
  muroMensaje$ = this._cargarMuro.asObservable();

  constructor(
    private http: HttpClient,
    private storage: Storage
  ) { }

  sendMessage(message: string){
    this._cargarMuro.next(message);
  }
  
  postHomenajeGeneral(homenaje, token):Observable<FormData>{
    let url = URL_SERVICIOS.homenaje_post;
    console.log(token)
    let httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer '+token,
      })
    }
    return this.http.post<FormData>(url, homenaje, httpOptions);
  }

  getHomenajesDifunto(id: String) {
    let url = URL_SERVICIOS.homenajes + id + '/';
    return this.http.get(url)
  }

  dejarRosa(id:any){
    let url = URL_SERVICIOS.addRoses + id +'/1/';
    
    return this.http.patch(url,1);
  }

  postRegistroRosa(registro, token){
    let url = URL_SERVICIOS.registroRosa;
    let httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer '+token,
      })
    }
    return this.http.post(url, registro, httpOptions);
  }

  getLogRosas(id:any){
    let url = URL_SERVICIOS.logRosas+id+'/'
    return this.http.get(url);

  }
}
