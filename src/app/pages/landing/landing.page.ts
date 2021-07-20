import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ReportRequirementPage } from 'src/app/modals/report-requirement/report-requirement.page';
import { SendQuotePage } from 'src/app/modals/send-quote/send-quote.page';
import { ChatroomService } from 'src/app/services/chatroom.service';
import { RegisterLoginService } from 'src/app/services/register-login.service';
import { RequirementService } from 'src/app/services/requirement.service';
import { VendorService } from 'src/app/services/vendor.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage implements OnInit {

  color:string = "rgba(255,255,255,0.2)";
  darkColor:string = "rgba(0,0,0,0.1)";
  isGettingRequirements:boolean = true;
  requirements:any[] = [];
  categories:any[] = [];
  pageNo:number = 0;
  pageSize:number = 3;
  messageCount:string = "";
  getRecievedMessagesSubscription:Subscription;
  vendorDetails:any = "";
  isGettingAnnouncements:boolean = false;  
  isGettingCounts:boolean = false; 
  isGettingRequirementsSuccess:boolean = true;
  dateForExpiryAsString:string = "0";
  announcements:any[] = [];
  constructor(
    private vendorService:VendorService,    
    private snackBar:MatSnackBar,
    private requirementService:RequirementService,
    private registerLoginService:RegisterLoginService,
    private modalController:ModalController,
    private chatService:ChatroomService
  ) { }

  ngOnInit(): void {        
  }
  ionViewWillEnter(){
    this.getAnnouncements();
    this.getCategories(); 
    this.getVendorProfileDetails();
    this.getRecievedMessagesSubscription = this.chatService.getRecievedMessages().subscribe(res =>{
      this.setMessageUnreadCount();
    });
  }
  ionViewWillLeave(){
    this.getRecievedMessagesSubscription.unsubscribe();
 }
 getVendorProfileDetails(){
  this.isGettingCounts = true;
  this.registerLoginService.getVendorBasicDetails(localStorage.getItem("vid")).subscribe(res=>{
    if(res["success"]){
      this.vendorDetails = res["data"];
      this.setMessageUnreadCount();
      this.setDaysLeft();
    }
  },error=>{
    console.log(error);
  });
  }
  setMessageUnreadCount(){
    this.chatService.getMessagesUnreadCount(localStorage.getItem("vid")).subscribe(res=>{
      this.isGettingCounts = false;
      if(res["success"]){
        this.messageCount = res["data"]>50?"50+":res["data"];
      }else{
        this.messageCount = "";
      }
    }); 
  }
  getAnnouncements(){
    this.isGettingAnnouncements = true;
    this.vendorService.getAnnouncements().subscribe(res=>{
      this.isGettingAnnouncements = false;
      if(res["success"]){
        this.announcements = res["data"];
      }else{
        this.announcements.push({
          message:"No announcements yet..."
        });
      }
    },error=>{
      console.log(error);
    })
  } 
  ngOnDestroy():void{
    
  }
  showSnackbar(content:string,hasDuration:boolean,action:string){
    const config = new MatSnackBarConfig();
    if(hasDuration){
      config.duration = 3000;
    }
    config.panelClass = ['snackbar-styler'];
    return this.snackBar.open(content, action, config);
  }
  getCategories(){
    this.isGettingRequirements = true;
    this.registerLoginService.getCategories().subscribe(res=>{
      if(res["success"]){
        this.categories = res["data"];
        this.getRequirements(0,this.pageSize);
      }else{
        this.isGettingRequirements = false;
        this.isGettingRequirementsSuccess = false;
      }
    },error=>{
      this.showSnackbar("Server error",true,"close");
      this.isGettingRequirements = false;
      this.isGettingRequirementsSuccess = false;
    });
  }  
  getRequirements(pageNo:number,pageSize:number){
    this.isGettingRequirements = true;
    this.requirementService.getRequirements(localStorage.getItem("vid"),this.pageNo,this.pageSize).subscribe(res=>{
      this.isGettingRequirements = false;
      if(res["success"]){
        this.requirements = res["data"]["content"];
        this.requirements.map(obj=>{
          let categoryName = this.categories.filter(category=>{
            return category.categoryId == obj.categoryId;
          })[0]["categoryName"];
          return obj.categoryId = categoryName;
        });   
      }else{
        this.isGettingRequirementsSuccess = false;
      }
    },error=>{
      this.isGettingRequirements = false;
      this.isGettingRequirementsSuccess = false;
    });
  }
  
  async sendQuote(requirementId:string,event:any){
      event.stopPropagation();
      event.preventDefault();
      const modal = await this.modalController.create({
        component: SendQuotePage,
        componentProps:{
          "requirementId":requirementId
        }
      });   
      modal.onDidDismiss().then((data) => {
        if(data['data']['isSubmitted']){
          this.showSnackbar("Quote send successfully!",true,"close");
        }
      });      
      return await modal.present();
  }
  async reportRequirement(requirementId:string){
    const modal = await this.modalController.create({
      component: ReportRequirementPage,
      componentProps:{
        "requirementId":requirementId
      }
    });   
    modal.onDidDismiss().then((data) => {
      if(data['data']['isReported']){
        this.showSnackbar("Requirement reported successfully!",true,"close");
      }
    });      
    return await modal.present();    
  }
  pageChange(newPage: number){
    this.pageNo = newPage-1;
    this.getRequirements(this.pageNo,this.pageSize);
  }
  setDaysLeft() {
    let startDate = new Date();
    let endDate = new Date(Number(this.vendorDetails.packageExpiryDate.split("/")[2]),Number(this.vendorDetails.packageExpiryDate.split("/")[1])-1,Number(this.vendorDetails.packageExpiryDate.split("/")[0]));
    const oneDay = 1000 * 60 * 60 * 24;  
    let start = Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
    let end = Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());  
    let diff = (start - end) / oneDay;
    if(diff<0){
      this.dateForExpiryAsString = "0";
    }else{
      this.dateForExpiryAsString = diff.toString();
    }
  }
  getImagePath(image:any){
    if((image)&&(image!="")){
      return encodeURIComponent(image);
    }
    return encodeURIComponent("default.jpg");
  }
  doRefresh(event:any) {
    this.pageNo = 0;
    this.pageSize = 3;
    this.isGettingRequirements = true;
    this.isGettingRequirementsSuccess = true;
    this.isGettingAnnouncements = true;
    this.isGettingCounts = true;
    this.requirements = [];
    this.categories = [];
    this.announcements = [];
    this.messageCount = "";
    this.vendorDetails = "";
    this.dateForExpiryAsString = "0";
    this.getAnnouncements();
    this.getCategories();
    this.getVendorProfileDetails();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

}
