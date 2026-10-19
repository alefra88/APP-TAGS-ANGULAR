import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/auth`; 

  // Signal que inicializa leyendo el localStorage
  token = signal<string | null>(localStorage.getItem('jwt_token'));

  login(usuario: string, password: string) {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { usuario, password })
      .pipe(
        tap(response => {
          // Guardamos en persistencia y actualizamos el Signal
          localStorage.setItem('jwt_token', response.token);
          this.token.set(response.token);
        })
      );
  }

  logout() {
    localStorage.removeItem('jwt_token');
    this.token.set(null);
  }

  // Computed signal para login
  isLoggedIn() {
    return this.token() !== null;
  }
}