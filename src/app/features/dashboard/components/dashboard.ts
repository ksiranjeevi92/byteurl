import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProjectService } from '../../projects/services/project.service';
import { ProjectDto } from '../../projects/models/project.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {
  myProjects: ProjectDto[] = [];
  loading = false;
  error: string | null = null;
  
  // Dashboard statistics
  dashboardStats = {
    totalProjects: 0,
    totalTasks: 0,
    activeTasks: 0,
    completedTasks: 0,
    totalMembers: 0,
    recentProjects: [] as ProjectDto[]
  };
  
  taskStatusBreakdown = {
    todo: 0,
    inProgress: 0,
    done: 0
  };

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.loadMyProjects();
  }

  loadMyProjects(): void {
    this.loading = true;
    this.error = null;
    
    this.projectService.getMyProjects().subscribe({
      next: (projects) => {
        this.myProjects = projects;
        this.calculateDashboardStats();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading user projects:', err);
        this.error = 'Failed to load your projects. Please try again.';
        this.loading = false;
      }
    });
  }

  private calculateDashboardStats(): void {
    const stats = {
      totalProjects: this.myProjects.length,
      totalTasks: 0,
      activeTasks: 0,
      completedTasks: 0,
      totalMembers: 0,
      recentProjects: [] as ProjectDto[]
    };

    const taskBreakdown = {
      todo: 0,
      inProgress: 0,
      done: 0
    };

    // Calculate statistics from projects
    this.myProjects.forEach(project => {
      // Task counts
      if (project.tasks) {
        stats.totalTasks += project.tasks.length;
        
        project.tasks.forEach(task => {
          switch (task.status?.toUpperCase()) {
            case 'TODO':
              taskBreakdown.todo++;
              stats.activeTasks++;
              break;
            case 'IN_PROGRESS':
              taskBreakdown.inProgress++;
              stats.activeTasks++;
              break;
            case 'DONE':
              taskBreakdown.done++;
              stats.completedTasks++;
              break;
            default:
              stats.activeTasks++;
          }
        });
      }
      
      // Member counts (unique members across all projects)
      if (project.members) {
        stats.totalMembers += project.members.length;
      }
    });

    // Get recent projects (first 3 projects)
    stats.recentProjects = this.myProjects.slice(0, 3);

    this.dashboardStats = stats;
    this.taskStatusBreakdown = taskBreakdown;
  }

  getCompletionPercentage(): number {
    if (this.dashboardStats.totalTasks === 0) return 0;
    return Math.round((this.dashboardStats.completedTasks / this.dashboardStats.totalTasks) * 100);
  }

  getTaskStatusPercentage(status: 'todo' | 'inProgress' | 'done'): number {
    if (this.dashboardStats.totalTasks === 0) return 0;
    return Math.round((this.taskStatusBreakdown[status] / this.dashboardStats.totalTasks) * 100);
  }

  getProjectInitials(projectName: string): string {
    return projectName
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }
}