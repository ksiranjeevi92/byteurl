export interface TaskDto {
  id: string;
  title: string;
  description?: string;
  status: string;
  owner: string; // owner email
  ownerId?: string; // owner ID if available
  assignee?: string; // assignee email if available
  assigneeId?: string; // assignee ID if available
  projectId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectDto {
  id: string;
  name: string;
  description: string;
  owner: string; // owner email
  members: string[]; // members emails
  tasks: TaskDto[];
  createdAt?: string;
}

export interface CreateProjectRequest {
  name: string;
  description: string;
}

export interface ChangeProjectNameRequest {
  newName: string;
}

export interface ChangeProjectDescriptionRequest {
  newDescription: string;
}

export interface AddTaskToProjectRequest {
  title: string;
  description: string;
  assignedToEmail: string;
}