import type { ReactNode } from 'react'
import { AdminLayout } from '../../screens/Admin/components/AdminLayout'
import { requireUser } from '../../server/auth/guards'

export default async function Layout({ children }: { children: ReactNode }) {
  const user = await requireUser()
  return <AdminLayout user={{ name: user.name, email: user.email, role: user.role }}>{children}</AdminLayout>
}
