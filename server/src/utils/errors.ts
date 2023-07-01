export function mongooseErrors(error: any) {
  const result: any[] = [];

  if (error.name === "ValidationError") {
    for (const field in error.errors) {
      result.push({ field, message: error.errors[field].message });
    }
  } else if (error.code === 11000) {
    for (const field in error.keyValue) {
      result.push({
        field,
        message: `${error.keyValue[field]} already exists`,
      });
    }
  }

  return result;
}
