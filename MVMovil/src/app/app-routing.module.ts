import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'inicio',
    loadChildren: () => import('./pages/inicio/inicio.module').then( m => m.InicioPageModule),
    // canActivate: [AuthGuard]
  },
  {
    path: 'search',
    loadChildren: () => import('./pages/search/search.module').then( m => m.SearchPageModule)
  },
  {
    path: 'search-results',
    loadChildren: () => import('./pages/search-results/search-results.module').then( m => m.SearchResultsPageModule)
  },
  {
    path: 'ubicacion-fallecido',
    loadChildren: () => import('./pages/ubicacion-fallecido/ubicacion-fallecido.module').then( m => m.UbicacionFallecidoPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'muro-difunto',
    loadChildren: () => import('./pages/muro-difunto/muro-difunto.module').then( m => m.MuroDifuntoPageModule)
  },
  {
    path: 'perfil',
    loadChildren: () => import('./pages/perfil/perfil.module').then( m => m.PerfilPageModule)
  },
  {
    path: 'notificacion/:data',
    loadChildren: () => import('./pages/notificacion/notificacion.module').then( m => m.NotificacionPageModule)
  },
  {
    path: 'notificacion-fcm/:data',
    loadChildren: () => import('./pages/notificacion-fcm/notificacion-fcm.module').then( m => m.NotificacionFcmPageModule)
  },
  {
    path: 'recuperar-contrasena',
    loadChildren: () => import('./pages/recuperar-contrasena/recuperar-contrasena.module').then( m => m.RecuperarContrasenaPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
