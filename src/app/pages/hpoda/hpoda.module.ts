import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HpodaPageRoutingModule } from './hpoda-routing.module';

import { HpodaPage } from './hpoda.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HpodaPageRoutingModule
  ],
  declarations: [HpodaPage]
})
export class HpodaPageModule {}
