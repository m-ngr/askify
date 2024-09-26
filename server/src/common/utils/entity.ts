import { getMetadataArgsStorage } from 'typeorm';

export const entityHelper = {
  getFields(entity: Function): string[] {
    const entityMetadata = getMetadataArgsStorage();
    const columns = entityMetadata.columns.filter(
      (column) => column.target === entity && column.options.select !== false,
    );
    return columns.map((column) => column.propertyName);
  },

  validate(object: object, entity: Function): string[] {
    const entityFields = entityHelper.getFields(entity);
    const errors: string[] = [];
    for (const field in object) {
      if (entityFields.includes(field)) continue;
      errors.push(`'${field}' is not a valid field.`);
    }
    return errors;
  },
};
