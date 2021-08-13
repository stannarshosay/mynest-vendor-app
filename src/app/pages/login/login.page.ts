import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ModalController, NavController } from '@ionic/angular';
import { ForgotPasswordPage } from 'src/app/modals/forgot-password/forgot-password.page';
import { LoginOtpPage } from 'src/app/modals/login-otp/login-otp.page';
import { ChatroomService } from 'src/app/services/chatroom.service';
import { FcmService } from 'src/app/services/fcm.service';
import { RegisterLoginService } from 'src/app/services/register-login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  color:string = "rgba(255,255,255,0.2)";
  darkColor:string = "rgba(0,0,0,0.1)";
  showSpinner:boolean = false;
  loginForm = this.fb.group({
    username:['',Validators.required],
    password:['',Validators.required]
  });

  constructor(
    private registerLoginService:RegisterLoginService,
    private chatService:ChatroomService,
    private fb:FormBuilder,
    private modalController:ModalController,
    private snackBar:MatSnackBar,
    private navController:NavController,
    private fcmService:FcmService
  ) { }

  ngOnInit(): void {
  }

  onSubmit(){
    this.showSpinner = true;
    if(this.loginForm.valid){
      this.registerLoginService.login(this.loginForm.get("username").value,this.loginForm.get("password").value).subscribe(res =>{
        this.showSpinner = false;
        if(res["success"]){
          localStorage.setItem("vid",res["data"]["id"]);
          localStorage.setItem("vname",res["data"]["username"]);
          this.registerLoginService.hasLoggedIn.next(true);
          this.fcmService.initPush();
          this.chatService.hasRecievedMessage.next("no");
          this.chatService.hasRecievedNotification.next("no");
          this.setVendorStatusAndRedirect(res["message"]);
        }else{
          this.showSnackbar("Oops! "+res["message"]);
        }
      },
      error=>{
        this.showSpinner = false;
        this.showSnackbar("Oops! "+error["error"]["message"]);
      });
    }else{
      this.showSpinner = false;
      this.showSnackbar("Oops! no credentials entered");
    }
  }

  showSnackbar(content:string){
    const config = new MatSnackBarConfig();
    config.duration = 3000;
    config.panelClass = ['snackbar-styler'];
    this.snackBar.open(content, "close", config);
  }
  setVendorStatusAndRedirect(message:string){
    this.registerLoginService.getVendorBasicDetails(localStorage.getItem('vid')).subscribe(res=>{
      if(res["success"]){
        localStorage.setItem("vstatus",res["data"]["profileCompletionStatus"]);
        this.registerLoginService.profileStatus.next(res["data"]["profileCompletionStatus"]);
        this.showSnackbar(message);
        this.navController.navigateRoot(["/home"]);
      }else{
        this.showSnackbar("Server error!");
      }
    },error=>{
      this.showSnackbar("Connection error!");
    });    
  }
  async forgotPassword(){
    const modal = await this.modalController.create({
      component: ForgotPasswordPage
    });
    modal.onDidDismiss().then((data) => {
      if(data['data']['dismissed']){
        console.log("password changed");
      }  
    });
    return await modal.present();
  }
  async loginWithOtp(){    
    const modal = await this.modalController.create({
      component: LoginOtpPage,     
      showBackdrop: true,
      cssClass: 'login-otp-modal'
    });
    modal.onDidDismiss().then((data) => {
        if(data['data']['isVerified']){
          let loginData = data['data']['data'];
          localStorage.setItem("vid",loginData["id"]);
          localStorage.setItem("vname",loginData["username"]);
          this.registerLoginService.hasLoggedIn.next(true);
          this.fcmService.initPush();
          this.chatService.hasRecievedMessage.next("no");
          this.chatService.hasRecievedNotification.next("no");
          this.setVendorStatusAndRedirect("Otp Login Successfull!");         
        }
    });
    return await modal.present();
  
}  
}
