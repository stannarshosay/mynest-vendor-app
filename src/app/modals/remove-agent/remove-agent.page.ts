import { Component, Input, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ModalController } from '@ionic/angular';
import { AgentService } from 'src/app/services/agent.service';

@Component({
  selector: 'app-remove-agent',
  templateUrl: './remove-agent.page.html',
  styleUrls: ['./remove-agent.page.scss'],
})
export class RemoveAgentPage implements OnInit {

  @Input('agentId') agentId:any;
  color:string = "rgba(255,255,255,0.2)";
  darkColor:string = "rgba(0,0,0,0.1)";
  isRequesting:boolean = false;

  reason = new FormControl("",Validators.required);
  constructor(
    private snackBar:MatSnackBar,
    private modalController:ModalController,
    private agentService:AgentService

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
  requestRemoval(){
    if(this.reason.valid){
      this.isRequesting = true;
      this.agentService.deleteAgent("removal",this.agentId,localStorage.getItem("vid"),this.reason.value).subscribe(res=>{
         this.isRequesting = false;
         if(res["success"]){
           this.dismiss(true);
         }else{
           this.showSnackbar("Server error!",true,"close");
         }
      },error=>{  
       this.isRequesting = false;       
       this.showSnackbar("Connection error!",true,"close");
      });
    }else{
      this.showSnackbar("Please specify a reason",true,"close");
    }
}
  dismiss(isSuccess:boolean){
    this.modalController.dismiss({
      'isRemove': isSuccess
    });
  }  
}
