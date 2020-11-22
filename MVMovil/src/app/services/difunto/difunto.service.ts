import { Injectable } from '@angular/core';
import URL_SERVICIOS from 'src/app/config/config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DifuntoService {

  constructor(private http: HttpClient) { }
  getDifuntos(id,nombre,apellido) {
    let url = URL_SERVICIOS.difuntos+id+'/'+nombre+'/'+ apellido+'/';

    return this.http.get(url);
  }

  getDifuntoByID(id){
    let url = URL_SERVICIOS.difunto+id+'/';
    return this.http.get(url);
  }

  private _recargarListaDifuntos = new Subject<string>();
  updateInfoDifunto$ = this._recargarListaDifuntos.asObservable();

  recarga_Lista_Difunto(message: string){
    this._recargarListaDifuntos.next(message);
  }
}