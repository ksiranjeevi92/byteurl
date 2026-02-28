import { Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-project-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './project-modal.html',
  styleUrl: './project-modal.scss'
})
export class ProjectModalComponent {
  projectSubmit = output<{name: string, description: string}>();
  modalClose = output<void>();
  
  createProjectForm: FormGroup;
  isSubmitting = false;
  
  constructor(private fb: FormBuilder) {
    this.createProjectForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(255)]]
    });
  }

  onSubmit(): void {
    if (this.createProjectForm.valid) {
      this.isSubmitting = true;
      const formData = this.createProjectForm.value;
      this.projectSubmit.emit(formData);
    } else {
      this.markFormGroupTouched();
    }
  }

  onClose(): void {
    this.modalClose.emit();
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.createProjectForm.controls).forEach(field => {
      const control = this.createProjectForm.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.createProjectForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
      }
      if (field.errors['minlength']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${field.errors['minlength'].requiredLength} characters`;
      }
      if (field.errors['maxlength']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} cannot exceed ${field.errors['maxlength'].requiredLength} characters`;
      }
    }
    return '';
  }

  resetForm(): void {
    this.createProjectForm.reset();
    this.isSubmitting = false;
  }
}