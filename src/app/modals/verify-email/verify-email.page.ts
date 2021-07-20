import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ModalController } from '@ionic/angular';
import { Subscription, timer } from 'rxjs';
import { RegisterLoginService } from 'src/app/services/register-login.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.page.html',
  styleUrls: ['./verify-email.page.scss'],
})
export class VerifyEmailPage implements OnInit {

  @Input('email') email:string;
  @ViewChild('ngOtpInput', { static: false}) ngOtpInput: any;
  isProcessing:boolean = false;
  info:string = "Sending otp via mail...";
  otp: string = "";
  isCounting:boolean = false;
  countDown: Subscription;
  counter = 50;
  tick = 1000;
  config = {
    allowNumbersOnly: true,
    length: 4,
    isPasswordInput: false,
    placeholder: '',
    inputStyles: {
      'width': '50px',
      'height': '50px',
      'background-color':'#f5f5f5'
    }
  };
  constructor(   
    private snackBar:MatSnackBar,
    public registerLoginService:RegisterLoginService,
    private modalController:ModalController
  ) { }

  ngOnInit(): void { 
      
  }
  ionViewWillEnter(){
    this.sendOTP();
  }
  ionViewWillLeave(){
    this.countDown=null;
  }
  ngOnDestroy(){
  }
  showSnackbar(content:string,hasDuration:boolean,action:string){
    const config = new MatSnackBarConfig();
    if(hasDuration){
      config.duration = 3000;
    }
    config.panelClass = ['snackbar-styler'];
    return this.snackBar.open(content, action, config);
  }
  sendOTP(){
    this.info = "Sending otp via mail...";
    this.isProcessing = true;
    this.showSnackbar("Sending OTP via mail...",true,"okay");
    this.registerLoginService.sendEmailOtp(this.email).subscribe(res=>{
      this.isProcessing = false;
      if(res["success"]){
          this.isCounting = true;
          this.countDown = timer(0, this.tick).subscribe(() => {
            if(this.counter>0){
              --this.counter;
            }else{
              this.isCounting = false;
              this.countDown = null;
              this.counter = 50;
            }
          });
          this.showSnackbar("OTP sent successfully!",true,"okay");
          this.info = "Please enter otp sent to "+this.email;
        }else{
          this.showSnackbar(res["message"],true,"close");
          this.dismiss(false);
        }
    },error=>{
      this.showSnackbar("Error sending email, check email",true,"close");
      this.isProcessing = false;
      this.dismiss(false);
      console.log(error);
    });
  }
  verifyOTP(){    
    if(this.otp.length == 4){
      this.info = "Verifying otp...";
      this.isProcessing = true;
      this.showSnackbar("Verifying email...",false,"");
      this.registerLoginService.verifyOtp(this.otp).subscribe(res=>{
        this.isProcessing = false;
        if(res["success"]){
          this.showSnackbar("Email verified successfully!",true,"close");
          this.dismiss(true);
        }else{
          this.info = "Please enter otp sent to "+this.email;
          this.showSnackbar("Wrong otp!",true,"close");
        }
      },error=>{
        this.isProcessing = false;
        this.info = "Otp expired, please resend "+this.email;
        this.showSnackbar("Oops! otp expired, please resend",true,"okay");
      });
    }else{
      this.showSnackbar("Please enter otp recieved",true,"close");
    }
  }
  onOtpChange(otp:string) {
    this.otp = otp;
  }
  dismiss(isVerified:boolean){
    this.modalController.dismiss({
      'isVerified': isVerified,
    });
  } 
}
