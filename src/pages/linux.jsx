import { PageHero, SectionHead, VideoCard } from '../components/ui.jsx'
import { InternalCards } from './courses.jsx'
import { linuxCourses, linuxDistros, webPentestResources } from '../data/contentData.js'

const linuxSections = [
  { title: 'الدورات', description: 'دورات شاملة لتعلم نظام لينكس من الصفر حتى الاحتراف .', link: '/roadmap/linux/courses', icon: 'Book' },
  { title: 'ما هو نظام لينكس ؟', description: 'تعرف على نظام لينكس .', link: '/roadmap/linux/what-is-linux', icon: 'CircleHelp' },
]

const webSections = [
  { title: 'أساسيات البرمجة لاختبار اختراق الويب', description: 'تعلم أساسيات HTML و CSS و JavaScript الضرورية لاختبار اختراق الويب .', link: '/roadmap/web-programming-basics', icon: 'Code' },
  { title: 'مصادر تعلم اختبار اختراق الويب', description: 'قنوات و دورات متخصصة في تعليم اختبار اختراق تطبيقات الويب .', link: '/roadmap/web-pentest-resources', icon: 'Book' },
]

export function LinuxMain() {
  return (
    <div className="min-h-screen">
      <PageHero
        badge="المستوى المبتدئ"
        badgeIcon="Terminal"
        title="نظام لينكس"
        desc="إتقان نظام لينكس أمر أساسي في عالم الأمن السيبراني ."
      />
      <section className="py-16">
        <div className="container mx-auto px-4">
          <SectionHead title="أقسام التعلم" subtitle="اختر القسم المناسب لبدء رحلتك في تعلم نظام لينكس ." glowColor="green" />
          <InternalCards cards={linuxSections} />
        </div>
      </section>
    </div>
  )
}

export function LinuxCourses() {
  return (
    <div className="min-h-screen">
      <PageHero
        badge="نظام لينكس"
        badgeIcon="Terminal"
        title="دورات لينكس"
        desc="أفضل الدورات العربية لإتقان نظام لينكس ."
      />
      <section className="py-16">
        <div className="container mx-auto px-4">
          <SectionHead title="الدورات" subtitle="دورات عربية متميزة لتعلم نظام لينكس من الصفر حتى الاحتراف ." glowColor="green" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {linuxCourses.map((c, i) => (
              <VideoCard key={c.link} {...c} btnLabel="مشاهدة الدورة" delay={i} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export function WhatIsLinux() {
  return (
    <div className="min-h-screen">
      <PageHero
        badge="نظام لينكس"
        badgeIcon="Terminal"
        title="ما هو نظام لينكس ؟"
        desc="تعرف على نظام التشغيل الأكثر استخدامًا في عالم الأمن السيبراني و الخوادم ."
      />
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl space-y-8">
          <div className="cyber-card">
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-white mb-4">لينكس ( Linux )</h2>
              <p className="text-muted-foreground leading-relaxed">
                هو نظام تشغيل مفتوح المصدر ( Open Source ) تم تطويره عام 1991 بواسطة <span className="text-primary font-bold">لينوس تورفالدس</span> .
              </p>
            </div>
          </div>
          <div className="cyber-card">
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-white mb-4">ما هو الـ Kernel ؟</h2>
              <p className="text-muted-foreground leading-relaxed">
                هو الجزء الذي يتعامل مباشرة مع العتاد ( Hardware ) مثل المعالج و الذاكرة و الأقراص .
              </p>
            </div>
          </div>
          <div className="cyber-card">
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-white mb-4">مفهوم التوزيعات ( Distributions )</h2>
              <p className="text-muted-foreground leading-relaxed">
                <span className="text-primary font-bold">التوزيعة</span> هي نسخة معدّلة من نظام لينكس تأتي مع مجموعة من البرامج و الأدوات و الواجهات الرسومية .
              </p>
            </div>
          </div>
          <div className="cyber-card border-secondary/30">
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-white mb-4">لماذا لينكس مهم للأمن السيبراني ؟ </h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3"><span className="text-secondary">←</span><span><span className="text-primary font-bold">أغلب أدوات الاختراق</span> مصممة للعمل على لينكس .</span></li>
                <li className="flex items-start gap-3"><span className="text-secondary">←</span><span><span className="text-primary font-bold">الخوادم</span> : أكثر من 90% من خوادم الإنترنت تعمل علي لينكس .</span></li>
                <li className="flex items-start gap-3"><span className="text-secondary">←</span><span><span className="text-primary font-bold">التحكم الكامل</span> : سطر الأوامر يمنحك قوة و تحكم لا مثيل لهما .</span></li>
                <li className="flex items-start gap-3"><span className="text-secondary">←</span><span><span className="text-primary font-bold">مفتوح المصدر</span> : يمكنك فهم كيف يعمل النظام بالكامل .</span></li>
                <li className="flex items-start gap-3"><span className="text-secondary">←</span><span><span className="text-primary font-bold">مجاني</span> : لا حاجة لدفع تراخيص مثل Windows .</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section className="py-16">
        <div className="container mx-auto px-4">
          <SectionHead title="أشهر توزيعات لينكس" subtitle="اختر التوزيعة المناسبة لأهدافك و مستواك ." glowColor="green" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {linuxDistros.map((c, i) => (
              <VideoCard key={c.link} {...c} btnLabel="زيارة الموقع" delay={i} icon="HardDrive" mono />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export function WebPentestMain() {
  return (
    <div className="min-h-screen">
      <PageHero
        badge="المستوى المتوسط"
        badgeIcon="Globe"
        title="اختبار اختراق الويب"
        desc="تعلم تقنيات اختبار اختراق تطبيقات الويب و اكتشاف الثغرات الأمنية ."
      />
      <section className="py-16">
        <div className="container mx-auto px-4">
          <SectionHead title="أقسام التعلم" subtitle="اختر القسم المناسب لبدء رحلتك في اختبار اختراق الويب ." glowColor="green" />
          <InternalCards cards={webSections} />
        </div>
      </section>
    </div>
  )
}

export function WebPentestResources() {
  return (
    <div className="min-h-screen">
      <PageHero
        badge="اختبار اختراق الويب"
        badgeIcon="Globe"
        title="مصادر تعلم اختبار اختراق الويب"
        desc="قنوات و دورات متخصصة في تعليم اختبار اختراق تطبيقات الويب ."
        blue
      />
      <section className="py-16">
        <div className="container mx-auto px-4">
          <SectionHead title="المصادر التعليمية" subtitle="أفضل القنوات و الدورات العربية لتعلم الـ Web Pentesting ." glowColor="purple" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {webPentestResources.map((c, i) => (
              <VideoCard key={c.link} {...c} btnLabel="زيارة القناة" delay={i} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
