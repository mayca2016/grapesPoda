import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HpodaPage } from './hpoda.page';

const routes: Routes = [
  {
    path: '',
    component: HpodaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HpodaPageRoutingModule {}
