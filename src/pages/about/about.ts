import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { PrototypePage } from '../prototype/prototype';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  constructor(public navCtrl: NavController) {

  }

  onClickLaunchPrototype(module:string){

    //let link:string='assets/QTW_Prototype_Code/index.html';
    this.navCtrl.push(PrototypePage,{module});
  }

}
