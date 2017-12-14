import { Component,OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams,ModalController } from 'ionic-angular';
import { QuizService } from '../../app/services/quiz.service';
import { QuizSavePage } from '../quiz-save/quiz-save';
import { Quiz } from '../../app/models/quiz';

/**
 * Generated class for the InformationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

//@IonicPage()
@Component({
  selector: 'page-information',
  templateUrl: 'information.html',
})
export class InformationPage implements OnInit  {

  choicesMax:number=3;
  questionsMax:number=3;
  showAnswerAfterQuestion:boolean=false;
  optionsList:string[]=[];
  frChecked:boolean=false;
  enChecked:boolean=true;
  language:string="en";
  isQuizListEmpty:boolean=true;

  constructor(public navCtrl: NavController, public navParams: NavParams, private quizService:QuizService,public modalCtrl: ModalController) {
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

    
    
        console.log('ionViewWillLeave LanguagePage, language: '+this.language);

  }

  ngOnInit() {
    console.log('InformationPage onInit');
this.language = this.quizService.getLanguage();

    if(this.language==="en")
    {
    this.enChecked =  true;
    this.frChecked= false;
    }
    else{
      this.enChecked =  false;
      this.frChecked= true;

    }

    this.optionsList = this.quizService.getOptionsList();
    this.questionsMax = +this.optionsList[0];
   this.choicesMax = + this.optionsList[1];

   if( this.optionsList[2]==='true')
      this.showAnswerAfterQuestion = true;
   else
   this.showAnswerAfterQuestion = false;
   
   ///////////////////
   this.isQuizListEmpty = this.quizService.isQuizListEmpty();
   console.log(' this.isQuizListEmpty: '+ this.isQuizListEmpty);
  // this.quizesList[0].toasts_list[0].subject_OK.article_name
   this.quizService.QuizChange
     .subscribe(
       (quizes: Quiz[]) => {
        
           console.log('quiz changed, isQuizListEmpty: '+this.isQuizListEmpty);
           this.isQuizListEmpty = this.quizService.isQuizListEmpty();
           
         }
         
       
     );

  }

  onClickRadioLanguage(language:string){
    console.log('Click language: '+language);
    this.language = language;
    this.quizService.setLanguage(this.language);
    //notice to other component that language was modified
    this.quizService.languageChanged.next();

  }

  onClickSave(){
    
      let isSaveAction:boolean=true;
      this.navCtrl.push(QuizSavePage,{isSaveAction});
    
      //let modal = this.modalCtrl.create(QuizSavePage,{isSaveAction});
     // modal.present();
    
    }
    
    onClickRetrieve(){
    
      let isSaveAction:boolean=false;
      this.navCtrl.push(QuizSavePage,{isSaveAction});
    
     // let modal = this.modalCtrl.create(QuizSavePage,{isSaveAction});
      //modal.present();
    
    }

}
