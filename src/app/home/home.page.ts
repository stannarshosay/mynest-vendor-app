import { Component } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MenuController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ChatroomService } from '../services/chatroom.service';
import { FcmService } from '../services/fcm.service';
import { RegisterLoginService } from '../services/register-login.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  isLoggedIn:boolean = false;
  logoChangedStatusSubscription:Subscription;
  getLoginSetStatusSubscription:Subscription;
  getRecievedMessagesSubscription:Subscription;
  getRecievedNotificationsSubscription:Subscription;
  messageCount:string = "";
  notificationCount:string = "";
  vendorUsername:string = "Guest";
  vendorCompanyLogo:string = "";
  vendorDetails:any;
  color:string = "rgba(255,255,255,0.2)";
  darkColor:string = "rgba(0,0,0,0.1)";

  constructor(
    private chatService:ChatroomService,
    private snackBar:MatSnackBar,
    private registerLoginService:RegisterLoginService,
    private menu:MenuController,
    private navController:NavController,
    private fcmService:FcmService
  ) {}
  
  ngOnInit():void{
    
  }
  ionViewWillEnter(){   
    this.menu.enable(true, 'sidebar-menu');
    this.getLoginSetStatusSubscription = this.registerLoginService.getLoginSetStatus().subscribe(res =>{
      this.isLoggedIn = res;
      if(res){
        this.getVendorProfileDetails();
        this.vendorUsername = localStorage.getItem("vname");
      }else{
        this.vendorUsername = "Guest";
      }
    });
    this.logoChangedStatusSubscription = this.registerLoginService.getLogoChangedStatus().subscribe(res=>{
      if(res){
        this.getVendorProfileDetails();
      }
    });
    this.getRecievedMessagesSubscription = this.chatService.getRecievedMessages().subscribe(res =>{
      if(this.isLoggedIn){
        this.setMessageUnreadCount();
      }else{
        this.messageCount="";
      }
    });
   
    this.getRecievedNotificationsSubscription = this.chatService.getRecievedNotification().subscribe(res =>{
      if(this.isLoggedIn){
        this.setNotificationUnreadCount();
      }else{
        this.notificationCount = "";
      }
    });
    if(this.isLoggedIn){
      this.setNotificationUnreadCount();
      this.setMessageUnreadCount();
    }else{
      this.notificationCount = "";
      this.messageCount="";
    }  
  }
  ionViewWillLeave(){
     this.logoChangedStatusSubscription.unsubscribe();
     this.getLoginSetStatusSubscription.unsubscribe();
     this.getRecievedMessagesSubscription.unsubscribe();
     this.getRecievedNotificationsSubscription.unsubscribe();
  }
  getVendorProfileDetails(){
    this.registerLoginService.getVendorProfileDetails(localStorage.getItem("vid")).subscribe(res=>{
      if(res["success"]){
        this.vendorDetails = res["data"];
        this.vendorCompanyLogo = res["data"]["logo"];
      }
   },error=>{
     console.log(error);
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
 
  setMessageUnreadCount(){
    this.chatService.getMessagesUnreadCount(localStorage.getItem("vid")).subscribe(res=>{
      if(res["success"]){
        this.messageCount = res["data"] == 0?"":res["data"]>50?"50+":res["data"];
      }else{
        this.messageCount = "";
      }
    }); 
  }
  setNotificationUnreadCount(){
    this.chatService.getNotificationsUnreadCount(localStorage.getItem("vid")).subscribe(res=>{
      if(res["success"]){
        this.notificationCount = res["data"] == 0?"":res["data"]>50?"50+":res["data"];
      }else{
        this.notificationCount="";
      }
    }); 
  }
  getImagePath(imagePath:string){
    if((imagePath)&&imagePath != ""){
      return encodeURIComponent(imagePath);
    }
    return encodeURIComponent("default.jpg");
  }
  closeMenu(){
    this.menu.close("sidebar-menu");
  }
  logout(){ 
    this.fcmService.removeTokenOnLogout(localStorage.getItem("vid"));
    localStorage.setItem("vid","");
    localStorage.setItem("vname","");
    localStorage.setItem("vstatus","");
    this.registerLoginService.hasLoggedIn.next(false);
    this.chatService.hasRecievedMessage.next("no");
    this.chatService.hasRecievedNotification.next("no");    
    this.closeMenu();
    this.showSnackbar("Logout Successful!",true,"close");
    this.navController.navigateRoot(['login']);
  }
}
