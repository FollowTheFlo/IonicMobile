import { Component, OnInit} from '@angular/core';
import { Quiz } from '../../app/models/quiz';
import { Question } from '../../app/models/question';
import { Article } from '../../app/models/article';
import { QuizService } from '../../app/services/quiz.service';
import { QuestionService } from '../../app/services/question.service';
import { NavController, NavParams,ViewController } from 'ionic-angular';
import { QuizesListPage } from '../quizes-list/quizes-list';
import {DomSanitizer} from '@angular/platform-browser';
import { SingleQuestionPage } from '../single-question/single-question';

@Component({
  selector: 'page-questions-list',
  templateUrl: 'questions-list.html'
})
export class QuestionsListPage implements OnInit {

    quiz:Quiz;
    ArticleWikiLink:string="";

  constructor(private navParams: NavParams,
    public navCtrl: NavController,
    private quizService:QuizService, 
    private questionService:QuestionService,
    private sanitizer:DomSanitizer,
    public viewCtrl: ViewController) {

  }

  
  ionViewWillEnter(){
    this.viewCtrl.showBackButton(false);
   
  }   

  onClickBack()
{
  console.log("onClickBack");
  this.navCtrl.push(QuizesListPage);
}

  ngOnInit() {
    console.log("QuestionsListPage: ngOnInit");

    this.quiz = this.navParams.get('quiz');
    
       

  }

  onClickSelectQuestion(question:Question): void {

    if(question)
        this.navCtrl.push(SingleQuestionPage,{question})
    else
        console.log("QuestionsListPage: question NULL");
    
    }
    
}