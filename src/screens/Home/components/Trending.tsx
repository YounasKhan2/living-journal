import { ArrowUpRight } from 'phosphor-react'
import Link from 'next/link'
import type { Post } from '../../../types/content'
import { SectionHeading } from '../../../components/global/SectionHeading'

export function Trending({ posts }: { posts: Post[] }) {
  return <section className="trending-block page-gutter section-space">
    <SectionHeading eyebrow="Read by everyone" title={<>Trending <span className="serif">now</span></>}/>
    <div>{posts.map((post, index) => <Link href={`/stories/${post.slug}`} key={post.id} className="trending-row reveal"><span>{String(index + 1).padStart(2, '0')}</span><h3>{post.title}</h3><div><span>{post.category}</span><ArrowUpRight size={18}/></div></Link>)}</div>
  </section>
}
