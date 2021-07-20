import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectPackagePageRoutingModule } from './select-package-routing.module';

import { SelectPackagePage } from './select-package.page';
import { MaterialModule } from 'src/app/components/material.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectPackagePageRoutingModule,
    MaterialModule
  ],
  declarations: [SelectPackagePage]
})
export class SelectPackagePageModule {}
