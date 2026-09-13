import 'server-only'

import { readSession } from './session'
import { hasCapability, type Capability } from './permissions'

export async function getAuthorizedUser(capability?: Capability) {
  const session = await readSession()
  if (!session) return null
  if (capability && !hasCapability(session.user.role, capability)) return null
  return session.user
}
