import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ModalController } from '@ionic/angular';
import { AgentService } from 'src/app/services/agent.service';

@Component({
  selector: 'app-refferal-code',
  templateUrl: './refferal-code.page.html',
  styleUrls: ['./refferal-code.page.scss'],
})
export class RefferalCodePage implements OnInit {
  title:string = "Add Agent Via Code";
  color:string = "rgba(255,255,255,0.2)";
  darkColor:string = "rgba(0,0,0,0.1)";
  isProcessing:boolean = false;
  code = new FormControl("",Validators.required);

  constructor(
    public modalController:ModalController,
    private snackBar: MatSnackBar,
    private agentService:AgentService
  ) { }

  ngOnInit() {
  }
  dismiss(isAgent:boolean,data:any){
    this.modalController.dismiss({
      'isAgent': isAgent,
      'agent':data
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

  addAgent(){
    if(this.code.valid){
       this.isProcessing = true;
       this.agentService.checkRefferalCode(this.code.value).subscribe(res=>{
          this.isProcessing = false;
          if(res["success"]){
            this.showSnackbar("Agent Selected!",true,"close");
            this.dismiss(true,res["data"]);           
          }else{
            this.showSnackbar("No Agent With This Refferal Code!",true,"close");
          }
       },error=>{  
        this.isProcessing = false;   
        this.showSnackbar("No Agent With This Refferal Code!",true,"close");
       });
    }else{
      this.showSnackbar("Please enter a refferal code",true,"close");
    }
  }

}
