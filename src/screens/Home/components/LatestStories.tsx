import { ArrowUpRight } from 'phosphor-react'
import { Link } from 'react-router-dom'
import type { Post } from '../../../types/content'
import { SectionHeading } from '../../../components/global/SectionHeading'
export function LatestStories({posts}:{posts:Post[]}){return <section className="latest-stories page-gutter section-space"><SectionHeading title={<>Latest <span className="serif">stories</span></>} action={<Link className="text-link" to="/stories">View all <ArrowUpRight size={16}/></Link>}/><div className="latest-stories__list">{posts.map((post,index)=><Link to={`/stories/${post.slug}`} className="story-line reveal" key={post.id}><span className="story-line__number">{String(index+1).padStart(2,'0')}</span><div><h3>{post.title}</h3><p>{post.category} · {post.readTime}</p></div><div className="story-line__thumb"><img src={post.image} alt="" loading="lazy"/></div><ArrowUpRight className="story-line__arrow" size={22}/></Link>)}</div></section>}
