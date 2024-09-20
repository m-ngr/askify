// import {
//   IsBoolean,
//   IsEmail,
//   IsNotEmpty,
//   IsOptional,
//   IsString,
// } from 'class-validator';
// import { IsPassword } from 'src/common/decorators/password.decorator';
// import { StringTransform } from 'src/common/decorators/string-transform.decorator';
// import { IsUsername } from 'src/common/decorators/username.decorator';

// export class UpdateUserDto {
//   @IsOptional()
//   @IsUsername()
//   username?: string;

//   @IsOptional()
//   @IsEmail()
//   email?: string;

//   @IsOptional()
//   @IsPassword()
//   password?: string;

//   @IsOptional()
//   @IsNotEmpty()
//   @StringTransform({ trim: 'both', whitespace: { collapse: true } })
//   name?: string;

//   @IsOptional()
//   @IsString()
//   @StringTransform({ trim: 'both', whitespace: { collapse: true } })
//   bio?: string;

//   @IsOptional()
//   @IsBoolean()
//   allowAnonymous?: boolean;
// }

import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
