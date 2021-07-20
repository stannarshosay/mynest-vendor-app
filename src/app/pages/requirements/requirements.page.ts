import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ModalController, NavController } from '@ionic/angular';
import { ReportRequirementPage } from 'src/app/modals/report-requirement/report-requirement.page';
import { SendQuotePage } from 'src/app/modals/send-quote/send-quote.page';
import { RegisterLoginService } from 'src/app/services/register-login.service';
import { RequirementService } from 'src/app/services/requirement.service';

@Component({
  selector: 'app-requirements',
  templateUrl: './requirements.page.html',
  styleUrls: ['./requirements.page.scss'],
})
export class RequirementsPage implements OnInit {
  color:string = "rgba(255,255,255,0.2)";
  darkColor:string = "rgba(0,0,0,0.1)";
  selectedTab:number = 0;
  isGettingRequirements:boolean = true;
  isGettingRequirementsSuccess:boolean = true;
  requirements:any[] = [];
  categories:any[] = [];
  pageNo:number = 0;
  pageSize:number = 9;
  config:any = {};
  constructor(
    private snackBar:MatSnackBar,
    private requirementService:RequirementService,
    private registerLoginService:RegisterLoginService,
    private modalController:ModalController
  ) { }

  ngOnInit(): void {   
  }
  ionViewWillEnter(){
    this.config["totalItems"] = 0;
    this.config["currentPage"] = this.pageNo+1;
    this.config["itemsPerPage"] = this.pageSize;
    this.getCategories(); 
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
    this.registerLoginService.getCategories().subscribe(res=>{
      if(res["success"]){
        this.categories = res["data"];
        this.getRequirements(0,this.pageSize);
      }
    },error=>{
      this.showSnackbar("Server error",true,"close");
    });
  }
  getRequirements(pageNo:number,pageSize:number){
    this.isGettingRequirements = true;
    this.config["totalItems"] = 0;
    this.config["currentPage"] = pageNo+1;
    this.config["itemsPerPage"] = pageSize;
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
        this.config["totalItems"] = res["data"]["totalElements"]; 
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
  getImagePath(image:any){
    if((image)&&(image!="")){
      return encodeURIComponent(image);
    }
    return encodeURIComponent("default.jpg");
  }
  doRefresh(event:any) {
    this.config = {}

    this.pageNo = 0;
    this.pageSize = 9;
    this.config["totalItems"] = 0;
    this.config["currentPage"] = this.pageNo+1;
    this.config["itemsPerPage"] = this.pageSize;
    this.selectedTab = 0;
    this.isGettingRequirements = true;

    this.isGettingRequirementsSuccess = true;

    this.requirements = [];
    this.categories = [];
    this.getCategories();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

}
