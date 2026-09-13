import { redirect } from 'next/navigation'
import { LoginScreen } from '../../screens/Auth/LoginScreen'
import { safeReturnTo } from '../../server/auth/redirects'
import { readSession } from '../../server/auth/session'

type LoginPageProps = {
  searchParams: Promise<{ returnTo?: string }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await readSession()
  if (session) redirect('/admin')

  const params = await searchParams
  return <LoginScreen returnTo={safeReturnTo(params.returnTo)} />
}
