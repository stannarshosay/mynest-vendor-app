import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Dialog } from '@capacitor/dialog';
import { Device } from '@capacitor/device';
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';
@Injectable({
  providedIn: 'root'
})
export class FcmService {
  constructor(
    private http:HttpClient,
    private router:Router
  ) { }

  public initPush(){
    this.registerPushNotification();
  }
  async getDeviceId(){
    const info = await Device.getId();
    return info;
  }
  private registerPushNotification(){
    PushNotifications.requestPermissions().then((permission)=>{
      if(permission.receive === 'granted'){
        PushNotifications.register();
      }else{
        this.showAlert("No push notification permisson granted");
      }
    });  
    PushNotifications.addListener("registration",(token:Token)=>{
      // this.showAlert("token => "+JSON.stringify(token));
      //add to table;
      if(localStorage.getItem("mnvFcmToken")){
        if(localStorage.getItem("mnvFcmToken")!=JSON.stringify(token)){
          this.addTokenForUser(JSON.stringify(token));
        }
      }else{
        this.addTokenForUser(JSON.stringify(token));
      }
    });
    PushNotifications.addListener("registrationError",(error:any)=>{
      // this.showAlert("register error => "+JSON.stringify(error));
    });
    PushNotifications.addListener("pushNotificationReceived",async (notification:PushNotificationSchema)=>{
      // this.showAlert("recieved => "+JSON.stringify(notification));
    });
    PushNotifications.addListener("pushNotificationActionPerformed",async (notification:ActionPerformed)=>{
      // PushNotifications.removeAllDeliveredNotifications();
      // this.showAlert("action performed => "+JSON.stringify(notification.notification.data));
      if(notification.notification.data.notificationType == "message"){
        this.router.navigateByUrl("/home/tabs/chatroom");
      }else{       
        this.router.navigateByUrl("/home/tabs/notifications");
      }    
    });
  }
  async showAlert(data:any) {
    let alertRet = await Dialog.alert({
      title: 'Mynest',
      message: data
    });
  }
  removeTokenOnLogout(customerId:string){
    this.getDeviceId().then(result=>{
      this.removeMobileToken(customerId,result["uuid"]).subscribe(res=>{
        if(res["success"]){
          localStorage.setItem("mnvFcmToken","");
        }
      },error=>{
        console.log(error);
      });
    });    
  }
  addTokenForUser(token:string){
    this.getDeviceId().then(result=>{
      this.addMobileToken(localStorage.getItem("vid"),result["uuid"],JSON.parse(token).value).subscribe(res=>{
        if(res["success"]){
          localStorage.setItem("mnvFcmToken",token);
        }
      },error=>{
        console.log(error);
      });
    });
  }
  removeMobileToken(customerId:string,deviceId:string){
    let param = {};
    param["userId"]=customerId;
    param["deviceId"] = deviceId;
    return this.http.post("https://mynestonline.com/collection/api/mobile/token/delete",param);
  }
  addMobileToken(customerId:string,deviceId:string,token:string){
    let param = {};
    param["userId"]=customerId;
    param["deviceId"] = deviceId;
    param["token"] = token;
    return this.http.post("https://mynestonline.com/collection/api/mobile/token/new",param);
  }
}
