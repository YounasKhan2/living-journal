import { LegalScreen } from '../../../../screens/Legal/LegalScreen'
export default async function Page({ params }: { params: Promise<{ page: string }> }) { const { page } = await params; return <LegalScreen page={page}/> }
