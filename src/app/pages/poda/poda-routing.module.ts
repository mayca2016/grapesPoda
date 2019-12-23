import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PodaPage } from './poda.page';

const routes: Routes = [
  {
    path: '',
    component: PodaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PodaPageRoutingModule {}
