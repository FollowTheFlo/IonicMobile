export class Article
{
	user_answer:boolean = false;
	thumbnail_url:string="";
	article_name:string="";
	type:string;//3 types: target,distractor,subject
    wiki_correct:boolean;
    wiki_link:string="";
    abstract:string="";
    
    constructor(type:string, article_name:string,wiki_correct:boolean){
        this.type = type;
        this.article_name = article_name;
        this.wiki_correct = wiki_correct;
    }
       
    }