import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { StandardException } from '../utils/standard-exceptions';
import { Sort } from '../utils/sort';

type SortSource = 'query' | 'body';

export const SortArgs = (entity: Function, source: SortSource) => {
  return createParamDecorator(async (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const sortInput = request[source]?.sort;
    let sortOutput = new Sort();

    if (Array.isArray(sortInput)) {
      const orderInput = request[source]?.order;
      sortOutput = Sort.fromArray(
        sortInput,
        Array.isArray(orderInput) ? orderInput : [],
      );
    } else if (typeof sortInput === 'string') {
      const orderInput = String(request[source]?.order);
      sortOutput = Sort.fromString(sortInput, orderInput);
    } else if (typeof sortInput === 'object') {
      sortOutput = Sort.fromObject(sortInput);
    }

    const errors = sortOutput.validate(entity);
    if (errors.length > 0) {
      throw new StandardException({ [source]: { sort: errors } });
    }

    return sortOutput;
  })();
};
