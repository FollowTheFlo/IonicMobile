import { Component,OnInit,ViewChild  } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { InformationPage } from '../information/information';
import { HomePage } from '../home/home';
import { QuizCreatePage } from '../quiz-create/quiz-create';
import { QuizesListPage } from '../quizes-list/quizes-list';
import { Quiz } from '../../app/models/quiz';
import { Question } from '../../app/models/question';
import { Article } from '../../app/models/article';
import { QuizService } from '../../app/services/quiz.service';
//import { TranslateService } from '@ngx-translate/core';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage implements OnInit{

  tab1Root = QuizCreatePage;
  tab2Root = QuizesListPage;
  tab3Root = InformationPage;
  tab4Root = AboutPage;
  @ViewChild('myNav') nav: NavController
  quizCount:Number=0;

  constructor( private quizService:QuizService, public navCtrl: NavController) {

  }

  ngOnInit() {
    //this.translate.setDefaultLang('en'); 
   // this.translate.use("en");
    this.quizCount = this.quizService.getCountStartedQuiz();
    console.log('quizCount: '+this.quizCount)

    this.quizService.QuizChange
    .subscribe(
      (quizes: Quiz[]) => {
        this.quizCount = this.quizService.getCountStartedQuiz();
        
      }
    );


    this.quizService.LeaveQuizPage
    .subscribe(
      () => {
        this.quizCount = this.quizService.getCountStartedQuiz();
        
      }
    );

  }


 
}
