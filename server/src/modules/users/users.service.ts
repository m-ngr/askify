import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Not, Repository } from 'typeorm';
import { throwIfDuplicate } from 'src/common/utils/common';
import { secureHasher } from 'src/common/utils/securtiy-hasher';
import { ParamException } from 'src/common/utils/standard-exceptions';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { buildFilterQuery } from 'src/common/utils/query-filter';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { Sort } from 'src/common/utils/sort';
import { Select } from 'src/common/utils/select';
import { SearchDto } from 'src/common/dto/search.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { email, username, password } = createUserDto;

    const existingUser = await this.usersRepository.findOne({
      where: [{ username }, { email }],
      select: ['id', 'username', 'email'],
    });

    throwIfDuplicate({ email, username }, existingUser);

    const user = this.usersRepository.create({
      ...createUserDto,
      password: await secureHasher.hash(password),
    });

    return await this.usersRepository.save(user);
  }

  async findAll(
    filter: FilterUserDto,
    search: SearchDto,
    pagination: PaginationDto,
    sort: Sort,
    select: Select,
  ): Promise<Pagination<User>> {
    return paginate<User>(this.usersRepository, pagination, {
      where: buildFilterQuery<User>(filter, search.search),
      select: select.value,
      order: sort.value,
    });
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) throw new ParamException({ id: 'user not found' }, 404);
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id); // Check if user exists

    const { username, email } = updateUserDto;

    if (username || email) {
      const existingUser = await this.usersRepository.findOne({
        where: [
          { username, id: Not(id) },
          { email, id: Not(id) },
        ],
        select: ['id', 'username', 'email'],
      });

      throwIfDuplicate({ email, username }, existingUser);
    }

    if (updateUserDto.password) {
      updateUserDto.password = await secureHasher.hash(updateUserDto.password);
    }

    await this.usersRepository.update(id, updateUserDto);
    return await this.findOne(id);
  }

  async remove(id: string) {
    const result = await this.usersRepository.delete({ id });
    if (result.affected === 0) {
      throw new ParamException({ id: 'user not found' }, 404);
    }
  }
}
