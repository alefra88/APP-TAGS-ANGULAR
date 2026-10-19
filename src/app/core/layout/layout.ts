import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet, Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <div class="min-h-screen bg-slate-50 flex flex-col">
      <!-- Menú Superior -->
      <nav class="bg-slate-900 text-white shadow-md">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16">
            <div class="flex items-center gap-3">
              <div class="font-black text-xl tracking-wider text-blue-400">SADT</div>
              <div class="text-sm font-medium text-slate-300 hidden sm:block border-l border-slate-700 pl-3 ml-1">
                Sistema Alta de Tags
              </div>
            </div>
            <div class="flex space-x-4">
              <!-- Se agregó cursor-pointer a los enlaces y al botón -->
              <a routerLink="/dashboard" class="cursor-pointer text-slate-300 hover:bg-slate-800 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition">Inicio</a>
              <a routerLink="/tags" class="cursor-pointer text-slate-300 hover:bg-slate-800 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition">Padrón Tags</a>
              <button (click)="cerrarSesion()" class="cursor-pointer text-slate-400 hover:text-red-400 px-3 py-2 rounded-md text-sm font-medium transition">Salir</button>
            </div>
          </div>
        </div>
      </nav>

      <!-- Contenido Dinámico -->
      <main class="flex-grow">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class LayoutComponent {
  private router = inject(Router);

  cerrarSesion() {
    // 1. Elimina el JWT del almacenamiento local
    localStorage.removeItem('token'); 
    
    // 2. Redirige inmediatamente a la pantalla de login
    this.router.navigate(['/login']);
  }
}