import { PageHero, SectionHead, RoadmapCard } from '../components/ui.jsx'
import { roadmapBeginner, roadmapIntermediate, roadmapBlue, roadmapResources } from '../data/contentData.js'

function LevelGrid({ cards, level }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((c, i) => (
        <div key={c.link} className={`opacity-0 animate-fade-in-up${cards.length % 3 === 1 && i === cards.length - 1 ? ' lg:col-start-2' : ''}${i === 1 && cards.length === 2 ? ' lg:col-start-3' : ''}`} style={{ animationDelay: `${i * 0.1}s`, animationFillMode: 'forwards' }}>
          <RoadmapCard {...c} level={level} />
        </div>
      ))}
    </div>
  )
}

export default function Roadmap() {
  return (
    <div className="min-h-screen">
      <PageHero
        title="خريطة طريق التعلم"
        desc="اتبع هذا المسار المنظم للتقدم من مبتدئ في الأمن السيبراني إلى ممارس متقدم ."
      />
      <section className="py-16 relative">
        <div className="container mx-auto px-4">
          <SectionHead title="المستوى المبتدئ" glowColor="green" />
          <LevelGrid cards={roadmapBeginner} level="beginner" />
        </div>
      </section>
      <section className="py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-blue/5 to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <SectionHead title="المستوى المتوسط" glowColor="green" />
          <LevelGrid cards={roadmapIntermediate} level="intermediate" />
        </div>
      </section>
      <section className="py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/5 to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <SectionHead title="المستوى المتقدم" subtitle="مسارات متقدمة و تخصصات متنوعة في عالم الأمن السيبراني ." />
          <LevelGrid cards={roadmapBlue} level="advanced" />
        </div>
      </section>
      <section className="py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <SectionHead title="مصادر مفيدة" subtitle="موارد إضافية لدعم رحلتك في تعلم الأمن السيبراني ." glowColor="green" />
          <LevelGrid cards={roadmapResources} />
        </div>
      </section>
    </div>
  )
}
