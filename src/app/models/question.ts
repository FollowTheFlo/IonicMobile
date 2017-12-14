import  {Article} from "./article";

export class Question{

    question_id:number;

    subject_OK:Article = new Article("subject","",true);
	target_article:Article = new Article("target","",true);
	subject_KO:Article[] = [];
	distractor_article:Article= new Article("distractor","",false);
	success:boolean=false;
	article_shuffle_list:Article[] = [];
    target_title:string = "Blank Subject";
	is_valid:boolean = false;
	answered:boolean=false;
	answered_ok:boolean=false;
	imageQuestion:boolean=false;
	abstractQuestion:boolean=false;

   
}