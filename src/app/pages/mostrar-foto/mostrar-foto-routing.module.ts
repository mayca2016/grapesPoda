import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MostrarFotoPage } from './mostrar-foto.page';

const routes: Routes = [
  {
    path: '',
    component: MostrarFotoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MostrarFotoPageRoutingModule {}
