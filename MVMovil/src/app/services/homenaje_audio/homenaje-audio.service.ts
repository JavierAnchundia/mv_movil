import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import URL_SERVICIOS from 'src/app/config/config';
import { Storage  } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class HomenajeAudioService {

  constructor(
    private http: HttpClient,
    private storage: Storage
  ) { }
  postAudio(audio, token):Observable<FormData>{
    let url = URL_SERVICIOS.haudio_post;
    console.log(token)
    let httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer '+ token,
      })
    }
    return this.http.post<FormData>(url, audio, httpOptions);
  }

  deleteAudio(id){
    let url = URL_SERVICIOS.haudio_del + id + "/"
    return this.http.delete(url, {observe: 'response'});
  }
}
