import {SparqlService} from './sparql.service';
import { Injectable, EventEmitter } from '@angular/core';
import  { Question } from "../models/question";
import { Quiz } from '../models/quiz';
//import { Question } from '../models/question';
//import { QUIZES_LIST } from '../mocks/mock-quizes-list';
//import { Headers, Http, Response,  } from '@angular/http';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
//import {HttpClient} from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { Subject } from 'rxjs/Subject';
import { Article } from '../models/article';
import { Storage } from '@ionic/storage';
//import { TranslateService } from '@ngx-translate/core';




@Injectable()
export class QuizService {
    QUIZES_ALL:Quiz[]=[];
  //  QUESTIONS_ALL:Question[];
QUIZES_ALL_INDEX:number=0;
    index_selection_list:number[];
    results: string[];
    target_subjects_count:number;
    QuizChange = new EventEmitter<Quiz[]>();
    quizSelected = new Subject();
    languageChanged = new Subject();
    loaderChange = new Subject<string[]>();
    suggestionSelected = new Subject<string>();
    LeaveQuizPage = new Subject();
    showAnswerCheckBox:boolean=false;
    suggestionsList:string[] = [];
   optionsList:string[] = ['6','4','false']; //Questions,Choice,ShowAmswer
   language:string = 'en';
   RecommenderArticles:Article[]=[];
   

    constructor(private sparqlService:SparqlService,private storage: Storage) {}


    saveListonDevice():Promise<any>{
       return this.storage.set('quizList', this.getQuizesList()).then()
        .catch(
          err => {
           alert('Error fetching QUiz List form Device Memory');
          }
        );
    
    }

    fetchListfromDevice():Promise<any>{
       return this.storage.get('quizList').then((quizList:Quiz[]) => {
            
            if(quizList){
                 this.QUIZES_ALL=quizList;
                 this.QuizChange.next();
            }
            else
                this.QUIZES_ALL=[];
        }).catch(
            err => console.log(err)
          );
      
      }

      saveOptionsonDevice():Promise<any>{
        return this.storage.set('optionsList', this.getOptionsList()).then()
         .catch(
           err => {
            alert('Error fetching OptionsList form Device Memory');
           }
         );
     
     }
 
     fetchOptionsfromDevice():Promise<any>{
        return this.storage.get('optionsList').then((optionsList:string[]) => {
             
             if(optionsList){
                  this.optionsList=optionsList;
                 
             }
             else
                 {console.log('fetchOptionsfromDevice, no optionsList stored');}
         }).catch(
             err => console.log(err)
           );
       
       }

       saveLanguageonDevice():Promise<any>{
        return this.storage.set('language', this.getLanguage()).then()
         .catch(
           err => {
            alert('Error saveLanguageonDevice');
           }
         );
     
     }
 
     fetchLanguagefromDevice():Promise<any>{
        return this.storage.get('language').then((language:string) => {
             
             if(language){
                  this.language=language;
                  this.languageChanged.next();
                 
             }
             else
                 {console.log('fetchLanguagefromDevice, no optionsList stored');}
         }).catch(
             err => console.log(err)
           );
       
       }
      

    getCountStartedQuiz():number{
        let i:number=0;
        let startedQuizCount:number=0;
        while(i<this.QUIZES_ALL.length){

            if(!this.QUIZES_ALL[i].is_finished)
                startedQuizCount++;
            
        i++;
        }   
        return startedQuizCount;
    }

    getLanguage():string{

        return this.language
    }

    setLanguage(language:string){

        this.language = language;
        this.saveLanguageonDevice().then()
        .catch(
          err => {
            console.log('saveLanguageonDevice, err '+err);
          }
        );
       
    }

    getOptionsList():string[]{

        return this.optionsList;
    }

    setOptionsList(optionsList:string[]){
        this.optionsList = optionsList;

        this.saveOptionsonDevice().then()
        .catch(
          err => {
            console.log('saveOptionsonDevice, err '+err);
          }
        );
    }

    getShowAnwserCheckBoxValue(){

        return this.showAnswerCheckBox;
    }

    setShowAnwserCheckBoxValue(showAnswerCheckBox:boolean){
        
        this.showAnswerCheckBox = showAnswerCheckBox;
    }

    ClearQuizesList(){
        this.QUIZES_ALL = [];
        this.QuizChange.emit(this.QUIZES_ALL);

        this.saveListonDevice().then()
        .catch(
          err => {
            console.log('ClearQuizesList: error saving quiz list in device memory, err '+err);
          }
        );
    }

    isQuizListEmpty():boolean{

        if(this.QUIZES_ALL.length==0 )
            return true;
        else
            return false;
    }


getLastQuiz():Quiz{

    return this.QUIZES_ALL[0];
}


    

  generateQuiz(article:string,maxQuestions:number,maxChoices:number,language:string):Promise<string>
  {



    let promise =
    new Promise<string>((resolve, reject) => {
       
          this.sparqlService.getArticleCount(article,language).then(
              
            response => {
                //response is the number of article returns from keyword, basically if the article exists, it is over 0
                if(response>0)
                {
                         ///////////////////
                  this.sparqlService.getArticleSubjectCount(article,language).then(
                    response => {
                    //response is number of subject that target article contains
                    if(response>0)
                    {
                   
    
                    this.target_subjects_count= response;
            
                        console.log('inside this.target_subjects_count: '+this.target_subjects_count);
                        
                        //setting randm index table of number, ex: 8,3,7 with max number of elements limit by subject count
                        //this step is use to make the questions in random order
                        this.index_selection_list = this.get_random_list_indexes(maxQuestions,this.target_subjects_count);

                        console.log('index_selection_list: '+this.index_selection_list);

                        //setting vars
                        let question_index:number=0; //to scroll questions
                        let distractor_count:number=0; //to check the number of Distractor of a Subject
                        let random_distractor_index:number=0; // to unforce randomness we will pick a random distractor article within distractor count

                        // we can create a the new quiz has we know we have at least one question (= one subject)
                        //(quiz_id:number,target_name:string,multiple_choices_number:number,max_questions_number:number,language)
                        let quiz = new Quiz(this.QUIZES_ALL_INDEX,article,maxChoices, this.index_selection_list.length,language);

                        
                            console.log('AtLeastOneValidQuestion, QUIZES_ALL_INDEX: '+this.QUIZES_ALL_INDEX);
                            this.QUIZES_ALL.unshift(quiz);
                            this.QUIZES_ALL_INDEX++;
                        
                        
                        let AtLeastOneValidQuestion:boolean = false;
                       // (quiz_id:number,target_name:string,multiple_choices_number:number,max_questions_number:number)
                        while(question_index <  this.index_selection_list.length)
                        {
                            console.log("1-question_index: "+question_index);
                            console.log("1-index_selection_list.length: "+this.index_selection_list.length);

                            console.log('0: this.index_selection_list[question_index]: '+this.index_selection_list[question_index]);
                            let selectionListIndex:number = this.index_selection_list[question_index];
                            this.sparqlService.getSubjectDistractorsCount(this.index_selection_list[question_index],article,language).then(
                                response => { 
                                    console.log('getSubjectDistractorsCount: '+response);
                                    console.log('this.index_selection_list[question_index]test: '+selectionListIndex);
                                    distractor_count = response;
                                    
                                    console.log("2-question_index: "+question_index);
                                    console.log("2-index_selection_list.length: "+this.index_selection_list.length);

                                    if(distractor_count==0)
                                    {
                                        //add empty question, we will filter them later
                                        let question = new Question();
                                        quiz.toasts_list.push(question);
                                        console.log("3-question_index: "+question_index);
                                        console.log("3-index_selection_list.length: "+this.index_selection_list.length);
                                        console.log("AtLeastOneValidQuestion: "+AtLeastOneValidQuestion);
                                        console.log("distractor_count: "+distractor_count);


                                        if( question_index==1 && (question_index == this.index_selection_list.length)&& AtLeastOneValidQuestion==false)
                                        {
                                            console.log('QUIT - quiz only have invalid question, resolve ');
                                            this.QUIZES_ALL.shift();
                                            this.QUIZES_ALL_INDEX--;
                                            resolve("no_subject_suggestions");
                                        }

                                                                                       
                                }else{
                                      random_distractor_index= this.random_num_out_of(distractor_count-1);
                                      console.log('random_distractor_index: '+random_distractor_index);
                                        
                                      let question = new Question();
                                      console.log('new Question created');

                                      if(question)
                                        console.log("Question not null");
                                      else
                                         console.log("Question NULL!!!");
                                      //getOneQuestionWithArticles(question:Question,target_name:string,target_subject_index:number,distractor_index:number,distractor_subject_index:number,distractor_subject_number:number,SELECTED_LOCALE:string):Promise<boolean>{
         
                                      this.sparqlService.getOneQuestionWithArticles(question,article,selectionListIndex,random_distractor_index,0,maxChoices,language).then(
                                        response => { 
                                            //return is_valid
                                            console.log('getOneQuestionWithArticles: '+response);

                                                AtLeastOneValidQuestion = true;
                                               

                                               this.build_choices_list(question);
                                               
                                               console.log('Question added to toasts_list');
                                                quiz.toasts_list.push(question);
                                                    //we should always reach mx_questions_number as we add empty questions too
                                                    if( quiz.toasts_list.length==quiz.max_questions_number)
                                                       {
                                                       //END of the Quiz Creation

                                                        if(quiz.toasts_list.length==0){

                                                            resolve("no_subject_suggestions");
                                                        }else{
                                                            if(!this.removeEmptyQuestionsFromQuiz(quiz))
                                                            {
                                                             
                                                                this.QUIZES_ALL.shift();
                                                                this.QUIZES_ALL_INDEX--;
                                                                resolve("no_subject_suggestions");
                                                            }else
                                                            {
                                                                console.log("END CONDITION FINISH: toast length "+quiz.toasts_list.length);
                                                                
                                                                
                                                                let abstractSuccess = this.buildAbstractQuestion(quiz);
                                                                console.log("END ABSTRACT, abstractSuccess: "+abstractSuccess);

                                                                let imageSuccess = this.buildImageQuestion(quiz);
                                                                console.log("END IMAGE, imageSuccess: "+imageSuccess);
                                                            
                                                                //this.QuizChange.emit(this.QUIZES_ALL);
                                                                resolve("Finished Loading");

                                                            }


                                                          
                                                        }
                                                       }
                                                      

                                        },
                   
                                  msg => { // Error
                                  reject(msg);
                                  }

                                        );

                                    /////////////////////////////


    
                                    /////////////////////////////


                                    }

                                     


                                },
                                msg => { // Error
                                reject(msg);
                              }
                            );
                                
                                question_index++;
                                console.log(" question_index++ : "+question_index)
                               

                        }

                       
                        //add quiz to list if having at least one valid question

                        
                       
                       
    
    
                    }else{
                       // this.sparqlService.getpopup(' 0 so quit at getArticleSubjectCount' );
                      // resolve("No Questions Found for this subject");

                      resolve("no_subject_suggestions");
                    }
                    
                    },
                        msg => { // Error
                        reject(msg);
                      }
                    );
        
                    //////////////////////

                    }
                    else{
                        
                        
                       
                                resolve("no_target_suggestions");
                             
                       // alert('0 so quit at getArticleCount')
                    }

               
        },
        
  msg => { // Error
      console.log("First web service call failed, probably No internet connection: "+msg);
  reject(msg);
  }
        );
          //-----

          //this.QuizAdded.emit(this.QUIZES_ALL);
        
          })
          

         

    return promise;
    
  }

  removeEmptyQuestionsFromQuiz(quiz:Quiz):boolean
  {
    let i:number=0;
    let temp_questions_list:Question[]=[];
    //temp_questions_list = quiz.toasts_list

    while(i<quiz.toasts_list.length){

        if(quiz.toasts_list[i].is_valid==true){
            temp_questions_list.push(quiz.toasts_list[i]);
            console.log("removeEmptyQuestionsFromQuiz: IN CONDITION: quiz.toasts_list[i].is_valid: "+i);

        }
        console.log("removeEmptyQuestionsFromQuiz: OUT of CONDITION: quiz.toasts_list[i].is_valid: "+i+", "+quiz.toasts_list[i].is_valid);
        
        i++;
    }
    quiz.toasts_list = temp_questions_list;
    console.log("END removeEmptyQuestionsFromQuiz: IN CONDITION  temp_questions_list: "+ temp_questions_list.length);
    console.log("END removeEmptyQuestionsFromQuiz: IN CONDITION  quiz.toasts_list: "+ quiz.toasts_list);
    console.log("END removeEmptyQuestionsFromQuiz: IN CONDITION  temp_questions_list: "+ temp_questions_list.length);

    if(temp_questions_list.length == 0)
        return false;
     else
      return true;


  }

   get_random_list_indexes(index_number, total_number):number[]{
    let random_list:number[]=[];
    let random_index:number =0;
    let i:number =0;
    
    if(index_number>=total_number)
    {
        index_number=total_number;
    }
    //alert("index num : "+index_number)
    while(i<index_number)
    {
        random_index = this.random_num_out_of(total_number);
      
        if(random_list.indexOf(random_index) == -1)
        {
           
            random_list.push(random_index);
            i++;
        }
    }
    
    return random_list;
    
}

random_num_out_of(total_index:number)
{
    
    return Math.floor(Math.random()*(total_index));
}


build_choices_list(choices:Question)
{
     
    //generate random number between 0 and length of KO choicess, will be use to insert OK choices. 
    //create offset as OK choices will be inserted
    let random_index:number = Math.floor(Math.random()*(choices.subject_KO.length+1));
    
    console.log("build_choices_list, random index: "+random_index);

    let article_index:number=0;
    while(article_index < random_index)
    {
        //Choice(choices_index,article,wiki_correct)
        
        choices.article_shuffle_list[article_index]= choices.subject_KO[article_index];
        
        article_index++;
    }
    
            
    //insert good choices
    choices.article_shuffle_list[article_index]= choices.subject_OK;
    article_index++;//increment the index to insert KO choicess after OK choices
    
    //add 1 to length as we added OK choices
    while(article_index < (choices.subject_KO.length+1))
    {
        //Choice(choices_index,article,wiki_correct)
        
        //article_index-1 to pull the subject KO as there was an offset created by OK subject insert
        choices.article_shuffle_list[article_index]= choices.subject_KO[article_index-1];
       
        
        
        article_index++;
        
        
    }
       
    
}


getQuizesList():Quiz[]
{

    return this.QUIZES_ALL;
}


buildImageQuestion(quiz:Quiz)
{
    let distractor_article_list:Article[]=[];
    let i:number=0;
    var j=0;
    
    var target_article;
    
    //we get the target article in index 0, could be any index as target_index always have the the same value
    // sometimes SPARQL returns thumbnail 'undefined', need to filter them
    if( quiz.toasts_list[0] && quiz.toasts_list[0].target_article && quiz.toasts_list[0].target_article.thumbnail_url != "" && quiz.toasts_list[0].target_article.thumbnail_url != "undefined")
    {
        console.log('Image target exist');
        target_article = quiz.toasts_list[0].target_article;
    }
    else 
    {
        console.log('Image target NOT exist');
        return false;
    }
        

    
    
    //multiple_choices_number-1 as exclude OK choice
    while((i< quiz.toasts_list.length) && (i<(quiz.multiple_choices_number-1)))
    {
            if(quiz.toasts_list[i] && quiz.toasts_list[i].distractor_article && quiz.toasts_list[i].distractor_article.thumbnail_url != "" && quiz.toasts_list[i].distractor_article.thumbnail_url != "undefined")
            {
                
                    distractor_article_list[j] = quiz.toasts_list[i].distractor_article;
                    j++;
            }
                
            i++;
            
    }
    
    if(distractor_article_list.length == 0)
    {
        console.log('Image distractor NOT exist');
        return false;
    }
        
    
        
    let imageQuestion:Question = new Question();
    imageQuestion.imageQuestion=true;

    imageQuestion.subject_OK = target_article;
    imageQuestion.subject_KO = distractor_article_list;
    this.build_choices_list(imageQuestion);
   // insert the Image question in a random index of question list

   
    //quiz.toasts_list.splice(this.random_num_out_of(quiz.toasts_list.length-1),0,imageQuestion);

    if(quiz.toasts_list.length < quiz.max_questions_number )
    {
        console.log('before Image pushed, quiz.toasts_list.length: '+quiz.toasts_list.length);
        quiz.toasts_list.splice(this.random_num_out_of(quiz.toasts_list.length-1),0,imageQuestion);
        console.log('after Image pushed, quiz.toasts_list.length: '+quiz.toasts_list.length);
    }
     else
     {
        console.log('before Image replace, quiz.toasts_list.length: '+quiz.toasts_list.length);
        quiz.toasts_list.splice(0,1,imageQuestion);
        console.log('after Image replace, quiz.toasts_list.length: '+quiz.toasts_list.length);
     }
    
    
    return true;
    
}

buildAbstractQuestion(quiz)
{
    console.log("enter buildAbstractQuestion");
    let distractor_article_list:Article[]=[];
    let i:number=0;
    let j:number=0;
    
    let target_article:Article;
    
    //we get the target article in index 0, could be any index as target_index always have the the same value
    // sometimes SPARQL returns thumbnail 'undefined', need to filter them
    if( quiz.toasts_list[0] && quiz.toasts_list[0].target_article && quiz.toasts_list[0].target_article.abstract != "")
       {
       console.log("quiz.toasts_list[0].target_article.abstract: "+quiz.toasts_list[0].target_article.abstract);
        target_article = new Article('target',quiz.toasts_list[0].target_article.abstract,true) ;
       }  
    else {
        console.log("1- return false");
        console.log("quiz.toasts_list[0].target_article.abstract: "+quiz.toasts_list[0].target_article.abstract);
        return false;

    }
       
    
    
    //max_questions_number-1 as exclude OK choice
    while((i< quiz.toasts_list.length) && (i<(quiz.multiple_choices_number-1)))
    {
            if(quiz.toasts_list[i] && quiz.toasts_list[i].distractor_article && quiz.toasts_list[i].distractor_article.abstract != "" && quiz.toasts_list[i].distractor_article.abstract != "undefined")
            {
                console.log("1 in condition,quiz.toasts_list[i].distractor_article "+quiz.toasts_list[i].distractor_article);
                    distractor_article_list[j] = new Article('distractor', quiz.toasts_list[i].distractor_article.abstract,false);
                    j++;
            }
                
            i++;
            
    }
    
    if(distractor_article_list.length == 0){
        console.log("2- return false");
        return false;
    }
       
    
        
    let abstractQuestion:Question = new Question();
    abstractQuestion.abstractQuestion=true;

    abstractQuestion.subject_OK = target_article;
    abstractQuestion.subject_KO = distractor_article_list;
    this.build_choices_list(abstractQuestion);
   // insert the abstract question at the end of question list, if only 1 question, push it
console.log("quiz.max_questions_number: "+quiz.max_questions_number);
   if(quiz.toasts_list.length < quiz.max_questions_number || quiz.toasts_list.length==1)
   {
    console.log('before Abstract pushed, quiz.toasts_list.length: '+quiz.toasts_list.length);
        quiz.toasts_list.push(abstractQuestion);
        console.log('after Abstract pushed, quiz.toasts_list.length: '+quiz.toasts_list.length);
        
   }
    else
    {
        console.log('before Abstract replace, quiz.toasts_list.length: '+quiz.toasts_list.length);
         quiz.toasts_list.splice(quiz.toasts_list.length-1,1,abstractQuestion);
         console.log('after Abstract replace, quiz.toasts_list.length: '+quiz.toasts_list.length);
         
    }
    
    return true;
    
}


setQuizList(newQuizList:Quiz[])
{
    this.QUIZES_ALL = newQuizList;
    this.QuizChange.emit(this.QUIZES_ALL);

}

getQuizesListCopy(){

    return this.QUIZES_ALL.slice();

}

getSuggestions(article:string,language:string):Promise<string[]>
{



  let promise =
  new Promise<string[]>((resolve, reject) => {
     
    this.sparqlService.getTargetSuggestions(article,language).then(
        
      response => {
          //response is the number of article returns from keyword, basically if the article exists, it is over 0
          console.log("quiz.service: getTargetSuggestions Resolve");
            this.suggestionsList = response;
            resolve(this.suggestionsList);
         
        
        
        },
        msg=>{
            console.log("quiz.service in reject: "+msg);
            reject('Timeout, Please try with a different Subject');
           
    });
        
        }
    );
        return promise;
    }



 getAllRecommenderArticles(language:string):Promise<Article[]>
 {

    let promise = new Promise<Article[]>((resolve, reject) => {
        // Do some async stuff
//Capitals_in_Europe,Capitals_in_Asia

        Promise.all([
            this.getRecommenderArticles('Best Actor Academy Award winners',language),
            this.getRecommenderArticles('Capitals in Europe',language),
            this.getRecommenderArticles('Capitals in Asia',language),
            this.getRecommenderArticles('World Music Awards winners',language),
          ]).then(response => {
        
            let j:number=0;

            while(j< response.length)
            {
                this.RecommenderArticles.push(...response[j]);
                console.log('this.RecommenderArticles.push(...response[]); j: '+j);
                j++;
            }
          

          let randomIndexList:number[]= this.get_random_list_indexes(40,this.RecommenderArticles.length);
          let i:number=0;
          let ArticleListFiltered:Article[]=[];

          while(i<randomIndexList.length)
          {
            ArticleListFiltered[i]=this.RecommenderArticles[randomIndexList[i]];
            i++;

          }
          console.log('');
          resolve(ArticleListFiltered);
          },
          msg => { // Error
              console.log('error http getting recommenders, check connection: '+msg);
              reject(msg);
              
              }
      
      
        );
       
       
      });


return promise;

 }   

getRecommenderArticles(category:string,language:string):Promise<Article[]>
{

     //World Music Awards winners
//Member states of the United Nations
//Best Actor Academy Award winners

//let RecommenderArticles:Article[]=[];

  let promise =
  new Promise<Article[]>((resolve, reject) => {
     
    this.sparqlService.getRecommenderArticles(category,language).then(
        
      response => {
          //response is the number of article returns from keyword, basically if the article exists, it is over 0
          console.log("getRecommenderArticles Resolve");
        
        
        resolve(response);
        },
        msg=>{
            console.log("getRecommenderArticles in reject: "+msg);
            reject('Timeout, cannot fetch recommenders');
           
        });
            
            }
        );
        return promise;
    }


    generateTypeQuiz(article:string,maxQuestions:number,maxChoices:number,language:string):Promise<string>
    {
   
        let typeQuiz:Quiz = new Quiz(33,article,maxChoices,2,language);
    let abstractQuestion = new Question();
    let imageQuestion = new Question();
    imageQuestion.imageQuestion=true;

      let promise =
      new Promise<string>((resolve, reject) => {
        
        //maxChoices-1 as include the OK choice
        this.sparqlService.getTargetTypeDistractors(abstractQuestion,article,language,this.random_num_out_of(500),(maxChoices-1)).then(
            
          response => {
              //response is the number of article returns from keyword, basically if the article exists, it is over 0
              console.log("getTargetTypeDistractors response: "+response);
            if(response){
            
                this.build_choices_list(abstractQuestion);
                typeQuiz.toasts_list.unshift(abstractQuestion);
               

//----------------------------//Image question

                            this.sparqlService.getTargetTypeDistractors(imageQuestion,article,language,this.random_num_out_of(500),(maxChoices-1)).then(
                                
                            response => {
                                //response is the number of article returns from keyword, basically if the article exists, it is over 0
                                console.log("getTargetTypeDistractors IMAGE response: "+response);
                                if(response && imageQuestion.subject_OK.thumbnail_url!=""){

                                // imageQuestion.subject_OK = imageQuestion.target_article;
                                // imageQuestion.subject_KO[0] = imageQuestion.distractor_article;
                                    this.build_choices_list(imageQuestion);
                                    typeQuiz.toasts_list.unshift(imageQuestion);
                                    this.QUIZES_ALL.unshift(typeQuiz);
                                    this.QUIZES_ALL_INDEX++;
                                    resolve("Finished Loading");
                                }
                                else{
                                    //will only be the abstract question
                                    this.QUIZES_ALL.unshift(typeQuiz);
                                    this.QUIZES_ALL_INDEX++;
                                    resolve("Finished Loading");
                                }

                            }, msg=>{
                                console.log("getTargetTypeDistractors in reject: "+msg);
                                reject('Timeout, cannot fetch TypeDistractors');
                            
                            }

);
//----------------------------




                
            }
            else{
                console.log("getTargetTypeDistractors in reject: ");
                reject('Timeout, cannot fetch TypeDistractors');
            }
            
           
            },
            msg=>{
                console.log("getTargetTypeDistractors in reject: "+msg);
                reject('Timeout, cannot fetch TypeDistractors');
               
            });
                
                }
            );
            return promise;
        }

}
