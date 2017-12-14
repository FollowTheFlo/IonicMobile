import  {Question} from "./question";

export class Quiz {

    quiz_id:number;
    target_name:string;
    multiple_choices_number:number;
    max_questions_number:number;
      toasts_list:Question[];
      language='en';

      ////
      choice_KO_number:number; //we remove the correct answer
     current_question_index:number;
      target_subjects_count:number=0;
      current_toast:Question;
      is_finished:boolean=false;
      is_started:boolean=false;
      is_selected:boolean=false;
      final_score:number = 0;
      final_questions_number:number=0;
      good_answers_count:number=0;
      start_timestamp:string =  new Date().toLocaleString();
      ////

    constructor(quiz_id:number,target_name:string,multiple_choices_number:number,max_questions_number:number,language:string)
    {
        this.quiz_id=quiz_id;
        this.target_name=target_name;
        this. multiple_choices_number=multiple_choices_number;
        this. max_questions_number=max_questions_number;
        this.toasts_list=[];
        this.choice_KO_number = multiple_choices_number -1;
        this.current_question_index=0;
        this.language=language;
    }
}