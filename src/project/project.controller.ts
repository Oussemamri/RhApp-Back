import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Delete,
  Put,
  Query,
  ParseIntPipe,
} from "@nestjs/common";
import { ProjectService } from "./project.service";
import { CreateProjectDto } from "./dto/create-project.dto";
import { UserEntity } from "../user/entity/user.entity";

@Controller("projects")
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  createProject(@Body() createProjectDto: CreateProjectDto) {
    return this.projectService.createProject(createProjectDto);
  }

  @Get()
  getProjects() {
    return this.projectService.getProjects();
  }

  @Delete(":id")
  deleteProject(@Param("id") id: number) {
    return this.projectService.deleteProject(id);
  }

  @Get("status")
  getProjectsByStatus(@Query("status") status: string) {
    return this.projectService.getProjectsByStatus(status);
  }

  @Get("manager/:projectManagerId")
  getProjectsByProjectManager(
    @Param("projectManagerId") projectManagerId: number,
  ) {
    return this.projectService.getProjectsByProjectManager(projectManagerId);
  }

  @Put(":id")
  updateProject(
    @Param("id") id: number,
    @Body() updateProjectDto: CreateProjectDto,
  ) {
    return this.projectService.updateProject(id, updateProjectDto);
  }

  @Post(":projectId/users/:userId")
  assignUserToProject(
    @Param("projectId") projectId: number,
    @Param("userId") userId: number,
  ) {
    return this.projectService.assignUserToProject(projectId, userId);
  }

  @Delete(":projectId/users/:userId")
  unassignUserFromProject(
    @Param("projectId") projectId: number,
    @Param("userId") userId: number,
  ) {
    return this.projectService.unassignUserFromProject(projectId, userId);
  }

  @Get("user/:userId")
  getUserProjects(@Param("userId") userId: number) {
    return this.projectService.getUserProjects(userId);
  }

  @Get(":id/users")
  async getProjectUsers(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<UserEntity[]> {
    return this.projectService.getProjectUsers(id);
  }
}
