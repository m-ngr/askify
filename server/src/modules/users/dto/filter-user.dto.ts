import { IsOptional, IsString, IsBoolean } from 'class-validator';
import { BooleanTransform } from 'src/common/decorators/boolean-transform.decorator';
import {
  DateRange,
  DateRangeTransform,
  IsDateRange,
} from 'src/common/decorators/date-range.decorator';
import { DtoType } from 'src/common/decorators/dto-type.decorator';
import { Searchable } from 'src/common/decorators/tags.decorator';

@DtoType('query')
export class FilterUserDto {
  @IsOptional()
  @IsString()
  @Searchable()
  username?: string;

  @IsOptional()
  @IsString()
  @Searchable()
  email?: string;

  @IsOptional()
  @IsString()
  @Searchable()
  name?: string;

  @IsOptional()
  @IsString()
  @Searchable()
  bio?: string;

  @IsOptional()
  @BooleanTransform()
  @IsBoolean()
  allowAnonymous?: boolean;

  @IsOptional()
  @BooleanTransform()
  @IsBoolean()
  emailVerified?: boolean;

  @IsOptional()
  @IsDateRange()
  @DateRangeTransform()
  updatedAt?: DateRange;

  @IsOptional()
  @IsDateRange()
  @DateRangeTransform()
  createdAt?: DateRange;
}
