import { ExternalLink, Youtube } from 'lucide-react'
import { PageHero, SectionHead, SiteCard, Bidi } from '../components/ui.jsx'
import { websitesResources, youtubeChannels } from '../data/contentData.js'

export function Websites() {
  const isForum = (s) => s.category === 'منتدى' || s.category === 'منصة تدريب'
  const sites = websitesResources.filter((s) => !isForum(s))
  const forums = websitesResources.filter(isForum)
  return (
    <div className="min-h-screen">
      <PageHero
        badge="مواقع مفيدة"
        badgeIcon="Book"
        title="مواقع مفيدة"
        desc="مجموعة مختارة من أفضل المواقع في مجال الأمن السيبراني و اختبار الاختراق ."
      />
      <section className="py-16">
        <div className="container mx-auto px-4">
          <SectionHead title="المواقع المميزة" subtitle="استكشف هذه المصادر القيمة لتطوير مهاراتك ." glowColor="green" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {sites.map((s, i) => (
              <SiteCard key={s.link} {...s} delay={i} className={i === sites.length - 1 && sites.length % 3 === 1 ? 'lg:col-start-2' : ''} />
            ))}
          </div>
        </div>
      </section>
      <section className="py-16">
        <div className="container mx-auto px-4">
          <SectionHead title="منتديات و منصات مفيدة" subtitle="مجتمعات عربية لتبادل الخبرات و التعلم في الأمن السيبراني ." glowColor="purple" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {forums.map((s, i) => (
              <SiteCard key={s.link} {...s} delay={i} theme="pink" />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

function ChannelCard({ name, description, url, delay = 0 }) {
  return (
    <div className="cyber-card group opacity-0 animate-fade-in-up" style={{ animationDelay: `${delay * 0.1}s`, animationFillMode: 'forwards' }}>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 rounded bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
            <Youtube className="w-6 h-6" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2 group-hover:glow-green transition-all duration-300 font-mono-en"><Bidi text={name} /></h3>
        <p className="text-muted-foreground text-sm mb-4"><Bidi text={description} /></p>
        <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors group/link">
          <span className="border-b border-primary/50 group-hover/link:border-primary transition-colors">زيارة القناة</span>
          <ExternalLink className="w-4 h-4 transition-transform group-hover/link:-translate-x-1 group-hover/link:-translate-y-1" />
        </a>
      </div>
    </div>
  )
}

export function YoutubeChannels() {
  return (
    <div className="min-h-screen">
      <PageHero
        badge="مصادر مفيدة"
        badgeIcon="Youtube"
        title="قنوات يوتيوب مفيدة"
        desc="أفضل قنوات يوتيوب العربية و الإنجليزية لتعلم الأمن السيبراني ."
      />
      <section className="py-16">
        <div className="container mx-auto px-4">
          <SectionHead title="قنوات يوتيوب" subtitle="أفضل قنوات يوتيوب لتعلم الأمن السيبراني و اختبار الاختراق ." glowColor="green" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {youtubeChannels.map((c, i) => (
              <ChannelCard key={c.url} {...c} delay={i} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
