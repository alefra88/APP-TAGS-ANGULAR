import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verificamos el Signal  en el AuthService
  if (authService.isLoggedIn()) {
    return true; // El usuario tiene token, lo dejamos pasar
  } else {
    router.navigate(['/login']); // No hay token, lo mandamos al login
    return false; // Bloqueamos el acceso a la ruta
  }
};