import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from './schemas/blog.schema';
import { Model } from 'mongoose';
import { BlogDto } from './dto/blog.dto';
import { User, UserDocument } from 'src/auth/schemas/user.schema';

@Injectable()
export class BlogsService {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<BlogDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async createBlog(dto: BlogDto, req: any) {
    const user = await this.userModel.findOne({ email: req.user.email });
    const newBlog = new this.blogModel({
      title: dto.title,
      content: dto.content,
      sharedBy: user.email,
      userId: user._id,
    });
    return await newBlog.save();
  }

  async updateBlog(dto: BlogDto, id: string) {
    const blog = await this.blogModel.findById(id);
    if (dto.userId !== blog.userId) {
      throw new UnauthorizedException(
        'You are not authorized to update this blog',
      );
    }
    return await this.blogModel.findByIdAndUpdate(id, dto, { new: true });
  }

  async deleteBlog(id: string, dto: BlogDto) {
    const blog = await this.blogModel.findById(id);
    if (dto.userId !== blog.userId) {
      throw new UnauthorizedException(
        'You are not authorized to delete this blog',
      );
    }
    return await this.blogModel.findByIdAndDelete(id);
  }

  async getAllBlogs() {
    return await this.blogModel.find();
  }

  async getMyBlogs(req: any) {
    const user = await this.userModel.findOne({ email: req.user.email });
    return await this.blogModel.find({ userId: user._id });
  }

  async getBlog(id: string) {
    return await this.blogModel.findById(id);
  }
}
