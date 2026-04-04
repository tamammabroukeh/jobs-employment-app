import { ZodRawShape, ZodSchema, z } from "zod";
import validator from "validator";

export const optionalUrlValidation = (params?: { error?: string }) => {
  const { error } = params ?? {};
  return z
    .string()
    .url(error ?? "Invalid URL")
    .optional()
    .nullable();
};

export const requiredUrlValidation = (params?: {
  error?: string;
  invalidError?: string;
}) => {
  const { error, invalidError } = params ?? {};
  return z
    .string({ message: error ?? "This field is required" })
    .min(1, error ?? "This field is required")
    .url(invalidError ?? "Invalid URL");
};

export const optionalDateTimeValidation = (params?: { error?: string }) => {
  const { error } = params ?? {};
  return z
    .string()
    .datetime(error ?? "Invalid datetime")
    .optional()
    .nullable();
};

export const requiredDateTimeValidation = (params?: {
  error?: string;
  invalidError?: string;
}) => {
  const { error, invalidError } = params ?? {};
  return z
    .string({ message: error ?? "This field is required" })
    .min(1, error ?? "This field is required")
    .datetime(invalidError ?? "Invalid datetime");
};

export const requiredEmailValidation = (params?: {
  error?: string;
  invalidError?: string;
}) => {
  const { error, invalidError } = params ?? {};
  return z
    .string({ message: error ?? "This field is required" })
    .min(1, error ?? "This field is required")
    .email(invalidError ?? "Invalid email address");
};

export const optionalEmailValidation = (params?: { error?: string }) => {
  const { error } = params ?? {};
  return z
    .string()
    .email(error ?? "Invalid email address")
    .optional()
    .nullable();
};

export const optionalBooleanValidation = () => {
  return z.boolean().optional().nullable();
};

export const requiredBooleanValidation = (params?: { error?: string }) => {
  const { error } = params ?? {};
  return z.boolean({
    message: error ?? "This field is required",
  });
};

export const optionalNumberValidation = (params?: {
  positive?: boolean;
  positiveError?: string;
  negative?: boolean;
  negativeError?: string;
  nonZero?: boolean;
  nonZeroError?: string;
}) => {
  const {
    positive = false,
    positiveError,
    negative = false,
    negativeError,
    nonZero = false,
    nonZeroError,
  } = params ?? {};
  let schema = z.number({});
  if (positive) {
    schema = schema.positive(
      positiveError ?? "Must be a positive number"
    );
  }
  if (nonZero) {
    schema = schema[negative ? "max" : "min"](
      0,
      nonZeroError ?? (negative ? "Must be less than zero" : "Must be greater than zero")
    );
  }
  if (negative) {
    schema = schema.negative(
      negativeError ?? "Must be a negative number"
    );
  }
  return schema.optional().nullable();
};

export const requiredNumberValidation = (params?: {
  error?: string;
  positive?: boolean;
  positiveError?: string;
  negative?: boolean;
  negativeError?: string;
  nonZero?: boolean;
  nonZeroError?: string;
}) => {
  const {
    error,
    positive = false,
    positiveError,
    negative = false,
    negativeError,
    nonZero = false,
    nonZeroError,
  } = params ?? {};
  let schema = z.number({
    message: error ?? "This field is required",
  });
  if (positive) {
    schema = schema.positive(
      positiveError ?? "Must be a positive number"
    );
  }
  if (nonZero) {
    schema = schema[negative ? "max" : "min"](
      0,
      nonZeroError ?? (negative ? "Must be less than zero" : "Must be greater than zero")
    );
  }
  if (negative) {
    schema = schema.negative(
      negativeError ?? "Must be a negative number"
    );
  }
  return schema;
};

export const optionalDateValidation = () => {
  return z.date().optional().nullable();
};

export const optionalStringValidation = () => {
  return z.string().optional().nullable();
};

export const requiredStringValidation = (params?: {
  error?: string;
  minLength?: number;
  minLengthError?: string;
  maxLength?: number;
  maxLengthError?: string;
  nullable?: boolean;
}) => {
  const { error, minLength, minLengthError, maxLength, maxLengthError } =
    params ?? {};
  let schema = z.string({
    message: error ?? "This field is required",
  });
  if (minLength) {
    schema = schema.min(
      minLength,
      minLengthError ?? `Must be at least ${minLength} characters`
    );
  } else {
    schema = schema.min(1, error ?? "This field is required");
  }
  if (maxLength) {
    schema = schema.max(
      maxLength,
      maxLengthError ?? `Must be at most ${maxLength} characters`
    );
  }
  return schema;
};

export const objectValidation = (params?: {
  objectSchema?: ZodRawShape;
  error?: string;
  optional?: boolean;
}) => {
  const { objectSchema, error, optional = false } = params ?? {};
  const schema = z.object(objectSchema ?? {}, {
    message: error ?? "This field is required",
  });
  if (optional) {
    return schema.optional().nullable();
  }
  return schema;
};
export const arrayValidation = (params?: {
  itemSchema?: ZodSchema;
  error?: string;
  minLength?: number;
  minLengthError?: string;
  maxLength?: number;
  maxLengthError?: string;
  optional?: boolean;
}) => {
  const {
    itemSchema,
    error,
    minLength,
    minLengthError,
    maxLength,
    maxLengthError,
    optional = false,
  } = params ?? {};
  let schema = z.array(itemSchema ?? z.string(), {
    message: error ?? "This field is required",
  });
  if (minLength) {
    schema = schema.min(
      minLength,
      minLengthError ?? `Must have at least ${minLength} items`
    );
  }
  if (maxLength) {
    schema = schema.max(
      maxLength,
      maxLengthError ?? `Must have at most ${maxLength} items`
    );
  }
  if (optional) {
    return schema.optional().nullable();
  }
  return schema;
};

export const requiredEnumValidation = (params: {
  enumValues: string[];
  error?: string;
}) => {
  const { enumValues, error } = params ?? {};
  return z.enum(enumValues as [string, ...string[]], {
    message: error ?? "This field is required",
  });
};

export const localeStringValidation = (params?: {
  languages?: string[];
  requiredLanguages?: string[];
  error?: string;
}) => {
  const {
    error,
    languages = ["en", "ar"],
    requiredLanguages = ["en"],
  } = params ?? {};
    const obj: Record<string, ZodSchema> = {};
  languages.forEach(
    (s) =>
      (obj[s] =
        requiredLanguages.findIndex((r) => r === s) > -1
          ? requiredStringValidation({ error })
          : z.string().optional().nullable())
  );
  if (requiredLanguages.length === 0) {
    return z.object(obj).optional().nullable();
  }
  return z.object(obj);
};
export const localeArrayStringValidation = (params?: {
  languages?: string[];
  requiredLanguages?: string[];
  error?: string;
}) => {
  const {
    error,
    languages = ["en", "ar"],
    requiredLanguages = ["en"],
  } = params ?? {};
  const obj: Record<string, ZodSchema> = {};
  languages.forEach(
    (s) =>
      (obj[s] = arrayValidation({
        itemSchema: requiredStringValidation({ error }),
        optional: requiredLanguages.findIndex((r) => r === s) === -1,
      }))
  );
  if (requiredLanguages.length === 0) {
    return z.object(obj).optional().nullable();
  }
  return z.object(obj);
};

export const requiredPhoneValidation = (params?: {
  error?: string;
  invalidError?: string;
}) => {
  const { error, invalidError } = params ?? {};
  const schema = z
    .string({ message: error ?? "This field is required" })
    .min(1, error ?? "This field is required")
    .refine(validator.isMobilePhone, {
      message: invalidError ?? "Invalid phone number",
    });

  return schema;
};

export const optionalPhoneValidation = (params?: { invalidError?: string }) => {
  const { invalidError } = params ?? {};
  const schema = z
    .string()
    .refine(validator.isMobilePhone, {
      message: invalidError ?? "Invalid phone number",
    })
    .optional()
    .nullable();

  return schema;
};

export function validateUrl(string: string) {
  try {
    const url = new URL(string);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function validateEmail(string: string) {
  if (string && string.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) {
    return true;
  }
  return false;
}

export function validatePhone(string: string) {
  if (
    string &&
    string.match(
      /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
    )
  ) {
    return true;
  }
  return false;
}
