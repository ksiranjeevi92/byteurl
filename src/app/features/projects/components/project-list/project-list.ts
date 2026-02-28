import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectDto } from '../../models/project.model';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-list.html',
  styleUrl: './project-list.scss'
})
export class ProjectListComponent {
  // Signal-based inputs
  projects = input<ProjectDto[]>([]);
  isLoading = input(false);
  errorMessage = input('');

  // Signal-based outputs
  createProject = output<void>();
  viewProject = output<ProjectDto>();
  deleteProject = output<ProjectDto>();
  retry = output<void>();

  // Computed signal: enriches projects with derived values
  // This is memoized - only recalculates when projects() changes
  enrichedProjects = computed(() => {
    return this.projects().map(project => ({
      ...project,
      taskCount: project.tasks?.length ?? 0,
      memberCount: project.members?.length ?? 0,
      initials: this.getProjectInitials(project.name)
    }));
  });

  onCreateProject(): void {
    this.createProject.emit();
  }

  onViewProject(project: ProjectDto): void {
    this.viewProject.emit(project);
  }

  onDeleteProject(project: ProjectDto): void {
    this.deleteProject.emit(project);
  }

  onRetry(): void {
    this.retry.emit();
  }

  // Helper method - private since only used by computed signal
  private getProjectInitials(projectName: string): string {
    return projectName
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }
}
