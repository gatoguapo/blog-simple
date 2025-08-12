import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Blog } from '../../models/blog';
import Swal from 'sweetalert2';
import { BlogsServices } from '../../services/blogs-services';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-blog',
  imports: [CommonModule],
  templateUrl: './edit-blog.html',
  styleUrl: './edit-blog.css',
  standalone: true
})
export class EditBlog {
  fileSelectedName:string = '';
  fileSelected:File | null = null;
  @Input() blogData:Blog | null = null;
  @Input() editBlogModal:boolean = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() isEdited = new EventEmitter<void>();
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor (private blogsServices:BlogsServices) {}

  editBlog(id: number | undefined, title: string, description: string) {
    this.blogsServices.editBlog(id, title, description, this.fileSelected).subscribe({
      next: (response) => {
        if (response.status === 200) {
          this.onCancel();
          this.isEdited.emit();
        }
      },
      error: (error) => {
        this.swalMessage('Error', `${error.error.message}`, 'error')
      }
    })
  }

  openFileInput() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected() {
    if (this.fileInput.nativeElement.files && this.fileInput.nativeElement.files.length > 0) {
      this.fileSelected = this.fileInput.nativeElement.files[0];
      this.fileSelectedName = this.fileSelected.name
    }
  }

  onCancel() {
    this.closeModal.emit();
    this.fileSelectedName = "";
    this.fileSelected = null;
  }

  swalMessage(title: string, text: string, icon: 'success' | 'error' | 'warning' | 'info' | 'question'): Promise<any> {
    return Swal.fire({
      title: title,
      text: text,
      icon: icon,
      confirmButtonText: 'Ok',
      draggable: true
    });
  }
}
