'use client'

import { useDocumentTitle } from '../../hooks/useDocumentTitle'

const content = {
  privacy: {
    title: 'Privacy policy',
    intro: 'A plain-language overview of the information this publication may collect and how it should be handled when production services are connected.',
    sections: [
      ['Information we collect', 'Newsletter forms may collect your email address. Analytics services may collect aggregated usage information such as page views, device type and referring source.'],
      ['How information is used', 'Information should be used to deliver requested services, understand readership, improve the publication and protect the website from abuse.'],
      ['Third-party services', 'When analytics, email, advertising or hosting providers are connected, their own privacy terms may apply to the data they process on behalf of the publication.'],
      ['Your choices', 'Readers should be able to unsubscribe from email communications and request deletion of directly identifying information held by the publication.'],
    ],
  },
  terms: {
    title: 'Terms of use',
    intro: 'These starter terms describe the intended relationship between readers and the publication. Have final production terms reviewed for your jurisdiction before launch.',
    sections: [
      ['Editorial content', 'Articles are provided for general information and commentary. They should not be treated as legal, financial, medical or other regulated professional advice.'],
      ['Acceptable use', 'Readers may access and share links to the publication but may not interfere with the service, scrape it abusively or republish substantial content without permission.'],
      ['Intellectual property', 'Original writing, visual identity and publication assets remain the property of their respective owners unless explicitly stated otherwise.'],
      ['Changes', 'The publication may update its features, policies and terms as the product evolves.'],
    ],
  },
  'affiliate-disclosure': {
    title: 'Affiliate disclosure',
    intro: 'Transparency matters. Some recommendations may eventually include affiliate links that earn the publication a commission without changing the reader’s purchase price.',
    sections: [
      ['Editorial independence', 'Commercial relationships should never determine whether a product receives positive coverage. Sponsored or affiliate-supported material should be clearly identified.'],
      ['Affiliate links', 'When an article contains affiliate links, the page should disclose that relationship near the relevant recommendation or at the beginning of the article.'],
      ['Sponsored content', 'Paid collaborations should be labeled clearly so readers can distinguish them from independent editorial work.'],
    ],
  },
} as const

type LegalKey = keyof typeof content

export function LegalScreen({ page = 'privacy' }: { page?: string }) {
  const key = (page in content ? page : 'privacy') as LegalKey
  const document = content[key]
  useDocumentTitle(document.title)

  return <main className="legal-page page-gutter page-top"><header className="page-intro"><span className="eyebrow">The fine print</span><h1>{document.title}</h1><p>{document.intro}</p></header><div className="legal-copy">{document.sections.map(([title, text]) => <section key={title}><h2>{title}</h2><p>{text}</p></section>)}</div></main>
}
