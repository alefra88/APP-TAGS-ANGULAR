import { Component, OnInit, inject, signal } from '@angular/core';
import { TagService, TelepeajeTag } from '../../core/services/tag'; 
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-tags',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50 p-8">
      <div class="max-w-6xl mx-auto">
        <!-- Header -->
        <div class="flex justify-between items-center mb-8">
          <div>
            <h1 class="text-3xl font-extrabold text-gray-900">Administración de Tags</h1>
            <p class="text-sm text-gray-500 mt-1">Gestión del padrón de telepeaje</p>
          </div>
          <button (click)="abrirModal()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm">
          + Nuevo Tag
          </button>
        </div>

        <!-- Tabla -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table class="w-full text-left border-collapse">
            <thead class="bg-gray-100 text-gray-700 uppercase text-xs font-semibold">
              <tr>
                <th class="px-6 py-4 border-b">EPC / ID</th>
                <th class="px-6 py-4 border-b">Placa</th>
                <th class="px-6 py-4 border-b">Estado</th>
                <th class="px-6 py-4 border-b text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
             @for (tag of tagsList(); track tag.numeroTag) {
  <tr class="hover:bg-gray-50 transition-colors border-b last:border-0">
    <td class="px-6 py-4 text-gray-900 font-medium">{{ tag.numeroTag }}</td>
    <td class="px-6 py-4 text-gray-600">{{ tag.placaVehiculo }}</td>
    <td class="px-6 py-4">
      <span class="px-2.5 py-1 text-xs font-semibold rounded-full"
            [class.bg-green-100]="tag.estadoActual === 'ACTIVO'"
            [class.text-green-800]="tag.estadoActual === 'ACTIVO'"
            [class.bg-red-100]="tag.estadoActual !== 'ACTIVO'"
            [class.text-red-800]="tag.estadoActual !== 'ACTIVO'">
        {{ tag.estadoActual }}
      </span>
    </td>
    <td class="px-6 py-4 text-right space-x-3">
      <button class="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors">Editar</button>
      <button class="text-red-600 hover:text-red-800 font-medium text-sm transition-colors">Eliminar</button>
    </td>
  </tr>
  <!-- MODAL ALTA DE TAG -->
@if (mostrarModal()) {
  <div class="fixed inset-0 bg-slate-900 bg-opacity-50 flex items-center justify-center z-50 transition-opacity">
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
      
      <!-- Encabezado -->
      <div class="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
        <h3 class="text-lg font-bold text-slate-800">Registrar Nuevo Tag</h3>
        <button (click)="cerrarModal()" class="text-slate-400 hover:text-red-500 transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <!-- Disclaimer de Formato de Placas -->
              <div class="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-r-lg mt-3">
                <div class="flex items-start">
                  <div class="flex-shrink-0 mt-0.5">
                    <!-- Icono de información -->
                    <svg class="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <div class="ml-3 text-xs text-blue-800">
                    <p class="font-semibold mb-1">Criterios de captura obligatorios:</p>
                    <ul class="list-disc pl-4 space-y-1 mb-2">
                      <li><strong>Formatos Particulares:</strong> ABC-1234 o AAA-000-A</li>
                      <li><strong>Formatos Transporte:</strong> AB-12345, AB-1234 o A-000-AAA</li>
                    </ul>
                    <p class="text-blue-700">
                      <span class="font-semibold">Importante:</span> Por normativa, las letras <strong>O, Q, Ñ</strong> e <strong>I</strong> están restringidas para evitar confusiones visuales con los números 0 y 1.
                    </p>
                  </div>
                </div>
              </div>
      <!-- Cuerpo y Formulario -->
      <div class="p-6">
        <form #altaForm="ngForm" (ngSubmit)="guardarTag(altaForm)" class="space-y-4">
          
          <!-- Campo: Placa del Vehículo -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Placa del Vehículo</label>
            <input 
              type="text" 
              name="placaVehiculo" 
              [(ngModel)]="tagTemporal.placaVehiculo" 
              #placaCtrl="ngModel"
              required
              minlength="5"
              maxlength="10"
              /* pattern="^(?:[A-HJ-NP-Z]{3}-\d{4}|[A-HJ-NP-Z]{3}-\d{3}-[A-HJ-NP-Z]|[A-HJ-NP-Z]{2}-\d{4,5}|[A-HJ-NP-Z]-\d{3}-[A-HJ-NP-Z]{3})$" */
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 outline-none transition-all uppercase"
              [class.border-red-500]="placaCtrl.invalid && (placaCtrl.touched || altaForm.submitted)"
              [class.border-slate-300]="!(placaCtrl.invalid && (placaCtrl.touched || altaForm.submitted))"
              [class.focus:ring-blue-500]="!(placaCtrl.invalid && (placaCtrl.touched || altaForm.submitted))"
              placeholder="Ej. ABC-1234"
              oninput="this.value = this.value.toUpperCase()"
            >
            
            <!-- Mensajes de Error Dinámicos -->
            @if (placaCtrl.invalid && (placaCtrl.touched || altaForm.submitted)) {
              <div class="text-red-500 text-xs mt-1 font-medium space-y-1">
                @if (placaCtrl.errors?.['required']) {
                  <p>La placa del vehículo es obligatoria.</p>
                }
                @if (placaCtrl.errors?.['pattern']) {
                  <p>Formato inválido. Ejemplos aceptados:</p>
                  <ul class="list-disc pl-4 text-[10px] text-slate-500">
                    <li>Particular: ABC-1234 o AAA-000-A</li>
                    <li>Transporte: AB-12345 o A-000-AAA</li>
                  </ul>
                }
              </div>
            }
          </div>

          <!-- Botones de Acción -->
          <div class="pt-4 flex space-x-3 justify-end">
            <button type="button" (click)="cerrarModal()" class="px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors">
              Cancelar
            </button>
            <button 
              type="submit" 
              [disabled]="isSaving() || altaForm.invalid"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center"
            >
              @if (isSaving()) {
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Asignando Tag...
              } @else {
                Generar Tag
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
}
} @empty {
                <tr>
                  <td colspan="4" class="px-6 py-12 text-center text-gray-500">
                    @if (isLoading()) {
                      <div class="flex justify-center items-center space-x-2">
                        <svg class="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Cargando padrón de tags...</span>
                      </div>
                    } @else {
                      <span class="font-medium">No hay tags registrados en la base de datos.</span>
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class TagsComponent implements OnInit {
  private tagService = inject(TagService);
  mostrarModal = signal(false);
  isSaving = signal(false);
  private http = inject(HttpClient);
  tagTemporal = { placaVehiculo: '' };

  // Signals para manejar el estado reactivo
  tagsList = signal<TelepeajeTag[]>([]);
  isLoading = signal(true);

  ngOnInit() {
    this.cargarTags();
  }
abrirModal() {
    this.mostrarModal.set(true);
  }

  cerrarModal() {
  this.mostrarModal.set(false);
  this.tagTemporal = { placaVehiculo: '' }; 
}

 guardarTag(form: NgForm) {
  if (form.invalid) return;
  
  this.isSaving.set(true);
  const url = `${environment.apiUrl}/tags`;

  this.http.post(url, this.tagTemporal).subscribe({
    next: () => {
      this.isSaving.set(false);
      this.cerrarModal();
      this.cargarTags(); // Recargamos la tabla en el fondo
      
      // Lanzamos el SweetAlert de éxito
      Swal.fire({
        title: '¡Generado!',
        text: `El Tag para la placa ${this.tagTemporal.placaVehiculo} ha sido creado con éxito.`,
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#2563eb' // Azul blue-600 de Tailwind
      });
    },
    error: (err) => {
      this.isSaving.set(false);
      
      // Lanzamos el SweetAlert de error
      Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al generar el Tag. Inténtalo nuevamente.',
        icon: 'error',
        confirmButtonText: 'Cerrar',
        confirmButtonColor: '#dc2626' // Rojo red-600 de Tailwind
      });
    }
  });
}
  cargarTags() {
    this.isLoading.set(true);
    this.tagService.getTags().subscribe({
      next: (data) => {
        this.tagsList.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error al obtener los tags desde .NET', err);
        this.isLoading.set(false);
      }
    });
  }
}