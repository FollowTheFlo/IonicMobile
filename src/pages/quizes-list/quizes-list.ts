import { Component, OnInit} from '@angular/core';
import { Quiz } from '../../app/models/quiz';
import { QuizService } from '../../app/services/quiz.service';
import { NavController,AlertController,ViewController,  } from 'ionic-angular';
import { QuizRunPage } from '../quiz-run/quiz-run';
import { QuestionsListPage } from '../questions-list/questions-list';
import { QuizSavePage } from '../quiz-save/quiz-save';
import { QuizCreatePage } from '../quiz-create/quiz-create';

@Component({
  selector: 'page-quizes-list',
  templateUrl: 'quizes-list.html'
})
export class QuizesListPage implements OnInit {

    quizesList:Quiz[];
    selectedIndex:number = -1;
    statusString:string = "START QUIZ";
    isQuizListEmpty:boolean=false;
  constructor(public navCtrl: NavController,private quizService:QuizService,public alertCtrl: AlertController,public viewCtrl: ViewController) {

  }

  ionViewWillEnter(){
    this.viewCtrl.showBackButton(false);
 
   
  }   

  ngOnInit() {
    this.quizesList = this.quizService.getQuizesList();

    this.isQuizListEmpty = this.quizService.isQuizListEmpty();
    console.log(' this.isQuizListEmpty: '+ this.isQuizListEmpty);
   // this.quizesList[0].toasts_list[0].subject_OK.article_name
    this.quizService.QuizChange
      .subscribe(
        (quizes: Quiz[]) => {
          this.quizesList = quizes;
          if(this.quizesList[0]){
           /*
            this.clearQuizSelection();
            this.quizesList[0].is_selected =  true;
            this.selectedIndex = 0;
            //this.quizService.quizSelected.next(this.quizesList[0]);
            */
            console.log('quiz changed');
            this.isQuizListEmpty = this.quizService.isQuizListEmpty();
            
          }
          
        }
      );
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad QuizesListPage');
  }


  showPromptLaunchQuiz() {
    let prompt = this.alertCtrl.create({
      title: 'Launch a New Quiz',
      message: "Enter your subject",
      inputs: [
        {
          name: 'keyWord',
          placeholder: 'ex:Michael Jackson,Paris'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Launch',
          handler: data => {
            console.log('Launch Quiz clicked: '+data.keyWord );

            if(data.keyWord){
              let keyWord=data.keyWord;
              this.navCtrl.push(QuizCreatePage,{keyWord});
            }
            else{
              alert('Please enter a Keyword or Press Cancel')
            }
           
          }
        }
      ]
    });
    prompt.present();
  }

  onClickClearQuizesList() {
    let confirm = this.alertCtrl.create({
      title: 'Clear quiz list?',
      message: 'The quiz list will be removed from your phone',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            console.log('clicked Yes');
            this.quizService.ClearQuizesList();
            this.isQuizListEmpty = true;
          }
        },
        {
          text: 'Cancel',
          handler: () => {
            console.log('clicked Cancel');
          }
        }
      ]
    });
    confirm.present();
  }

/*
  onClickClearQuizesList(){
    
        this.quizService.ClearQuizesList();
      } 
 */ 
onClickSave(){
  
    let isSaveAction:boolean=true;
    this.navCtrl.push(QuizSavePage,{isSaveAction});
  
   // let modal = this.modalCtrl.create(QuizSavePage,{isSaveAction});
   // modal.present();
  
  }
  
  onClickRetrieve(){
  
    let isSaveAction:boolean=false;
    this.navCtrl.push(QuizSavePage,{isSaveAction});
  
   // let modal = this.modalCtrl.create(QuizSavePage,{isSaveAction});
    //modal.present();
  
  }

  onSelect(quiz: Quiz, index): void {
    // this.selectedArticle = article;
    this.clearQuizSelection();
    this.selectedIndex = index;
  
    this.quizesList[this.selectedIndex].is_selected =  true;
   // this.quizService.quizSelected.next(quiz);

   if(!quiz.is_finished)
   {
    console.log(" this.navCtrl.push(QuizRunPage,{quiz});");
    this.navCtrl.push(QuizRunPage,{quiz});
   }
   else{
    console.log(" this.navCtrl.push(QuestionsListPage,{quiz});");
    this.navCtrl.push(QuestionsListPage,{quiz});
   }
    
    
    
  }

  clearQuizSelection()
  {
    let i:number=0;
    while(i<this.quizesList.length)
    {
      this.quizesList[i].is_selected = false;
      i++;
    }

  }
}