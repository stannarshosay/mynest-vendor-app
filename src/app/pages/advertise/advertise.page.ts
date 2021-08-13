import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { AdvertisementService } from 'src/app/services/advertisement.service';
import { RegisterLoginService } from 'src/app/services/register-login.service';
import  'capacitor-razorpay';
import { Plugins } from '@capacitor/core';
const { Checkout } = Plugins;
import moment from 'moment';
import { MatSelect } from '@angular/material/select';
import { Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-advertise',
  templateUrl: './advertise.page.html',
  styleUrls: ['./advertise.page.scss'],
})
export class AdvertisePage implements OnInit {
  @ViewChild('categorySelect') private categorySelect:MatSelect;
  @ViewChild('locationSelect') private locationSelect:MatSelect;
  totalAmount:number = 0;
  isLoadingSlots:boolean = false;
  isBooking:boolean = false;
  orderId:string;
  isLoadingCategoriesAndLocations:boolean = false;
  categories:any[] = [];
  locations:any[] = [];
  slots:any[] = [];
  selectedSlots:any[] = [];
  options:any = {};
  slotsForm: FormGroup;
  backButtonSubscription:Subscription;
  constructor(
    private registerLoginService:RegisterLoginService,
    private adService:AdvertisementService,
    private snackBar:MatSnackBar,
    private fb:FormBuilder,
    public platform:Platform
  ) { }

  ngOnInit(): void {
    this.options = {
      "key": "rzp_test_AH9Z2L7Vuospz9",
      "amount": "50000",
      "currency": "INR",
      "name": "MyNest",
      "description": "Purchase your slots",
      "image": "https://mynestonline.com/vendor/assets/images/main-logo.png",     
      "prefill": {
          "name": localStorage.getItem("vname")
          // "email": "gaurav.kumar@example.com",
          // "contact": "9999999999"
      },      
      "theme": {
          "color": "#039eba"
       }
    };
    this.slotsForm = this.fb.group({
      categoryId:['',Validators.required],
      district:['',Validators.required]
    });
  }
  ionViewWillEnter(){
    this.getCategoryAndLocations();
  }
  ionViewDidEnter(){
    this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(10, (processNextHandler) => {
      if(this.categorySelect.panelOpen||this.locationSelect.panelOpen){
        this.categorySelect.close();
        this.locationSelect.close();
      }else{
        processNextHandler();
      }
    });
  }
  ionViewWillLeave(){
    this.backButtonSubscription.unsubscribe();
  }
  getCategoryAndLocations(){
    this.isLoadingCategoriesAndLocations = true;
    this.registerLoginService.getCategories().subscribe(res=>{
      if(res["success"]){
        this.categories = res["data"];
        this.slotsForm.get("categoryId").setValue(this.categories[0].categoryId);
        this.registerLoginService.getAllLocations().subscribe(res=>{
          if(res["success"]){
            this.locations = res["data"];
            this.isLoadingCategoriesAndLocations = false;            
            this.slotsForm.get("categoryId").setValue(String(this.categories[0].categoryId));
            this.slotsForm.get("district").setValue(this.locations[0].district);
            this.loadSlots();
          }else{
            this.showSnackbar("Server error!",true,"close");
          }
        },error=>{
          this.showSnackbar("Connection error!",true,"close");
        });
      }else{
        this.showSnackbar("Server error!",true,"close");
      }
    },error=>{
      this.showSnackbar("Connection error!",true,"close");
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

  loadSlots(){    
    this.isLoadingSlots = true;
    this.slots = [];
    let param = {};
    param = this.slotsForm.value;
    param["adType"] = "SERVICE_LISTING"; 
    this.adService.getAllSlots(param).subscribe(res=>{
      this.isLoadingSlots = false;
      if(res["success"]){
        this.slots = res["data"];
      }else{
        this.showSnackbar("Oops! No slots available",true,"close");
      }
    },error=>{
      this.isLoadingSlots = false;
      this.showSnackbar("Connection error!",true,"close");
    });
  }
  toggleSlot(event:any,slot:any){
     if(event.target.checked){
      this.selectedSlots.push(slot);
      this.totalAmount = this.totalAmount + Number(slot.price);
     }else{
      let index = this.selectedSlots.findIndex((obj)=>{
        return obj.slotId == slot.slotId;
      });
      this.selectedSlots.splice(index,1);
      this.totalAmount = this.totalAmount - Number(slot.price);
     }
  }  
  async loadCheckout() {   
    try {
       let data = (await Checkout.open(this.options));
       this.verifyAndBookSlots(JSON.parse(data['response']));
    } catch (error) {
      console.log(error['description']);
      this.isBooking = false;
      this.showSnackbar("Payment gateway not intialized, Try again!",true,"close");
    }
  }
  verifyAndBookSlots(response:any){
    this.isBooking = true;
    this.showSnackbar("Please wait verifying payment...",false,"");
    let params = {};
    params["slotIds"] = this.selectedSlots.map((obj)=>{
      return obj.slotId;
    });
    params["vendorId"] = localStorage.getItem("vid");
    params["paymentId"] = response.razorpay_payment_id;
    params["orderId"] = this.orderId;
    params["signature"] = response.razorpay_signature;
    this.adService.bookSlotIds(params).subscribe(res=>{
        this.isBooking = false;
          if(res["success"]){
            this.showSnackbar("Booked successfully, Upload ads in My Ads section!",true,"close");
            window.scroll(0,0);
            this.loadSlots();
            this.totalAmount = 0;
            this.selectedSlots = [];
            this.orderId = null;
          }else{
            this.showSnackbar("Internal Server Error!",true,"close");
          }
      },error=>{
        this.isBooking = false;
        this.showSnackbar("Connection Error!",true,"close");
      });
    }
  
  bookSlots(){
    this.isBooking = true;
    this.showSnackbar("Please wait...",false,"");
    let params = {};
    params["totalPrice"] = this.totalAmount;
    params["vendorId"] = localStorage.getItem("vid");
    params["orderType"] = "ADVERTISEMENT";
    this.registerLoginService.createOrder(params).subscribe(res=>{
      if(res["success"]){
        this.showSnackbar("Please complete payment!",true,"close");
        this.orderId = res["data"]["orderId"]; 
        this.options["amount"] = this.totalAmount+"00";
        this.options["order_id"] = this.orderId;
        this.loadCheckout();
      }else{
        this.isBooking = false;
        this.showSnackbar("Connection Error!",true,"close");
      }
    },error=>{
      this.showSnackbar("Connection Error!",true,"close");
      this.isBooking = false;
    });    
  }
  getBeautifiedDate(dateString:string){
    return moment(dateString, "DD/MM/YYYY").format('Do MMM YYYY');
  }
  doRefresh(event:any) {
  this.totalAmount = 0;
  this.isLoadingSlots = false;
  this.isBooking = false;
  this.orderId = null;
  this.isLoadingCategoriesAndLocations = false;
  this.categories = [];
  this.locations = [];
  this.slots = [];
  this.selectedSlots = [];
  this.getCategoryAndLocations();

     setTimeout(() => {
       event.target.complete();
     }, 2000);
   }
}
