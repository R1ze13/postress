import { FieldError } from '../generated/graphql'

type TErrorMap = Record<string, string>

export function toErrorMap(errors: Array<FieldError>): TErrorMap {
  const recordMap: TErrorMap = {}

  errors.forEach(({ field, message }) => {
    recordMap[field.toLowerCase()] = message
  })

  return recordMap
}
