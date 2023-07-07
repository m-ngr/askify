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
  } else if (error.name === "CastError") {
    const { path: field, kind } = error;
    result.push({ field, message: `${field} must be ${kind}` });
  }

  return result;
}

export function isValidRegex(input: string) {
  try {
    new RegExp(input);
    return true;
  } catch {
    return false;
  }
}
