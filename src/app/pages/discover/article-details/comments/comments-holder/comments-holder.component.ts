import { Component, effect, EventEmitter, input, Output, ViewChild } from '@angular/core';
import { CommentsFormComponent } from '../comments-form/comments-form.component';
import { JsonPipe, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-comments-holder',
  standalone: true,
  imports: [NgIf, NgFor, JsonPipe, CommentsFormComponent],
  templateUrl: './comments-holder.component.html',
  styleUrl: './comments-holder.component.scss'
})
export class CommentsHolderComponent {
  comment: any = input();
  isReplying: boolean = false;
  replyingId: any;
  showReplies: boolean = false;
  @ViewChild('CommentFormComponent') commentForm = CommentsFormComponent;
  @Output()exportCommentdata=new EventEmitter<any>();
  constructor(){
    effect(()=>{
      // console.log(this.comment());
      
    })
  }
  ngOnInit() {
  }
  handleReply(id: any) {
    this.isReplying = !this.isReplying;
    this.replyingId = id;
  }
  getFormData(data:any){
    this.exportCommentdata.emit(data);
     this.isReplying = false;
    this.replyingId = ''
  }

}
