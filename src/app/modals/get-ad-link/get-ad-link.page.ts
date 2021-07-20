import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-get-ad-link',
  templateUrl: './get-ad-link.page.html',
  styleUrls: ['./get-ad-link.page.scss'],
})
export class GetAdLinkPage implements OnInit {

  color:string = "rgba(255,255,255,0.2)";
  darkColor:string = "rgba(0,0,0,0.1)";
  link = new FormControl('',Validators.required);
  constructor(
    private snackBar:MatSnackBar,
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
  getLink(){
    if(this.link.valid){
      this.dismiss(this.link.value);
    }else{
       this.showSnackbar("Please enter a valid redirect link",true,"close");
    }
  }
  dismiss(link:any){
    this.modalController.dismiss({
      'link': link,
    });
  } 

}
