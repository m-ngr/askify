import { IsString } from 'class-validator';
import { DtoType } from 'src/common/decorators/dto-type.decorator';

@DtoType('body')
export class LoginDto {
  @IsString()
  login: string;
  @IsString()
  password: string;
}
