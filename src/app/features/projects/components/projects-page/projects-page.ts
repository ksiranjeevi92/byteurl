import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProjectListComponent } from '../project-list/project-list';
import { ProjectModalComponent } from '../../../../shared/components/project-modal/project-modal';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { ProjectService } from '../../services/project.service';
import { ProjectDto, CreateProjectRequest } from '../../models/project.model';

@Component({
  selector: 'app-projects-page',
  standalone: true,
  imports: [CommonModule, ProjectListComponent, ProjectModalComponent, ConfirmDialogComponent],
  templateUrl: './projects-page.html',
  styleUrl: './projects-page.scss'
})
export class ProjectsPageComponent implements OnInit {
  projects: ProjectDto[] = [];
  isLoading = false;
  errorMessage = '';
  showModal = false;
  showDeleteConfirm = false;
  isDeletingProject = false;
  projectToDelete: ProjectDto | null = null;

  constructor(
    private projectService: ProjectService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.projectService.getAllProjects().subscribe({
      next: (projects) => {
        this.projects = projects;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading projects:', error);
        if (error.status === 401) {
          this.errorMessage = 'Authentication failed. Please log in again.';
        } else if (error.status === 403) {
          this.errorMessage = 'Access denied. You don\'t have permission to view projects.';
        } else {
          this.errorMessage = 'Failed to load projects. Please try again.';
        }
        this.isLoading = false;
      }
    });
  }

  onCreateProject(): void {
    this.showModal = true;
  }

  onViewProject(project: ProjectDto): void {
    this.router.navigate(['/projects', project.id]);
  }

  onDeleteProject(project: ProjectDto): void {
    this.projectToDelete = project;
    this.showDeleteConfirm = true;
  }

  onRetry(): void {
    this.loadProjects();
  }

  onModalClose(): void {
    this.showModal = false;
  }

  onProjectSubmit(projectData: { name: string; description: string }): void {
    const createRequest: CreateProjectRequest = {
      name: projectData.name,
      description: projectData.description
    };

    this.projectService.createProject(createRequest).subscribe({
      next: (newProject) => {
        console.log('Project created successfully:', newProject);
        this.showModal = false;
        this.loadProjects();
      },
      error: (error) => {
        console.error('Error creating project:', error);
        if (error.status === 401) {
          this.errorMessage = 'Authentication failed. Please log in again.';
        } else if (error.status === 403) {
          this.errorMessage = 'Access denied. You don\'t have permission to create projects.';
        } else {
          this.errorMessage = 'Failed to create project. Please try again.';
        }
        this.showModal = false;
      }
    });
  }

  onConfirmDelete(): void {
    if (!this.projectToDelete) return;

    this.isDeletingProject = true;

    this.projectService.deleteProject(this.projectToDelete.id).subscribe({
      next: () => {
        console.log('Project deleted successfully:', this.projectToDelete?.name);
        this.showDeleteConfirm = false;
        this.isDeletingProject = false;
        this.projectToDelete = null;
        this.loadProjects();
      },
      error: (error) => {
        console.error('Error deleting project:', error);
        if (error.status === 401) {
          this.errorMessage = 'Authentication failed. Please log in again.';
        } else if (error.status === 403) {
          this.errorMessage = 'Access denied. You don\'t have permission to delete this project.';
        } else if (error.status === 404) {
          this.errorMessage = 'Project not found. It may have already been deleted.';
        } else {
          this.errorMessage = 'Failed to delete project. Please try again.';
        }
        this.isDeletingProject = false;
        this.showDeleteConfirm = false;
        this.projectToDelete = null;
      }
    });
  }

  onCancelDelete(): void {
    this.showDeleteConfirm = false;
    this.projectToDelete = null;
  }

  getDeleteConfirmMessage(): string {
    return `Are you sure you want to permanently delete "${this.projectToDelete?.name}"? This action is irreversible and will remove all associated data including tasks and project history. You cannot rollback this operation.`;
  }
}
