// محتوى الصفحات
export const roadmapBeginner = [
  { title: "أساسيات الأمن السيبراني", description: "تعلم أساسيات الحاسوب والأمان مع دورات CompTIA A+ و Security+ .", link: "/roadmap/cybersecurity-basics", icon: "Shield", isInternal: true },
  { title: "نظام لينكس", description: "إتقان سطر أوامر لينكس ، أنظمة الملفات ، و مهارات الإدارة الأساسية .", link: "/roadmap/linux", icon: "Terminal", isInternal: true },
  { title: "البرمجة", description: "تعلم أساسيات البرمجة و بايثون للأمن السيبراني و كتابة السكربتات .", link: "/roadmap/programming", icon: "Terminal", isInternal: true },
  { title: "الشبكات", description: "فهم أساسيات الشبكات .", link: "/roadmap/networking", icon: "Network", isInternal: true },
]

export const roadmapIntermediate = [
  { title: "البداية في اختبار الاختراق", description: "ابدأ رحلتك في اختبار الاختراق مع دورات eJPT و OSCP.", link: "/roadmap/pentest-basics", icon: "Target", isInternal: true },
  { title: "اختبار اختراق الويب", description: "تعلم تقنيات اختبار اختراق تطبيقات الويب واكتشاف الثغرات.", link: "/roadmap/web-pentest", icon: "Globe", isInternal: true },
  { title: "Active Directory", description: "تعلم أساسيات Active Directory و اختراق بيئات Windows المؤسسية .", link: "/roadmap/active-directory", icon: "Server", isInternal: true },
]

export const roadmapBlue = [
  { title: "الفريق الدفاعي", description: "تعلم مهارات الدفاع السيبراني و التحليل و الاستجابة للحوادث .", link: "/roadmap/malware-analysis", icon: "Shield", isInternal: true },
]

export const roadmapResources = [
  { title: "مواقع مفيدة", description: "مجموعة مختارة من المواقع المفيدة في مجال الأمن السيبراني و اختبار الاختراق .", link: "/resources/websites", icon: "Book", isInternal: true },
  { title: "قنوات يوتيوب مفيدة", description: "أفضل قنوات يوتيوب لتعلم الأمن السيبراني .", link: "/resources/youtube-channels", icon: "Youtube", isInternal: true },
]

export const labs = [
  { name: "Hack The Box", description: "أشهر منصة عملية تحتوي على عشرات الآلات .", url: "https://www.hackthebox.com/", glyph: "text-[#9FEF00]", color: "#9FEF00", icon: "Terminal" },
  { name: "TryHackMe", description: "منصة تعليمية بالمختبرات التفاعلية من المستوى المبتدئ حتى الخبير .", url: "https://tryhackme.com/", glyph: "text-[#FF0000]", color: "#FF0000", icon: "Target" },
  { name: "PortSwigger Web Security Academy", description: "أفضل منصة في العالم لتعلم Web Security من خلال مختبرات عملية حقيقية .", url: "https://portswigger.net/web-security", glyph: "text-[#FF6633]", color: "#FF6633", icon: "Globe" },
  { name: "CyberDefenders", description: "تحديات Blue Team , DFIR , SOC .", url: "https://cyberdefenders.org/", glyph: "text-[#335eea]", color: "#335eea", icon: "Shield" },
]

export const programmingCourses = [
    { title: "Programming Advices", description: "موقع عربي شامل لتعلم البرمجة من الصفر مع دورات مجانية و مدفوعة في لغات متعددة .", link: "https://programmingadvices.com/", icon: "BookOpen", type: "موقع تعليمي", recommended: true },
  { title: "أساسيات لغة Python", description: "دورة بايثون المقدمة من المهندس أسامة الزيرو - دورة شاملة لتعلم أساسيات لغة بايثون من الصفر .", link: "https://www.youtube.com/watch?v=mvZHDpCHphk&list=PLDoPjvoNmBAyE_gei5d18qkfIe-Z8mocs", type: "سلسلة يوتيوب" },
]

export const networkingCourses = [
  { title: "دورة CCNA – م . سجاد غفوري", description: "مناسبة للمبتدئين لفهم المفاهيم الأساسية قبل الدخول لمجال الأمن السيبراني", link: "https://www.youtube.com/watch?v=TrQljnE49-o&list=PLAqaqJU4wzYU_6EIzVoxHghQILgyY--yf", type: "سلسلة يوتيوب" },
]

export const linuxCourses = [
  { title: "تعلم لينكس من الصفر", description: "دورة شاملة في أساسيات نظام لينكس للمبتدئين ،", link: "https://www.youtube.com/watch?v=OxL0B1F65W8", type: "دورة يوتيوب" },
]

export const linuxDistros = [
  { title: "Kali Linux", description: "هي أشهر توزيعة على الإطلاق في مجال اختبار الاختراق و الهندسة العكسية و التحليل الجنائي الرقمي", link: "https://www.kali.org/", type: "اختبار الاختراق" },
  { title: "Ubuntu", description: "مناسبة للمبتدئين و تتميز بمجتمع كبير و دعم طويل الأمد .", link: "https://ubuntu.com/", type: "للمبتدئين" },
  { title: "Debian", description: "هي الأساس الذي تُبنى عليه توزيعات مثل Ubuntu و Kali Linux .", link: "https://www.debian.org/", type: "خوادم" },
  { title: "Fedora", description: "سريعة التحديث و مناسبة للمطورين .", link: "https://getfedora.org/", type: "للمطورين" },
  { title: "Arch Linux", description: "تعتمد على البساطة و التحكم الكامل .", link: "https://archlinux.org/", type: "متقدم" },
  { title: "Parrot OS Security", description: "بديل ممتاز لـ Kali Linux بموارد أقل .", link: "https://parrotsec.org/", type: "اختبار الاختراق" },
]

export const basicsCourses = [
  { title: "دورة CompTIA A+ - سامح رمضان", description: "دورة أساسيات الحاسوب العامة - تغطي كل ما تحتاجه لفهم أساسيات الحاسوب و الأجهزة .", link: "https://www.youtube.com/watch?v=zIpF33NCgrA&list=PLH-n8YK76vIiDdOMRB-ylvns-_8Zl1euV", type: "سلسلة يوتيوب" },
  { title: "دورة Security+ - أحمد سلطان", description: "أساسيات الأمان - دورة شاملة لفهم مبادئ الأمن السيبراني .", link: "https://www.youtube.com/watch?v=dyKg_bQOXfU&list=PLky4bd7_03m8o1NB0j96OsxZs0KcKlgMO", type: "سلسلة يوتيوب" },
]

export const pentestCourses = [
  { title: "دورة eJPTv2 - ياسر عمار", description: "دورة احترافية للبداية في اختبار الاختراق .", link: "https://www.youtube.com/watch?v=3vpW_ZlH4d8", icon: "Youtube", type: "دورة احترافية" },
  { title: "دورة OSCP+ - أحمد عطية", description: "دورة OSCP+ من المهندس أحمد عطية لاختبار الاختراق الاحترافي .", link: "https://www.youtube.com/watch?v=VAV0Z8GGT9g&list=PL5dZpxpUkHPM0HMefFCFjGeLAwyty4LYm", type: "سلسلة يوتيوب" },
  { title: "دورة OSCP - أحمد عطية", description: "دورة OSCP من المهندس أحمد عطية لإتقان اختبار الاختراق .", link: "https://www.youtube.com/watch?v=bc8JcenrvB0&list=PLZNz7wrFA85CHJLogfqUJJUg2EkxvIa27", type: "سلسلة يوتيوب" },
]

export const webPentestResources = [
  { title: "قناة ArabSecLab", description: "قناة عربية متخصصة في تعليم اختبار اختراق الويب ،", link: "https://www.youtube.com/@Arabseclab", type: "قناة يوتيوب" },
  { title: "كورس اختبار اختراق الويب للمهندس ابراهيم حجازي", description: "كورس لتعلم اساسيات اختبار اختراق الويب .", link: "https://www.youtube.com/watch?v=BjfCWSFmIFI&list=PLFp3U4AOU6ACPUGth26yLFOMNIVuE67u4", type: "سلسلة يوتيوب" },
  { title: "كورس أساسيات اختبار اختراق الويب - تكناوي دوت نت", description: "كورس أساسيات اختبار اختراق الويب للمبتدئين .", link: "https://www.youtube.com/watch?v=clLoyQeEVUw&list=PLroS9tRyoUGpAJPAgygxEP9imIZpkxFMi", type: "سلسلة يوتيوب" },
]

export const webBasicsCourses = [
  { title: "دورة JavaScript - المهندس أسامة الزيرو", description: "دورة أساسيات JavaScript لبناء صفحات الويب - الخطوة الأولى في فهم بنية المواقع .", link: "https://www.youtube.com/watch?v=GM6dQBmc-Xg&list=PLDoPjvoNmBAx3kiplQR_oeDqLDBUDYwVv", type: "سلسلة يوتيوب" },
  { title: "دورة HTML - المهندس أسامة الزيرو", description: "دورة أساسيات HTML للتفاعل مع صفحات الويب و فهم البرمجة النصية .", link: "https://www.youtube.com/watch?v=6QAELgirvjs&list=PLDoPjvoNmBAw_t_XWUFbBX-c9MafPk9ji", type: "سلسلة يوتيوب" },
  { title: "دورة PHP - المهندس أسامة الزيرو", description: "دورة أساسيات PHP لبرمجة الخوادم و فهم الجانب الخلفي للمواقع .", link: "https://www.youtube.com/watch?v=xcg9qq6SZ0w&list=PLDoPjvoNmBAy41u35AqJUrI-H83DObUDq", type: "سلسلة يوتيوب" },
]

export const adCourses = [
  { title: "Active Directory 101 - إيهاب أبو عليا", description: "دورة شاملة لفهم Active Directory من المهندس إيهاب أبو عليا .", link: "https://www.youtube.com/watch?v=l5jryNnDhjk&list=PLyyAUp-Erl9WhBzp1ma2NzYQEb1nfQM1t", type: "سلسلة يوتيوب" },
]

export const malwareCourses = [
  { title: "كورس Malware Analysis - المهندس إسلام عباس", description: "كورس شامل لتعلم تحليل البرمجيات الخبيثة و الهندسة العكسية باللغة العربية .", link: "https://www.youtube.com/watch?v=6P8N7VW21MQ&list=PLgKWvRMsdLZ4N_okwVWqB6cgqeVQtZNC4", type: "سلسلة يوتيوب" },
]

export const websitesResources = [
  { title: "HackTricks", description: "موسوعة شاملة لتقنيات القرصنة و الاختراق مع شروحات تفصيلية .", link: "https://book.hacktricks.xyz/", category: "موارد تعليمية", color: "#f61900" },
  { title: "OWASP", description: "مشروع مفتوح المصدر لأمن تطبيقات الويب مع أدلة و أدوات مجانية .", link: "https://owasp.org/", category: "أمن الويب", color: "#0998ff" },
  { title: "PayloadsAllTheThings", description: "مجموعة ضخمة من الـ Payloads المفيدة لاختبار الاختراق .", link: "https://github.com/swisskyrepo/PayloadsAllTheThings", category: "موارد تعليمية", color: "#FFFFFF" },
  { title: "Exploit Database", description: "قاعدة بيانات للثغرات الأمنية و الأدوات المستخدمة في الاستغلال .", link: "https://www.exploit-db.com/", category: "قواعد بيانات", color: "#ec5e10" },
  { title: "CVE Details", description: "قاعدة بيانات للثغرات الأمنية المعروفة و الموثقة .", link: "https://www.cvedetails.com/", category: "قواعد بيانات", color: "#1163ea" },
  { title: "GTFOBins", description: "قائمة بالأوامر التي يمكن استغلالها في نظام Unix / Linux", link: "https://gtfobins.github.io/", category: "أدوات Linux", color: "#bf0707" },
  { title: "CyberChef", description: "أداة ويب لتحليل و فك تشفير البيانات .", link: "https://gchq.github.io/CyberChef/", category: "أدوات تحليل", color: "#E0E0E0" },
  { title: "CrackStation", description: "أداة مجانية لفك تشفير الهاشات باستخدام قواعد بيانات ضخمة .", link: "https://crackstation.net/", category: "أدوات تحليل", color: "#C0C0C0" },
  { title: "Pentester Lab", description: "دروس عملية و مختبرات لتعلم اختبار الاختراق .", link: "https://pentesterlab.com/", category: "موارد تعليمية", color: "#ebff00" },
  { title: "Awesome Hacking", description: "قائمة منسقة بأفضل الموارد في مجال الأمن السيبراني .", link: "https://github.com/Hack-with-Github/Awesome-Hacking", category: "موارد تعليمية", color: "#FFFFFF" },
  { title: "منتدى شبكة شل العربية", description: "منتدى عربي للدراسة و لتبادل خبرات الأمن السيبراني و يجمع خبرات كبيرة", link: "https://sh3ll.cloud/xf2/", category: "منتدى", color: "#cc1515" },
]

export const youtubeChannels = [
  { name: "NetworkChuck", description: "قناة رائعة لتعلم الشبكات و الأمن السيبراني بطريقة ممتعة .", url: "https://www.youtube.com/@NetworkChuck" },
  { name: "John Hammond", description: "محتوى متنوع في الأمن السيبراني و CTF و البرمجة .", url: "https://www.youtube.com/@_JohnHammond" },
  { name: "IppSec", description: "شروحات تفصيلية لحل تحديات Hack The Box .", url: "https://www.youtube.com/@ippsec" },
  { name: "HackerSploit", description: "دروس في اختبار الاختراق و الأمن السيبراني .", url: "https://www.youtube.com/@HackerSploit" },
  { name: "The Cyber Mentor", description: "دورات شاملة في اختبار الاختراق الأخلاقي .", url: "https://www.youtube.com/@TCMSecurityAcademy" },
  { name: "LiveOverflow", description: "محتوى متقدم في أمن التطبيقات و الثغرات الأمنية .", url: "https://www.youtube.com/@LiveOverflow" },
]
