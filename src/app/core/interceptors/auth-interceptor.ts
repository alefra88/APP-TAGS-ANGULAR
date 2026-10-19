import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  // 1. Inyectar el token en la petición original 
  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // 2. Procesar la petición y vigilar la respuesta del backend
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // 3. Si el token expiró (401), limpiamos el almacenamiento y redirigimos
      if (error.status === 401) {
        console.warn('Sesión expirada. Redirigiendo al login...');
        localStorage.removeItem('token');
        router.navigate(['/login']);
      }
      
      // Dejamos que el error continúe por si el componente también necesita saberlo
      return throwError(() => error);
    })
  );
};