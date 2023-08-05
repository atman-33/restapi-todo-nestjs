import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Task, User } from '@prisma/client';
import { CurrentUser } from '../auth/current-user.decorator';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TodoService } from './todo.service';

@UseGuards(AuthGuard('jwt'))
@Controller('todo')
export class TodoController {
    constructor(private readonly todoService: TodoService) { }

    @Get()
    getTasks(
        @CurrentUser() user: User
    ): Promise<Task[]> {
        return this.todoService.getTasks(user.id);
    }

    @Get(':id')
    getTaskById(
        @CurrentUser() user: User,
        @Param('id', ParseIntPipe) taskId: number
    ): Promise<Task | null> {
        return this.todoService.getTaskById(user.id, taskId);
    }

    @Post()
    createTask(
        @CurrentUser() user: User,
        @Body() dto: CreateTaskDto
    ): Promise<Task> {
        return this.todoService.createTask(user.id, dto);
    }

    @Patch(':id')
    updateTaskById(
        @CurrentUser() user: User,
        @Param('id', ParseIntPipe) taskId: number,
        @Body() dto: UpdateTaskDto
    ): Promise<Task> {
        return this.todoService.updateTaskById(user.id, taskId, dto);
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    deleteTaskById(
        @CurrentUser() user: User,
        @Param('id', ParseIntPipe) taskId: number
    ): Promise<void> {
        return this.todoService.deleteTaskById(user.id, taskId);
    }
}
