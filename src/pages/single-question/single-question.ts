import { Component, OnInit} from '@angular/core';
import { Quiz } from '../../app/models/quiz';
import { Question } from '../../app/models/question';
import { Article } from '../../app/models/article';
import { QuizService } from '../../app/services/quiz.service';
import { QuestionService } from '../../app/services/question.service';
import { NavController, NavParams } from 'ionic-angular';
import { QuizesListPage } from '../quizes-list/quizes-list';
import {DomSanitizer} from '@angular/platform-browser';
import { QuestionsListPage } from '../questions-list/questions-list';

@Component({
  selector: 'page-single-question',
  templateUrl: 'single-question.html'
})
export class SingleQuestionPage implements OnInit {

    question:Question;
   

  constructor(private navParams: NavParams,
    public navCtrl: NavController,
    private quizService:QuizService, 
    private questionService:QuestionService,
    private sanitizer:DomSanitizer) {

  }

  ngOnInit() {
    console.log("QuizRunPage: ngOnInit");
    this.question = this.navParams.get('question');

    
    }
}