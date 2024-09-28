import { IsOptional, IsString } from 'class-validator';
import { DtoType } from '../decorators/dto-type.decorator';
import { StringTransform } from '../decorators/string-transform.decorator';

@DtoType('query')
export class SearchDto {
  @IsOptional()
  @IsString()
  @StringTransform()
  search?: string;
}
