import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController } from 'ionic-angular';
import { Response } from '@angular/http';
import { DataStorageService } from '../../app/services/data-storage.service';
import { QuizService } from '../../app/services/quiz.service';
import { QuizesListPage } from '../quizes-list/quizes-list';

/**
 * Generated class for the QuizSavePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-quiz-save',
  templateUrl: 'quiz-save.html',
})
export class QuizSavePage implements OnInit {

  actionTitle:string='Save';
  isSaveAction:boolean=true;

  constructor(public viewCtrl: ViewController,public navCtrl: NavController, public navParams: NavParams,private dataStorageService:DataStorageService,private quizService:QuizService) {
  }


  ngOnInit() {

    this.isSaveAction = this.navParams.get('isSaveAction');

    if(this.isSaveAction)
      this.actionTitle='Save';
    else
      this.actionTitle='Download';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad QuizSavePage');
  }

  onClickCancel() {
    //this.viewCtrl.dismiss();
    this.navCtrl.pop();
}


  onClickSaveQuizList(usernameInput:string) {
   

     if(!usernameInput){
       alert("Please enter username");
       return;
     }
 
     this.dataStorageService.storeQuizesList(usernameInput)
       .subscribe(
         (response: Response) => {
           console.log(response);
           this.navCtrl.push(QuizesListPage);
         }
       );
   }
 
 
   onClickRetrieveQuizList(usernameInput:string){
   
   
      if(!usernameInput){
        alert("Please enter username");
        return;
      }
      
      
  
        console.log("onClickRetrieveQuizList");
      this.dataStorageService.getDBQuizesList(usernameInput);
      this.navCtrl.push(QuizesListPage);

     
      
   }
 

}
