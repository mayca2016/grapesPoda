import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SalirPageRoutingModule } from './salir-routing.module';

import { SalirPage } from './salir.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SalirPageRoutingModule
  ],
  declarations: [SalirPage]
})
export class SalirPageModule {}
