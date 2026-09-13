export type AuthRole = 'ADMIN' | 'EDITOR'

export type Capability =
  | 'cms:read'
  | 'content:write'
  | 'content:publish'
  | 'audience:read'
  | 'settings:manage'
  | 'users:manage'
  | 'monetization:manage'

const roleCapabilities: Record<AuthRole, ReadonlySet<Capability>> = {
  ADMIN: new Set<Capability>([
    'cms:read',
    'content:write',
    'content:publish',
    'audience:read',
    'settings:manage',
    'users:manage',
    'monetization:manage',
  ]),
  EDITOR: new Set<Capability>([
    'cms:read',
    'content:write',
    'content:publish',
    'audience:read',
  ]),
}

export function hasCapability(role: AuthRole, capability: Capability) {
  return roleCapabilities[role].has(capability)
}

export function capabilitiesForRole(role: AuthRole) {
  return [...roleCapabilities[role]]
}
