import { ArrowUpRight } from 'phosphor-react'
import { Link } from 'react-router-dom'
import type { Post } from '../../../types/content'

export function EditorialRail({ posts }: { posts: Post[] }) {
  return <section className="editorial-rail"><div className="editorial-rail__intro page-gutter"><div><span className="eyebrow">Explore the signal</span><h2>What’s<br/><span className="serif">changing.</span></h2><p>Four stories. Four lenses on the next shift in technology and work.</p></div></div><div className="editorial-rail__track">{posts.map((post,index)=><article className="editorial-panel" key={post.id}><div className="editorial-panel__number">{String(index+1).padStart(2,'0')}</div><div className="editorial-panel__media"><img src={post.image} alt="" loading="lazy"/></div><div className="editorial-panel__copy"><span>{post.category}</span><h3>{post.title}</h3><p>{post.dek}</p><Link to={`/stories/${post.slug}`}>Read story <ArrowUpRight size={16}/></Link></div></article>)}</div></section>
}
