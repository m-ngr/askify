import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  HttpCode,
  Query,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UUIDParam } from 'src/common/decorators/uuid-param.decorator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { User } from './entities/user.entity';
import { Arg } from 'src/common/decorators/arg.decorator';
import { Sort } from 'src/common/utils/sort';
import { Select } from 'src/common/utils/select';
import { SearchDto } from 'src/common/dto/search.dto';
import { Public } from '../auth/public.decorator';
import { AuthUser } from 'src/common/decorators/auth-user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Public()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(
    @Query() filter: FilterUserDto,
    @Query() search: SearchDto,
    @Query() pagination: PaginationDto,
    @Arg('query', Sort, User) sort: Sort,
    @Arg('query', Select, User) select: Select,
  ) {
    return this.usersService.findAll(filter, search, pagination, sort, select);
  }

  @Get(':id')
  findOne(@UUIDParam('id') id: string, @AuthUser() user: User) {
    if (user.id !== id) throw new ForbiddenException();
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(
    @UUIDParam('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @AuthUser() user: User,
  ) {
    if (user.id !== id) throw new ForbiddenException();
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@UUIDParam('id') id: string, @AuthUser() user: User) {
    if (user.id !== id) throw new ForbiddenException();
    return this.usersService.remove(id);
  }
}
