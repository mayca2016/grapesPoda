import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)},
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'mantenimiento',
    loadChildren: () => import('./pages/mantenimiento/mantenimiento.module').then( m => m.MantenimientoPageModule)
  },
  {
    path: 'poda/:id/:idApp',
    loadChildren: () => import('./pages/poda/poda.module').then( m => m.PodaPageModule)
  },
  {
    path: 'selector/:opcion',
    loadChildren: () => import('./pages/selector/selector.module').then( m => m.SelectorPageModule)
  },
  {
    path: 'salir',
    loadChildren: () => import('./pages/salir/salir.module').then( m => m.SalirPageModule)
  },
  {
    path: 'mostrar-foto',
    loadChildren: () => import('./pages/mostrar-foto/mostrar-foto.module').then( m => m.MostrarFotoPageModule)
  },
  {
    path: 'historial',
    loadChildren: () => import('./pages/historial/historial.module').then( m => m.HistorialPageModule)
  },
  {
    path: 'hpoda',
    loadChildren: () => import('./pages/hpoda/hpoda.module').then( m => m.HpodaPageModule)
  },
  {
    path: 'info',
    loadChildren: () => import('./pages/info/info.module').then( m => m.InfoPageModule)
  },
  
 
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
