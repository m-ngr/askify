export function mongooseErrors(error: any) {
  const result: Record<string, string> = {};

  if (error.name === "ValidationError") {
    for (const field in error.errors) {
      result[field] = error.errors[field].message;
    }
  } else if (error.code === 11000) {
    for (const field in error.keyValue) {
      result[field] = `${error.keyValue[field]} already exists`;
    }
  } else if (error.name === "CastError") {
    const { path, kind } = error;
    result[path] = `${path} must be ${kind}`;
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
