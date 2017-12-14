import { Quiz } from '../models/quiz';
import { User } from '../models/user';
import { Injectable } from '@angular/core';

@Injectable()
export class UserService {


    //USER_QUIZES_LIST:Quiz[]=[];
    USERS_LIST:User[]=[];


    getUser(username:string):User{
       
        let i:number=0;
        let temp_user:User;
        let userFound:boolean=false;

        while(i < this.USERS_LIST.length){

            if(this.USERS_LIST[i].username == username ){
                temp_user = this.USERS_LIST[i];
                userFound=true;
            }

            i++;
        }

    

    return temp_user;

    }

    getUserQuizList(username:string):Quiz[]{

        let i:number=0;
        let temp_quiz_list:Quiz[]=[];

        while(i < this.USERS_LIST.length){

            if(this.USERS_LIST[i].username == username ){
                temp_quiz_list = this.USERS_LIST[i].UserQuizList;
            }

            i++;
        }

    

    return temp_quiz_list;
}

    addUserQuizList(username:string,quizList:Quiz[]){

        let i:number=0;
        let temp_quiz_list:Quiz[]=[];
        let userExist:boolean=false;

        //check if user exists
        while(i < this.USERS_LIST.length){

            if(this.USERS_LIST[i].username == username ){
                 this.USERS_LIST[i].UserQuizList = quizList;
                 userExist=true;
            }

            i++;
        }

        if(!userExist){
           
            let user:User = new User(username);
            user.UserQuizList = quizList;
            this.USERS_LIST.push(user);

        }


    }

}