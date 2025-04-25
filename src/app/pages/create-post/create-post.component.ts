import { NgIf, NgClass, JsonPipe } from '@angular/common';
import { Component, effect, inject, input } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { OnlinePublishingService } from '../../services/online-publishing.service';
import { QuillEditorComponent } from 'ngx-quill';
import { v4 as uuidv4 } from 'uuid';
import { AppState, selectCurrentUser } from '../../store/userData.selector';
import { ToastType, UtilityService } from '../../utilities/services/utility.service';
import { CalendarModule } from 'primeng/calendar';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [QuillEditorComponent, NgIf, ReactiveFormsModule, NgClass, JsonPipe, CalendarModule, FormsModule],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.scss'
})
export class CreatePostComponent {
  isBasicDetailsFilled: boolean = false;
  isFirstPageSubmitted = false;
  uploadedImage: any
  articleForm!: FormGroup;
  fb = inject(FormBuilder);
  mode = input();
  id = input()
  articleService = inject(OnlinePublishingService);
  router = inject(Router);
  store$ = inject(Store<AppState>)
  loggedUser$: any
  currentTime = new Date()
  toastService = inject(UtilityService)
  isScheduleClicked: boolean = false;
  scheduleTime: any
  constructor() {
    this.articleForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      tags: ['', Validators.required],
      articlePhoto: ['', Validators.required],
      editorContent: ['', Validators.required],
      scheduleTime: ['']
    });
    effect(() => {
      if (this.mode() != 'create') {
        this.patchValue(this.id())
      }
    })
  }
  patchValue(id: any) {
    this.articleService.getArticleById('drafted', id).subscribe(data => {
      this.articleForm.patchValue(data[0])
    })
  }
  ngOnInit(): void {

    this.store$.select(selectCurrentUser).subscribe(user => {
      this.loggedUser$ = user;
    })
  }
  handleContent(data: any) {
    this.articleForm.get('editorContent')?.setValue(data?.html);
  }
  uploadImages(event: any) {
    const file = event.target.files[0];
    this.uploadedImage = file as File;
    // console.log(this.uploadedImage.name, file as File);

    const reader = new FileReader();
    reader.onload = (event) => {
      this.articleForm.get('articlePhoto')?.setValue(event.target?.result);
    };
    reader.readAsDataURL(file);
  }

  deleteImage() {
    this.articleForm.get('articlePath')?.setValue('');
    this.uploadedImage = ''
  }
  handleNext() {
    if (
      this.articleForm.get('title')?.valid &&
      this.articleForm.get('description')?.valid &&
      this.articleForm.get('tags')?.valid &&
      this.articleForm.get('articlePhoto')?.valid
    ) {
      this.isBasicDetailsFilled = true
    } else {
      this.isFirstPageSubmitted = true;
    }
  }
  readingTime() {
    const wpm = 300;
    const words = this.articleForm.value?.title.trim().split(/\s+/).length + this.articleForm.value?.editorContent.trim().split(/\s+/).length + this.articleForm.value?.description.trim().split(/\s+/).length;;
    const time = Math.ceil(words / wpm);
    return time
  }
  handlePublishArticle(category: string) {
    const payload = {
      _id: uuidv4(),
      ...this.articleForm.value,
      authorId: this.loggedUser$?.userUid,
      author: this.loggedUser$.username,
      tags: this.articleForm.value.tags.split(','),
      status: category,
      readTime: this.readingTime(),
      published: this.currentTime.toDateString(),
      updated: this.currentTime.toDateString(),
      comments: [],
      views: 0
    };
    // if (category != 'scheduled') {
    if (payload.title && payload.description) {
      this.articleService.createArticle(category, payload).subscribe((data) => {
        this.toastService.addToToast({ type: ToastType.success, message: `Article ${category} Succesfully!!` })
        this.articleForm.reset();
        this.isBasicDetailsFilled=false;
      });
    } else {
      this.toastService.addToToast({ type: ToastType.error, message: `Please fill some basic details and then draft your article!!` })
    }

    // }
  }
  getDescription() {
    return this.isBasicDetailsFilled
      ? this.articleForm.value?.description
      : 'Please fill all therequired fields';
  }
  isControlInvalid(controlName: string) {
    const control: any = this.articleForm?.get(controlName);
    return (
      (this.isFirstPageSubmitted &&
        !this.articleForm.value[controlName]) ||
      (control.touched && !this.articleForm.value[controlName])
    );
  }
}
