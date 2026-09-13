import * as argon2 from 'argon2'

export const PASSWORD_MIN_LENGTH = 12
export const PASSWORD_MAX_LENGTH = 128

export function validatePassword(password: string) {
  if (typeof password !== 'string') return false
  return password.length >= PASSWORD_MIN_LENGTH && password.length <= PASSWORD_MAX_LENGTH
}

export async function hashPassword(password: string) {
  if (!validatePassword(password)) {
    throw new Error(`Password must be ${PASSWORD_MIN_LENGTH}-${PASSWORD_MAX_LENGTH} characters long.`)
  }

  return argon2.hash(password, {
    type: argon2.argon2id,
  })
}

export async function verifyPassword(passwordHash: string, password: string) {
  if (!passwordHash || typeof password !== 'string' || password.length > PASSWORD_MAX_LENGTH) return false

  try {
    // The algorithm is encoded in the Argon2 hash itself; verify() does not
    // accept the hash `type` option in argon2's VerifyOptions.
    return await argon2.verify(passwordHash, password)
  } catch {
    return false
  }
}
