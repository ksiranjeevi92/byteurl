import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ProjectService } from '../../services/project.service';
import { ProjectDto, ChangeProjectNameRequest, ChangeProjectDescriptionRequest, AddTaskToProjectRequest } from '../../models/project.model';
import { TaskModalComponent, CreateTaskRequest, UserProfile } from '../../../../shared/components/task-modal/task-modal';
import { TimeAgoPipe } from '../../../../shared/pipes/time-ago.pipe';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TaskModalComponent, TimeAgoPipe],
  templateUrl: './project-detail.html',
  styleUrl: './project-detail.scss'
})
export class ProjectDetailComponent implements OnInit {
  project: ProjectDto | null = null;
  isLoading = false;
  errorMessage = '';
  isEditingName = false;
  isEditingDescription = false;
  isSavingName = false;
  isSavingDescription = false;
  showTaskModal = false;

  // User search state for TaskModal
  userSearchResults: UserProfile[] = [];
  isSearchingUsers = false;

  nameForm: FormGroup;
  descriptionForm: FormGroup;

  private readonly userSearchApiUrl = 'http://localhost:8080/api/user-profiles/search';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.nameForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]]
    });

    this.descriptionForm = this.fb.group({
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(255)]]
    });
  }

  ngOnInit(): void {
    const projectId = this.route.snapshot.paramMap.get('id');
    if (projectId) {
      this.loadProject(projectId);
    } else {
      this.errorMessage = 'Project ID not found';
    }
  }

  loadProject(projectId: string): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.projectService.getProjectById(projectId).subscribe({
      next: (project) => {
        this.project = project;
        this.initializeForms();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading project:', error);
        if (error.status === 401) {
          this.errorMessage = 'Authentication failed. Please log in again.';
        } else if (error.status === 403) {
          this.errorMessage = 'Access denied. You don\'t have permission to view this project.';
        } else if (error.status === 404) {
          this.errorMessage = 'Project not found';
        } else {
          this.errorMessage = 'Failed to load project. Please try again.';
        }
        this.isLoading = false;
      }
    });
  }

  initializeForms(): void {
    if (this.project) {
      this.nameForm.patchValue({ name: this.project.name });
      this.descriptionForm.patchValue({ description: this.project.description });
    }
  }

  goBack(): void {
    this.router.navigate(['/projects']);
  }

  startEditingName(): void {
    this.isEditingName = true;
    this.nameForm.patchValue({ name: this.project?.name });
  }

  cancelEditingName(): void {
    this.isEditingName = false;
    this.nameForm.patchValue({ name: this.project?.name });
  }

  saveName(): void {
    if (this.nameForm.valid && this.project) {
      this.isSavingName = true;
      const newName = this.nameForm.value.name;
      const request: ChangeProjectNameRequest = { newName: newName };

      this.projectService.changeProjectName(this.project.id, request).subscribe({
        next: (updatedProject) => {
          this.project = updatedProject;
          this.isEditingName = false;
          this.isSavingName = false;
        },
        error: (error) => {
          console.error('Error updating project name:', error);
          this.errorMessage = 'Failed to update project name. Please try again.';
          this.isSavingName = false;
        }
      });
    }
  }

  startEditingDescription(): void {
    this.isEditingDescription = true;
    this.descriptionForm.patchValue({ description: this.project?.description });
  }

  cancelEditingDescription(): void {
    this.isEditingDescription = false;
    this.descriptionForm.patchValue({ description: this.project?.description });
  }

  saveDescription(): void {
    if (this.descriptionForm.valid && this.project) {
      this.isSavingDescription = true;
      const newDescription = this.descriptionForm.value.description;
      const request: ChangeProjectDescriptionRequest = { newDescription: newDescription };

      this.projectService.changeProjectDescription(this.project.id, request).subscribe({
        next: (updatedProject) => {
          this.project = updatedProject;
          this.isEditingDescription = false;
          this.isSavingDescription = false;
        },
        error: (error) => {
          console.error('Error updating project description:', error);
          this.errorMessage = 'Failed to update project description. Please try again.';
          this.isSavingDescription = false;
        }
      });
    }
  }

  getFieldError(form: FormGroup, fieldName: string): string {
    const field = form.get(fieldName);
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

  getTaskStatusIcon(status: string): string {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'done':
        return '✅';
      case 'in_progress':
      case 'in progress':
        return '🔄';
      case 'pending':
      case 'todo':
        return '📋';
      default:
        return '📋';
    }
  }

  getTaskStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'done':
        return 'completed';
      case 'in_progress':
      case 'in progress':
        return 'in-progress';
      case 'pending':
      case 'todo':
        return 'pending';
      default:
        return 'pending';
    }
  }

  showAddTaskModal(): void {
    this.showTaskModal = true;
    this.userSearchResults = [];
    this.isSearchingUsers = false;
  }

  onTaskModalClose(): void {
    this.showTaskModal = false;
    this.userSearchResults = [];
    this.isSearchingUsers = false;
  }

  onSearchUsers(query: string): void {
    this.isSearchingUsers = true;
    // JWT token is automatically added by jwtInterceptor in app.config.ts
    this.http.get<UserProfile[]>(this.userSearchApiUrl, { params: { query } }).subscribe({
      next: (results) => {
        this.userSearchResults = results;
        this.isSearchingUsers = false;
      },
      error: (error) => {
        console.error('Error searching users:', error);
        this.userSearchResults = [];
        this.isSearchingUsers = false;
      }
    });
  }

  onTaskSubmit(taskData: CreateTaskRequest): void {
    if (this.project) {
      const addTaskRequest: AddTaskToProjectRequest = {
        title: taskData.title,
        description: taskData.description,
        assignedToEmail: taskData.assignedToEmail
      };

      this.projectService.addTaskToProject(this.project.id, addTaskRequest).subscribe({
        next: (updatedProject) => {
          console.log('Task added successfully:', updatedProject);
          this.project = updatedProject;
          this.showTaskModal = false;
          this.userSearchResults = [];
        },
        error: (error) => {
          console.error('Error adding task:', error);
          if (error.status === 401) {
            this.errorMessage = 'Authentication failed. Please log in again.';
          } else if (error.status === 403) {
            this.errorMessage = 'Access denied. You don\'t have permission to add tasks to this project.';
          } else {
            this.errorMessage = 'Failed to add task. Please try again.';
          }
          this.showTaskModal = false;
        }
      });
    }
  }

}
