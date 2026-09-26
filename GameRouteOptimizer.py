# -*- coding: utf-8 -*-
"""
GameRouteOptimizer — مُحسّن مسار الألعاب 🏆
واجهة رسومية فخمة لتحليل أفضل نود / مسار / هوب للإنترنت — مخصص للألعاب الأونلاين.

الفكرة بصراحة (مهم تقرأ):
- أنت كمستخدم منزلي لا تستطيع إجبار الإنترنت أنه يعدي على "هوب وسيط" معين في
  شبكة المزود — التوجيه بين الدول يتم ببروتوكول BGP ويتحكم فيه ISP.
- لكن ما يمكنك فعله فعلياً (وهذا ما يفعله هذا السكريبت):
  1) كشف اللفة المالهاش داعي (Loop / Detour): هوب يتكرر، أو قفزة ping ضخمة، أو مسار أوروبا يلف عبر أمريكا.
  2) اختيار أفضل سيرفر لعبة (EU vs ME vs ...).
  3) اختيار أسرع DNS.
  4) اختيار كارت الشبكة / الجيتواي الذي يخرج منه جهازك + Static Route للعبة عبر جيتواي معين.
  5) تحسين ويندوز للجيمنج (Nagle / Throttling / TCP / DNS flush) — مدمج مع سكريبت Optimize-GamingNetwork.ps1.
  6) مراقبة حية تكشف فقدان الحزم والدمج الوهمي (Jitter/Spikes).

التشغيل:
    python GameRouteOptimizer.py
للخصائص التي تغير DNS أو Routes تحتاج: كليك يمين > Run as Administrator.

لا يحتاج أي مكتبة خارجية — tkinter فقط (موجودة مع بايثون).
"""

import tkinter as tk
from tkinter import ttk, messagebox, filedialog, scrolledtext
import threading
import subprocess
import re
import socket
import urllib.request
import json
import time
import datetime
import ipaddress
import queue
import platform

VERSION = "2.0"

# ───────────────────────────── الثيم الفخم ─────────────────────────────
BG        = "#070b16"   # خلفية عامة داكنة جداً
BG_CARD   = "#0f1628"   # خلفية الكروت
BG_CARD2  = "#131c33"
ACCENT    = "#00e5ff"   # سماوي نيون
ACCENT2   = "#b537ff"   # بنفسجي نيون
GOLD      = "#ffc93c"   # ذهبي
GREEN     = "#00e676"
RED       = "#ff4d6d"
ORANGE    = "#ff9f1c"
FG        = "#e8eefc"
FG_DIM    = "#8b98b8"
FONT_MAIN = ("Segoe UI", 10)
FONT_BIG  = ("Segoe UI", 13, "bold")
FONT_HDR  = ("Segoe UI", 11, "bold")

# ───────────────────────────── بيانات افتراضية قابلة للتخصيص ─────────────────────────────
DEFAULT_GAME_SERVERS = [
    # (اسم اللعبة, اسم السيرفر, الهوست)
    ("Valorant", "EU Frankfurt", "151.249.90.1"),
    ("Valorant", "Bahrain ME", "151.249.11.1"),
    ("Fortnite", "EU", "ping-eu.ds.on.epicgames.com"),
    ("PUBG", "EU", "eu-north-1.pubg.com"),
    ("Call of Duty", "EU", "185.34.107.128"),
    ("CS2", "EU North", "146.66.152.1"),
    ("League of Legends", "EUW", "185.40.64.69"),
    ("Apex Legends", "EU", "34.250.195.87"),
    ("EA FC / FIFA", "EU", "159.153.184.115"),
    ("Roblox", "EU", "185.38.151.1"),
    ("Minecraft", "Hypixel EU", "mc.hypixel.net"),
    ("Google DNS (مرجع)", "8.8.8.8", "8.8.8.8"),
    ("Cloudflare (مرجع)", "1.1.1.1", "1.1.1.1"),
]

DEFAULT_DNS = [
    ("Cloudflare", "1.1.1.1", "1.0.0.1"),
    ("Google", "8.8.8.8", "8.8.4.4"),
    ("Quad9", "9.9.9.9", "149.112.112.112"),
    ("OpenDNS", "208.67.222.222", "208.67.220.220"),
    ("AdGuard", "94.140.14.14", "94.140.15.15"),
]

# ═══════════════════════════ محرك الشبكة ═══════════════════════════
class Net:
    @staticmethod
    def run(cmd, timeout=60):
        """تشغيل أمر وإرجاع (returncode, stdout+stderr كنص)."""
        try:
            p = subprocess.run(cmd, capture_output=True, text=True,
                               timeout=timeout, shell=False,
                               encoding="utf-8", errors="ignore")
            return p.returncode, (p.stdout or "") + (p.stderr or "")
        except subprocess.TimeoutExpired:
            return -1, "TIMEOUT"
        except Exception as e:
            return -1, f"ERROR: {e}"

    @staticmethod
    def ping(host, count=4, timeout_ms=1000, size=32):
        """بينج ويندوز وتحليل النتيجة -> dict."""
        cmd = ["ping", "-n", str(count), "-w", str(timeout_ms), "-l", str(size), host]
        rc, out = Net.run(cmd, timeout=count * (timeout_ms / 1000) + 10)
        # يدعم ويندوز عربي وإنجليزي — time<1ms تُحسب 0
        times = []
        for m in re.finditer(r"[Tt]ime([=<])\s*(\d+)\s*m?s?", out):
            op, val = m.group(1), int(m.group(2))
            times.append(0 if (op == "<" and val <= 1) else val)
        if not times:  # ويندوز عربي: الوقت=12م.ث
            times = [int(x) for x in re.findall(r"=\s*(\d+)\s*(?:ms|م)", out)
                     if int(x) < 10000][:count * 2]
        sent = lost = None
        m = re.search(r"Sent\s*=\s*(\d+).*Received\s*=\s*(\d+).*Lost\s*=\s*(\d+)", out, re.S)
        if m:
            sent, recvd, lost_n = int(m.group(1)), int(m.group(2)), int(m.group(3))
            sent, lost = sent, lost_n
        else:
            m2 = re.search(r"(\d+)\s*%.*loss|فقد|خسارة", out)
            sent, lost = count, (count - len(times))
        recv = len(times)
        loss_pct = round((count - recv) / count * 100, 1) if count else 100.0
        if times:
            avg = round(sum(times) / len(times), 1)
            mn, mx = min(times), max(times)
            # Jitter = متوسط فرق القيم المتتالية (الدمج الوهمي / التقطيع)
            jit = round(sum(abs(times[i] - times[i-1]) for i in range(1, len(times))) / max(len(times)-1, 1), 1)
        else:
            avg = mn = mx = jit = None
        return {"host": host, "sent": count, "recv": recv, "loss": loss_pct,
                "avg": avg, "min": mn, "max": mx, "jitter": jit, "raw": out}

    @staticmethod
    def score(p):
        """نقاط جودة الجيمنج من 100: ping 40% + loss 40% + jitter 20%."""
        if p["recv"] == 0 or p["avg"] is None:
            return 0
        s_ping = max(0, 100 - max(0, p["avg"] - 20) * 1.2)
        s_loss = max(0, 100 - p["loss"] * 20)
        s_jit  = max(0, 100 - (p["jitter"] or 0) * 8)
        return round(s_ping * 0.4 + s_loss * 0.4 + s_jit * 0.2, 1)

    @staticmethod
    def verdict(p):
        s = Net.score(p)
        if p["recv"] == 0:
            return "❌ لا يوجد اتصال", RED
        if s >= 85:
            return "🏆 ممتاز للجيمنج", GREEN
        if s >= 70:
            return "✅ جيد", GREEN
        if s >= 50:
            return "⚠️ مقبول — لاج خفيف", ORANGE
        if s >= 30:
            return "🔶 سيئ — لاج واضح", ORANGE
        return "🔴 غير صالح للعب", RED

    @staticmethod
    def traceroute(host, max_hops=20, timeout_ms=1500):
        """tracert ويندوز -> قائمة hops: [{n, ip, host, ms1,ms2,ms3, avg}]."""
        cmd = ["tracert", "-d", "-h", str(max_hops), "-w", str(timeout_ms), host]
        rc, out = Net.run(cmd, timeout=max_hops * (timeout_ms / 1000) * 3 + 20)
        hops = []
        for line in out.splitlines():
            m = re.match(r"\s*(\d+)\s+(.+)", line)
            if not m:
                continue
            n = int(m.group(1))
            if n > max_hops:
                continue
            rest = m.group(2)
            ips = re.findall(r"\b(?:\d{1,3}\.){3}\d{1,3}\b", rest)
            mss = [int(x) for x in re.findall(r"(\d+)\s*m?s?", rest) if int(x) < timeout_ms + 500]
            # أسطر tracert شكلها:  3    12 ms    11 ms    12 ms  192.168.1.1
            ms_vals = [int(x) for x in re.findall(r"(\d+)\s*ms", rest)]
            ip = ips[-1] if ips else ("*" if "*" in rest else None)
            if ip is None and "Request timed out" not in rest and "توقف" not in rest and "*" not in rest:
                continue
            avg = round(sum(ms_vals) / len(ms_vals), 1) if ms_vals else None
            hops.append({"n": n, "ip": ip or "*", "ms": ms_vals, "avg": avg, "raw": rest.strip()})
        return hops, out

    @staticmethod
    def reverse_dns(ip):
        try:
            return socket.gethostbyaddr(ip)[0]
        except Exception:
            return "—"

    @staticmethod
    def is_private(ip):
        try:
            return ipaddress.ip_address(ip).is_private
        except Exception:
            return False

    @staticmethod
    def analyze_hops(hops):
        """كشف المشاكل: لوب، قفزة ping، تايم آوت، لفة جغرافية مشبوهة."""
        notes = []
        seen = {}
        prev_avg = None
        for h in hops:
            ip = h["ip"]
            if ip and ip != "*":
                if ip in seen:
                    notes.append((h["n"], f"🔁 لوب مكتشف! الهوب {ip} تكرر (ظهر قبل كده في هوب {seen[ip]}) — دي غالباً «اللفة المالهاش داعي» اللي بتعمل فقدان حزم.",
                                  RED))
                else:
                    seen[ip] = h["n"]
                if Net.is_private(ip) and h["n"] > 3:
                    notes.append((h["n"], f"🏠 IP خاص {ip} ظهر متأخر (هوب {h['n']}) — غالباً NAT/CGNAT عند المزود، يزود تأخير بسيط.", ORANGE))
            if h["avg"] is None:
                notes.append((h["n"], "⏱️ تايم آوت (*) — الراوتر في الهوب ده لا يرد على ICMP (عادي غالباً)، لكن لو اتكرر 3+ مرات ورا بعض قد يكون فلترة أو اختناق.", FG_DIM))
            else:
                if prev_avg is not None and h["avg"] - prev_avg > 40:
                    notes.append((h["n"], f"📈 قفزة {h['avg']-prev_avg:.0f}ms عن الهوب السابق — الاختناق/اللفة تحصل هنا! (من {prev_avg:.0f} إلى {h['avg']:.0f}).",
                                  RED if h["avg"] - prev_avg > 80 else ORANGE))
                prev_avg = h["avg"]
        # لفة جغرافية: هوب أخير بعيد جداً
        if hops and hops[-1]["avg"] and hops[-1]["avg"] > 180:
            notes.append((hops[-1]["n"], "🌍 البنج النهائي فوق 180ms — المسار غالباً يلف عبر قارة بعيدة. جرّب سيرفر أقرب أو DNS مختلف أو VPN-Gaming.",
                          ORANGE))
        return notes

    @staticmethod
    def public_info(timeout=12):
        info = {}
        try:
            with urllib.request.urlopen("https://api.ipify.org", timeout=timeout) as r:
                info["public_ip"] = r.read().decode().strip()
        except Exception as e:
            info["public_ip"] = f"تعذر: {e}"
        try:
            with urllib.request.urlopen(f"http://ip-api.com/json/{info.get('public_ip','')}?fields=status,country,city,isp,org,as,lat,lon", timeout=timeout) as r:
                j = json.loads(r.read().decode())
                info.update({k: j.get(k, "—") for k in ("country", "city", "isp", "org", "as")})
        except Exception:
            for k in ("country", "city", "isp", "org", "as"):
                info.setdefault(k, "—")
        try:
            info["local_ip"] = socket.gethostbyname(socket.gethostname())
        except Exception:
            info["local_ip"] = "—"
        # الجيتواي
        rc, out = Net.run(["ipconfig"], timeout=15)
        gws = re.findall(r"Gateway.*?:\s*([\d.]+)", out)
        info["gateway"] = gws[0] if gws else "—"
        return info

    @staticmethod
    def interfaces():
        rc, out = Net.run(["route", "print", "-4"], timeout=15)
        return out

    @staticmethod
    def dns_test(dns_ip, test_host="google.com", timeout=8):
        t0 = time.time()
        try:
            # قياس زمن حل الاسم عبر DNS محدد باستخدام nslookup
            rc, out = Net.run(["nslookup", test_host, dns_ip], timeout=timeout)
            dt = (time.time() - t0) * 1000
            ok = ("Name:" in out or "name =" in out.lower() or "Address" in out) and rc == 0
            p = Net.ping(dns_ip, count=2, timeout_ms=1000)
            return {"ok": ok, "resolve_ms": round(dt, 1) if ok else None,
                    "ping": p["avg"], "loss": p["loss"]}
        except Exception as e:
            return {"ok": False, "resolve_ms": None, "ping": None, "loss": 100}


# ═══════════════════════════ ويدجت: بطاقة ═══════════════════════════
class Card(tk.Frame):
    def __init__(self, parent, title="", accent=ACCENT, **kw):
        super().__init__(parent, bg=BG_CARD, highlightbackground="#1e2a4a",
                         highlightthickness=1, **kw)
        if title:
            top = tk.Frame(self, bg=BG_CARD)
            top.pack(fill="x", padx=12, pady=(10, 2))
            tk.Label(top, text="▍", fg=accent, bg=BG_CARD, font=("Segoe UI", 12, "bold")).pack(side="left")
            tk.Label(top, text=title, fg=FG, bg=BG_CARD, font=FONT_HDR).pack(side="left", padx=4)


def style_init(root):
    s = ttk.Style(root)
    try:
        s.theme_use("clam")
    except Exception:
        pass
    s.configure("TNotebook", background=BG, borderwidth=0)
    s.configure("TNotebook.Tab", background=BG_CARD, foreground=FG_DIM,
                padding=(14, 8), font=("Segoe UI", 10, "bold"))
    s.map("TNotebook.Tab", background=[("selected", "#1a2547")],
          foreground=[("selected", ACCENT)])
    s.configure("Treeview", background=BG_CARD2, fieldbackground=BG_CARD2,
                foreground=FG, rowheight=26, font=("Segoe UI", 9))
    s.configure("Treeview.Heading", background="#1a2547", foreground=ACCENT,
                font=("Segoe UI", 9, "bold"))
    s.map("Treeview", background=[("selected", "#24335e")])
    s.configure("TProgressbar", background=ACCENT, troughcolor=BG_CARD2, borderwidth=0)
    s.configure("Lux.TButton", background="#1a2547", foreground=FG,
                padding=(12, 7), font=("Segoe UI", 10, "bold"), borderwidth=0)
    s.map("Lux.TButton", background=[("active", "#24335e")], foreground=[("active", ACCENT)])
    s.configure("Gold.TButton", background="#3a2c07", foreground=GOLD,
                padding=(12, 7), font=("Segoe UI", 10, "bold"), borderwidth=0)
    s.map("Gold.TButton", background=[("active", "#54400a")])
    s.configure("Danger.TButton", background="#3a0f1c", foreground=RED,
                padding=(12, 7), font=("Segoe UI", 10, "bold"), borderwidth=0)
    s.configure("TScale", background=BG_CARD, troughcolor="#1a2547")
    return s


class ToolTip:
    def __init__(self, w, text):
        self.w, self.text, self.tip = w, text, None
        w.bind("<Enter>", self.show); w.bind("<Leave>", self.hide)

    def show(self, _):
        x, y = self.w.winfo_rootx() + 20, self.w.winfo_rooty() + 20
        self.tip = tk.Toplevel(self.w)
        self.tip.wm_overrideredirect(True); self.tip.wm_geometry(f"+{x}+{y}")
        tk.Label(self.tip, text=self.text, bg="#1a2547", fg=FG, font=("Segoe UI", 9),
                 wraplength=320, justify="right", padx=10, pady=8).pack()

    def hide(self, _):
        if self.tip:
            self.tip.destroy(); self.tip = None


# ═══════════════════════════ التطبيق الرئيسي ═══════════════════════════
class App:
    def __init__(self, root):
        self.root = root
        root.title(f"GameRouteOptimizer v{VERSION} — مُحسّن مسار الألعاب 🏆")
        root.geometry("1180x760")
        root.configure(bg=BG)
        root.minsize(1000, 660)
        style_init(root)

        self.servers = [tuple(x) for x in DEFAULT_GAME_SERVERS]
        self.live_running = False
        self.live_data = []
        self.msg_q = queue.Queue()
        self.root.after(200, self._pump_queue)

        self._header()
        self.nb = ttk.Notebook(root)
        self.nb.pack(fill="both", expand=True, padx=12, pady=(0, 10))

        self._tab_dashboard()
        self._tab_games()
        self._tab_trace()
        self._tab_live()
        self._tab_dns()
        self._tab_route()
        self._tab_tweaks()
        self._footer_status("جاهز ✅ — اختر تبويب وابدأ القياس")

    # ── هيدر ──
    def _header(self):
        h = tk.Frame(self.root, bg="#0b1226", highlightbackground="#1e2a4a", highlightthickness=1)
        h.pack(fill="x", padx=12, pady=10)
        tk.Label(h, text="🎮", font=("Segoe UI", 26), bg="#0b1226").pack(side="left", padx=(14, 4), pady=8)
        t = tk.Frame(h, bg="#0b1226"); t.pack(side="left", pady=8)
        tk.Label(t, text="GameRouteOptimizer — مُحسّن مسار الألعاب", bg="#0b1226",
                 fg=FG, font=("Segoe UI", 14, "bold")).pack(anchor="w")
        tk.Label(t, text="اكشف اللفة المالهاش داعي • اختار أفضل سيرفر وDNS وجيتواي • قلل فقدان الحزم والدمج الوهمي",
                 bg="#0b1226", fg=FG_DIM, font=("Segoe UI", 9)).pack(anchor="w")
        tk.Label(h, text=f"v{VERSION}", bg="#0b1226", fg=GOLD, font=("Segoe UI", 10, "bold")).pack(side="right", padx=16)

    def _footer_status(self, txt):
        if hasattr(self, "_status"):
            self._status.config(text=txt); return
        self._status = tk.Label(self.root, text=txt, bg=BG, fg=FG_DIM,
                                font=("Segoe UI", 9), anchor="w")
        self._status.pack(fill="x", padx=16, pady=(0, 8))

    def _pump_queue(self):
        try:
            while True:
                fn = self.msg_q.get_nowait()
                fn()
        except queue.Empty:
            pass
        self.root.after(200, self._pump_queue)

    def run_bg(self, fn):
        threading.Thread(target=fn, daemon=True).start()

    # ════════ تبويب 1: لوحة القيادة ════════
    def _tab_dashboard(self):
        f = tk.Frame(self.nb, bg=BG); self.nb.add(f, text="  📊 لوحة القيادة  ")
        left = Card(f, title="هويتك على الإنترنت"); left.pack(side="left", fill="both", expand=True, padx=(10, 5), pady=10)
        right = Card(f, title="جودة خطك للجيمنج (فحص سريع)"); right.pack(side="right", fill="both", expand=True, padx=(5, 10), pady=10)

        self.dash_vars = {}
        for k, label in [("public_ip", "🌐 IP العام"), ("country", "🏳️ الدولة"), ("city", "🏙️ المدينة"),
                         ("isp", "🏢 المزود ISP"), ("as", "🔗 رقم الشبكة AS"),
                         ("local_ip", "💻 IP جهازك"), ("gateway", "🚪 الجيتواي")]:
            row = tk.Frame(left, bg=BG_CARD); row.pack(fill="x", padx=14, pady=3)
            tk.Label(row, text=label, bg=BG_CARD, fg=FG_DIM, font=FONT_MAIN, width=14, anchor="w").pack(side="left")
            v = tk.Label(row, text="—", bg=BG_CARD, fg=FG, font=("Segoe UI", 10, "bold"), anchor="w")
            v.pack(side="left", fill="x", expand=True)
            self.dash_vars[k] = v
        ttk.Button(left, text="🔄 تحديث بياناتي", style="Lux.TButton",
                   command=lambda: self.run_bg(self._do_public)).pack(pady=12)

        expl = ("ℹ️ يعني إيه؟\n"
                "• الجيتواي = أول هوب (الراوتر بتاعك). لو البنج له فوق 3ms فالمشكلة واي-فاي/سلك.\n"
                "• الـ AS والمزود يحددان مسارك الدولي — اللفة الزيادة غالباً من عندهم.\n"
                "• الفحص السريع يقيس ping/jitter/loss لمرجع ثابت ويعطيك نقاط من 100.")
        tk.Label(left, text=expl, bg=BG_CARD, fg=FG_DIM, font=("Segoe UI", 9),
                 justify="left", wraplength=460).pack(padx=14, pady=6, anchor="w")

        # فحص سريع
        opt = tk.Frame(right, bg=BG_CARD); opt.pack(fill="x", padx=14, pady=6)
        tk.Label(opt, text="الهدف:", bg=BG_CARD, fg=FG_DIM).pack(side="left")
        self.dash_target = tk.Entry(opt, bg=BG_CARD2, fg=FG, insertbackground=FG, width=20)
        self.dash_target.insert(0, "8.8.8.8"); self.dash_target.pack(side="left", padx=6)
        ToolTip(self.dash_target, "مرجع القياس. الأفضل تختار IP سيرفر لعبتك من تبويب الألعاب.")
        ttk.Button(opt, text="⚡ افحص الآن", style="Gold.TButton",
                   command=lambda: self.run_bg(self._do_quick)).pack(side="left", padx=6)

        self.quick_box = tk.Frame(right, bg=BG_CARD); self.quick_box.pack(fill="both", expand=True, padx=14, pady=4)
        self.quick_labels = {}
        for k, label in [("ping", "📶 البنج Ping"), ("jitter", "🌊 الجيتر Jitter (الدمج الوهمي)"),
                         ("loss", "📦 فقدان الحزم Loss"), ("score", "🏆 نقاط الجيمنج /100"),
                         ("verdict", "🧾 الحكم")]:
            row = tk.Frame(self.quick_box, bg=BG_CARD); row.pack(fill="x", pady=4)
            tk.Label(row, text=label, bg=BG_CARD, fg=FG_DIM, font=FONT_MAIN, width=26, anchor="w").pack(side="left")
            v = tk.Label(row, text="—", bg=BG_CARD, fg=FG, font=FONT_BIG, anchor="w")
            v.pack(side="left"); self.quick_labels[k] = v

        self.score_bar = ttk.Progressbar(right, length=300, mode="determinate", maximum=100)
        self.score_bar.pack(padx=14, pady=6, anchor="w")
        tk.Label(right, wraplength=480, justify="left", bg=BG_CARD, fg=FG_DIM, font=("Segoe UI", 9),
                 text="📖 شرح: البنج = زمن الذهاب والعودة. الجيتر = تذبذب البنج (هو «الدمج الوهمي» اللي تحس بيه أن اللاعبين يتنططوا). اللوس = نسبة الحزم الضائعة (تقطيع وضربات لا تُحتسب). للجيمنج المثالي: ping<60 • jitter<10 • loss=0%."
                 ).pack(padx=14, pady=6, anchor="w")

    def _do_public(self):
        self._footer_status("⏳ جاري جلب بيانات IP...")
        info = Net.public_info()
        for k, lbl in self.dash_vars.items():
            self.msg_q.put(lambda k=k: self.dash_vars[k].config(text=str(info.get(k, "—"))))
        self._footer_status("تم ✅")

    def _do_quick(self):
        host = self.dash_target.get().strip() or "8.8.8.8"
        self._footer_status(f"⏳ فحص {host} ...")
        p = Net.ping(host, count=6)
        s = Net.score(p); verdict, color = Net.verdict(p)
        def upd():
            self.quick_labels["ping"].config(text=f"{p['avg']} ms" if p["avg"] is not None else "فشل")
            self.quick_labels["jitter"].config(text=f"{p['jitter']} ms" if p["jitter"] is not None else "—")
            self.quick_labels["loss"].config(text=f"{p['loss']}% ({p['recv']}/{p['sent']})")
            self.quick_labels["score"].config(text=str(s), fg=color)
            self.quick_labels["verdict"].config(text=verdict, fg=color)
            self.score_bar["value"] = s
            self._footer_status(f"انتهى فحص {host}: {verdict}")
        self.msg_q.put(upd)

    # ════════ تبويب 2: سيرفرات الألعاب ════════
    def _tab_games(self):
        f = tk.Frame(self.nb, bg=BG); self.nb.add(f, text="  🎯 سيرفرات الألعاب  ")
        top = Card(f, title="إعدادات الاختبار — خصص كما تشاء"); top.pack(fill="x", padx=10, pady=(10, 4))
        ctr = tk.Frame(top, bg=BG_CARD); ctr.pack(fill="x", padx=12, pady=8)
        self.g_count = self._spin(ctr, "عدد البنجات:", 4, 1, 20)
        self.g_timeout = self._spin(ctr, "مهلة (ms):", 1200, 300, 5000)
        self.g_size = self._spin(ctr, "حجم الحزمة:", 32, 32, 1400)
        ttk.Button(ctr, text="⚡ اختبر الكل", style="Gold.TButton", command=lambda: self.run_bg(self._do_games)).pack(side="left", padx=10)
        ttk.Button(ctr, text="➕ أضف سيرفر", style="Lux.TButton", command=self._add_server).pack(side="left")
        ttk.Button(ctr, text="🗑️ احذف المحدد", style="Danger.TButton", command=self._del_server).pack(side="left", padx=6)
        ToolTip(ctr, "الاختبار متوازي (threads) حتى لا تنتظر طويلاً. عدد بنجات أكبر = دقة أعلى لكن وقت أطول.")

        mid = Card(f, title="النتائج — اضغط على العمود للترتيب (الأفضل فوق 🏆)"); mid.pack(fill="both", expand=True, padx=10, pady=4)
        cols = ("game", "server", "host", "ping", "jitter", "loss", "score", "verdict")
        self.g_tree = ttk.Treeview(mid, columns=cols, show="headings", height=11)
        hdr = {"game": "🎮 اللعبة", "server": "🌍 السيرفر", "host": "الهوست/IP",
               "ping": "بنج", "jitter": "جيتر", "loss": "لوس%", "score": "نقاط", "verdict": "الحكم"}
        for c in cols:
            self.g_tree.heading(c, text=hdr[c], command=lambda c=c: self._sort_tree(self.g_tree, c))
            self.g_tree.column(c, width=120 if c not in ("verdict", "host") else 170, anchor="center")
        self.g_tree.pack(fill="both", expand=True, padx=12, pady=8)
        sb = ttk.Scrollbar(mid, orient="vertical", command=self.g_tree.yview)
        self.g_tree.configure(yscrollcommand=sb.set)

        self.g_best = tk.Label(mid, text="🏆 الأفضل: —", bg=BG_CARD, fg=GOLD, font=FONT_HDR)
        self.g_best.pack(pady=(0, 8))
        tk.Label(mid, bg=BG_CARD, fg=FG_DIM, font=("Segoe UI", 9), wraplength=1000, justify="left",
                 text="💡 كيف تختار؟ العب على السيرفر صاحب أعلى نقاط (بنج قليل + لوس صفر + جيتر قليل). لو سيرفر الشرق الأوسط أسوأ من أوروبا فمسار مزودك للخليج لافف — استخدم Traceroute وقارن، وفعّل Static Route/غيّر DNS من التبويبات التالية."
                 ).pack(padx=12, pady=(0, 8))
        self._refresh_games(empty=True)

    def _spin(self, parent, label, default, mn, mx):
        tk.Label(parent, text=label, bg=BG_CARD, fg=FG_DIM).pack(side="left")
        v = tk.IntVar(value=default)
        tk.Spinbox(parent, from_=mn, to=mx, textvariable=v, width=6,
                   bg=BG_CARD2, fg=FG, buttonbackground="#1a2547").pack(side="left", padx=(4, 14))
        return v

    def _refresh_games(self, empty=False):
        for i in self.g_tree.get_children():
            self.g_tree.delete(i)
        for g, s, h in self.servers:
            self.g_tree.insert("", "end", values=(g, s, h, "—", "—", "—", "—", "بانتظار الاختبار"))

    def _sort_tree(self, tree, col):
        rows = [(tree.set(i, col), i) for i in tree.get_children("")]
        def key(x):
            try:
                return float(str(x[0]).split()[0])
            except Exception:
                return 9999 if col in ("ping", "jitter", "loss") else x[0]
        rev = col not in ("ping", "jitter", "loss", "score")
        if col == "score":
            rev = True
        rows.sort(key=key, reverse=rev)
        for idx, (_, i) in enumerate(rows):
            tree.move(i, "", idx)

    def _add_server(self):
        w = tk.Toplevel(self.root); w.title("إضافة سيرفر"); w.configure(bg=BG_CARD); w.geometry("340x220")
        tk.Label(w, text="🎮 اللعبة:", bg=BG_CARD, fg=FG).pack(pady=(12, 0))
        e1 = tk.Entry(w, bg=BG_CARD2, fg=FG, insertbackground=FG); e1.pack()
        tk.Label(w, text="🌍 السيرفر:", bg=BG_CARD, fg=FG).pack()
        e2 = tk.Entry(w, bg=BG_CARD2, fg=FG, insertbackground=FG); e2.pack()
        tk.Label(w, text="الهوست/IP:", bg=BG_CARD, fg=FG).pack()
        e3 = tk.Entry(w, bg=BG_CARD2, fg=FG, insertbackground=FG); e3.pack()
        def ok():
            if e3.get().strip():
                self.servers.append((e1.get().strip() or "مخصص", e2.get().strip() or "—", e3.get().strip()))
                self._refresh_games(); w.destroy()
        ttk.Button(w, text="حفظ", style="Lux.TButton", command=ok).pack(pady=10)

    def _del_server(self):
        sel = self.g_tree.selection()
        if not sel:
            messagebox.showinfo("تنبيه", "حدد صفاً أولاً"); return
        vals = self.g_tree.item(sel[0])["values"]
        self.servers = [s for s in self.servers if not (s[0] == vals[0] and s[1] == vals[1] and s[2] == vals[2])]
        self._refresh_games()

    def _do_games(self):
        n, to, sz = self.g_count.get(), self.g_timeout.get(), self.g_size.get()
        self._footer_status(f"⏳ اختبار {len(self.servers)} سيرفر (×{n} بنج)...")
        results = {}
        def worker(idx, host):
            results[idx] = Net.ping(host, count=n, timeout_ms=to, size=sz)
        threads = [threading.Thread(target=worker, args=(i, h), daemon=True)
                   for i, (_, _, h) in enumerate(self.servers)]
        for t in threads:
            t.start()
        for t in threads:
            t.join(timeout=120)
        def upd():
            best, best_s = None, -1
            for i, (g, s, h) in enumerate(self.servers):
                p = results.get(i, {"avg": None, "jitter": None, "loss": 100, "recv": 0})
                sc = Net.score(p); verdict, _ = Net.verdict(p)
                ping_t = f"{p['avg']}ms" if p.get("avg") is not None else "فشل"
                jit_t = f"{p.get('jitter')}ms" if p.get("jitter") is not None else "—"
                self.g_tree.insert("", "end", values=(g, s, h, ping_t, jit_t, f"{p.get('loss',100)}%", sc, verdict))
                # احذف صفوف الانتظار القديمة تدريجياً
                if sc > best_s:
                    best_s, best = sc, (g, s, h, p)
            for i in list(self.g_tree.get_children(""))[:len(self.servers)]:
                if "بانتظار" in str(self.g_tree.item(i)["values"]):
                    self.g_tree.delete(i)
            self._sort_tree(self.g_tree, "score")
            if best:
                g, s, h, p = best
                self.g_best.config(text=f"🏆 الأفضل لك: {g} — {s} ({h}) | بنج {p['avg']}ms • لوس {p['loss']}% • جيتر {p['jitter']}ms")
                self._footer_status(f"انتهى ✅ الأفضل: {g} {s}")
        # امسح ثم اعرض
        self.msg_q.put(lambda: [self.g_tree.delete(i) for i in self.g_tree.get_children("")])
        self.msg_q.put(upd)

    # ════════ تبويب 3: تحليل المسار ════════
    def _tab_trace(self):
        f = tk.Frame(self.nb, bg=BG); self.nb.add(f, text="  🛣️ تحليل المسار  ")
        top = Card(f, title="الهدف والإعدادات"); top.pack(fill="x", padx=10, pady=(10, 4))
        ctr = tk.Frame(top, bg=BG_CARD); ctr.pack(fill="x", padx=12, pady=8)
        tk.Label(ctr, text="🎯 الهوست:", bg=BG_CARD, fg=FG_DIM).pack(side="left")
        self.tr_host = tk.Entry(ctr, bg=BG_CARD2, fg=FG, insertbackground=FG, width=30)
        self.tr_host.insert(0, "8.8.8.8"); self.tr_host.pack(side="left", padx=6)
        self.tr_hops = self._spin(ctr, "أقصى هوب:", 20, 5, 30)
        self.tr_timeout = self._spin(ctr, "مهلة/هوب (ms):", 1500, 500, 5000)
        ttk.Button(ctr, text="🛣️ حلل المسار", style="Gold.TButton",
                   command=lambda: self.run_bg(self._do_trace)).pack(side="left", padx=8)
        ttk.Button(ctr, text="📋 انسخ أفضل IP", style="Lux.TButton", command=self._copy_best_hop).pack(side="left")
        ToolTip(ctr, "انسخ IP سيرفر لعبتك من تبويب الألعاب والصقه هنا لرؤية كل هوب يمر به اتصالك.")

        body = tk.Frame(f, bg=BG); body.pack(fill="both", expand=True, padx=10, pady=4)
        tbl = Card(body, title="الهوبات (Nodes) — كل سطر = راوتر يمر به اتصالك"); tbl.pack(side="left", fill="both", expand=True, padx=(0, 5))
        cols = ("n", "ip", "avg", "detail")
        self.tr_tree = ttk.Treeview(tbl, columns=cols, show="headings", height=13)
        for c, t, w in [("n", "#", 40), ("ip", "IP الهوب", 140), ("avg", "البنج", 80), ("detail", "التفاصيل", 320)]:
            self.tr_tree.heading(c, text=t); self.tr_tree.column(c, width=w, anchor="center")
        self.tr_tree.pack(fill="both", expand=True, padx=12, pady=8)

        ana = Card(body, title="🧠 التشخيص الذكي — فين اللفة؟"); ana.pack(side="right", fill="both", expand=True, padx=(5, 0))
        self.tr_text = scrolledtext.ScrolledText(ana, bg=BG_CARD2, fg=FG, font=("Segoe UI", 9),
                                                 wrap="word", height=16)
        self.tr_text.pack(fill="both", expand=True, padx=12, pady=8)
        self.tr_text.insert("end", "📖 يعني إيه هوب؟\nكل هوب = راوتر. هوب 1 = الراوتر بتاعك، 2-3 = المزود المحلي، الباقي = شبكات دولية حتى سيرفر اللعبة.\n\nشغّل التحليل وسيخبرك السكريبت:\n• هل يوجد لوب (IP يتكرر)؟\n• في أي هوب تحصل قفزة البنج؟\n• هل المسار يلف عبر قارة بعيدة؟\n")

    def _copy_best_hop(self):
        sel = self.tr_tree.selection()
        if not sel:
            messagebox.showinfo("تنبيه", "حدد هوباً من الجدول أولاً"); return
        ip = self.tr_tree.item(sel[0])["values"][1]
        self.root.clipboard_clear(); self.root.clipboard_append(str(ip))
        self._footer_status(f"📋 نُسخ {ip}")

    def _do_trace(self):
        host = self.tr_host.get().strip()
        if not host:
            return
        mx, to = self.tr_hops.get(), self.tr_timeout.get()
        self._footer_status(f"⏳ تتبع {host} (حتى {mx} هوب)... قد يستغرق دقيقة")
        hops, raw = Net.traceroute(host, max_hops=mx, timeout_ms=to)
        notes = Net.analyze_hops(hops)
        try:
            dest_ip = socket.gethostbyname(host)
        except Exception:
            dest_ip = host
        def upd():
            for i in self.tr_tree.get_children():
                self.tr_tree.delete(i)
            for h in hops:
                avg_t = f"{h['avg']}ms" if h["avg"] is not None else "***"
                det = "تايم آوت (لا يرد)" if h["avg"] is None else h["raw"][:90]
                tag = ""
                if h["avg"] is not None and h["avg"] > 150:
                    tag = "bad"
                self.tr_tree.insert("", "end", values=(h["n"], h["ip"], avg_t, det))
            self.tr_text.delete("1.0", "end")
            self.tr_text.insert("end", f"🎯 الهدف: {host} ({dest_ip}) — {len(hops)} هوب\n")
            self.tr_text.insert("end", "═" * 46 + "\n")
            if not hops:
                self.tr_text.insert("end", "❌ فشل التتبع — تأكد من الإنترنت أو جرّب IP مباشرة بدل الدومين.\n")
            elif not notes:
                self.tr_text.insert("end", "✅ المسار نظيف! لا لوب ولا قفزات مشبوهة. مشكلتك غالباً واي-فاي أو ضغط شبكة منزلية.\n")
            else:
                for n, txt, _ in notes:
                    self.tr_text.insert("end", f"[هوب {n}] {txt}\n\n")
            self.tr_text.insert("end", "─" * 46 + "\n📌 ماذا تفعل بالتشخيص؟\n")
            self.tr_text.insert("end", ("• قفزة عند هوب 1-2 → مشكلة بيتك (سلك بدل واي-فاي، رستر الراوتر).\n"
                                        "• قفزة في الوسط + لوب → مشكلة مزود ISP — خذ سكرين شوت وكلم الدعم الفني.\n"
                                        "• النهائي عالٍ بدون قفزة واحدة → السيرفر بعيد — العب على سيرفر أقرب (تبويب الألعاب).\n"
                                        "• لا يمكنك إجبار الهوب الوسيط، لكن يمكنك: تغيير DNS + Static Route للعبة عبر جيتواي آخر إن وجد + تجربة Cloudflare WARP كمسار بديل.\n"))
            self._footer_status(f"انتهى تحليل {host} ✅ ({len(hops)} هوب، {len(notes)} ملاحظة)")
        self.msg_q.put(upd)

    # ════════ تبويب 4: المراقبة الحية ════════
    def _tab_live(self):
        f = tk.Frame(self.nb, bg=BG); self.nb.add(f, text="  📡 المراقبة الحية  ")
        top = Card(f, title="مراقبة مستمرة (MTR مبسط) — تكشف التقطيع والدمج الوهمي لحظة بلحظة")
        top.pack(fill="x", padx=10, pady=(10, 4))
        ctr = tk.Frame(top, bg=BG_CARD); ctr.pack(fill="x", padx=12, pady=8)
        tk.Label(ctr, text="🎯 الهوست:", bg=BG_CARD, fg=FG_DIM).pack(side="left")
        self.lv_host = tk.Entry(ctr, bg=BG_CARD2, fg=FG, insertbackground=FG, width=26)
        self.lv_host.insert(0, "8.8.8.8"); self.lv_host.pack(side="left", padx=6)
        tk.Label(ctr, text="كل (ث):", bg=BG_CARD, fg=FG_DIM).pack(side="left")
        self.lv_interval = tk.DoubleVar(value=1.0)
        tk.Spinbox(ctr, from_=0.5, to=5, increment=0.5, textvariable=self.lv_interval,
                   width=5, bg=BG_CARD2, fg=FG, buttonbackground="#1a2547").pack(side="left", padx=4)
        self.lv_btn = ttk.Button(ctr, text="▶️ ابدأ", style="Gold.TButton", command=self._toggle_live)
        self.lv_btn.pack(side="left", padx=8)
        ttk.Button(ctr, text="🧹 مسح", style="Lux.TButton", command=self._clear_live).pack(side="left")
        ToolTip(ctr, "اتركها شغالة أثناء اللعب 5-10 دقائق: السبايكات المتكررة = Jitter عالٍ (دمج وهمي)، والانقطاعات = Loss.")

        mid = tk.Frame(f, bg=BG); mid.pack(fill="both", expand=True, padx=10, pady=4)
        gfx = Card(mid, title="الرسم الحي للبنج (كل نقطة = نبضة)"); gfx.pack(side="left", fill="both", expand=True, padx=(0, 5))
        self.canvas = tk.Canvas(gfx, bg=BG_CARD2, highlightthickness=0, height=260)
        self.canvas.pack(fill="both", expand=True, padx=12, pady=8)
        stats = Card(mid, title="إحصائيات الجلسة"); stats.pack(side="right", fill="both", padx=(5, 0))
        self.lv_vars = {}
        for k, label in [("last", "آخر نبضة"), ("avg", "المتوسط"), ("min", "الأقل"), ("max", "الأعلى"),
                         ("jit", "الجيتر"), ("loss", "الفقد"), ("spikes", "السبايكات ⚡"), ("n", "النبضات")]:
            row = tk.Frame(stats, bg=BG_CARD); row.pack(fill="x", padx=14, pady=3)
            tk.Label(row, text=label, bg=BG_CARD, fg=FG_DIM, width=12, anchor="w").pack(side="left")
            v = tk.Label(row, text="—", bg=BG_CARD, fg=FG, font=FONT_HDR); v.pack(side="left")
            self.lv_vars[k] = v
        self.lv_log = scrolledtext.ScrolledText(stats, bg=BG_CARD2, fg=ORANGE, font=("Consolas", 8),
                                                wrap="word", height=7, width=34)
        self.lv_log.pack(padx=12, pady=8)
        self.lv_log.insert("end", "سجل الأحداث (سبايك/انقطاع)...\n")

    def _toggle_live(self):
        if self.live_running:
            self.live_running = False
            self.lv_btn.config(text="▶️ ابدأ")
            self._footer_status("توقفت المراقبة")
            return
        host = self.lv_host.get().strip()
        if not host:
            return
        self.live_running = True
        self.live_data = []
        self.lv_btn.config(text="⏸️ أوقف")
        self.run_bg(lambda: self._live_loop(host))

    def _clear_live(self):
        self.live_data = []
        self.canvas.delete("all")
        for v in self.lv_vars.values():
            v.config(text="—")
        self.lv_log.delete("1.0", "end")

    def _live_loop(self, host):
        interval = max(0.5, self.lv_interval.get())
        spikes = 0
        while self.live_running:
            p = Net.ping(host, count=1, timeout_ms=2000)
            val = p["avg"]  # ms أو None
            self.live_data.append(val if val is not None else -1)
            if len(self.live_data) > 120:
                self.live_data.pop(0)
            if val is None:
                spikes += 1
                self.msg_q.put(lambda: self.lv_log.insert("end", f"[{datetime.datetime.now():%H:%M:%S}] ❌ انقطاع (Loss)!\n"))
            elif len(self.live_data) >= 2 and self.live_data[-2] > 0 and val - self.live_data[-2] > 60:
                spikes += 1
                self.msg_q.put(lambda v=val: self.lv_log.insert("end", f"[{datetime.datetime.now():%H:%M:%S}] ⚡ سبايك {v}ms (دمج وهمي)!\n"))
            vals = [x for x in self.live_data if x >= 0]
            loss = round((len(self.live_data) - len(vals)) / len(self.live_data) * 100, 1) if self.live_data else 0
            def upd(vals=list(vals), loss=loss, spikes=spikes, val=val):
                self._draw_live()
                if vals:
                    self.lv_vars["last"].config(text=f"{val if val is not None else 'timeout'}")
                    self.lv_vars["avg"].config(text=f"{sum(vals)/len(vals):.0f}ms")
                    self.lv_vars["min"].config(text=f"{min(vals)}ms")
                    self.lv_vars["max"].config(text=f"{max(vals)}ms")
                    j = sum(abs(vals[i]-vals[i-1]) for i in range(1, len(vals)))/max(len(vals)-1, 1)
                    self.lv_vars["jit"].config(text=f"{j:.0f}ms")
                self.lv_vars["loss"].config(text=f"{loss}%")
                self.lv_vars["spikes"].config(text=str(spikes))
                self.lv_vars["n"].config(text=str(len(self.live_data)))
                self.lv_log.see("end")
            self.msg_q.put(upd)
            time.sleep(interval)

    def _draw_live(self):
        c = self.canvas
        c.delete("all")
        W, H = c.winfo_width(), c.winfo_height()
        if W < 50:
            W, H = 500, 240
        data = self.live_data[-120:]
        if not data:
            c.create_text(W//2, H//2, text="اضغط «ابدأ» واتركها أثناء اللعب 🎮", fill=str(FG_DIM))
            return
        mx = max([x for x in data if x >= 0] + [100]) * 1.2
        # شبكة
        for frac, lbl in [(0.25, "25%"), (0.5, "50%"), (0.75, "75%")]:
            y = H * frac
            c.create_line(0, y, W, y, fill="#1e2a4a")
        # خط 100ms الذهبي (حد الجيمنج)
        y100 = H - (min(100, mx) / mx) * (H - 20) - 10
        c.create_line(0, y100, W, y100, fill=str(GOLD), dash=(6, 4))
        c.create_text(W - 46, y100 - 10, text="100ms حد", fill=str(GOLD), font=("Segoe UI", 8))
        pts = []
        for i, v in enumerate(data):
            x = i / max(len(data)-1, 1) * (W - 10) + 5
            y = 10 if v < 0 else H - (min(v, mx) / mx) * (H - 20) - 10
            pts += [x, y]
            if v < 0:
                c.create_oval(x-3, 8, x+3, 14, fill=str(RED), outline="")
        if len(pts) >= 4:
            c.create_line(*pts, fill=str(ACCENT), width=2, smooth=True)
        # نقاط سبايك
        for i, v in enumerate(data):
            if v is not None and v > 100:
                x = i / max(len(data)-1, 1) * (W - 10) + 5
                y = H - (min(v, mx) / mx) * (H - 20) - 10
                c.create_oval(x-3, y-3, x+3, y+3, fill=str(RED), outline="")

    # ════════ تبويب 5: DNS ════════
    def _tab_dns(self):
        f = tk.Frame(self.nb, bg=BG); self.nb.add(f, text="  🌐 الـ DNS  ")
        top = Card(f, title="مقارنة سيرفرات DNS — الأسرع = دخول أسرع للسيرفرات"); top.pack(fill="x", padx=10, pady=(10, 4))
        ctr = tk.Frame(top, bg=BG_CARD); ctr.pack(fill="x", padx=12, pady=8)
        tk.Label(ctr, text="دومين الاختبار:", bg=BG_CARD, fg=FG_DIM).pack(side="left")
        self.dns_test_host = tk.Entry(ctr, bg=BG_CARD2, fg=FG, insertbackground=FG, width=24)
        self.dns_test_host.insert(0, "google.com"); self.dns_test_host.pack(side="left", padx=6)
        ttk.Button(ctr, text="⚡ قارن الآن", style="Gold.TButton",
                   command=lambda: self.run_bg(self._do_dns)).pack(side="left", padx=8)
        ToolTip(ctr, "DNS يترجم الدومين لـ IP. DNS بطيء = تأخير دخول الماتش + أحياناً توجيه لسيرفر أبعد.")

        mid = Card(f, title="النتائج"); mid.pack(fill="both", expand=True, padx=10, pady=4)
        cols = ("name", "primary", "resolve", "ping", "loss", "score")
        self.d_tree = ttk.Treeview(mid, columns=cols, show="headings", height=7)
        for c, t in [("name", "المزود"), ("primary", "الأساسي"), ("resolve", "زمن الحل"),
                     ("ping", "بنج"), ("loss", "لوس"), ("score", "التقييم")]:
            self.d_tree.heading(c, text=t); self.d_tree.column(c, width=130, anchor="center")
        self.d_tree.pack(fill="x", padx=12, pady=8)
        self.d_best = tk.Label(mid, text="🏆 الأفضل: —", bg=BG_CARD, fg=GOLD, font=FONT_HDR)
        self.d_best.pack()
        bot = tk.Frame(mid, bg=BG_CARD); bot.pack(fill="x", padx=12, pady=8)
        ttk.Button(bot, text="✅ طبّق أفضل DNS (يحتاج أدمن)", style="Gold.TButton",
                   command=lambda: self.run_bg(self._apply_dns)).pack(side="left")
        ttk.Button(bot, text="↩️ رجّع DNS تلقائي", style="Lux.TButton",
                   command=lambda: self.run_bg(self._reset_dns)).pack(side="left", padx=8)
        tk.Label(mid, bg=BG_CARD, fg=FG_DIM, font=("Segoe UI", 9), wraplength=1000, justify="left",
                 text="⚠️ التطبيق يغيّر DNS كارت الشبكة النشط فقط عبر netsh. لو فشل: كليك يمين على السكريبت > Run as administrator."
                 ).pack(padx=12, pady=(0, 8))
        self._dns_results = {}

    def _do_dns(self):
        th = self.dns_test_host.get().strip() or "google.com"
        self._footer_status("⏳ مقارنة DNS...")
        res = {}
        for name, primary, _sec in DEFAULT_DNS:
            res[name] = (primary, Net.dns_test(primary, th))
        def upd():
            for i in self.d_tree.get_children():
                self.d_tree.delete(i)
            best, best_k = 99999, None
            for name, (ip, r) in res.items():
                if r["ok"] and r["resolve_ms"] is not None:
                    k = (r["resolve_ms"] or 999) + (r["ping"] or 999) * 0.3
                    tag = "⭐ ممتاز" if k < 60 else ("✅ جيد" if k < 150 else "⚠️ بطيء")
                    if k < best:
                        best, best_k = k, (name, ip)
                else:
                    tag = "❌ فشل"
                self.d_tree.insert("", "end", values=(name, ip, f"{r['resolve_ms']}ms" if r["resolve_ms"] else "—",
                                                      f"{r['ping']}ms" if r["ping"] else "—",
                                                      f"{r['loss']}%", tag))
            self._dns_results = {n: ip for n, (ip, _) in res.items()}
            if best_k:
                self.d_best.config(text=f"🏆 الأفضل: {best_k[0]} ({best_k[1]})")
            self._footer_status("انتهت مقارنة DNS ✅")
        self.msg_q.put(upd)

    def _active_adapter(self):
        rc, out = Net.run(["netsh", "interface", "show", "interface"], timeout=10)
        for line in out.splitlines():
            if "Connected" in line or "متصل" in line:
                parts = line.split()
                name = " ".join(parts[3:]) if len(parts) > 3 else None
                if name and name not in ("Interface", "Name", "Admin", "State", "Type"):
                    return name.strip()
        return "Ethernet"

    def _apply_dns(self):
        sel = self.d_tree.selection()
        if sel:
            vals = self.d_tree.item(sel[0])["values"]
            name, ip = vals[0], vals[1]
        elif self.d_best.cget("text") != "🏆 الأفضل: —":
            m = re.search(r"\(([\d.]+)\)", self.d_best.cget("text"))
            ip = m.group(1) if m else None
            name = "الأفضل"
        else:
            messagebox.showinfo("تنبيه", "قارن أولاً ثم حدد صفاً"); return
        if not ip:
            return
        adapter = self._active_adapter()
        self._footer_status(f"⏳ تطبيق DNS {ip} على {adapter}...")
        rc1, o1 = Net.run(["netsh", "interface", "ip", "set", "dns", f"name={adapter}", "static", ip], timeout=15)
        Net.run(["ipconfig", "/flushdns"], timeout=10)
        if rc1 == 0:
            messagebox.showinfo("تم ✅", f"تم تطبيق DNS {ip} على {adapter}\nأعد اختبار الألعاب لتلاحظ الفرق.")
        else:
            messagebox.showerror("فشل ❌", f"تعذر التطبيق (غالباً تحتاج صلاحية أدمن):\n{o1[:400]}")

    def _reset_dns(self):
        adapter = self._active_adapter()
        Net.run(["netsh", "interface", "ip", "set", "dns", f"name={adapter}", "dhcp"], timeout=15)
        messagebox.showinfo("تم", f"رجّعنا DNS تلقائي (DHCP) على {adapter}")

    # ════════ تبويب 6: التوجيه اليدوي ════════
    def _tab_route(self):
        f = tk.Frame(self.nb, bg=BG); self.nb.add(f, text="  🧭 التوجيه اليدوي  ")
        exp = Card(f, title="افهم أولاً: ماذا يمكنك أن تختار فعلاً؟"); exp.pack(fill="x", padx=10, pady=(10, 4))
        tk.Label(exp, bg=BG_CARD, fg=FG, font=("Segoe UI", 9), wraplength=1080, justify="left",
                 text="❌ لا يمكنك إجبار باكتاتك على المرور بهوب وسيط معين في الإنترنت (مثلاً «عايز أعدي على فرانكفورت مش لندن») — هذا توجيه BGP بيد ISP.\n"
                      "✅ لكن يمكنك: (1) اختيار سيرفر اللعبة الأقرب/الأنظف، (2) اختيار كارت الشبكة/الجيتواي في جهازك إن كان لديك أكثر من اتصال (إيثرنت + واي-فاي + USB)، (3) إضافة Static Route تجبر IP لعبة معينة على الخروج عبر جيتواي معين، (4) استخدام VPN-Gaming/WARP كمسار بديل إن كان مسار ISP لافف."
                 ).pack(padx=14, pady=8)
        body = tk.Frame(f, bg=BG); body.pack(fill="both", expand=True, padx=10, pady=4)
        left = Card(body, title="جدول التوجيه الحالي (route print)"); left.pack(side="left", fill="both", expand=True, padx=(0, 5))
        self.rt_text = scrolledtext.ScrolledText(left, bg=BG_CARD2, fg=FG, font=("Consolas", 8), wrap="none", height=14)
        self.rt_text.pack(fill="both", expand=True, padx=12, pady=8)
        ttk.Button(left, text="🔄 عرض الجدول", style="Lux.TButton",
                   command=lambda: self.run_bg(self._show_routes)).pack(pady=(0, 8))

        right = Card(body, title="أضف مساراً ثابتاً للعبة عبر جيتواي تختاره"); right.pack(side="right", fill="both", expand=True, padx=(5, 0))
        form = tk.Frame(right, bg=BG_CARD); form.pack(fill="x", padx=14, pady=8)
        self.rt_dest = tk.Entry(form, bg=BG_CARD2, fg=FG, insertbackground=FG, width=20)
        self.rt_gw = tk.Entry(form, bg=BG_CARD2, fg=FG, insertbackground=FG, width=20)
        self.rt_persist = tk.BooleanVar(value=False)
        r = 0
        for lbl, w, tip in [("🎯 IP اللعبة/السيرفر:", self.rt_dest, "IP سيرفر اللعبة الذي تريد توجيهه (انسخه من تبويب الألعاب). مثال: 151.249.90.1"),
                            ("🚪 الجيتواي:", self.rt_gw, "جيتواي الشبكة التي تريد الخروج منها (تجده في لوحة القيادة أو route print). مثال: 192.168.1.1")]:
            tk.Label(form, text=lbl, bg=BG_CARD, fg=FG_DIM).grid(row=r, column=0, sticky="w", pady=4)
            w.grid(row=r, column=1, pady=4, padx=6); ToolTip(w, tip); r += 1
        tk.Checkbutton(form, text="اجعله دائماً (-p) يبقى بعد إعادة التشغيل", variable=self.rt_persist,
                       bg=BG_CARD, fg=GOLD, selectcolor=BG_CARD2, activebackground=BG_CARD).grid(row=2, columnspan=2, sticky="w")
        btns = tk.Frame(right, bg=BG_CARD); btns.pack(pady=4)
        ttk.Button(btns, text="➕ أضف المسار", style="Gold.TButton", command=lambda: self.run_bg(self._add_route)).pack(side="left", padx=4)
        ttk.Button(btns, text="➖ احذف المسار", style="Danger.TButton", command=lambda: self.run_bg(self._del_route)).pack(side="left", padx=4)
        tk.Label(right, bg=BG_CARD, fg=FG_DIM, font=("Segoe UI", 9), wraplength=480, justify="left",
                 text="مثال عملي: عندك إيثرنت (192.168.1.1) وواي-فاي (192.168.0.1) — ثبّت IP لعبة Valorant على الإيثرنت الأسرع. لو عندك جيتواي واحد فقط فالمسار الثابت لن يغير الهوبات الدولية، وساعتها الحل: سيرفر أقرب أو WARP."
                 ).pack(padx=14, pady=8)

    def _show_routes(self):
        out = Net.interfaces()
        self.msg_q.put(lambda: (self.rt_text.delete("1.0", "end"), self.rt_text.insert("end", out[:8000])))

    def _add_route(self):
        dest, gw = self.rt_dest.get().strip(), self.rt_gw.get().strip()
        if not dest or not gw:
            messagebox.showinfo("تنبيه", "أدخل IP اللعبة والجيتواي"); return
        cmd = ["route", "add", dest, "mask", "255.255.255.255", gw]
        if self.rt_persist.get():
            cmd.append("-p")
        rc, out = Net.run(cmd, timeout=15)
        self.msg_q.put(lambda: (self.rt_text.delete("1.0", "end"), self.rt_text.insert("end", out[:3000])))
        if rc == 0:
            messagebox.showinfo("تم ✅", f"أُضيف المسار: {dest} عبر {gw}")
        else:
            messagebox.showerror("فشل ❌", f"غالباً تحتاج Run as administrator:\n{out[:500]}")

    def _del_route(self):
        dest = self.rt_dest.get().strip()
        if not dest:
            return
        rc, out = Net.run(["route", "delete", dest], timeout=15)
        messagebox.showinfo("نتيجة", out[:500])

    # ════════ تبويب 7: تحسينات الجيمنج ════════
    def _tab_tweaks(self):
        f = tk.Frame(self.nb, bg=BG); self.nb.add(f, text="  ⚙️ تحسين الجيمنج  ")
        left = Card(f, title="تحسينات سريعة (آمنة وقابلة للرجوع)"); left.pack(side="left", fill="both", expand=True, padx=(10, 5), pady=10)
        self.tw_log = scrolledtext.ScrolledText(left, bg=BG_CARD2, fg=GREEN, font=("Consolas", 9), wrap="word", height=18)
        self.tw_log.pack(fill="both", expand=True, padx=12, pady=8)
        btns = tk.Frame(left, bg=BG_CARD); btns.pack(pady=(0, 8))
        ttk.Button(btns, text="🧹 Flush DNS", style="Lux.TButton", command=lambda: self.run_bg(lambda: self._tweak(["ipconfig", "/flushdns"], "تنظيف كاش DNS"))).pack(side="left", padx=3)
        ttk.Button(btns, text="⚡ تعطيل Nagle", style="Lux.TButton", command=lambda: self.run_bg(self._tweak_nagle)).pack(side="left", padx=3)
        ttk.Button(btns, text="🎮 وضع الجيمنج", style="Gold.TButton", command=lambda: self.run_bg(self._tweak_gaming)).pack(side="left", padx=3)
        ttk.Button(btns, text="🌐 TCP محسوب", style="Lux.TButton", command=lambda: self.run_bg(self._tweak_tcp)).pack(side="left", padx=3)

        right = Card(f, title="شرح كل خاصية + سكريبت الكارت المتكامل"); right.pack(side="right", fill="both", expand=True, padx=(5, 10), pady=10)
        tk.Label(right, bg=BG_CARD, fg=FG, font=("Segoe UI", 9), wraplength=480, justify="left",
                 text="• Flush DNS: يمسح عناوين قديمة قد توجهك لسيرفر بعيد.\n\n"
                      "• تعطيل Nagle (TcpNoDelay): ويندوز يجمع الحزم الصغيرة قبل إرسالها لتوفير الباندويث — هذا يضيف 20-200ms في الألعاب. التعطيل = إرسال فوري.\n\n"
                      "• وضع الجيمنج: يمنع ويندوز من خنق الشبكة أثناء اللعب (NetworkThrottlingIndex) ويوقف Delivery Optimization التي تسرق الرفع.\n\n"
                      "• TCP محسوب: autotuning=normal + rss مفعّل + ecn معطّل — توازن بين السرعة والبنج.\n\n"
                      "• لتحسين كارت Realtek الكامل (InterruptModeration OFF...) استخدم الملف المرفق مع المشروع:"
                 ).pack(padx=14, pady=8, anchor="w")
        ttk.Button(right, text="📜 تشغيل Optimize-GamingNetwork.ps1", style="Gold.TButton",
                   command=lambda: self.run_bg(self._run_ps1)).pack(pady=6)
        tk.Label(right, bg=BG_CARD, fg=RED, font=("Segoe UI", 9, "bold"), wraplength=480, justify="left",
                 text="⚠️ سكريبت الكارت وNagle يعدلان الريجستري — نقطة استعادة قبل التشغيل مستحسنة. كلها تحتاج Run as administrator."
                 ).pack(padx=14, pady=6)

    def _tweak(self, cmd, label):
        self._footer_status(f"⏳ {label}...")
        rc, out = Net.run(cmd, timeout=20)
        self.msg_q.put(lambda: (self.tw_log.insert("end", f"\n[{label}] {'✅' if rc==0 else '❌'}\n{out[:800]}\n"), self.tw_log.see("end")))

    def _tweak_nagle(self):
        import winreg
        try:
            base = r"SYSTEM\CurrentControlSet\Services\Tcpip\Parameters\Interfaces"
            with winreg.OpenKey(winreg.HKEY_LOCAL_MACHINE, base) as k:
                n = winreg.QueryInfoKey(k)[0]
                names = [winreg.EnumKey(k, i) for i in range(n)]
            c = 0
            for name in names:
                try:
                    with winreg.OpenKey(winreg.HKEY_LOCAL_MACHINE, base + "\\" + name, 0, winreg.KEY_SET_VALUE) as sk:
                        winreg.SetValueEx(sk, "TcpNoDelay", 0, winreg.REG_DWORD, 1)
                        winreg.SetValueEx(sk, "TcpAckFrequency", 0, winreg.REG_DWORD, 1)
                        c += 1
                except PermissionError:
                    self.msg_q.put(lambda: messagebox.showerror("صلاحيات", "شغّل السكريبت كمسؤول (Run as administrator)"))
                    return
            self.msg_q.put(lambda: (self.tw_log.insert("end", f"\n✅ تعطيل Nagle على {c} واجهة\n"), self.tw_log.see("end")))
        except Exception as e:
            self.msg_q.put(lambda: self.tw_log.insert("end", f"\n❌ {e}\n"))

    def _tweak_gaming(self):
        import winreg
        try:
            with winreg.OpenKey(winreg.HKEY_LOCAL_MACHINE,
                                r"SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile",
                                0, winreg.KEY_SET_VALUE) as k:
                winreg.SetValueEx(k, "NetworkThrottlingIndex", 0, winreg.REG_DWORD, 0xFFFFFFFF)
                winreg.SetValueEx(k, "SystemResponsiveness", 0, winreg.REG_DWORD, 0)
            self.msg_q.put(lambda: (self.tw_log.insert("end", "\n✅ وضع الجيمنج مفعّل (Throttling OFF)\n"), self.tw_log.see("end")))
        except PermissionError:
            self.msg_q.put(lambda: messagebox.showerror("صلاحيات", "شغّل كمسؤول"))
        except Exception as e:
            self.msg_q.put(lambda: self.tw_log.insert("end", f"\n❌ {e}\n"))

    def _tweak_tcp(self):
        for cmd in (["netsh", "interface", "tcp", "set", "global", "autotuninglevel=normal"],
                    ["netsh", "interface", "tcp", "set", "global", "rss=enabled"],
                    ["netsh", "interface", "tcp", "set", "global", "ecncapability=disabled"]):
            Net.run(cmd, timeout=15)
        self.msg_q.put(lambda: (self.tw_log.insert("end", "\n✅ TCP: autotuning=normal / rss=on / ecn=off\n"), self.tw_log.see("end")))

    def _run_ps1(self):
        import os
        ps1 = os.path.join(os.path.dirname(os.path.abspath(__file__)), "Optimize-GamingNetwork.ps1")
        if not os.path.exists(ps1):
            messagebox.showwarning("غير موجود", "ملف Optimize-GamingNetwork.ps1 غير موجود بجانب السكريبت"); return
        rc, out = Net.run(["powershell", "-ExecutionPolicy", "Bypass", "-File", ps1], timeout=120)
        self.msg_q.put(lambda: (self.tw_log.insert("end", f"\n{'='*30}\n{out[:3000]}\n"), self.tw_log.see("end")))


def main():
    root = tk.Tk()
    App(root)
    root.mainloop()


if __name__ == "__main__":
    main()
