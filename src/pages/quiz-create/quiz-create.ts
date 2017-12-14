import { Component, OnInit,ViewChild} from '@angular/core';
import { Quiz } from '../../app/models/quiz';
import { QuizService } from '../../app/services/quiz.service';
import { QuizesListPage } from '../quizes-list/quizes-list';
import { QuizSavePage } from '../quiz-save/quiz-save';
import { NavParams,Slides ,NavController,ToastController,LoadingController,PopoverController,ModalController,ViewController,Config  } from 'ionic-angular';
import { QuizRunPage } from '../quiz-run/quiz-run';
import { ToolsPage } from '../tools/tools';
import { LanguagePage } from '../language/language';
import { SuggestionsPage } from '../suggestions/suggestions';
import { Subject } from 'rxjs/Subject';
import {DomSanitizer} from '@angular/platform-browser';
import { Article } from '../../app/models/article';
import { Network } from '@ionic-native/network';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'page-quiz-create',
  templateUrl: 'quiz-create.html'
})
export class QuizCreatePage implements OnInit{

    loading:string='';
    sparql_response:string='nothing';
    articleStatus:string="";
    language:string="en";
    checkBoxShowAnswer:boolean=false;
    isCollapsed: boolean = true;
    suggestionsList:string[] = [];
    showSuggestions:boolean = false;
    targetInputValue:string = "";
    maxQuestionsValue:number=3;
    maxChoicesValue:number=3;
    keyWordFromNav:string="";
    showAnswerAfterQuestion:boolean=false;
    optionsList:string[]=['5','4','false'];
    recommendersList:Article[]=[];
    slideIndex:number=3;
    @ViewChild(Slides) slides: Slides;
    loaderCreated=false;


  //Localisation labels
   LOADING:string="Loading";
   SUGGESTION_NOT_FOUND:string="";
   QUESTIONS_NOT_FOUND:string="";
   TIMEOUT:string="";
   EXCEPTION:string="";
   NOT_FILLED:string="";
   SUBJECT_NOT_FOUND:string="";
   FINISHED_LOADING:string="";

 
   

constructor(private sanitizer:DomSanitizer,
  public modalCtrl: ModalController,public popoverCtrl: PopoverController,
  public navCtrl: NavController,private quizService:QuizService,
  public toastCtrl: ToastController,public loadingCtrl: LoadingController,
  public viewCtrl: ViewController,public navParams: NavParams,
  private network: Network,private translate: TranslateService,private config: Config
  
) {

}

 ionViewWillEnter(){
   //this.viewCtrl.showBackButton(false);
  
 }       


    
ngOnInit(){

  this.translate.setDefaultLang('en'); 
  this.translate.use(this.quizService.getLanguage());



  this.translate.get(['LOADING','SUGGESTION_NOT_FOUND','QUESTIONS_NOT_FOUND','TIMEOUT','EXCEPTION','NOT_FILLED','SUBJECT_NOT_FOUND','FINISHED_LOADING']).subscribe((translationRes: string) => {
   
    this.LOADING = translationRes['LOADING'];
    this.SUGGESTION_NOT_FOUND = translationRes['SUGGESTION_NOT_FOUND'];
    this.QUESTIONS_NOT_FOUND = translationRes['QUESTIONS_NOT_FOUND'];
    this.TIMEOUT = translationRes['TIMEOUT'];
    this.EXCEPTION = translationRes['EXCEPTION'];
    this.NOT_FILLED = translationRes['NOT_FILLED'];
    this.SUBJECT_NOT_FOUND = translationRes['SUBJECT_NOT_FOUND'];
    this.FINISHED_LOADING = translationRes['FINISHED_LOADING'];
   
});
 
this.quizService.fetchLanguagefromDevice().then(
  () => {
    console.log("SUCCESS quizService.fetchLanguagefromDevice()");
  }
)
.catch(
  err => console.log(err)
);

    this.quizService.fetchListfromDevice().then(
      () => {
        console.log("SUCCESS quizService.fetchListfromDevice()");
      }
    )
    .catch(
      err => console.log(err)
    );

    this.quizService.fetchOptionsfromDevice().then(
      () => {
        console.log("SUCCESS quizService.fetchOptionsfromDevice()");
      }
    )
    .catch(
      err => console.log(err)
    );

    this.quizService.languageChanged.subscribe(
      () => {
      this.language = this.quizService.getLanguage();
    // this.getRecommenderArticles();
    this.translate.use(this.language);

    //change BACK button
      this.translate.get('BACK').subscribe((res: string) => {
        // Let android keep using only arrow
        
        this.config.set('backButtonText', res);
      });
   
    }
    );


    this.quizService.suggestionSelected.subscribe(
      suggestion => {
        if(suggestion)
        {
         
          this.clickCreateQuiz(suggestion,true);
         
        }
        else{
          console.log("Suggestion string is null");
        }
      
    }
    );

    this.getRecommenderArticles();
  
    
    //handling scenario where passing Keyworl to this page
    this.keyWordFromNav="";
    this.keyWordFromNav = this.navParams.get('keyWord');

    if(this.keyWordFromNav){
      this.targetInputValue=this.keyWordFromNav;
      this.clickCreateQuiz(this.targetInputValue,false);
    }



    
    
  
    
    
    // watch network for a connection
    let connectSubscription = this.network.onConnect().subscribe(() => {
      console.log('network connected!');
      this.getRecommenderArticles();
    });
}




onClickSlideChange(direction:string){

  //move slides by step of 3, so need to detect beginning and end
  let slidesLength:number = this.slides.length();
  console.log('this.slideIndex: '+this.slideIndex);
  console.log('slidesLengthmax: '+slidesLength);

  if(direction=='right' &&  this.slideIndex<slidesLength-3)
  {
    console.log('this.slides.isEnd: '+this.slides.isEnd);
    this.slideIndex = this.slideIndex+3;
    this.slides.slideTo(this.slideIndex);
  
  }
  else if(direction=='left' && this.slideIndex>3){
    this.slideIndex = this.slideIndex-3;
    this.slides.slideTo(this.slideIndex);
 
  }

}

getRecommenderArticles(){


  //World Music Awards winners
//Member states of the United Nations
//Best Actor Academy Award winners



  this.quizService.getAllRecommenderArticles('en').then(
    response => {
     // this.suggestionsList = response;
    
      if(response.length >0)
      {
        //this.isConnected=true;
        this.recommendersList = response;
        this.articleStatus="No Subject found. See subjects suggestions";
        console.log('Recommender articles loaded');
     
       
      }
      else{

       
        console.log('problem in getting recommender articles: response.length probably 0');
       // alert('problem in getting recommender articles: response.length probably 0');
        //this.isConnected=false;
      
      }

    },
    reject=>{  

      console.log('in Reject: getRecommenderArticles');
     // alert('in Reject: getRecommenderArticles');
      //this.isConnected=false;
    

    });
}

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

  

  presentOptionsModal() {
    let modal = this.modalCtrl.create(ToolsPage);
    modal.present();
  }

  presentLanguagePopover(myEvent) {
    let popover = this.popoverCtrl.create(LanguagePage);
    popover.present({
      ev: myEvent
    });
  }

  getOptionsList(){

    //index 0 -> maxQuestionsValue
    //index 1 -> maxChoicesValue
    //index 2 -> showAnswerAfterQuestion
    this.optionsList =this.quizService.getOptionsList();

    this.maxQuestionsValue = +this.optionsList[0];
    this.maxChoicesValue = +this.optionsList[1];

    if(this.optionsList[1]==='true')
      this.showAnswerAfterQuestion = true;
    else
    this.showAnswerAfterQuestion = false;

    this.language = this.quizService.getLanguage();

  }



  clickOptions(){
//false for LanguagePageSelected as it is Options
    this.navCtrl.push(ToolsPage);
  }


    
  


  capitalizeFirstLetter(articleString:string) {
       return articleString.charAt(0).toUpperCase() + articleString.slice(1);
    }


    presentToast(message:string) {
        let toast = this.toastCtrl.create({
          message: message ,
          duration: 3000,
          position: 'middle'
        });
        toast.present();
      }


   //create quiz called from html click and other pages(Suggestion,QuizList Add Modal)
   //cannot reduce size as the same loadingControler cannot run into several methods
   //so duplicated code to run suggestions and type question
   //pattern:
   //subject found with questions (ex:Paris)-> launch quiz-run
   //subject not found->trigger suggestions-> if Timeout -> trigger Type questions
   //subject not found->trigger suggestion->if result is 0 suggestion-> END message
   //subject found but no associated category(ex:Argonay) -> trigger suggestions -> if Timeout -> trigger Type questions
   //subject coming up from SuggestionPage-> subject found but no associated subject ->  trigger Type questions
   // trigger Type question return 0 question or timeout -> END message  
  clickCreateQuiz(articleInputString:string,startedFromSuggestion): void {
    console.log("Enter startedFromSuggestion "+startedFromSuggestion);

     //Loader message
     
  let loader = this.loadingCtrl.create({
    content: this.LOADING,
          
  });

      
        articleInputString = this.capitalizeFirstLetter(articleInputString);
        this.targetInputValue = articleInputString;
       
      this.loading= this.LOADING;
          if(articleInputString && this.maxQuestionsValue && this.maxChoicesValue)
          {
            
           
            this.articleStatus= this.LOADING;

            loader.present();
           
            this.getOptionsList();
            this.quizService.generateQuiz(articleInputString,this.maxQuestionsValue,this.maxChoicesValue,this.language).then(
              response => {
                
                this.articleStatus =  response;
    
                  console.log('articleStatus: '+this.articleStatus);
    
                  if(response == 'Finished Loading')
                  {
                    console.log('response == Finished Loading');
                    loader.setContent( this.FINISHED_LOADING);

                   let quiz:Quiz = this.quizService.getLastQuiz();
                   console.log('quiz: '+quiz.target_name);
                   loader.dismiss().catch(() => {console.log('catch loader dismiss');});
                    this.navCtrl.push(QuizRunPage,{quiz});

                    //no need to display Success as we go straight on Quiz Run
                    this.targetInputValue=""; //clear input
                    this.articleStatus ="";

                  }
                  else if(response == 'no_target_suggestions')
                  {
                    this.articleStatus= "Subject not found. Loading Suggestions";

                   // loader.dismiss().catch(() => { console.log('catch loader dismiss');});
                    
                    ///////////////////////requestSuggestions START//////////////////                    
                    loader.setContent(this.QUESTIONS_NOT_FOUND);
                    //loader.present();
                    console.log("Enter requestSuggestions")
                    this.quizService.getSuggestions(articleInputString,this.language).then(
                      response => {
                      // this.suggestionsList = response;
                      loader.dismiss().catch(() => { console.log('catch loader dismiss');});
                        if(response.length >0)
                        {
                          this.suggestionsList = response;
                          this.articleStatus="No Subject found. See subjects suggestions";
                          console.log(this.articleStatus);
                      
                        
                          
                          let suggestionsList:string[] = this.suggestionsList;
                          this.navCtrl.push(SuggestionsPage,{suggestionsList,articleInputString});
                        
                        }
                        else{

                          this.articleStatus="no Suggestions found";
                          console.log(this.articleStatus);
                        
                          this.targetInputValue="";
                        
                          this.presentToast( this.SUGGESTION_NOT_FOUND);
                        }

                      },
                      reject=>{  

                        console.log('in Reject: quiz-create');
                        loader.dismiss().catch(() => { console.log('catch loader dismiss');});
                        
                        
                      
                        this.targetInputValue="";
                        console.log('reject: '+this.articleStatus);
                    

                          console.log("Loading Type Questions");
                          
                          //---------------------------//if no suggestion, try the Type questions
                          this.requestTypeQuestions(articleInputString);


                        

                      });

                    ///////////////////////requestSuggestions END//////////////////                   
                   
                    //this.articleStatus='Not found, see below suggestions:';
                  }
                  else if(response == 'no_subject_suggestions')
                  {
                    console.log("condition: no_subject_suggestions ");
                    this.articleStatus= "No questions found for this subject. Loading Suggestions";
                    console.log( this.articleStatus);
                   // loader.dismiss().catch(() => { console.log('catch loader dismiss');});


                    
                    //if thge article already from suggestion we go straight to Type Questions, we don't run suggestions again
                    if(!startedFromSuggestion)
                    {
                      //fresh subject, not from suggestion attempt
///////////////////////requestSuggestions START//////////////////
loader.setContent(this.QUESTIONS_NOT_FOUND);
//loader.present();
console.log("Enter requestSuggestions")
this.quizService.getSuggestions(articleInputString,this.language).then(
  response => {
   // this.suggestionsList = response;
   loader.dismiss().catch(() => { console.log('catch loader dismiss');});
    if(response.length >0)
    {
      this.suggestionsList = response;
      this.articleStatus="No Subject found. See subjects suggestions";
      console.log(this.articleStatus);
   
    
      
      let suggestionsList:string[] = this.suggestionsList;
      this.navCtrl.push(SuggestionsPage,{suggestionsList,articleInputString});
     
    }
    else{

      this.articleStatus="no Suggestions found";
      console.log(this.articleStatus);
     
      this.targetInputValue="";
     
      this.presentToast( this.SUGGESTION_NOT_FOUND);
    }

  },
  reject=>{  

    console.log('in Reject: quiz-create');
   // loader.dismiss().catch(() => { console.log('catch loader dismiss');});
    
    
   
    this.targetInputValue="";
    console.log('reject: '+this.articleStatus);
 

      console.log("Loading Type Questions");
      
      //---------------------------//if no suggestion, try the Type questions
                          //////////////////////requestTypeQuestions START///////////////
                    loader.setContent( this.LOADING);
                    this.quizService.generateTypeQuiz(articleInputString,this.maxQuestionsValue,this.maxChoicesValue,this.language).then(
                      response => {

                        if(response == 'Finished Loading')
                        {
                          console.log('response == Finished Loading');
                          loader.setContent( this.FINISHED_LOADING);

                        let quiz:Quiz = this.quizService.getLastQuiz();
                        console.log('quiz: '+quiz.target_name);
                        loader.dismiss().catch(() => {console.log('catch loader dismiss');});
                          this.navCtrl.push(QuizRunPage,{quiz});

                          //no need to display Success as we go straight on Quiz Run
                          this.targetInputValue=""; //clear input
                          this.articleStatus ="";
                        }
                        else{
                          console.log('in Reject: quiz-create:generateTypeQuiz');
                          loader.dismiss().catch(() => { console.log('catch loader dismiss');});
                        this.targetInputValue="";
                        
                            this.presentToast( this.SUGGESTION_NOT_FOUND);

                        }
                      },
                      reject=>{

                        console.log('in Reject2: quiz-create');
                        loader.dismiss().catch(() => { console.log('catch loader dismiss');});
                      this.targetInputValue="";
                        console.log('reject: '+this.articleStatus);
                    
                          this.presentToast( this.SUGGESTION_NOT_FOUND);

                      });
                    //////////////////////requestTypeQuestions END///////////////


     

  });

///////////////////////requestSuggestions END///////////////////
                  }
                  else{
                    
//---------------------------//we are running an unseccessful suggestion, so try Type questions

//////////////////////requestTypeQuestions START///////////////
loader.setContent( this.LOADING);
this.quizService.generateTypeQuiz(articleInputString,this.maxQuestionsValue,this.maxChoicesValue,this.language).then(
  response => {

    if(response == 'Finished Loading')
    {
      console.log('response == Finished Loading');
      loader.setContent( this.FINISHED_LOADING);

     let quiz:Quiz = this.quizService.getLastQuiz();
     console.log('quiz: '+quiz.target_name);
     loader.dismiss().catch(() => {console.log('catch loader dismiss');});
      this.navCtrl.push(QuizRunPage,{quiz});

      //no need to display Success as we go straight on Quiz Run
      this.targetInputValue=""; //clear input
      this.articleStatus ="";
     }
     else{
      console.log('in Reject: quiz-create:generateTypeQuiz');
      loader.dismiss().catch(() => { console.log('catch loader dismiss');});
     this.targetInputValue="";
     
        this.presentToast( this.SUGGESTION_NOT_FOUND);

     }
  },
  reject=>{

    console.log('in Reject2: quiz-create');
    loader.dismiss().catch(() => { console.log('catch loader dismiss');});
   this.targetInputValue="";
    console.log('reject: '+this.articleStatus);
 
      this.presentToast( this.SUGGESTION_NOT_FOUND);

  });
//////////////////////requestTypeQuestions END///////////////


                     }
                       
                  }
                
                  //this.loading = 'Finsh loading';
              
              },
              reject=> {this.articleStatus="Error, check your network connection";
              loader.dismiss().catch(() => { console.log('catch loader dismiss');});
              this.presentToast( this.EXCEPTION);
            }
              
            );
          }
          else
          {
            console.log('Please fill all fields');
            this.presentToast( this.NOT_FILLED);
          }
        
      }



requestTypeQuestions(articleInputString:string){

   //Loader message
   let loader = this.loadingCtrl.create({
    content: this.LOADING,
          
  });
  loader.present
  loader.setContent(this.LOADING);
  this.quizService.generateTypeQuiz(articleInputString,this.maxQuestionsValue,this.maxChoicesValue,this.language).then(
    response => {
  
      if(response == 'Finished Loading')
      {
        console.log('response == Finished Loading');
        loader.setContent( this.FINISHED_LOADING);
  
       let quiz:Quiz = this.quizService.getLastQuiz();
       console.log('quiz: '+quiz.target_name);
       loader.dismiss().catch(() => {console.log('catch loader dismiss');});
        this.navCtrl.push(QuizRunPage,{quiz});
  
        //no need to display Success as we go straight on Quiz Run
        this.targetInputValue=""; //clear input
        this.articleStatus ="";
       }
       else{
        console.log('in Reject: quiz-create:generateTypeQuiz');
        loader.dismiss().catch(() => { console.log('catch loader dismiss');});
       this.targetInputValue="";
       
          this.presentToast( this.SUGGESTION_NOT_FOUND);
  
       }
    },
    reject=>{
  
      console.log('in Reject2: quiz-create');
      loader.dismiss().catch(() => { console.log('catch loader dismiss');});
     this.targetInputValue="";
      console.log('reject: '+this.articleStatus);
   
        this.presentToast( this.SUGGESTION_NOT_FOUND);
  
    });

}

requestSuggestions(articleInputString:string){

   //Loader message
   let loader = this.loadingCtrl.create({
    content: "",
          
  });

  loader.setContent(this.QUESTIONS_NOT_FOUND);
  //loader.present();
  console.log("Enter requestSuggestions")
  this.quizService.getSuggestions(articleInputString,this.language).then(
    response => {
     // this.suggestionsList = response;
     loader.dismiss().catch(() => { console.log('catch loader dismiss');});
      if(response.length >0)
      {
        this.suggestionsList = response;
        this.articleStatus="No Subject found. See subjects suggestions";
        console.log(this.articleStatus);
     
      
        
        let suggestionsList:string[] = this.suggestionsList;
        this.navCtrl.push(SuggestionsPage,{suggestionsList,articleInputString});
       
      }
      else{

        this.articleStatus="no Suggestions found";
        console.log(this.articleStatus);
       
        this.targetInputValue="";
       
        this.presentToast( this.SUGGESTION_NOT_FOUND);
      }

    },
    reject=>{  

      console.log('in Reject: quiz-create');
      loader.dismiss().catch(() => { console.log('catch loader dismiss');});
      
      
     
      this.targetInputValue="";
      console.log('reject: '+this.articleStatus);
   
  
        console.log("Loading Type Questions");
        
        //---------------------------//if no suggestion, try the Type questions
        this.requestTypeQuestions(articleInputString);

 
       

    });


}


startManageLoader(){

  console.log('manageLoader,loaderCreated: '+this.loaderCreated);
  if(!this.loaderCreated){
    let loader = this.loadingCtrl.create({
      content: "",
            
    });
    this.loaderCreated=true;

    this.quizService.loaderChange.subscribe(
      response => {
   
        if(response[0]=="dismiss")
        {
          console.log('dismiss');
          loader.dismiss().catch(() => { console.log('catch loader dismiss');});
        }
        else if(response[0]=="setContent"){
          console.log('setContent, response[1]: '+response[1]);
          loader.setContent(response[1]);
        }
        else if(response[0]=="present"){

          loader.present();
        }
   
    }
    );
 


}
}

}