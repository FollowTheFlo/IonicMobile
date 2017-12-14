import { Component,OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { QuizService } from '../../app/services/quiz.service';


/**
 * Generated class for the LanguagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-language',
  templateUrl: 'language.html',
})
export class LanguagePage implements OnInit {

  frChecked:boolean=false;
  enChecked:boolean=true;
  esChecked:boolean=false;
  language:string="en";


  constructor(public navCtrl: NavController, public navParams: NavParams,private quizService:QuizService) {
  }

  ngOnInit(){
this.language = this.quizService.getLanguage();

    if(this.language==="en")
    {
      this.enChecked =  true;
      this.frChecked= false;
      this.esChecked=false;
    }
    else if(this.language==="fr"){
      this.enChecked =  false;
      this.frChecked= true;
      this.esChecked=false;
    }
    else if(this.language==="es"){
      this.enChecked =  false;
      this.frChecked= false;
      this.esChecked=true;
    }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LanguagePage');
  }

  ionViewWillLeave() {
   
    

    //notice to other component that language was modified
   // this.quizService.languageChanged.next();

    console.log('ionViewWillLeave LanguagePage, language: '+this.language);

  }


  onClickRadioLanguage(language:string){
    console.log('Click language: '+language);
    this.language = language;
    this.quizService.setLanguage(this.language);
    this.quizService.languageChanged.next();

  }
}
