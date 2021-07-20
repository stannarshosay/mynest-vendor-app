import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerifyMobilePageRoutingModule } from './verify-mobile-routing.module';

import { VerifyMobilePage } from './verify-mobile.page';
import { FormatTimePipe } from 'src/app/pipes/format-time.pipe';
import { NgOtpInputModule } from  'ng-otp-input';
import { MaterialModule } from 'src/app/components/material.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerifyMobilePageRoutingModule,
    NgOtpInputModule,
    MaterialModule
  ],
  declarations: [VerifyMobilePage,FormatTimePipe]
})
export class VerifyMobilePageModule {}
