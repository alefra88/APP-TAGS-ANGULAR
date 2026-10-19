import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment'; 

export interface TelepeajeTag {
  numeroTag: string;
  placaVehiculo: string;
  saldoInicial: number;
  estadoActual: string;
  fechaDeRegistro: string;
}
@Injectable({
  providedIn: 'root'
})
export class TagService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/tags`; 

  getTags(): Observable<TelepeajeTag[]> {
    return this.http.get<TelepeajeTag[]>(this.apiUrl);
  }

  // Preparando el terreno para las siguientes acciones del CRUD
  createTag(tag: Partial<TelepeajeTag>): Observable<TelepeajeTag> {
    return this.http.post<TelepeajeTag>(this.apiUrl, tag);
  }
}