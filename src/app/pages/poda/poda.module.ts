import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PodaPageRoutingModule } from './poda-routing.module';

import { PodaPage } from './poda.page';
import {  ReactiveFormsModule} from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PodaPageRoutingModule,
    ReactiveFormsModule,
    MatSelectModule,
  ],
  declarations: [PodaPage]
})
export class PodaPageModule {}
