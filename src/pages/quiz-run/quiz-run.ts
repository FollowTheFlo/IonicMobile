import { Component, OnInit} from '@angular/core';
import { Quiz } from '../../app/models/quiz';
import { Question } from '../../app/models/question';
import { Article } from '../../app/models/article';
import { QuizService } from '../../app/services/quiz.service';
import { QuestionService } from '../../app/services/question.service';
import { NavController, NavParams, ViewController,ToastController,AlertController  } from 'ionic-angular';
import { QuizesListPage } from '../quizes-list/quizes-list';
import {DomSanitizer} from '@angular/platform-browser';
import { QuestionsListPage } from '../questions-list/questions-list';
import { TranslateService } from '@ngx-translate/core';



@Component({
  selector: 'page-quiz-run',
  templateUrl: 'quiz-run.html'
})
export class QuizRunPage implements OnInit {

    quiz:Quiz;
    currentQuestionIndex:number=0;
    totalQuestions:number;
    currentQuestion:Question;
    NextButtonValue:string='Next';
    totalScoreString:string='';
    correctString:string="";
    CorrectionQuestion:Question;
    showAnswerAfterQuestion:boolean=false;
    lastQuestion:boolean=false;
    firstQuestion:boolean=true;


  constructor(private navParams: NavParams,
    public viewCtrl:ViewController,
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    private quizService:QuizService, 
    private questionService:QuestionService,
    private sanitizer:DomSanitizer,
    public toastCtrl: ToastController,
    private translate: TranslateService
  ) {

  }



  ngOnInit() {
    console.log("QuizRunPage: ngOnInit");

    this.lastQuestion=false;

    this.quiz = this.navParams.get('quiz');

    if(!this.quiz){
      //handle case where user lick Back after finisheing the quiz
      console.log("QuizRunPage: quiz null");
      this.navCtrl.push(QuizesListPage,);
      
    }

    console.log("this.quizService.getOptionsList()[2]: "+this.quizService.getOptionsList()[2]);

    //showAnswerAfterQuestion is set in index 2 of OptionList array
    if(this.quizService.getOptionsList()[2]==='true')
    {
      console.log("in true");
      this.showAnswerAfterQuestion=true;
    }
    else{
      console.log("in false");
      this.showAnswerAfterQuestion=false;
    }

    if(this.quiz)
    {
    console.log("QuizRunPage:  this.quiz: "+ this.quiz);
    this.totalQuestions = this.quiz.toasts_list.length;
    console.log("this.totalQuestions: "+this.totalQuestions);
    this.currentQuestionIndex=this.getIndexIfQuizResume();
    this.currentQuestion = this.quiz.toasts_list[this.currentQuestionIndex];
    this.CalculateTotalScore();

    if(this.quiz.toasts_list.length==1)
      this.lastQuestion=true; //display button with Finish label as only 1 question

}else{console.log("QuizRunPage:  this.quiz: NULL");}

    
  }


  ionViewWillLeave(){

    this.quizService.saveListonDevice().then()
    .catch(
      err => {
        console.log('quiz-run: error saving quiz list in device memory, err '+err);
      }
    );


    this.quizService.LeaveQuizPage.next();
  }

  showFinishMessage() {

    let finishQuiz:string="Finish Quiz?";
    let yes:string="Yes";
    let no:string="No";



    this.translate.get(['FINISH_QUIZ','YES','NO']).subscribe((translationRes: string) => {
      console.log(translationRes);
      console.log(translationRes['FINISH_QUIZ']);
      finishQuiz = translationRes['FINISH_QUIZ'];
      yes=translationRes['YES'];
      no=translationRes['NO'];

      //=> 'hello world'
  });

    let prompt = this.alertCtrl.create({
      title: finishQuiz,
           
      buttons: [
        {
          text: yes,
          handler: data => {
            console.log('Yes clicked');
            this.onClickFinish();
          }
        },
        {
          text: no,
          handler: data => {
            console.log('No clicked' );
            this.lastQuestion=true;
           
          }
        }
      ]
    });
    prompt.present();
  }

  presentToast(message:string) {
    let toast = this.toastCtrl.create({
      message: message ,
      duration: 3000,
      position: 'middle',
      showCloseButton:false
    });
    toast.present();
  }








 GetChoiceUserSelectionIndex()
 {
    console.log("QuizRunPage: GetChoiceUserSelectionIndex");
   let i:number=0;
   let selectedIndex:number=0;
   let wikiCorrectIndex:number=0;
   while(i<  this.currentQuestion.article_shuffle_list.length){
     if(this.currentQuestion.article_shuffle_list[i].user_answer==true)
     {
       selectedIndex= i;
     }

     if(this.currentQuestion.article_shuffle_list[i].wiki_correct==true)
     {
      wikiCorrectIndex= i;
     }


     i++;
   }

   if(this.currentQuestion.article_shuffle_list[selectedIndex].user_answer && this.currentQuestion.article_shuffle_list[selectedIndex].wiki_correct)
   {
     //correct answer
     this.correctString = "Correct!";
   }
   else{
     this.correctString = "Wrong! Correct answer is "+ (wikiCorrectIndex+1);

   }
   this.CorrectionQuestion = this.currentQuestion;

 }

 getIndexIfQuizResume():number
 {
    console.log("QuizRunPage: getIndexIfQuizResume");
 let i:number=0;
 let lastAnsweredQuestion:number=0;
 this.NextButtonValue='Next';

 while(i<this.quiz.toasts_list.length)
 {
   if(this.quiz.toasts_list[i].answered==true)
   {
     lastAnsweredQuestion = i;
   }
   i++;

 }

 if(lastAnsweredQuestion == this.quiz.toasts_list.length-1)
   this.NextButtonValue = 'Finish';

 return lastAnsweredQuestion;

 }

 onClickSelectQuestion(selectedChoiceIndex:number){
    console.log("QuizRunPage: onClickSelectQuestion");
       // alert(selectedChoiceIndex);
       
        this.ClearCurrentQuestionUserSelection();
        this.currentQuestion.article_shuffle_list[selectedChoiceIndex].user_answer=true;

       
        this.currentQuestion.answered=true;
        this.quiz.is_started=true;

        
        setTimeout(() => {this.onClickNextQuestion()} , 500);
        
      }

ClearCurrentQuestionUserSelection()
      {
        console.log("QuizRunPage: ClearCurrentQuestionUserSelection");
        let i:number=0;
        while(i<  this.currentQuestion.article_shuffle_list.length){
          this.currentQuestion.article_shuffle_list[i].user_answer=false;
          i++;
        }
    
    
}


onClickNextQuestion(){

      this.firstQuestion=false;

        if(this.currentQuestion.answered==false)
        {
          alert('Please select an answer');
          return;
        }
        
        if(this.showAnswerAfterQuestion)
        {
          this.GetChoiceUserSelectionIndex();
          this.presentToast(this.correctString);
       
         //setTimeout(this.presentToast(this.correctString), 5000);
        }
    

        if(this.currentQuestionIndex == this.quiz.toasts_list.length -2)
        {
          //alert("Last Question");
         // this.lastQuestion=false;
         // this.NextButtonValue = 'Finish';
          this.currentQuestionIndex++;
          this.currentQuestion = this.quiz.toasts_list[this.currentQuestionIndex];
        }
        else if(this.currentQuestionIndex == this.quiz.toasts_list.length-1){
          
          //means whas click when label is Finshed, we can now close the quiz
         // this.quiz.is_finished=true;
          //notify that a quiz just got finished, so we will update the badge number in QuizList Tab
        // this.quizService.quizLeaveQuizPage.next();
         // this.CalculateTotalScore();
          //go to page Result
         // let quiz:Quiz= this.quiz;
          console.log('before showFinishMessage');
          this.showFinishMessage();
          //this.navCtrl.push(QuestionsListPage,{quiz});

        }
        else{
          //this.lastQuestion=false;
         
          //this.NextButtonValue = 'Next';
          this.currentQuestionIndex++;
          this.currentQuestion = this.quiz.toasts_list[this.currentQuestionIndex];
        }
        
      }

      onClickFinish(){
        this.quiz.is_finished=true;
        //notify that a quiz just got finished, so we will update the badge number in QuizList Tab
       //this.quizService.quizLeaveQuizPage.next();
        this.CalculateTotalScore();
        //go to page Result
        let quiz:Quiz= this.quiz;
        console.log('Push QuestionsListPage');
        this.navCtrl.push(QuestionsListPage,{quiz});

      }


      onClickPreviousQuestion(){
       // this.lastQuestion=false;
      
        
            if(this.currentQuestionIndex == 0)
            {
              console.log("First Question");
            }
            else{
              this.currentQuestionIndex--;
              this.currentQuestion = this.quiz.toasts_list[this.currentQuestionIndex];
            }

            if(this.currentQuestionIndex == 0)
            this.firstQuestion=true;
               else
            this.firstQuestion=false;
           
          }


          CalculateTotalScore()
          {
            console.log('CalculateTotalScore');
        let i:number=0;
        
        while(i< this.quiz.toasts_list.length)
        {
            let j:number=0;
            while(j<  this.quiz.toasts_list[i].article_shuffle_list.length){
              
              if(this.quiz.toasts_list[i].article_shuffle_list[j].user_answer == true && this.quiz.toasts_list[i].article_shuffle_list[j].wiki_correct==true )
              {
                this.quiz.toasts_list[i].answered_ok=true;
              }
              
        
              j++;
            }
            i++;
          }
        
          let good_answers:number=0;
          i=0;
          while(i< this.quiz.toasts_list.length)
          {
            if(this.quiz.toasts_list[i].answered_ok==true)
              good_answers++;
            
            i++;
          }
        
          this.quiz.final_score = +((good_answers/this.quiz.toasts_list.length) * 100).toFixed(0);
          this.quiz.good_answers_count = good_answers;
          this.totalScoreString = 'Results: '+ this.quiz.final_score + '%(' + good_answers + ' / ' + this.quiz.toasts_list.length +')';
          }
        

}