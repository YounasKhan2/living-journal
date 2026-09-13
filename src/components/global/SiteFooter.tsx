import { Link } from 'react-router-dom'
import { Brand } from './Brand'

export function SiteFooter() {
  return <footer className="site-footer">
    <div className="site-footer__lead">
      <Brand/>
      <p>Independent perspective on technology, products and the people building what comes next.</p>
    </div>
    <div className="site-footer__links site-footer__links--wide">
      <div><strong>Explore</strong><Link to="/stories">Stories</Link><Link to="/category/ai">AI</Link><Link to="/category/development">Development</Link><Link to="/category/business">Business</Link></div>
      <div><strong>Journal</strong><Link to="/about">About</Link><Link to="/contact">Contact</Link><Link to="/advertise">Advertise</Link><Link to="/newsletter">Newsletter</Link></div><div><strong>Legal</strong><Link to="/legal/privacy">Privacy</Link><Link to="/legal/terms">Terms</Link><Link to="/legal/affiliate-disclosure">Affiliate disclosure</Link></div>
      <div><strong>Manage</strong><Link to="/admin">Admin</Link><Link to="/admin/posts">Posts</Link><Link to="/admin/settings">Settings</Link></div>
    </div>
    <div className="site-footer__bottom"><span>© 2026 The Living Journal</span><span>Built for thoughtful reading.</span></div>
  </footer>
}
