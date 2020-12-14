import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import URL_SERVICIOS from 'src/app/config/config';

@Injectable({
  providedIn: 'root'
})
export class RedSocialService {

  constructor(
    private http: HttpClient
  ) { }

  getRedes(id) {
    let url = URL_SERVICIOS.red_social + id + '/';
    return this.http.get(url);
  }
}
