import { Component,OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { QuizService } from '../../app/services/quiz.service';

/**
 * Generated class for the ToolsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-tools',
  templateUrl: 'tools.html',
})
export class ToolsPage implements OnInit {

  questionsMax:number=6;
  choicesMax:number=4;
   showAnswerAfterQuestion:boolean=false;
  optionsList:string[]=[];

  

  constructor(public navCtrl: NavController, public navParams: NavParams, private quizService:QuizService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ToolsPage');
  }

  ionViewWillLeave() {
    console.log("questionsMax: "+this.questionsMax);
    console.log("choicesMax: "+this.choicesMax);
    console.log("showAnswerAfterQuestion: "+this.showAnswerAfterQuestion);

    this.optionsList[0]=''+this.questionsMax;
    this.optionsList[1]=''+this.choicesMax;
    this.optionsList[2]=''+this.showAnswerAfterQuestion;

    this.quizService.setOptionsList(this.optionsList);
    

  }

  ngOnInit() {



    this.optionsList = this.quizService.getOptionsList();
    this.questionsMax = +this.optionsList[0];
   this.choicesMax = + this.optionsList[1];

   if( this.optionsList[2]==='true')
      this.showAnswerAfterQuestion = true;
   else
   this.showAnswerAfterQuestion = false;
    

  }

}
