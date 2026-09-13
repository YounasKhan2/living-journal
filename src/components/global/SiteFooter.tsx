import Link from 'next/link'
import { Brand } from './Brand'

export function SiteFooter() {
  return <footer className="site-footer">
    <div className="site-footer__lead">
      <Brand/>
      <p>Independent perspective on technology, products and the people building what comes next.</p>
    </div>
    <div className="site-footer__links site-footer__links--wide">
      <div><strong>Explore</strong><Link href="/stories">Stories</Link><Link href="/category/ai">AI</Link><Link href="/category/development">Development</Link><Link href="/category/business">Business</Link></div>
      <div><strong>Journal</strong><Link href="/about">About</Link><Link href="/contact">Contact</Link><Link href="/advertise">Advertise</Link><Link href="/newsletter">Newsletter</Link></div><div><strong>Legal</strong><Link href="/legal/privacy">Privacy</Link><Link href="/legal/terms">Terms</Link><Link href="/legal/affiliate-disclosure">Affiliate disclosure</Link></div>
      <div><strong>Manage</strong><Link href="/admin">Admin</Link><Link href="/admin/posts">Posts</Link><Link href="/admin/settings">Settings</Link></div>
    </div>
    <div className="site-footer__bottom"><span>© 2026 The Living Journal</span><span>Built for thoughtful reading.</span></div>
  </footer>
}
