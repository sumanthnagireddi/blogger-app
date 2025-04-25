import { NgIf } from '@angular/common';
import { Component, EventEmitter, input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-comments-form',
  standalone: true,
  imports: [NgIf, FormsModule],
  templateUrl: './comments-form.component.html',
  styleUrl: './comments-form.component.scss'
})
export class CommentsFormComponent {
  showProfile = input(true);
  isNestedComment = input<boolean>();
  parentId = input<string>();
  comment: any;
  @Output() exportComment = new EventEmitter<any>();
  @Output() closeForm = new EventEmitter<any>()
  submitComment() {
    if(this.comment){
      this.exportComment.emit({
        body: this.comment,
        parentId: this.isNestedComment() && this.parentId() ? this.parentId() : null,
      });
    }else{
      alert("please enter comment and then submit")
    }
  }
}
