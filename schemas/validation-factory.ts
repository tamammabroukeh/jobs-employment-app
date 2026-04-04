import { z, ZodRawShape, ZodSchema } from "zod"
import validator from "validator"

/**
 * Factory function to create validation schemas with translations
 * Use this in your components/hooks where you have access to useTranslations
 * 
 * @example
 * const t = useTranslations('errors.validation')
 * const validations = createValidations(t)
 * const schema = z.object({
 *   email: validations.requiredEmail(),
 *   name: validations.requiredString({ minLength: 3 })
 * })
 */
export function createValidations(t: (key: string, values?: Record<string, string | number>) => string) {
  return {
    // String validations
    optionalString: () => z.string().optional().nullable(),

    requiredString: (params?: {
      error?: string
      minLength?: number
      minLengthError?: string
      maxLength?: number
      maxLengthError?: string
    }) => {
      const { error, minLength, minLengthError, maxLength, maxLengthError } = params ?? {}
      let schema = z.string({ message: error ?? t("required") })

      if (minLength) {
        schema = schema.min(
          minLength,
          minLengthError ?? t("minLength", { min: minLength })
        )
      } else {
        schema = schema.min(1, error ?? t("required"))
      }

      if (maxLength) {
        schema = schema.max(
          maxLength,
          maxLengthError ?? t("maxLength", { max: maxLength })
        )
      }

      return schema
    },

    // Email validations
    optionalEmail: (params?: { error?: string }) => {
      const { error } = params ?? {}
      return z.string().email(error ?? t("invalidEmail")).optional().nullable()
    },

    requiredEmail: (params?: { error?: string; invalidError?: string }) => {
      const { error, invalidError } = params ?? {}
      return z
        .string({ message: error ?? t("required") })
        .min(1, error ?? t("required"))
        .email(invalidError ?? t("invalidEmail"))
    },

    // URL validations
    optionalUrl: (params?: { error?: string }) => {
      const { error } = params ?? {}
      return z.string().url(error ?? t("invalidUrl")).optional().nullable()
    },

    requiredUrl: (params?: { error?: string; invalidError?: string }) => {
      const { error, invalidError } = params ?? {}
      return z
        .string({ message: error ?? t("required") })
        .min(1, error ?? t("required"))
        .url(invalidError ?? t("invalidUrl"))
    },

    // Phone validations
    optionalPhone: (params?: { invalidError?: string }) => {
      const { invalidError } = params ?? {}
      return z
        .string()
        .refine(validator.isMobilePhone, {
          message: invalidError ?? t("invalidPhone"),
        })
        .optional()
        .nullable()
    },

    requiredPhone: (params?: { error?: string; invalidError?: string }) => {
      const { error, invalidError } = params ?? {}
      return z
        .string({ message: error ?? t("required") })
        .min(1, error ?? t("required"))
        .refine(validator.isMobilePhone, {
          message: invalidError ?? t("invalidPhone"),
        })
    },

    // Number validations
    optionalNumber: (params?: {
      positive?: boolean
      positiveError?: string
      negative?: boolean
      negativeError?: string
      nonZero?: boolean
      nonZeroError?: string
    }) => {
      const {
        positive = false,
        positiveError,
        negative = false,
        negativeError,
        nonZero = false,
        nonZeroError,
      } = params ?? {}

      let schema = z.number({})

      if (positive) {
        schema = schema.positive(positiveError ?? t("positiveNumber"))
      }
      if (nonZero) {
        schema = schema[negative ? "max" : "min"](
          0,
          nonZeroError ?? t(negative ? "lessThanZero" : "greaterThanZero")
        )
      }
      if (negative) {
        schema = schema.negative(negativeError ?? t("negativeNumber"))
      }

      return schema.optional().nullable()
    },

    requiredNumber: (params?: {
      error?: string
      positive?: boolean
      positiveError?: string
      negative?: boolean
      negativeError?: string
      nonZero?: boolean
      nonZeroError?: string
    }) => {
      const {
        error,
        positive = false,
        positiveError,
        negative = false,
        negativeError,
        nonZero = false,
        nonZeroError,
      } = params ?? {}

      let schema = z.number({ message: error ?? t("required") })

      if (positive) {
        schema = schema.positive(positiveError ?? t("positiveNumber"))
      }
      if (nonZero) {
        schema = schema[negative ? "max" : "min"](
          0,
          nonZeroError ?? t(negative ? "lessThanZero" : "greaterThanZero")
        )
      }
      if (negative) {
        schema = schema.negative(negativeError ?? t("negativeNumber"))
      }

      return schema
    },

    // Boolean validations
    optionalBoolean: () => z.boolean().optional().nullable(),

    requiredBoolean: (params?: { error?: string }) => {
      const { error } = params ?? {}
      return z.boolean({ message: error ?? t("required") })
    },

    // Date validations
    optionalDate: () => z.date().optional().nullable(),

    optionalDateTime: (params?: { error?: string }) => {
      const { error } = params ?? {}
      return z.string().datetime(error ?? t("invalidDatetime")).optional().nullable()
    },

    requiredDateTime: (params?: { error?: string; invalidError?: string }) => {
      const { error, invalidError } = params ?? {}
      return z
        .string({ message: error ?? t("required") })
        .min(1, error ?? t("required"))
        .datetime(invalidError ?? t("invalidDatetime"))
    },

    // Array validations
    array: (params?: {
      itemSchema?: ZodSchema
      error?: string
      minLength?: number
      minLengthError?: string
      maxLength?: number
      maxLengthError?: string
      optional?: boolean
    }) => {
      const {
        itemSchema,
        error,
        minLength,
        minLengthError,
        maxLength,
        maxLengthError,
        optional = false,
      } = params ?? {}

      let schema = z.array(itemSchema ?? z.string(), {
        message: error ?? t("required"),
      })

      if (minLength) {
        schema = schema.min(
          minLength,
          minLengthError ?? t("arrayMinLength", { min: minLength })
        )
      }
      if (maxLength) {
        schema = schema.max(
          maxLength,
          maxLengthError ?? t("arrayMaxLength", { max: maxLength })
        )
      }

      if (optional) {
        return schema.optional().nullable()
      }
      return schema
    },

    // Object validations
    object: (params?: {
      objectSchema?: ZodRawShape
      error?: string
      optional?: boolean
    }) => {
      const { objectSchema, error, optional = false } = params ?? {}
      const schema = z.object(objectSchema ?? {}, {
        message: error ?? t("required"),
      })

      if (optional) {
        return schema.optional().nullable()
      }
      return schema
    },

    // Enum validations
    requiredEnum: (params: { enumValues: string[]; error?: string }) => {
      const { enumValues, error } = params ?? {}
      return z.enum(enumValues as [string, ...string[]], {
        message: error ?? t("required"),
      })
    },

    // Locale string validations
    localeString: (params?: {
      languages?: string[]
      requiredLanguages?: string[]
      error?: string
    }) => {
      const {
        error,
        languages = ["en", "ar"],
        requiredLanguages = ["en"],
      } = params ?? {}

      const obj: Record<string, ZodSchema> = {}
      languages.forEach((s) => {
        obj[s] =
          requiredLanguages.findIndex((r) => r === s) > -1
            ? z.string({ message: error ?? t("required") }).min(1, error ?? t("required"))
            : z.string().optional().nullable()
      })

      if (requiredLanguages.length === 0) {
        return z.object(obj).optional().nullable()
      }
      return z.object(obj)
    },

    localeArrayString: (params?: {
      languages?: string[]
      requiredLanguages?: string[]
      error?: string
    }) => {
      const {
        error,
        languages = ["en", "ar"],
        requiredLanguages = ["en"],
      } = params ?? {}

      const obj: Record<string, ZodSchema> = {}
      const requiredStr = z.string({ message: error ?? t("required") }).min(1, error ?? t("required"))

      languages.forEach((s) => {
        const isRequired = requiredLanguages.findIndex((r) => r === s) > -1
        obj[s] = isRequired
          ? z.array(requiredStr, { message: error ?? t("required") })
          : z.array(requiredStr).optional().nullable()
      })

      if (requiredLanguages.length === 0) {
        return z.object(obj).optional().nullable()
      }
      return z.object(obj)
    },
  }
}
