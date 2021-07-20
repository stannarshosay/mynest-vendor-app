import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ModalController } from '@ionic/angular';
import { Subscription, timer } from 'rxjs';
import { RegisterLoginService } from 'src/app/services/register-login.service';

@Component({
  selector: 'app-verify-mobile',
  templateUrl: './verify-mobile.page.html',
  styleUrls: ['./verify-mobile.page.scss'],
})
export class VerifyMobilePage implements OnInit {
  @Input('mobile') mobile:string;
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
    this.info = "Sending otp via mobile...";
    this.isProcessing = true;
    this.showSnackbar("Sending OTP via mobile...",true,"okay");
    this.registerLoginService.sendMobileOtp(this.mobile).subscribe(res=>{
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
          this.info = "Please enter otp sent to "+this.mobile;
        }else{
          this.showSnackbar(res["message"],true,"close");
          this.dismiss(false);
        }
    },error=>{
      this.showSnackbar("Error sending SMS, check mobile number",true,"close");
      this.isProcessing = false;
      this.dismiss(false);
      console.log(error);
    });
  }
  verifyOTP(){    
    if(this.otp.length == 4){
      this.info = "Verifying otp...";
      this.isProcessing = true;
      this.showSnackbar("Verifying mobile number...",false,"");
      this.registerLoginService.verifyOtp(this.otp).subscribe(res=>{
        this.isProcessing = false;
        if(res["success"]){
          this.showSnackbar("Mobile number verified successfully!",true,"close");
          this.dismiss(true);
        }else{
          this.info = "Please enter otp sent to "+this.mobile;
          this.showSnackbar("Wrong otp!",true,"close");
        }
      },error=>{
        this.isProcessing = false;
        this.info = "Otp expired, please resend "+this.mobile;
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
