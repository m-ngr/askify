import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { entityHelper } from '../utils/entity';
import { StandardException } from '../utils/standard-exceptions';
import { Arg as ArgType, ArgOf } from '../utils/arg';

type Source = 'query' | 'body';

export const Arg = (
  source: Source,
  Arg: ArgOf<ArgType<any>>,
  Entity?: Function,
) => {
  return createParamDecorator(async (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const input = request[source]?.[Arg.key];
    const output = Arg.from(input);

    if (Entity) {
      const errors = entityHelper.validate(output.value, Entity);
      if (errors.length > 0) {
        throw new StandardException({ [source]: { [Arg.key]: errors } });
      }
    }

    return output;
  })();
};
