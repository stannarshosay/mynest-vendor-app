import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ModalController } from '@ionic/angular';
import { GetAdLinkPage } from 'src/app/modals/get-ad-link/get-ad-link.page';
import { AdvertisementService } from 'src/app/services/advertisement.service';
import moment from 'moment';
@Component({
  selector: 'app-advertisements',
  templateUrl: './advertisements.page.html',
  styleUrls: ['./advertisements.page.scss'],
})
export class AdvertisementsPage implements OnInit {

  color:string = "rgba(255,255,255,0.2)";
  darkColor:string = "rgba(0,0,0,0.1)";
  isGettingSlots:boolean = true;
  isGettingSlotsSuccess:boolean = true;
  isUploading:boolean = false;
  adProgress:number = 0;
  adFile:File=null;
  adId:string;
  slots:any[] = [];
  link:any = null;

  constructor(
    private snackBar:MatSnackBar,
    private adService:AdvertisementService,
    private modalController:ModalController
  ) { }

  ngOnInit(): void {
  }
  ionViewWillEnter(){
    this.getSlots();
  }
  showSnackbar(content:string,hasDuration:boolean,action:string){
    const config = new MatSnackBarConfig();
    if(hasDuration){
      config.duration = 3000;
    }
    config.panelClass = ['snackbar-styler'];
    return this.snackBar.open(content, action, config);
  }
  getSlots(){
    this.isGettingSlots = true;
    this.isGettingSlotsSuccess = true;    
    this.adService.getBookedSlots(localStorage.getItem("vid")).subscribe(res=>{
      this.isGettingSlots = false;
      if(res["success"]){
        this.slots = res["data"];        
      }else{
        this.isGettingSlotsSuccess = false;
      }
    },error=>{
      this.isGettingSlots = false;
      this.isGettingSlotsSuccess = false;
    });
  }
  async onAdSelect(event:any,vendorAdId:string){
    this.adFile = event.target.files[0];
    if(this.adFile){  
      const modal = await this.modalController.create({
        showBackdrop: true,
        cssClass: 'login-otp-modal',
        component: GetAdLinkPage,
        backdropDismiss:false
      });
      modal.onDidDismiss().then((data) => {
        this.link = data['data']['link'];
        this.uploadAdPic(vendorAdId);
      });
      return await modal.present();
    }
  }
  uploadAdPic(vendorAdId:string){
    this.adId = vendorAdId;
    this.isUploading =true;
    this.showSnackbar("Please be patient! uploading ad pic...",true,"okay");
    const uploadData = new FormData();
    uploadData.append('adPic', this.adFile);
    this.adService.uploadAdPic(uploadData,vendorAdId,this.link).subscribe(
    (event: HttpEvent<any>) => {
      switch (event.type) {
        case HttpEventType.Sent:
          this.adProgress = 1;
          break;
        case HttpEventType.ResponseHeader:
          break;
        case HttpEventType.UploadProgress:
          this.adProgress = Math.round(event.loaded / event.total * 100);
          break;
        case HttpEventType.Response:
          this.isUploading = false;
          if(event.body["success"]){
            this.showSnackbar("Uploaded Ad pic",true,"close");            
            this.adFile = null;
            this.link = null;
            this.getSlots();
          }else{
            this.showSnackbar("Server error",true,"close");
          }
          setTimeout(() => {
            this.adProgress = 0;
          }, 1500);
          break;
        default:
          this.adProgress = 0;
          return `Unhandled event: ${event.type}`;
      }
    },error=>{
        console.log(error);
        this.adProgress = 0;
        this.isUploading = false;
        this.showSnackbar("Connection Error!",true,"close");
    }); 
}
getBeautifiedDate(dateString:string){
  return moment(dateString, "DD/MM/YYYY").format('Do MMM YYYY');
}
  doRefresh(event:any) {
  this.isGettingSlots = true;
  this.isGettingSlotsSuccess = true;
  this.isUploading = false;
  this.adProgress = 0;
  this.adFile =null;
  this.adId = null;
  this.link = null;
  this.slots = [];
    this.getSlots();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }
}
