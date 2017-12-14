import { Component,OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { QuizService } from '../../app/services/quiz.service';

/**
 * Generated class for the SuggestionsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-suggestions',
  templateUrl: 'suggestions.html',
})
export class SuggestionsPage implements OnInit {

  suggestionsList:string[]=[];
  articleInputString:string="";

  constructor(public navCtrl: NavController, public navParams: NavParams, private quizService:QuizService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SuggestionsPage');
  }

  ngOnInit(){
    console.log('ngOnInit SuggestionsPage');
    this.suggestionsList = this.navParams.get('suggestionsList');
    console.log('ngOnInit after suggestionsList param');
    this.articleInputString = this.navParams.get('articleInputString');
    console.log('ngOnInit after articleInputString param');

  }

  onSelectSuggestion(suggestion:string){
    console.log('onSelectSuggestion(suggestion:string)');
    this.quizService.suggestionSelected.next(suggestion);
    console.log('before this.navCtrl.pop()');
    this.navCtrl.pop();
    console.log('after this.navCtrl.pop()');

  }
}
