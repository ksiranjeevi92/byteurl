import { Component, input, output, OnInit, OnDestroy, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

export interface UserProfile {
  email: string;
  firstName: string;
  lastName: string;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  assignedToEmail: string;
}

@Component({
  selector: 'app-task-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-modal.html',
  styleUrl: './task-modal.scss'
})
export class TaskModalComponent implements OnInit, OnDestroy {
  // Signal-based inputs
  searchResults = input<UserProfile[]>([]);
  isSearching = input(false);

  // Signal-based outputs
  taskSubmit = output<CreateTaskRequest>();
  modalClose = output<void>();
  searchUsers = output<string>();

  createTaskForm: FormGroup;
  isSubmitting = false;
  showSearchResults = false;
  selectedUser: UserProfile | null = null;

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder) {
    this.createTaskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      userSearch: ['', [Validators.required]]
    });

    // Effect to show/hide search results when searchResults input changes
    effect(() => {
      const results = this.searchResults();
      this.showSearchResults = results.length > 0;
    });
  }

  ngOnInit(): void {
    // Setup debounced search
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(query => {
        if (query && query.length >= 2) {
          this.searchUsers.emit(query);
        } else {
          this.showSearchResults = false;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(): void {
    if (this.createTaskForm.valid && this.selectedUser) {
      this.isSubmitting = true;
      const formData = this.createTaskForm.value;
      const taskRequest: CreateTaskRequest = {
        title: formData.title,
        description: formData.description,
        assignedToEmail: this.selectedUser.email
      };
      this.taskSubmit.emit(taskRequest);
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

  selectUser(user: UserProfile): void {
    this.selectedUser = user;
    this.createTaskForm.get('userSearch')?.setValue(`${user.firstName} ${user.lastName} (${user.email})`);
    this.showSearchResults = false;
  }

  clearSelection(): void {
    this.selectedUser = null;
    this.createTaskForm.get('userSearch')?.setValue('');
    this.showSearchResults = false;
  }

  onSearchInput(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    if (query && query.length >= 2) {
      this.selectedUser = null; // Clear selection when typing
      this.searchSubject.next(query);
    } else {
      this.showSearchResults = false;
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.createTaskForm.controls).forEach(field => {
      const control = this.createTaskForm.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.createTaskForm.get(fieldName);
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
    this.createTaskForm.reset();
    this.selectedUser = null;
    this.showSearchResults = false;
    this.isSubmitting = false;
  }
}
