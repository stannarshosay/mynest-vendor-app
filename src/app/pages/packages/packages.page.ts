import { Component, NgZone, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { RegisterLoginService } from 'src/app/services/register-login.service';
import { VendorService } from 'src/app/services/vendor.service';
declare var jQuery: any;
import { Checkout } from 'capacitor-razorpay';
@Component({
  selector: 'app-packages',
  templateUrl: './packages.page.html',
  styleUrls: ['./packages.page.scss'],
})
export class PackagesPage implements OnInit {
  showSpinner:boolean = false;
  color:string = "rgba(255,255,255,0.2)";
  darkColor:string = "rgba(0,0,0,0.1)"; 
  packages:any = [];
  isProcessing:boolean = false;
  vendorDetails:any;
  options:any = {};
  planChoosed:any;
  orderId:string = "";
  constructor(
    private registerLoginService:RegisterLoginService,
    private snackBar:MatSnackBar,
    private vendorService:VendorService
  ) { }
  ngOnInit(): void {
    this.options = {
      key: "rzp_test_AH9Z2L7Vuospz9",
      amount: "50000",
      currency: "INR",
      name: "MyNest",
      description: "Purchase your membership",
      image: "https://mynestonline.com/vendor/assets/images/main-logo.png",
      prefill: {
        name: localStorage.getItem("vname")
      },
      notes: {},
      theme: {
          color: "#039eba"
      }
    };
    this.getVendorDashboardDetails();    
  }
  showSnackbar(content:string,hasDuration:boolean,action:string){
    const config = new MatSnackBarConfig();
    if(hasDuration){
      config.duration = 3000;
    }
    config.panelClass = ['snackbar-styler'];
    return this.snackBar.open(content, action, config);
  }
  setCounter(){
    // jquery
    jQuery('#sl-packagecounter').countdown(this.vendorDetails.packageExpiryDate.split("/").reverse().join("/"), function(event) {
      var $this = jQuery(this).html(event.strftime('' +
          '<li><div class="sl-buyPackage__heading"><h3>%-D</h3><h6>Days</h6></div></li>' +
          '<li><div class="sl-buyPackage__heading"><h3>%H</h3><h6>Hours</h6></div></li>' +
          '<li><div class="sl-buyPackage__heading"><h3>%M</h3><h6>Minutes</h6></div></li>' +
          '<li><div class="sl-buyPackage__heading"><h3>%S</h3><h6>Seconds</h6></div></li>'
      ));
    });
  }
  getVendorDashboardDetails(){
    this.showSpinner = true;
    this.vendorService.getVendorDashboardDetails(localStorage.getItem("vid")).subscribe(res=>{
      if(res["success"]){
        this.vendorDetails = res["data"];
        this.setCounter();
        this.getPlans();        
      }else{
        this.showSpinner = false;
        this.showSnackbar("No Vendor details found!",true,"close");
      }
   },error=>{
     this.showSpinner = false;
     this.showSnackbar("Connection Error!",true,"close");
   });
  }

  getPlans(){
    this.registerLoginService.getAllPackages().subscribe(res=>{
       this.showSpinner = false;       
       if(res["success"]){
          this.packages = res["data"].filter(obj=>
           obj.membershipName != "Bronze"
          ).reverse();
       }else{
         this.showSnackbar("No Plan details found!",true,"close");
       }
    },error=>{
      this.showSpinner = false;
      this.showSnackbar("Connection Error!",true,"close");
    });
  }
  choosePackage(plan:any){
    this.planChoosed = plan;
    if(plan.sellingPrice !="0"){
        this.createOrderAndAcceptPayment();        
    }else{
      this.saveMembershipForFree();
    }
  }
  async loadCheckout() {   
    try {
       let data = (await Checkout.open(this.options));
       this.saveMembership(data.response);
    } catch (error) {
      console.log(error['description']);
      this.isProcessing = false;
      this.showSnackbar("Payment gateway not intialized, Try again!",true,"close");
    }
  }
  createOrderAndAcceptPayment(){
    this.isProcessing = true;
    this.showSnackbar("Please wait...",false,"");
    let that = this;
    let params = {};
    params["totalPrice"] = this.planChoosed.sellingPrice;
    params["vendorId"] = localStorage.getItem("vid");
    params["orderType"] = "MEMBERSHIP";
    this.registerLoginService.createOrder(params).subscribe(res=>{
      this.isProcessing = false;
      if(res["success"]){
        this.showSnackbar("Please complete payment!",true,"close");
        this.orderId = res["data"]["orderId"]; 
        this.options["amount"] = this.planChoosed.sellingPrice+"00";
        this.options["description"] = "Purchase "+this.planChoosed.membershipName+ " Membership";
        this.options["order_id"] = this.orderId;
        this.loadCheckout();       
      }else{
        console.log(res);
        this.showSnackbar("Connection Error!",true,"close");
      }
    },error=>{
      this.showSnackbar("Connection Error!",true,"close");
      this.isProcessing = false;
    });    
  }
  saveMembershipForFree(){
    this.isProcessing = true;
    this.showSnackbar("Please wait...",false,"");
    let params = {};
    params["membershipId"] = this.planChoosed.membershipId;
    params["vendorId"] = localStorage.getItem("vid");
    this.registerLoginService.setPackageSubscriptionForFree(params).subscribe(res=>{
      this.isProcessing = false;
        if(res["success"]){
          this.showSnackbar("Subscribed successfully!",true,"close");
          this.packages = [];
          window.scroll(0,0);
          this.getVendorDashboardDetails();
        }else{
          this.showSnackbar("Internal Server Error!",true,"close");
        }
    },error=>{
      this.isProcessing = false;
      this.showSnackbar("Connection Error!",true,"close");
    });
  }
  saveMembership(response:any){
    this.isProcessing = true;
    this.showSnackbar("Please wait verifying payment...",false,"");
    let params = {};
    params["membershipId"] = this.planChoosed.membershipId;
    params["vendorId"] = localStorage.getItem("vid");
    params["paymentId"] = response.razorpay_payment_id;
    params["orderId"] = this.orderId;
    params["signature"] = response.razorpay_signature;
    this.registerLoginService.setPackageSubscription(params).subscribe(res=>{
      this.isProcessing = false;
        if(res["success"]){
          this.showSnackbar("Subscribed successfully!",true,"close");
          this.packages = [];
          window.scroll(0,0);
          this.getVendorDashboardDetails();
        }else{
          this.showSnackbar("Internal Server Error!",true,"close");
        }
    },error=>{
      this.isProcessing = false;
      this.showSnackbar("Connection Error!",true,"close");
    });
  }

}
