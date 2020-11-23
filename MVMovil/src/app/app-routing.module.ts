import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./guards/auth.guard";

const routes: Routes = [
  {
    path: "",
    redirectTo: "inicio",
    pathMatch: "full",
  },
  {
    path: "login",
    loadChildren: () =>
      import("./login/login.module").then((m) => m.LoginPageModule),
  },
  {
    path: "inicio",
    loadChildren: () =>
      import("./pages/inicio/inicio.module").then((m) => m.InicioPageModule),
    // canActivate: [AuthGuard]
  },
  {
    path: "search",
    loadChildren: () =>
      import("./pages/search/search.module").then((m) => m.SearchPageModule),
  },
  {
    path: "search-results",
    loadChildren: () =>
      import("./pages/search-results/search-results.module").then(
        (m) => m.SearchResultsPageModule
      ),
  },
  {
    path: "ubicacion-fallecido",
    loadChildren: () =>
      import("./pages/ubicacion-fallecido/ubicacion-fallecido.module").then(
        (m) => m.UbicacionFallecidoPageModule
      ),
  },
  {
    path: "register",
    loadChildren: () =>
      import("./register/register.module").then((m) => m.RegisterPageModule),
  },
  {
    path: "muro-difunto",
    loadChildren: () =>
      import("./pages/muro-difunto/muro-difunto.module").then(
        (m) => m.MuroDifuntoPageModule
      ),
  },
  {
    path: "perfil",
    loadChildren: () =>
      import("./pages/perfil/perfil.module").then((m) => m.PerfilPageModule),
  },
  {
    path: "notificacion",
    loadChildren: () =>
      import("./pages/notificacion/notificacion.module").then(
        (m) => m.NotificacionPageModule
      ),
  },
  {
    path: "recuperar-contrasena",
    loadChildren: () =>
      import("./pages/recuperar-contrasena/recuperar-contrasena.module").then(
        (m) => m.RecuperarContrasenaPageModule
      ),
  },
  {
    path: "favoritos",
    loadChildren: () =>
      import("./pages/favoritos/favoritos.module").then(
        (m) => m.FavoritosPageModule
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
