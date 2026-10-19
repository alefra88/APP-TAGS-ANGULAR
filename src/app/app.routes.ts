import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login';
import { authGuard } from './core/guards/auth-guard';
import { TagsComponent } from './features/tags/tags';
import { LayoutComponent } from './core/layout/layout';
import { DashboardComponent } from './features/dashboard/dashboard';

export const routes: Routes = [
  { 
    path: 'login', 
    component: LoginComponent 
  },
  { 
    // Ruta padre protegida con el Layout y el Navbar
    path: '', 
    component: LayoutComponent,
    canActivate: [authGuard], 
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'tags', component: TagsComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' } // Redirige por defecto al dashboard
    ]
  },
  { 
    path: '**', 
    redirectTo: '/login' 
  } // Ruta comodín para URLs que no existen
];