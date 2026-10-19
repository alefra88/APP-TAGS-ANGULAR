import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div class="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        <div class="text-center mb-8">
          <h2 class="text-3xl font-extrabold text-gray-900">Sistema Alta Tags</h2>
          <p class="text-sm text-gray-500 mt-2">Ingresa tus credenciales para continuar</p>
        </div>
        
        <form #loginForm="ngForm" (ngSubmit)="onSubmit(loginForm)" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
            <input 
              type="text" 
              [(ngModel)]="usuario" 
              name="usuario" 
              #userCtrl="ngModel"
              required
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 outline-none transition-all"
              [class.border-red-500]="userCtrl.invalid && (userCtrl.touched || loginForm.submitted)"
              [class.focus:ring-red-500]="userCtrl.invalid && (userCtrl.touched || loginForm.submitted)"
              [class.border-gray-300]="!(userCtrl.invalid && (userCtrl.touched || loginForm.submitted))"
              [class.focus:ring-blue-500]="!(userCtrl.invalid && (userCtrl.touched || loginForm.submitted))"
              placeholder="Ej. admin"
            >
            @if (userCtrl.invalid && (userCtrl.touched || loginForm.submitted)) {
              <span class="text-red-500 text-xs mt-1 block font-medium">El usuario no puede estar vacío.</span>
            }
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input 
              type="password" 
              [(ngModel)]="password" 
              name="password" 
              #passCtrl="ngModel"
              required
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 outline-none transition-all"
              [class.border-red-500]="passCtrl.invalid && (passCtrl.touched || loginForm.submitted)"
              [class.focus:ring-red-500]="passCtrl.invalid && (passCtrl.touched || loginForm.submitted)"
              [class.border-gray-300]="!(passCtrl.invalid && (passCtrl.touched || loginForm.submitted))"
              [class.focus:ring-blue-500]="!(passCtrl.invalid && (passCtrl.touched || loginForm.submitted))"
              placeholder="••••••••"
            >
            @if (passCtrl.invalid && (passCtrl.touched || loginForm.submitted)) {
              <span class="text-red-500 text-xs mt-1 block font-medium">La contraseña es requerida.</span>
            }
          </div>
          
          <button 
            type="submit" 
            [disabled]="isLoading()"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg shadow-md transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex justify-center items-center"
          >
            @if (isLoading()) {
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Procesando...
            } @else {
              Ingresar
            }
          </button>
        </form>

        @if (errorMessage()) {
          <div class="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg text-center font-medium">
            {{ errorMessage() }}
          </div>
        }
      </div>
    </div>
  `
})
export class LoginComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  usuario = signal('');
  password = signal('');
  isLoading = signal(false);
  errorMessage = signal('');

  ngOnInit() {
    // Si ya hay token, lo mandamos al dashboard directo
    if (localStorage.getItem('token')) {
      this.router.navigate(['/dashboard']);
    }
  }
  
  onSubmit(form: NgForm) {
    // Si el formulario es inválido (campos vacíos), detenemos todo aquí.
    if (form.invalid) {
      return; 
    }

    this.isLoading.set(true);
    this.errorMessage.set('');
    
    this.authService.login(this.usuario(), this.password()).subscribe({
      next: (response: any) => {
        // Extraemos el token limpio
        const jwt = response.token || response.Token; 
        
        if (jwt) {
          localStorage.setItem('token', jwt);
          this.isLoading.set(false);
          this.router.navigate(['/dashboard']);
        } else {
          this.isLoading.set(false);
          this.errorMessage.set('Error interno: No se recibió el token de acceso.');
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        // Mostramos el mensaje de error en la pantalla si fallan las credenciales
        this.errorMessage.set('Usuario o contraseña incorrectos.');
        console.error('Error de autenticación:', err);
      }
    });
  }
}