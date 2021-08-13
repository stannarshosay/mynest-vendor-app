import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { IonContent, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ChatroomService } from 'src/app/services/chatroom.service';
import moment from 'moment';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  @ViewChild('chatbox') private chatbox: IonContent;
  vendorId:any; 
  getRecievedMessagesSubscription:Subscription; 
  isGettingMessages:boolean = false;
  showNoMessages:boolean = false;
  messages:any[] = [];
  contactData:any = null;
  hasLoggedIn:boolean = false;
  contactTempForReload:boolean = null;
  messageControl:FormControl;
  quoteProgress:number = 0;
  quoteFilename:string = "";
  quoteFile:File=null;
  isUploading:boolean = false;
   constructor(
     private chatService:ChatroomService,
     private snackBar:MatSnackBar,
     private navController:NavController
   ) { }
   
   ngOnInit(): void {   
    this.messageControl = new FormControl('',Validators.required);
   }
   ionViewWillEnter(){
    this.vendorId = localStorage.getItem("vid");
    this.checkRecievedContactData();
    this.getRecievedMessagesSubscription = this.chatService.getRecievedMessages().subscribe(res=>{
       if(res!="no"){
         this.onRecieveMessage(res);
       }
    });
   }
   ngOnDestroy():void{     
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
   checkRecievedContactData(){
     if(this.chatService.hasContactData()){
       this.contactData =  this.chatService.getContactData();
       this.contactTempForReload = this.contactData;
       this.chatService.clearContactData();        
       this.getMessages(this.contactData.customerId);
     }else{
       this.isGettingMessages = false;
       this.showNoMessages = true;
       this.navController.navigateBack(['/home/tabs/chatroom']);
     }
   }
   getMessages(customerId:any){
     this.messages = [];
     this.showNoMessages = false;
     this.isGettingMessages = true;
     this.chatService.getMessagesByCustomerAndVendorId(this.vendorId,customerId).subscribe(res=>{
        this.isGettingMessages = false;
        if(res["success"]){
           this.messages = res["data"].reverse();
           this.scrollToBottom();
           this.chatService.hasRecievedMessage.next("no");
        }else{
          this.showNoMessages = true;
        }
     },error=>{
       this.isGettingMessages = false;
       this.showNoMessages = true;
       this.showSnackbar("Connection error!",true,"close");      
     });
   }
   getMessagesToUpdateUnreadCount(customerId:any){
     this.chatService.getMessagesByCustomerAndVendorId(this.vendorId,customerId).subscribe(res=>{
       if(res["success"]){
         this.chatService.hasRecievedMessage.next("no");
       }
     });
   } 
 
  sendQuoteMessage(){
   let message = {
     customerId: Number(this.contactData.customerId),
     vendorId: Number(this.vendorId),
     senderId: this.vendorId,
     recipientId: this.contactData.customerId,
     content: this.quoteFilename,
     messageType:"FILE"
   }; 
   if(this.chatService.sendMessage(message)){
     this.showNoMessages = false;
     let date = this.getFormattedDate();     
     message["sentTime"] = date;
     this.messages.push(message);  
     setTimeout(()=>{
      this.chatService.hasRecievedMessage.next("no");
     },5000); 
   }
  }  
   sendMessage(){
     if(this.messageControl.valid){
      let message = {
        customerId: Number(this.contactData.customerId),
        vendorId: Number(this.vendorId),
        senderId: this.vendorId,
        recipientId: this.contactData.customerId,
        content: this.messageControl.value,
        messageType:"TEXT"
      }; 
       if(this.chatService.sendMessage(message)){
         this.showNoMessages = false;
         let date = this.getFormattedDate();        
         message["sentTime"] = date;
         this.messages.push(message);  
         this.messageControl.setValue(""); 
         this.scrollToBottom();
         setTimeout(()=>{
          this.chatService.hasRecievedMessage.next("no");
         },5000);
       }  
     }else{
       this.showSnackbar("No message to send!",true,"okay");
     }
   }
   onQuoteSelect(event:any){
    var _size = event.target.files[0].size;
    var fSExt = new Array('Bytes', 'KB', 'MB', 'GB'),i=0;
        while(_size>900)
        {
          _size/=1024;
          i++;
        }
    if((((Math.round(_size*100)/100)>3)&&(i==2))||(i==3)){
      this.showSnackbar("File size is larger than 3 MB",true,"okay");
    }else{
      this.quoteFile = event.target.files[0];
      if(this.quoteFile){  
        this.uploadQuote(event);
      }  
    }     
  }
  uploadQuote(fileEvent:any){
    this.isUploading =true;
    this.showSnackbar("Please be patient! sending quote...",true,"okay");
    const uploadData = new FormData();
    uploadData.append('quote', this.quoteFile);
    this.chatService.uploadQuote(uploadData).subscribe((event: HttpEvent<any>) => {
      switch (event.type) {
        case HttpEventType.Sent:
          this.quoteFilename = "";
          this.quoteProgress = 1;
          break;
        case HttpEventType.ResponseHeader:
          break;
        case HttpEventType.UploadProgress:
          this.quoteProgress = Math.round(event.loaded / event.total * 100);
          break;
        case HttpEventType.Response:
          this.isUploading = false;
          if(event.body["success"]){
            this.showSnackbar("Send quote successfully",true,"close");            
            this.quoteFilename = event.body["data"]; 
            this.sendQuoteMessage();   
          }else{
            this.showSnackbar("Server error",true,"close");
          }
          setTimeout(() => {
            this.quoteProgress = 0;
          }, 1500);
          break;
        default:
          this.quoteProgress = 0;
          return `Unhandled event: ${event.type}`;
      }
    },error=>{
        this.quoteProgress = 0;
        this.isUploading = false;
        this.showSnackbar("Connection Error!",true,"close");
    });
  }
   onRecieveMessage(message:any){   
     if(message.senderId == this.contactData.customerId){
       this.messages.push(message);
       this.getMessagesToUpdateUnreadCount(this.contactData.customerId);
     }else{
       this.chatService.hasRecievedMessage.next("no");
     }      
   }
   getImagePath(path:string){
     if((path)&&(path!="")){
       return encodeURIComponent(path);
     }
     return encodeURIComponent("default.jpg");
   }
   downloadChatQuote(filePath:string){
     if((filePath)&&(filePath!="")){
       window.open(
         'https://mynestonline.com/collection/images/chat-quotes/'+encodeURIComponent(filePath),
         '_blank'
       );
     }else{
       this.showSnackbar("No qoute found!",true,"close");
     }
   }
   checkLength(message:string){    
     if(message.length>15){
       return message.substring(0,15) +" ...";
     }
     return message;
  }
   getFormattedDate() {
     return moment().format("DD/MM/YYYY HH:mm:ss");
   } 
   scrollToBottom(): void {
     try {
       setTimeout(()=>{
        this.chatbox.scrollToBottom(300);
       },500);
     } catch(err) { 
       console.log("error on scroll to bottom : "+err);
     }                 
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
    this.contactData = null;
    this.chatService.setContactData(this.contactTempForReload);
    this.contactTempForReload = null;
    this.quoteProgress = 0;
    this.quoteFilename = "";
    this.quoteFile =null;
    this.isUploading = false;  
    this.checkRecievedContactData();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
   }
}
