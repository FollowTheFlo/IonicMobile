import  {Quiz} from "./quiz";

export class User {
    username:string;
    UserQuizList:Quiz[];

    constructor(username){

        this.username = username;
    }
}