import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerifyEmailPageRoutingModule } from './verify-email-routing.module';

import { VerifyEmailPage } from './verify-email.page';
import { MaterialModule } from 'src/app/components/material.module';
import { NgOtpInputModule } from  'ng-otp-input';
import { FormatTimePipe } from 'src/app/pipes/format-time.pipe';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerifyEmailPageRoutingModule,
    MaterialModule,
    NgOtpInputModule
  ],
  declarations: [VerifyEmailPage,FormatTimePipe]
})
export class VerifyEmailPageModule {}
