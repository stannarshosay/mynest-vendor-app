import { Component, Input, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ModalController } from '@ionic/angular';
import { RequirementService } from 'src/app/services/requirement.service';

@Component({
  selector: 'app-report-requirement',
  templateUrl: './report-requirement.page.html',
  styleUrls: ['./report-requirement.page.scss'],
})
export class ReportRequirementPage implements OnInit {

  @Input('requirementId') requirementId:any;
  color:string = "rgba(255,255,255,0.2)";
  darkColor:string = "rgba(0,0,0,0.1)";

  reason = new FormControl("",Validators.required);
  isReporting:boolean = false;


  constructor(
    private snackBar:MatSnackBar,
    private requirementService:RequirementService,
    private modalController:ModalController
  ) { }

  ngOnInit(): void {
  }
  showSnackbar(content:string,hasDuration:boolean,action:string){
    const config = new MatSnackBarConfig();
    if(hasDuration){
      config.duration = 3000;
    }
    config.panelClass = ['snackbar-styler'];
    return this.snackBar.open(content, action, config);
  }  
  reportRequirement(){
    if(this.reason.valid){
       this.isReporting = true;
       let paramData = {};
       paramData["requirementId"] = this.requirementId;
       paramData["reportingVendorId"] = localStorage.getItem("vid");
       paramData["reason"] = this.reason.value;
       this.requirementService.reportRequirement(paramData).subscribe(res=>{
          this.isReporting = false;
          if(res["success"]){
            this.dismiss(true);
          }else{
            this.showSnackbar("Server error!",true,"close");
          }
       },error=>{  
        this.isReporting = false;       
        this.showSnackbar("Connection error!",true,"close");
       });
    }else{
      this.showSnackbar("Please specify a reason",true,"close");
    }
  }
  
  dismiss(isSuccess:boolean){
    this.modalController.dismiss({
      'isReported': isSuccess
    });
  }  
}
