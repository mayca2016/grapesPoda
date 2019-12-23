import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SalirPage } from './salir.page';

const routes: Routes = [
  {
    path: '',
    component: SalirPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalirPageRoutingModule {}
