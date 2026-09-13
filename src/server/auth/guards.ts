import 'server-only'

import { redirect } from 'next/navigation'
import { readSession } from './session'
import { hasCapability, type AuthRole, type Capability } from './permissions'

export async function requireUser() {
  const session = await readSession()
  if (!session) redirect('/login?returnTo=/admin')
  return session.user
}

export async function requireRole(role: AuthRole) {
  const user = await requireUser()
  if (user.role !== role) redirect('/admin?forbidden=1')
  return user
}

export async function requireCapability(capability: Capability) {
  const user = await requireUser()
  if (!hasCapability(user.role, capability)) redirect('/admin?forbidden=1')
  return user
}
