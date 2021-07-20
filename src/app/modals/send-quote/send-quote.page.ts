import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ModalController } from '@ionic/angular';
import { RequirementService } from 'src/app/services/requirement.service';

@Component({
  selector: 'app-send-quote',
  templateUrl: './send-quote.page.html',
  styleUrls: ['./send-quote.page.scss'],
})
export class SendQuotePage implements OnInit {
  @Input('requirementId') requirementId:any;
  color:string = "rgba(255,255,255,0.2)";
  darkColor:string = "rgba(0,0,0,0.1)";
  quoteFilename:string = "";
  isSending:boolean = false;

  quoteFile:File=null;

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
  sendQuote(){
    if(this.quoteFile){
       this.isSending = true;
       this.showSnackbar("Please be patient! uploading quote...",false,"");
       let paramData = {};       
       paramData["requirementId"] = this.requirementId;
       paramData["vendorId"] = localStorage.getItem("vid");
       const uploadData = new FormData();
       uploadData.append('quote', this.quoteFile);
       uploadData.append('quoteDTO',new Blob([JSON.stringify(paramData)], { type: "application/json"}));
       this.requirementService.sendQoute(uploadData).subscribe(res=>{
          this.isSending = false;
          if(res["success"]){
            this.quoteFile = null;
            this.dismiss(true);
          }else{
            this.showSnackbar("Server error!",true,"close");
          }
       },error=>{  
        this.isSending = false;       
        this.showSnackbar("Connection error!",true,"close");
       });
    }else{
      this.showSnackbar("Please select a quote file",true,"close");
    }
  }

  onQuoteSelect(event:any,fileInput:any){
    this.quoteFile = event.target.files[0];
    this.quoteFilename = this.quoteFile.name;
  }
  dismiss(isSuccess:boolean){
    this.modalController.dismiss({
      'isSubmitted': isSuccess
    });
  } 
}
