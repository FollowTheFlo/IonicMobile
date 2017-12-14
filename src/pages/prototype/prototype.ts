import { Component,OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the PrototypePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-prototype',
  templateUrl: 'prototype.html',
})
export class PrototypePage implements OnInit {

  link:string="";
  module:string="";
  title:string="";
  displayProto:boolean=true;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PrototypePage');
  }

  ngOnInit(){
    this.module = this.navParams.get('module');

    if(this.module=='JQueryApp'){
      this.displayProto=true;
      this.link='assets/QTW_Prototype_Code/index.html';
      this.title='Prototype Mobile App';
      
    }
    else{
      this.displayProto=false;
      this.link='https://flo-qtw.firebaseapp.com/';
      this.title='Web App';

    }


  }

}
