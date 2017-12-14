import { Subject } from 'rxjs/Subject';
import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class QuestionService {
  questionSelected = new Subject();
}