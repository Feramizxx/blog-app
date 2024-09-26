import {
  Body,
  Controller,
  Post,
  UseGuards,
  Put,
  Param,
  Delete,
  Get,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogDto } from './dto/blog.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from '@nestjs/common';

@Controller('blogs')
export class BlogsController {
  constructor(private blogService: BlogsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  createBlog(@Body() dto: BlogDto, @Request() req: any) {
    return this.blogService.createBlog(dto, req);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  updateBlog(@Body() dto: BlogDto, @Param('id') id: string) {
    return this.blogService.updateBlog(dto, id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  deleteBlog(@Param('id') id: string, @Body() dto: BlogDto) {
    return this.blogService.deleteBlog(id, dto);
  }

  @Get()
  getAllBlogs() {
    return this.blogService.getAllBlogs();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('my-blogs')
  getMyBlogs(@Request() req: any) {
    return this.blogService.getMyBlogs(req);
  }

  @Get(':id')
  getBlog(@Param('id') id: string) {
    return this.blogService.getBlog(id);
  }
}
