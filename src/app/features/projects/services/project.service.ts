import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ProjectDto,
  CreateProjectRequest,
  ChangeProjectNameRequest,
  ChangeProjectDescriptionRequest,
  AddTaskToProjectRequest
} from '../models/project.model';

// NOTE: JWT token is automatically added by jwtInterceptor in app.config.ts
// No need to manually add Authorization headers - the interceptor handles it!

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private readonly apiUrl = 'http://localhost:8080/api/projects';

  constructor(private http: HttpClient) {}

  /**
   * Get all projects
   */
  getAllProjects(): Observable<ProjectDto[]> {
    return this.http.get<ProjectDto[]>(this.apiUrl);
  }

  /**
   * Get projects for the connected user
   */
  getMyProjects(): Observable<ProjectDto[]> {
    return this.http.get<ProjectDto[]>(`${this.apiUrl}/my-projects`);
  }

  /**
   * Get project by ID
   */
  getProjectById(projectId: string): Observable<ProjectDto> {
    return this.http.get<ProjectDto>(`${this.apiUrl}/${projectId}`);
  }

  /**
   * Create a new project
   */
  createProject(project: CreateProjectRequest): Observable<ProjectDto> {
    return this.http.post<ProjectDto>(this.apiUrl, project);
  }

  /**
   * Change project name
   */
  changeProjectName(projectId: string, request: ChangeProjectNameRequest): Observable<ProjectDto> {
    return this.http.put<ProjectDto>(`${this.apiUrl}/${projectId}/name`, request);
  }

  /**
   * Change project description
   */
  changeProjectDescription(projectId: string, request: ChangeProjectDescriptionRequest): Observable<ProjectDto> {
    return this.http.put<ProjectDto>(`${this.apiUrl}/${projectId}/description`, request);
  }

  /**
   * Add task to project
   */
  addTaskToProject(projectId: string, request: AddTaskToProjectRequest): Observable<ProjectDto> {
    return this.http.put<ProjectDto>(`${this.apiUrl}/${projectId}/tasks`, request);
  }

  /**
   * Delete project
   */
  deleteProject(projectId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${projectId}`);
  }
}