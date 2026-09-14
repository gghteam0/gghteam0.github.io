import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { PageHero, SectionHead, ToolCard, Icon } from '../components/ui.jsx'
import { toolSections, toolsDetails } from '../data/toolsData.js'

export function Tools() {
  return (
    <div className="min-h-screen">
      <PageHero
        title="مكتبة الأدوات"
        desc="مكتبة شاملة لأهم أدوات الأمن السيبراني و اختبار الاختراق مع شرح الأوامر الأساسية ."
      />
      <section className="py-16">
        <div className="container mx-auto px-4">
          <SectionHead title="أقسام الأدوات" subtitle="اختر القسم الذي تريد استكشافه و تعلم أدواته ." glowColor="purple" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {toolSections.map((t, i) => (
              <Link
                key={t.path}
                to={t.path}
                className="cyber-card group cursor-pointer opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${i * 0.05}s`, animationFillMode: 'forwards' }}
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                      <Icon name={t.icon} className="w-8 h-8" />
                    </div>
                    <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">{t.count} أدوات</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:glow-green transition-all">{t.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{t.description}</p>
                  <div className="flex items-center gap-2 text-secondary text-sm font-medium group-hover:gap-3 transition-all">
                    <span>استكشف الأدوات</span>
                    <ArrowLeft className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export function ToolsDetail() {
  const { id } = useParams()
  const data = toolsDetails[id]
  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white glow-green mb-4">القسم غير موجود</h1>
          <Link to="/tools" className="cyber-btn inline-block">عودة للأدوات</Link>
        </div>
      </div>
    )
  }
  return (
    <div className="min-h-screen">
      <PageHero title={data.title} desc={data.desc} />
      <section className="py-16">
        <div className="container mx-auto px-4">
          <SectionHead title="الأدوات المتاحة" subtitle={data.subtitle} glowColor="green" />
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {data.tools.map((t, i) => (
              <div key={t.name} className="opacity-0 animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s`, animationFillMode: 'forwards' }}>
                <ToolCard {...t} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
