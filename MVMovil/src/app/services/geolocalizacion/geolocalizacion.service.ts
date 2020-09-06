import { Injectable } from '@angular/core';
import URL_SERVICIOS from 'src/app/config/config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Difunto } from '../../models/difunto.model'

@Injectable({
  providedIn: 'root'
})
export class GeolocalizacionService {

  constructor(
    private http: HttpClient
  ) { }

  getDifuntoGeolocalizacion(id):Observable<Difunto>{
    let url = URL_SERVICIOS.difunto + id + '/';
    return this.http.get<Difunto>(url);
  }
}
