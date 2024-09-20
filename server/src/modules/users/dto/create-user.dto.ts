import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { IsPassword } from 'src/common/decorators/password.decorator';
import { StringTransform } from 'src/common/decorators/string-transform.decorator';
import { IsUsername } from 'src/common/decorators/username.decorator';

export class CreateUserDto {
  @IsUsername()
  username: string;

  @IsEmail()
  email: string;

  @IsPassword()
  password: string;

  @IsNotEmpty()
  @StringTransform({ trim: 'both', whitespace: { collapse: true } })
  name: string;

  @IsOptional()
  @IsString()
  @StringTransform({ trim: 'both', whitespace: { collapse: true } })
  bio?: string;

  @IsOptional()
  @IsBoolean()
  allowAnonymous?: boolean;
}
