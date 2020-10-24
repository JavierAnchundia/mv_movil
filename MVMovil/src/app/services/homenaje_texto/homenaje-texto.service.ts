import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import URL_SERVICIOS from 'src/app/config/config';
import { Storage  } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class HomenajeTextoService {

  constructor(
    private http: HttpClient,
    private storage: Storage
  ) { }

  postTexto(texto, token):Observable<FormData>{
    let url = URL_SERVICIOS.hmensaje_post;
    console.log(token)
    let httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer '+ token,
      })
    }
    return this.http.post<FormData>(url, texto, httpOptions);
  }

  deleteTexto(id){
    let url = URL_SERVICIOS.hmensaje_del + id + "/"
    return this.http.delete(url, {observe: 'response'});
  }
}
