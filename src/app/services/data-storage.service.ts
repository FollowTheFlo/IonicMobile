import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/Rx';
import { QuizService } from '../services/quiz.service';
import { UserService } from '../services/user.service';
import { Quiz } from '../models/quiz';
import { User } from '../models/user';


@Injectable()
export class DataStorageService {
  constructor(private http: Http, private quizService: QuizService, private userService:UserService ) {}

  storeQuizesList(username:string){
    console.log("storeQuizesList");
    alert('Saving Quiz List of '+username);
    this.userService.addUserQuizList(username,this.quizService.getQuizesListCopy());

    if(!this.userService.getUser(username))
        alert('user is null');

    let user:User = this.userService.getUser(username);
    console.log('user: '+user.username);
    return this.http.put("https://flo-qtw.firebaseio.com/users/"+username+".json", user);
  }


  getDBQuizesList(username:string){
    console.log("getDBQuizesList");
   // let quizesList:Quiz[];
    this.http.get("https://flo-qtw.firebaseio.com/users/"+username+".json")
    .map(
      (response: Response) => {
         const user:User = response.json();
       /*
        for (let quiz of quizesList) {
          if (!recipe['ingredients']) {
            recipe['ingredients'] = [];
          }
        }
        */
        return user;
      }
    )
    .subscribe(
      (user: User) => {
        //this.userService.addUserQuizList(username,quizesList);
        //console.log('this.quizService.setQuizList(user.UserQuizList)+list.length: '+user.UserQuizList.length);
        if(!user || !user.UserQuizList || user.UserQuizList.length==0)
        {
          alert('No quiz associated with user: '+username);
        }
        else{
        this.quizService.setQuizList(user.UserQuizList) ;

              //also save the retrieved quiz list in device memory
              this.quizService.saveListonDevice().then()
              .catch(
                err => {
                  console.log('data-storage: error saving quiz list in device memory, err '+err);
                }
              );
        }
      }
    );

  }

  /*
  https://flo-qtw.firebaseio.com/
  storeRecipes() {
    return this.http.put('https://ng-recipe-book.firebaseio.com/recipes.json', this.recipeService.getRecipes());
  }

  getRecipes() {
    this.http.get('https://ng-recipe-book.firebaseio.com/recipes.json')
      .map(
        (response: Response) => {
          const recipes: Recipe[] = response.json();
          for (let recipe of recipes) {
            if (!recipe['ingredients']) {
              recipe['ingredients'] = [];
            }
          }
          return recipes;
        }
      )
      .subscribe(
        (recipes: Recipe[]) => {
          this.recipeService.setRecipes(recipes);
        }
      );
  }
  */
}
