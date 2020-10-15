import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import URL_SERVICIOS from 'src/app/config/config';
import { Storage  } from '@ionic/storage';

const TOKEN_KEY = 'access_token';

@Injectable({
  providedIn: 'root'
})
export class HomenajeImagenService {

  constructor(
    private http: HttpClient,
    private storage: Storage
  ) { }

  postImagen(imagen, token):Observable<FormData>{
    let url = URL_SERVICIOS.himagen_post;
    console.log(token)
    let httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer '+ token,
      })
    }
    return this.http.post<FormData>(url, imagen, httpOptions);
  }

}