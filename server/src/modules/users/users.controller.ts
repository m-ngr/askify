import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  HttpCode,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UUIDParam } from 'src/common/decorators/uuid-param.decorator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { User } from './entities/user.entity';
import { SortArgs } from 'src/common/decorators/sort-args.decorator';
import { Sort } from 'src/common/utils/sort';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(
    @Query() filter: FilterUserDto,
    @Query() pagination: PaginationDto,
    @SortArgs(User, 'query') sort: Sort,
  ) {
    return this.usersService.findAll(filter, pagination, sort);
  }

  @Get(':id')
  findOne(@UUIDParam('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@UUIDParam('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@UUIDParam('id') id: string) {
    return this.usersService.remove(id);
  }
}
