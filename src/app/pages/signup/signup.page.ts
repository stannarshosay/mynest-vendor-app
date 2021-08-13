import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ModalController, NavController } from '@ionic/angular';
import { VerifyEmailPage } from 'src/app/modals/verify-email/verify-email.page';
import { VerifyMobilePage } from 'src/app/modals/verify-mobile/verify-mobile.page';
import { ChatroomService } from 'src/app/services/chatroom.service';
import { FcmService } from 'src/app/services/fcm.service';
import { RegisterLoginService } from 'src/app/services/register-login.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  @ViewChild('terms') terms:ElementRef;
  color:string = "rgba(255,255,255,0.2)";
  darkColor:string = "rgba(0,0,0,0.1)";
  showSpinner:boolean = false;
  isSubmitted:boolean = false;
  isEmailVerified:boolean = false;
  emailTooltip:string = "needs verification";
  isMobileVerified:boolean = false;
  mobileTooltip:string = "needs verification";
  signupForm = this.fb.group({
    username:['',Validators.required],
    email:['',[Validators.required,Validators.email]],
    mobile:['',[Validators.required,Validators.pattern("^[0-9]{10}$")]],
    password:['',Validators.required],
    rePassword:['',Validators.required]
  });

  constructor(
    private registerLoginService:RegisterLoginService,
    private chatService:ChatroomService,
    private fb:FormBuilder,
    private snackBar:MatSnackBar,
    private navController:NavController,
    private modalController:ModalController,
    private fcmService:FcmService
  ) {

   }

  onSubmit(termsStatus:any){
    this.isSubmitted = true;
      if(this.signupForm.valid){
        if(this.signupForm.get("password").value==this.signupForm.get("rePassword").value){
          if(termsStatus){
            this.checkVerification().then(res=>{
              console.log(res);
              if(res){
                let requestData = this.signupForm.value;
                delete requestData["rePassword"];
                this.register(requestData);
              }
            });            
          }else{
            this.showSnackbar("Please agree to terms and conditions",true,"okay");
          }        
        }else{
          this.showSnackbar("Passwords don't match",true,"okay");
        }      
      }else{
        this.showSnackbar("Please check all required fields",true,"okay");
      }
  }
  async checkVerification():Promise<boolean>{
      if(!this.isEmailVerified){
          const modal = await this.modalController.create({
            component: VerifyEmailPage,     
            showBackdrop: true,
            cssClass: 'login-otp-modal',
            backdropDismiss:false,
            componentProps:{
              "email":this.signupForm.get("email").value
            }
          });
          modal.onDidDismiss().then((data) => {
              if(data['data']['isVerified']){
                this.isEmailVerified = true;
                this.emailTooltip = "verified, can't change";
                setTimeout(()=>{
                  this.onSubmit(this.terms.nativeElement.checked);
                });               
              }else{
                this.signupForm.get("email").setValue("");
              }
          });
          await modal.present();
          return false;
      }
      if(!this.isMobileVerified){
        const modal = await this.modalController.create({
          component: VerifyMobilePage,     
          showBackdrop: true,
          cssClass: 'login-otp-modal',
          backdropDismiss:false,
            componentProps:{
              "mobile":this.signupForm.get("mobile").value
            }
        });
        modal.onDidDismiss().then((data) => {
            if(data['data']['isVerified']){
              this.isMobileVerified = true;
              this.mobileTooltip = "verified, can't change";              
              setTimeout(()=>{
                this.onSubmit(this.terms.nativeElement.checked);
              });
            }else{
              this.signupForm.get("mobile").setValue("");
            }
        });
        await modal.present();        
        return false;
      }
      return true;
  }
  register(data:any){
    this.showSpinner = true;
    this.registerLoginService.registerAsVendor(data).subscribe(res=>{
      this.showSpinner = false;
       if(res["success"]){
         localStorage.setItem("vid",res["data"]["id"]);
         localStorage.setItem("vname",res["data"]["username"]);
         this.registerLoginService.hasLoggedIn.next(true); 
         this.fcmService.initPush();        
         this.chatService.hasRecievedMessage.next("no");
         this.chatService.hasRecievedNotification.next("no");
         this.setVendorStatusAndRedirect();
       }else{
         this.showSnackbar(res["message"],true,"close");
       }
    },error=>{
      this.showSpinner = false;
      this.showSnackbar("Internal Server error",true,"close");
    });
  }

  showSnackbar(content:string,hasDuration:boolean,action:string){
    const config = new MatSnackBarConfig();
    if(hasDuration){
      config.duration = 3000;
    }
    config.panelClass = ['snackbar-styler'];
    return this.snackBar.open(content, action, config);
  }
  setVendorStatusAndRedirect(){
    this.registerLoginService.getVendorBasicDetails(localStorage.getItem('vid')).subscribe(res=>{
      if(res["success"]){
        localStorage.setItem("vstatus",res["data"]["profileCompletionStatus"]);
        this.registerLoginService.profileStatus.next(res["data"]["profileCompletionStatus"]);
        this.showSnackbar("Registration successful!",true,"close");
        this.navController.navigateRoot(["/select-package"]);
      }else{
        this.showSnackbar("Server error!",true,"close");
      }
    },error=>{      
      this.showSnackbar("Connection error!",true,"close");
    });    
  }
  ngOnInit(): void {
  }

  ngOnDestroy(): void{
  }

}
