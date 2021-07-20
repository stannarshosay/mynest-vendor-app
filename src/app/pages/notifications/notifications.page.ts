import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ChatroomService } from 'src/app/services/chatroom.service';
import moment from 'moment';
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {
  isNotificationsLoaded:boolean = false;
  isNotificationsDataSuccess:boolean = true;
  notifications:any[] = [];
  pageNo:number = 0;
  pageSize:number = 9;
  config:any = {};
  getRecievedNotificationSubscription:Subscription;
  color:string = "rgba(255,255,255,0.2)";
  darkColor:string = "rgba(0,0,0,0.1)";  
  constructor(
    private chatService:ChatroomService,
    private snackBar:MatSnackBar,
    private navController:NavController,
    private router:Router
  ) { }

  ngOnInit(): void {   
  }
  ionViewWillEnter(){
    this.config["totalItems"] = 0;
    this.config["currentPage"] = this.pageNo+1;
    this.config["itemsPerPage"] = this.pageSize;
    this.getNotifications(this.pageNo,this.pageSize);
    this.getRecievedNotificationSubscription = this.chatService.getRecievedNotification().subscribe(res=>{
      if(res !== "no"){        
        this.getNotifications(this.pageNo,this.pageSize);        
      }
    });
  }
  ionViewWillLeave(){
    this.getRecievedNotificationSubscription.unsubscribe();
  }
  ngOnDestroy():void{
     
  }
  getNotifications(pageNo:number,pageSize:number){
    this.notifications = [];
    this.config["totalItems"] = 0;
    this.isNotificationsDataSuccess = true;
    this.isNotificationsLoaded = false;
    this.config["currentPage"] = pageNo+1;
    this.config["itemsPerPage"] = pageSize;
    this.chatService.getAllNotifications(localStorage.getItem("vid"),pageNo,pageSize).subscribe(res =>{
      this.isNotificationsLoaded = true;
      if(res["success"]){
        this.config["totalItems"] = res["data"]["totalElements"];
        this.notifications = res["data"]["content"];
        this.updateReadStatus();
      }else{
        this.isNotificationsDataSuccess = false;
      }
    });
  }
  updateReadStatus(){
    let paramData = {};
    paramData["notificationIds"] = this.notifications.filter((obj)=>{
      if(!obj.readStatus)
      return obj;
    }).map((obj)=>{
      return obj.notificationId;
    });
    if(paramData["notificationIds"].length){
      this.chatService.updateNotificationReadStatus(paramData).subscribe(res=>{
          this.chatService.hasRecievedNotification.next("no"); 
      },error=>{
        this.showSnackbar("Status update connection error!",true,"close");
      });
    }
  }
  goToRespectivePage(notificationType:string){
      switch(notificationType){
        case "AD_ACCEPTED":{
          this.navController.navigateForward("/advertisements");
          break;
        }
        case "AD_REJECTED ":{
          this.navController.navigateForward("/advertisements");
          break;
        }
        case "PROFILE_VERIFIED":{
          this.router.navigateByUrl("/home/tabs/landing");
          break;
        }
        case "REQ_REPORT_ACCEPTED":{
          this.router.navigateByUrl("/home/tabs/requirements");
          break;
        }
        case "REQ_REPORT_REJECTED":{
          this.router.navigateByUrl("/home/tabs/requirements");
          break;
        }
        case "NEW_REQUIREMENT":{
          this.router.navigateByUrl("/home/tabs/requirements");
          break;
        }
        case "AD_RUNNING":{
          this.navController.navigateForward("/advertisements");
          break;
        }
        case "AUTO_PLAN_DOWN":{
          this.navController.navigateForward("/packages");
          break;
        }
      }
  }
  showSnackbar(content:string,hasDuration:boolean,action:string){
    const config = new MatSnackBarConfig();
    if(hasDuration){
      config.duration = 3000;
    }
    config.panelClass = ['snackbar-styler'];
    return this.snackBar.open(content, action, config);
  }
  pageChange(newPage: number){
    this.pageNo = newPage-1;
    this.getNotifications(this.pageNo,this.pageSize);
  } 
  getBeautifiedDate(dateString:string){
    let date = moment(dateString, "DD/MM/YYYY HH:mm:ss");
    if(date.isSame(moment(),'day')){
      return "Today " + date.format('h:mm a');
    }
    if(date.isSame(moment().subtract(1,"days"),'day')){      
      return "Yesterday " + date.format('h:mm a');
    }
    return date.format('Do MMM YYYY h:mm a');
  }
  doRefresh(event:any) {
   this.pageNo = 0;
   this.pageSize = 10;
   this.config["totalItems"] = 0;
   this.config["currentPage"] = this.pageNo+1;
   this.config["itemsPerPage"] = this.pageSize;
   this.getNotifications(this.pageNo,this.pageSize);
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

}
