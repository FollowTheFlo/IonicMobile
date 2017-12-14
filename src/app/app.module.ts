import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SparqlService } from './services/sparql.service';
import { QuizService } from './services/quiz.service';
import { QuestionService } from './services/question.service';
import  {UserService} from './services/user.service';
import  {DataStorageService} from './services/data-storage.service';
import { QuizCreatePage } from '../pages/quiz-create/quiz-create';
import { QuizesListPage } from '../pages/quizes-list/quizes-list';
import { QuizRunPage } from '../pages/quiz-run/quiz-run';
import { QuestionsListPage } from '../pages/questions-list/questions-list';
import { SingleQuestionPage } from '../pages/single-question/single-question';
import { ToolsPage } from '../pages/tools/tools';
import { LanguagePage } from '../pages/language/language';
import { InformationPage } from '../pages/information/information';
import { SuggestionsPage } from '../pages/suggestions/suggestions';
import { QuizSavePage } from '../pages/quiz-save/quiz-save';
import { PrototypePage } from '../pages/prototype/prototype';
import { IonicStorageModule } from '@ionic/storage';
import { Network } from '@ionic-native/network';

import { HttpModule,Http } from '@angular/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import {HttpClientModule,HttpClient} from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    QuizCreatePage,
    QuizesListPage,
    QuizRunPage,
    QuestionsListPage,
    SingleQuestionPage,
    ToolsPage,
    LanguagePage,
    QuizSavePage,
    SuggestionsPage,
    InformationPage,
    PrototypePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
    HttpClientModule,
    IonicStorageModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })   
    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    QuizCreatePage,
    QuizesListPage,
    QuizRunPage,
    QuestionsListPage,
    SingleQuestionPage,
    ToolsPage,
    LanguagePage,
    QuizSavePage,
    SuggestionsPage,
    InformationPage,
    PrototypePage
  ],
  providers: [SparqlService,QuizService,QuestionService,DataStorageService,UserService,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},Network
  ]
})
export class AppModule {}

