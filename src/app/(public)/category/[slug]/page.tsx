import { CategoryScreen } from '../../../../screens/Category/CategoryScreen'
export default async function Page({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; return <CategoryScreen slug={slug}/> }
