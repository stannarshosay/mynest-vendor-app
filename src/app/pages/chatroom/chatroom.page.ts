import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ChatroomService } from 'src/app/services/chatroom.service';
import moment from 'moment';
@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.page.html',
  styleUrls: ['./chatroom.page.scss'],
})
export class ChatroomPage implements OnInit {
  vendorId:any; 
  getRecievedMessagesSubscription:Subscription;
  isGettingContacts:boolean = false;
  showNoContacts:boolean = false;
  hasLoggedIn:boolean = false;
  contacts:any[] = [];
   constructor(
     private chatService:ChatroomService,
     private snackBar:MatSnackBar,
     private navController:NavController
   ) { }
   
   ngOnInit(): void {        
   }
   ionViewWillEnter(){
    this.vendorId = localStorage.getItem("vid");
    this.getAllContacts(); 
    this.getRecievedMessagesSubscription = this.chatService.getRecievedMessages().subscribe(res=>{
       if(res!="no"){
         this.onRecieveMessage(res);
       }else{
         this.getAllContacts();
       }
    });
   }
   ionViewWillLeave(){
    this.getRecievedMessagesSubscription.unsubscribe();
   }
   showSnackbar(content:string,hasDuration:boolean,action:string){
     const config = new MatSnackBarConfig();
     if(hasDuration){
       config.duration = 3000;
     }
     config.panelClass = ['snackbar-styler'];
     return this.snackBar.open(content, action, config);
   }
   getAllContacts(){
    this.isGettingContacts = true;
    this.chatService.getChatContactsByVendorId(this.vendorId).subscribe(res=>{
      this.isGettingContacts = false;
      if(res["success"]){
        this.contacts = res["data"];
      }else{
        this.showNoContacts = true;
      }
    },error=>{
      this.showNoContacts = true;
      this.isGettingContacts = false;
      this.showSnackbar("Connection error!",true,"close");
    });
  } 
   loadChatroom(contact:any){ 
     this.chatService.setContactData(contact);
     this.navController.navigateForward(["/chat"]);
   }
   onRecieveMessage(message:any){ 
    if(this.contacts.length){
      let index = this.contacts.findIndex(obj=>obj.customerId == message.senderId);   
      let contact = this.contacts[index];
      contact["lastMessageTime"] = message.sentTime;
      contact["lastMessage"] = message.content;
      this.contacts.splice(index,1);
      this.contacts.unshift(contact); 
    }else{
      this.getAllContacts();
    }
   }
   getImagePath(path:string){
     if((path)&&(path!="")){
       return encodeURIComponent(path);
     }
     return encodeURIComponent("default.jpg");
   }  
   checkLength(message:string){    
     if(message.length>15){
       return message.substring(0,15) +" ...";
     }
     return message;
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
    this.contacts = [];
    this.vendorId = localStorage.getItem("vid");
    this.isGettingContacts = false;
    this.showNoContacts = false;      
    this.getAllContacts();
     setTimeout(() => {
       event.target.complete();
     }, 2000);
   }
}
