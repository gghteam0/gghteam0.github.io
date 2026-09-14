import {
  Shield, Terminal, Code, Network, Bug, Globe, Server, Eye, BookOpen,
  Youtube, Github, ExternalLink, Flag, Trophy, Zap, Database, Search,
  Cpu, Wifi, Key, Users, Gift, Instagram, Heart, Radar, FileCode,
  FileSearch, FileText, Image, Clock, Mail, Camera, MapPin, Megaphone, Radio,
  Hash, CircleHelp, Lock, HardDrive, Target, Monitor,
} from 'lucide-react'
import { Link } from 'react-router-dom'

// شعارات المنصات (SVG أصلية)
export function XLogo({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

export function TikTokLogo({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  )
}

export function TelegramLogo({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  )
}

export function SubstackLogo({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
    </svg>
  )
}

// يعزل المقاطع العربية داخل سطر أوامر إنجليزي (LTR)
// عشان حاجة زي http.request (فلتر HTTP) تظهر بترتيبها الصح
export function BidiCmd({ text }) {
  if (text === null || text === undefined) return null
  const parts = String(text).split(/([\u0600-\u06FF][\u0600-\u06FF ]*)/g)
  return (
    <>
      {parts.map((p, i) =>
        p === '' ? null : /[\u0600-\u06FF]/.test(p) ? (
          <span key={i} dir="rtl" style={{ unicodeBidi: 'isolate' }}>{p}</span>
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </>
  )
}

// يعزل المقاطع الإنجليزية/الأرقام والرموز داخل النص العربي
// عشان علامات زي + تفضل لازقة في مكانها الصح (مثال: CompTIA A+)
export function Bidi({ text }) {
  if (text === null || text === undefined) return null
  const parts = String(text).split(/([A-Za-z0-9+]+(?:[ .\/_-]*[A-Za-z0-9+]+)*)/g)
  return (
    <>
      {parts.map((p, i) =>
        p === '' ? null : i % 2 === 1 ? (
          <span key={i} dir="ltr" style={{ unicodeBidi: 'isolate' }}>{p}</span>
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </>
  )
}

export function Icon({ name, className }) {
  const map = {
    Shield, Terminal, Code, Network, Bug, Globe, Server, Eye,
    Book: BookOpen, BookOpen, Youtube, Github, Flag, Trophy, Zap, Database,
    Search, Cpu, Wifi, Key, Users, Gift,
    Instagram, Heart, Radar, FileCode, FileSearch, FileText, Image,
    Clock, Mail, Camera, MapPin, Radio, Hash, CircleHelp,
    Lock, HardDrive, Target, Monitor,
  }
  const C = map[name] || Terminal
  return <C className={className} />
}

export function Corners({ color = 'primary', hex }) {
  const c = hex
    ? ''
    : color === 'secondary'
      ? 'border-secondary/30 group-hover:border-secondary'
      : color === 'pink'
        ? 'border-pink-500/30 group-hover:border-pink-500'
        : 'border-primary/30 group-hover:border-primary'
  const style = hex ? { borderColor: hex } : undefined
  return (
    <>
      <div style={style} className={`absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 ${c} transition-colors`} />
      <div style={style} className={`absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 ${c} transition-colors`} />
      <div style={style} className={`absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 ${c} transition-colors`} />
      <div style={style} className={`absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 ${c} transition-colors`} />
    </>
  )
}

// te — عنوان قسم (أبيض بتوهج تركوازي)
export function SectionHead({ title, subtitle }) {
  return (
    <div className="text-center mb-12">
      <h2 className="text-3xl md:text-4xl font-bold font-display text-white glow-green mb-4">{title}</h2>
      {subtitle && <p className="text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>}
      <div className="flex items-center justify-center gap-2 mt-6">
        <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary" />
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
        <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary" />
      </div>
    </div>
  )
}

// ii — بطاقة خريطة الطريق
const levelCls = { beginner: 'level-beginner', intermediate: 'level-intermediate', advanced: 'level-advanced' }
const levelTxt = { beginner: 'مبتدئ', intermediate: 'متوسط', advanced: 'متقدم' }

export function RoadmapCard({ title, description, link, icon, level, isInternal = false }) {
  const inner = (
    <>
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="p-2 rounded bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                <Icon name={icon} className="w-5 h-5" />
              </div>
            )}
            {level && <span className={`level-badge ${levelCls[level]}`}>{levelTxt[level]}</span>}
          </div>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2 group-hover:glow-green transition-all duration-300"><Bidi text={title} /></h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2"><Bidi text={description} /></p>
        <span className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors group/link">
          <span className="border-b border-primary/50 group-hover/link:border-primary transition-colors">
            {isInternal ? 'عرض المصادر' : 'ابدأ التعلم'}
          </span>
          {!isInternal && <ExternalLink className="w-4 h-4 transition-transform group-hover/link:-translate-x-1 group-hover/link:-translate-y-1" />}
        </span>
      </div>
      <Corners />
    </>
  )
  return isInternal ? (
    <Link to={link} className="cyber-card group block">{inner}</Link>
  ) : (
    <a href={link} target="_blank" rel="noopener noreferrer" className="cyber-card group block">{inner}</a>
  )
}

// بطاقة دورة/موقع (خضراء)
export function VideoCard({ title, description, link, type, btnLabel = 'مشاهدة الدورة', delay = 0, discount, icon = 'Youtube', mono = false, recommended = false }) {
  const delayStyle = { animationDelay: `${delay * 0.1}s`, animationFillMode: 'forwards' }
  const content = (
    <>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 rounded bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
            <Icon name={icon} className="w-6 h-6" />
          </div>
          {type && (
            <span className={`text-xs px-3 py-1 rounded-full border ${String(type).includes('يوتيوب') ? 'bg-red-500/10 text-red-400 border-red-500/40' : String(type) === 'موقع تعليمي' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40' : String(type) === 'دورة احترافية' ? 'bg-[#ffbf00]/10 text-[#ffbf00] border-[#ffbf00]/40' : ['اختبار الاختراق', 'للمبتدئين', 'خوادم', 'للمطورين', 'متقدم'].includes(String(type)) ? 'bg-[#367bf0]/10 text-[#6ea8ff] border-[#367bf0]/40' : 'bg-secondary/20 text-secondary border-secondary/30'}`}>
              {type}
            </span>
          )}
        </div>
        <h3 className={`text-lg font-semibold text-white mb-2 group-hover:glow-green transition-all duration-300${mono ? ' font-mono-en' : ''}`}><Bidi text={title} /></h3>
        <p className="text-muted-foreground text-sm mb-4"><Bidi text={description} /></p>
        {discount && (
          <div className="mb-4 p-3 rounded bg-neon-blue/10 border border-neon-blue/30">
            <span className="text-neon-blue text-sm font-medium">{discount}</span>
          </div>
        )}
        <a href={link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors group/link">
          <span className="border-b border-primary/50 group-hover/link:border-primary transition-colors">{btnLabel}</span>
          <ExternalLink className="w-4 h-4 transition-transform group-hover/link:-translate-x-1 group-hover/link:-translate-y-1" />
        </a>
      </div>
      <Corners />
    </>
  )
  if (!recommended) {
    return (
      <div className="cyber-card group opacity-0 animate-fade-in-up" style={delayStyle}>
        {content}
      </div>
    )
  }
  return (
    <div className="relative opacity-0 animate-fade-in-up" style={delayStyle}>
      <div aria-hidden="true" className="recommended-beam pointer-events-none absolute -inset-[1.5px] rounded-[10px]" />
      <div className="absolute -top-4 left-1/2 z-20 animate-badge-float">
        <span className="badge-shine inline-flex items-center gap-1.5 text-xs font-bold px-4 py-1.5 rounded-full text-[#2a1503] bg-gradient-to-l from-[#ffb25b] via-[#ffd9ad] to-[#ff8e00] shadow-[0_0_22px_rgba(255,142,0,0.65)] whitespace-nowrap">
          <Megaphone className="w-3.5 h-3.5" />
          الأكثر ترشيحاً
        </span>
      </div>
      <div className="cyber-card group relative border-[#ffb25b]/50">
        {content}
      </div>
    </div>
  )
}

// ألوان شارات التصنيفات — كل تصنيف بلون مناسب وواضح
function categoryBadgeColors(cat) {
  switch (cat) {
    case 'موارد تعليمية':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40'
    case 'أمن الويب':
      return 'bg-[#3dc2ff]/10 text-[#3dc2ff] border-[#3dc2ff]/40'
    case 'أدوات تحليل':
      return 'bg-orange-500/10 text-orange-400 border-orange-500/40'
    case 'قواعد بيانات':
      return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/40'
    case 'أدوات Linux':
      return 'bg-[#367bf0]/10 text-[#6ea8ff] border-[#367bf0]/40'
    case 'أدوات Windows':
      return 'bg-yellow-500/10 text-yellow-300 border-yellow-500/40'
    case 'منتدى':
      return 'bg-pink-500/10 text-pink-400 border-pink-500/40'
    default:
      return 'bg-secondary/20 text-secondary border-secondary/30'
  }
}
export function SiteCard({ title, description, link, category, color, btnLabel = 'زيارة المصدر', delay = 0, theme = 'green', className = '' }) {
  const custom = !!color
  const purple = theme === 'purple'
  const pink = theme === 'pink'
  const box = custom
    ? 'p-3 rounded transition-colors'
    : purple
      ? 'p-3 rounded bg-secondary/10 text-secondary group-hover:bg-secondary/20 transition-colors'
      : pink
        ? 'p-3 rounded bg-pink-500/10 text-pink-400 group-hover:bg-pink-500/20 transition-colors'
        : 'p-3 rounded bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors'
  const boxStyle = custom ? { backgroundColor: `${color}1A`, color } : undefined
  const h3 = custom
    ? 'text-lg font-semibold mb-2 transition-all duration-300'
    : purple
      ? 'text-lg font-semibold text-secondary mb-2 group-hover:glow-green transition-all duration-300'
      : pink
        ? 'text-lg font-semibold text-pink-400 mb-2 group-hover:glow-pink transition-all duration-300'
        : 'text-lg font-semibold text-white mb-2 group-hover:glow-green transition-all duration-300'
  const h3Style = custom ? { color } : undefined
  const a = custom
    ? 'inline-flex items-center gap-2 text-sm font-medium transition-colors group/link'
    : purple
      ? 'inline-flex items-center gap-2 text-sm font-medium text-secondary hover:text-secondary/80 transition-colors group/link'
      : pink
        ? 'inline-flex items-center gap-2 text-sm font-medium text-pink-400 hover:text-pink-400/80 transition-colors group/link'
        : 'inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors group/link'
  const aStyle = custom ? { color } : undefined
  const span = custom
    ? 'border-b transition-colors'
    : purple
      ? 'border-b border-secondary/50 group-hover/link:border-secondary transition-colors'
      : pink
        ? 'border-b border-pink-500/50 group-hover/link:border-pink-500 transition-colors'
        : 'border-b border-primary/50 group-hover/link:border-primary transition-colors'
  const spanStyle = custom ? { borderColor: `${color}80` } : undefined
  return (
    <div className={`cyber-card group opacity-0 animate-fade-in-up ${className}`} style={{ animationDelay: `${delay * 0.1}s`, animationFillMode: 'forwards' }}>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={box} style={boxStyle}>
            <Icon name="BookOpen" className="w-6 h-6" />
          </div>
          {category && <span className={`text-xs px-3 py-1 rounded-full border ${categoryBadgeColors(category)}`}>{category}</span>}
        </div>
        <h3 className={h3} style={h3Style}><Bidi text={title} /></h3>
        <p className="text-muted-foreground text-sm mb-4"><Bidi text={description} /></p>
        <a href={link} target="_blank" rel="noopener noreferrer" className={a} style={aStyle}>
          <span className={span} style={spanStyle}>{btnLabel}</span>
          <ExternalLink className="w-4 h-4 transition-transform group-hover/link:-translate-x-1 group-hover/link:-translate-y-1" />
        </a>
      </div>
      <Corners color={purple ? 'secondary' : pink ? 'pink' : 'primary'} hex={color} />
    </div>
  )
}

// hero صفحات فرعية
export function PageHero({ badge, badgeIcon = 'Terminal', title, desc, blue = false, extra }) {
  const isBeginner = String(badge || '').includes('مبتدئ')
  const isIntermediate = String(badge || '').includes('متوسط')
  const badgeBox = isBeginner
    ? 'bg-[#4ade80]/10 border border-[#4ade80]/30'
    : isIntermediate
      ? 'bg-[#ffbf00]/10 border border-[#ffbf00]/30'
      : blue ? 'bg-neon-blue/10 border border-neon-blue/30' : 'bg-primary/10 border border-primary/30'
  const badgeTx = isBeginner ? 'text-[#4ade80]' : isIntermediate ? 'text-[#ffbf00]' : blue ? 'text-neon-blue' : 'text-primary'
  return (
    <section className="pt-24 pb-16 relative">
      <div className="absolute inset-0 bg-cyber-grid bg-cyber-grid opacity-20" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {badge && (
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 ${badgeBox}`}>
              <Icon name={badgeIcon} className={`w-5 h-5 ${badgeTx}`} />
              <span className={`text-sm font-medium ${badgeTx}`}>{badge}</span>
            </div>
          )}
          <h1 className="text-4xl md:text-5xl font-bold font-display mb-6 text-white glow-green">{title}</h1>
          <p className="text-muted-foreground text-lg">{desc}</p>
          {extra}
        </div>
      </div>
    </section>
  )
}

// Kt — بطاقة أداة
export function ToolCard({ name, description, commands, website, icon }) {
  return (
    <div className="cyber-card group">
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-lg bg-secondary/20 text-secondary group-hover:bg-secondary/30 transition-all duration-300 group-hover:shadow-[0_0_20px_hsl(var(--neon-purple)/0.5)]">
            <Icon name={icon || 'Terminal'} className="w-6 h-6" />
          </div>
            <h3 className="text-xl font-bold font-display text-white group-hover:glow-green transition-all duration-300 font-mono-en">{name}</h3>
        </div>
        <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{description}</p>
        {commands && commands.length > 0 && (
          <div className="mb-4">
            <h4 className="text-xs text-primary/70 uppercase tracking-wider mb-2">الأوامر الأساسية :</h4>
            <div className="bg-background/50 rounded-lg p-3 border border-primary/20">
              {commands.map((c, i) => (
                <code key={i} dir="ltr" className="block text-xs text-secondary font-mono mb-1 last:mb-0 break-all text-left"><BidiCmd text={c} /></code>
              ))}
            </div>
          </div>
        )}
        <a href={website} target="_blank" rel="noopener noreferrer" className="cyber-btn text-sm flex items-center justify-center gap-2 w-full">
          <span>الموقع الرسمي</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  )
}

export function Disclaimer() {
  return (
    <section className="py-16 relative">
      <div className="container mx-auto px-4 max-w-5xl">
        <div dir="rtl" className="bg-[#3dc2ff]/10 border-2 border-primary text-white p-8 rounded-lg text-center shadow-lg backdrop-blur-sm" style={{ lineHeight: '2' }}>
          <div className="text-3xl font-bold mb-4 glow-green">⚠️ إخلاء مسؤولية ⚠️</div>
          <div className="font-bold text-xl mb-3">لأغراض تعليمية فقط</div>
          <div className="font-normal max-w-3xl mx-auto mb-4 text-base">
            جميع المحتويات و التقنيات و الأدوات و الموارد المقدمة على هذه المنصة مخصصة حصراً لـ{' '}
            <strong className="glow-green">الأغراض التعليمية</strong> .
          </div>
          <div className="font-bold mt-6 text-lg">تنبيه قانوني :</div>
          <div className="font-normal max-w-3xl mx-auto mt-3 text-base">
            <strong className="glow-green">ممنوع منعاً باتاً</strong> استخدام هذه التقنيات ضد أي أنظمة لا تملكها أو ليس
            لديك <strong className="glow-green">إذن كتابي صريح</strong> لاختبارها .
          </div>
          <div className="mt-6 font-bold text-lg">🛡️ مارس الاختراق الأخلاقي و لكن دائماً احصل على التصريح المناسب ! 🛡️</div>
        </div>
      </div>
    </section>
  )
}
