import { Link } from 'react-router-dom'
import { PageHero, SectionHead, VideoCard, Bidi, Icon } from '../components/ui.jsx'
import {
  programmingCourses, networkingCourses, basicsCourses, pentestCourses,
  adCourses, malwareCourses, webBasicsCourses,
} from '../data/contentData.js'

export function CoursePage({ badge, badgeIcon = 'Terminal', title, desc, sectionTitle, sectionSubtitle, items, btnLabel = 'مشاهدة الدورة', blue = false }) {
  return (
    <div className="min-h-screen">
      <PageHero badge={badge} badgeIcon={badgeIcon} title={title} desc={desc} blue={blue} />
      <section className="py-16">
        <div className="container mx-auto px-4">
          <SectionHead title={sectionTitle} subtitle={sectionSubtitle} glowColor={blue ? 'purple' : 'green'} />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {items.map((c, i) => (
              <div key={c.link} className={`${i === 1 && items.length === 2 ? 'lg:col-start-3' : ''}${items.length === 1 ? 'lg:col-start-2' : ''}`}>
                <VideoCard {...c} btnLabel={btnLabel} delay={i} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export function InternalCards({ cards }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
      {cards.map((t, i) => (
        <Link
          key={t.link}
          to={t.link}
          className={`cyber-card group opacity-0 animate-fade-in-up block${i === 1 && cards.length === 2 ? ' lg:col-start-3' : ''}${cards.length === 1 ? ' lg:col-start-2' : ''}`}
          style={{ animationDelay: `${i * 0.1}s`, animationFillMode: 'forwards' }}
        >
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                <Icon name={t.icon} className="w-6 h-6" />
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-[#ffbf00]/10 text-[#ffbf00] border border-[#ffbf00]/40">قسم</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2 group-hover:glow-green transition-all duration-300"><Bidi text={t.title} /></h3>
            <p className="text-muted-foreground text-sm mb-4"><Bidi text={t.description} /></p>
            <span className="inline-flex items-center gap-2 text-sm font-medium text-primary">
              <span className="border-b border-primary/50 group-hover:border-primary transition-colors">الدخول للقسم</span>
            </span>
          </div>
        </Link>
      ))}
    </div>
  )
}

export function Programming() {
  return (
    <CoursePage
      badge="المستوى المبتدئ"
      badgeIcon="Code"
      title="البرمجة"
      desc="البرمجة هي أساس فهم كيفية عمل الأنظمة و اكتشاف الثغرات ."
      sectionTitle="مصادر التعلم"
      sectionSubtitle="مجموعة منتقاة من أفضل المصادر لتعلم البرمجة باللغة العربية ."
      items={programmingCourses}
      btnLabel="زيارة المصدر"
    />
  )
}

export function Networking() {
  return (
    <CoursePage
      badge="المستوى المبتدئ"
      badgeIcon="Network"
      title="الشبكات"
      desc="فهم أساسيات الشبكات ضروري لأي متخصص في الأمن السيبراني ."
      sectionTitle="الدورات"
      sectionSubtitle="دورات عربية متميزة لتعلم الشبكات من الصفر حتى الاحتراف ."
      items={networkingCourses}
      btnLabel="زيارة المصدر"
    />
  )
}

export function CyberBasics() {
  return (
    <CoursePage
      badge="المستوى المبتدئ"
      badgeIcon="Shield"
      title="أساسيات الأمن السيبراني"
      desc="ابدأ رحلتك في عالم الأمن السيبراني بتعلم أساسيات الحاسوب ومبادئ الأمان."
      sectionTitle="الدورات"
      sectionSubtitle="دورات عربية متميزة لبناء أساس قوي في الأمن السيبراني."
      items={basicsCourses}
      btnLabel="مشاهدة الدورة"
    />
  )
}

export function PentestBasics() {
  return (
    <CoursePage
      badge="المستوى المتوسط"
      badgeIcon="Bug"
      title="البداية في اختبار الاختراق"
      desc="ابدأ رحلتك في عالم اختبار الاختراق مع أفضل الدورات و المصادر العربية والعالمية ."
      sectionTitle="الدورات"
      sectionSubtitle="دورات متخصصة في اختبار الاختراق من مستوى المبتدئ إلى الاحترافي ."
      items={pentestCourses}
      btnLabel="مشاهدة الدورة"
    />
  )
}

export function ActiveDirectory() {
  return (
    <CoursePage
      badge="المستوى المتوسط"
      badgeIcon="Server"
      title="Active Directory"
      desc="تعلم أساسيات Active Directory و كيفية اختراق بيئات Windows المؤسسية ."
      sectionTitle="الدورات"
      sectionSubtitle="دورات متخصصة في Active Directory باللغة العربية ."
      items={adCourses}
      btnLabel="مشاهدة الدورة"
    />
  )
}

const malwareSections = [
  { title: 'البرمجيات الخبيثة', description: 'دورات تحليل البرمجيات الخبيثة و الهندسة العكسية .', link: '/roadmap/malware-analysis/courses', icon: 'Bug' },
]

export function MalwareAnalysis() {
  return (
    <div className="min-h-screen">
      <PageHero
        badge="الفريق الدفاعي"
        badgeIcon="Shield"
        title="الفريق الدفاعي"
        desc="تعلم مهارات الدفاع السيبراني و التحليل و الاستجابة للحوادث ."
      />
      <section className="py-16">
        <div className="container mx-auto px-4">
          <SectionHead title="التخصصات الدفاعية" subtitle="اختر التخصص المناسب لبدء رحلتك في مجال الدفاع السيبراني ." />
          <InternalCards cards={malwareSections} />
        </div>
      </section>
    </div>
  )
}

export function MalwareCourses() {
  return (
    <CoursePage
      badge="البرمجيات الخبيثة"
      badgeIcon="Bug"
      title="تحليل البرمجيات الخبيثة"
      desc="دورات عربية لتعلم تحليل البرمجيات الخبيثة و الهندسة العكسية ."
      sectionTitle="الدورات"
      sectionSubtitle="كورسات متخصصة في تحليل البرمجيات الخبيثة ."
      items={malwareCourses}
      btnLabel="مشاهدة الدورة"
    />
  )
}

export function WebProgrammingBasics() {
  return (
    <div className="min-h-screen">
      <PageHero
        badge="اختبار اختراق الويب"
        badgeIcon="Code"
        title="أساسيات البرمجة لاختبار اختراق الويب"
        desc="تعلم أساسيات HTML و PHP و JavaScript الضرورية لفهم تطبيقات الويب و اختبار اختراقها ."
      />
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto mb-8">
            <div className="cyber-card">
              <div className="relative z-10">
                <p className="text-muted-foreground leading-relaxed">
                  ملاحظة : يمكنك تقوية المنطق البرمجي بالتوازي مع التطبيق العملي .
                </p>
              </div>
            </div>
          </div>
          <SectionHead title="الدورات" subtitle="دورات عربية لتعلم أساسيات تطوير الويب ." glowColor="green" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {webBasicsCourses.map((c, i) => (
              <VideoCard key={c.link} {...c} btnLabel="مشاهدة الدورة" delay={i} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
