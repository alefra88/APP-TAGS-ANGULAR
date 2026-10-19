import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="max-w-4xl mx-auto px-4 py-12">
      <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <!-- Encabezado -->
        <div class="bg-slate-50 border-b border-slate-200 p-8">
          <h1 class="text-3xl font-extrabold text-slate-900">Centro de Control SADT</h1>
          <p class="text-slate-500 mt-2">Sistema Integrado para la Administración de Tags</p>
        </div>

        <div class="p-8">
          <!-- Aviso de Privacidad -->
          <div class="bg-blue-50 rounded-xl p-6 border border-blue-100 mb-8">
            <div class="flex items-center mb-4">
              <svg class="h-6 w-6 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 class="text-lg font-bold text-blue-900">Términos y Aviso de Privacidad</h2>
            </div>
            <div class="text-sm text-blue-800 space-y-3 leading-relaxed">
              <p>El acceso a esta plataforma está estrictamente restringido a personal operativo autorizado. Toda la información consultada, incluyendo identificadores EPC y placas vehiculares, está protegida bajo las leyes de privacidad de datos.</p>
              <p>Al acceder a los módulos del sistema, confirmas que la manipulación del padrón se realiza exclusivamente para fines operativos y de validación de peaje.</p>
            </div>
          </div>

          <!-- Tarjetas de Navegación -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <a routerLink="/tags" class="group block p-6 bg-white border-2 border-slate-100 rounded-xl hover:border-blue-500 hover:shadow-md transition-all cursor-pointer">
              <div class="flex items-center justify-between mb-4">
                <div class="p-3 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <span class="text-blue-600 font-medium text-sm">Aceptar y Acceder &rarr;</span>
              </div>
              <h3 class="text-xl font-bold text-slate-900 mb-1">Administrar Tags</h3>
              <p class="text-slate-500 text-sm">Altas, bajas y edición del padrón vehicular.</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent {}