import { User, validatorError } from "../types";

class Validator {
  field: string;
  regex: RegExp;
  message: string;

  constructor(field: string, regex: RegExp, message: string) {
    this.field = field;
    this.regex = regex;
    this.message = message;
  }

  validate(input: string, isStrict: boolean = true): validatorError | null {
    if (isStrict || input) {
      if (!input || !input.match(this.regex)) {
        return { field: this.field, message: this.message };
      }
    }

    return null;
  }
}

export const userValidator = {
  firstName: new Validator(
    "firstName",
    /^[\s\S]{1,50}$/,
    "First Name must be between 1 and 50 characters"
  ),

  lastName: new Validator(
    "lastName",
    /^[\s\S]{1,50}$/,
    "Last Name must be between 1 and 50 characters"
  ),

  username: new Validator(
    "username",
    /^[a-zA-Z0-9._-]{3,20}$/,
    "Username must be between 3 and 20 characters and can only contain alphanumeric characters, dots, dashes, and underscores"
  ),

  email: new Validator(
    "email",
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    "Invalid email address"
  ),

  password: new Validator(
    "password",
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,50}$/,
    "Password must be between 8 and 50 characters, contain one uppercase letter, one lowercase letter, one number, and one special character"
  ),

  validate(user: User, isStrict: boolean = true): validatorError[] {
    const errors: (validatorError | null)[] = [];

    errors.push(userValidator.firstName.validate(user.firstName, isStrict));
    errors.push(userValidator.lastName.validate(user.lastName, isStrict));
    errors.push(userValidator.username.validate(user.username, isStrict));
    errors.push(userValidator.email.validate(user.email, isStrict));
    errors.push(userValidator.password.validate(user.password, isStrict));

    return errors.filter((e) => e) as validatorError[];
  },
};
