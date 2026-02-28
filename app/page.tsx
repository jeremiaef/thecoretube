"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { DM_Sans, Instrument_Serif } from "next/font/google";
import { supabase } from "./lib/supabase";
import styles from "./landing-page.module.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-dm-sans",
});
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
});

const quotes = [
  {
    text: '"Habit replacement is more effective than elimination — the brain needs a substitute, not a void."',
    source: "— BJ Fogg · Stanford Behavioral Scientist",
  },
  {
    text: '"You don\'t rise to the level of your goals. You fall to the level of your systems."',
    source: "— James Clear · Atomic Habits",
  },
  {
    text: '"The secret to change is to focus all energy not fighting the old, but building the new."',
    source: "— Socrates",
  },
  {
    text: '"To replace a habit, keep the cue and reward — only change the routine in between."',
    source: "— Charles Duhigg · The Power of Habit",
  },
  {
    text: '"Average people consume content. Exceptional people act on it."',
    source: "— Robin Sharma · Leadership Expert",
  },
  {
    text: '"Every action you take is a vote for the person you wish to become."',
    source: "— James Clear · Atomic Habits",
  },
];

export default function LandingPage() {
  const router = useRouter();
  const navRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [activeQuote, setActiveQuote] = useState(0);

  // Redirect logged-in users straight to the app
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) router.push("/app");
    });
  }, [router]);

  // Nav scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Quote carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveQuote((prev) => (prev + 1) % quotes.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add(styles.visible);
            e.target.classList.remove(styles.reveal);
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll("[data-reveal]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`${styles.page} ${dmSans.variable} ${instrumentSerif.variable}`}>
      {/* NAV */}
      <nav ref={navRef} className={`${styles.nav} ${scrolled ? styles.navScrolled : ""}`}>
        <a className={styles.navLogo} href="#">
          <svg className={styles.navLogoIcon} viewBox="0 0 32 32" fill="none">
            <polygon points="8,4 22,4 28,16 22,28 8,28 8,16" fill="#2A2A2A" stroke="#444" strokeWidth="0.5" />
            <path d="M12 10 L20 10 L24 16 L20 22 L12 22" fill="#F5F5F5" opacity="0.9" />
            <path d="M16 10 L24 16 L16 22" fill="#CCCCCC" opacity="0.7" />
          </svg>
          <div className={styles.navWordmark}>WE ARE DOERS</div>
        </a>
        <button onClick={() => router.push("/login")} className={styles.navCta}>
          Masuk →
        </button>
      </nav>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroLogo}>
            <img src="/logo-transparent.png" alt="We Are Doers" className={styles.heroLogoImg} />
          </div>

          <div className={styles.heroDivider} />

          <p className={styles.heroPara}>
            We turn <strong>educational YouTube 30+ min videos</strong> into{" "}
            <strong>2-min swipeable core insights &amp; action cards</strong> — so instead of just
            watching, you actually <strong>learn and do something</strong> about it.
            Scroll. Learn. Act. <strong>Become a Doer.</strong>
          </p>

          {/* Rotating quotes */}
          <div className={styles.quoteCarousel}>
            {quotes.map((q, i) => (
              <div
                key={i}
                className={`${styles.quoteSlide} ${i === activeQuote ? styles.active : ""}`}
              >
                <p className={styles.quoteText}>{q.text}</p>
                <span className={styles.quoteSource}>{q.source}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className={styles.ctaWrap}>
            <button onClick={() => router.push("/login")} className={styles.ctaBtn}>
              Mulai Jadi Doer — Gratis →
            </button>
            <p className={styles.ctaNote}>Bukan scrolling biasa. Ini scrolling yang mengubah hidup.</p>
          </div>
        </div>
      </section>

      {/* TAGLINE BAR */}
      <div data-reveal className={styles.reveal}>
        <div className={styles.taglineBar}>
          <p>
            Watchers watch. <strong>Doers grow.</strong> Which one are you?
          </p>
        </div>
      </div>

      {/* PROBLEM */}
      <div data-reveal className={styles.reveal}>
        <div className={styles.section}>
          <span className={styles.sectionLabel}>The problem we&apos;re solving</span>
          <div className={styles.problemGrid}>
            {[
              {
                icon: "📱",
                title: "You scroll for hours.",
                desc: "The algorithm keeps you watching. You finish a session having learned nothing — and done nothing.",
              },
              {
                icon: "🧠",
                title: "You watch. You forget.",
                desc: 'Hundreds of "how to be better" videos. Nothing changed. Knowledge without action is just entertainment.',
              },
              {
                icon: "⚡",
                title: "Willpower doesn't work.",
                desc: "Research shows you can't stop a habit — you have to replace it. We built exactly that replacement.",
              },
            ].map((item, i) => (
              <div key={i} className={styles.problemItem}>
                <div className={styles.problemIcon}>{item.icon}</div>
                <div className={styles.problemTitle}>{item.title}</div>
                <p className={styles.problemDesc}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div data-reveal className={styles.reveal}>
        <div className={styles.stepsSection}>
          <h2 className={styles.stepsH2}>
            Same scroll.<br />
            <em>Real action.</em>
          </h2>
          <p className={styles.stepsSub}>
            We take the best educational YouTube content and turn it into something you can actually
            do — today.
          </p>
          <div className={styles.steps}>
            {[
              {
                num: "01",
                title: "Scroll like always",
                desc: "Swipe through cards — just like TikTok. But every card carries real insight from top YouTube educators, condensed into 5 slides.",
              },
              {
                num: "02",
                title: "Accept a challenge",
                desc: "Every piece of content ends with one concrete action. Not theory — something you can do today.",
              },
              {
                num: "03",
                title: "Prove it. Earn it.",
                desc: "Submit your proof. Get verified. Earn achievements you can flex — because you actually did it.",
              },
              {
                num: "04",
                title: "Become the inspiration",
                desc: "While others watch, you grow. Your achievements prove you're not a Watcher — you're a Doer.",
              },
            ].map((step, i) => (
              <div key={i} className={styles.step}>
                <span className={styles.stepNum}>{step.num}</span>
                <div>
                  <p className={styles.stepTitle}>{step.title}</p>
                  <p className={styles.stepDesc}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FINAL CTA */}
      <div data-reveal className={styles.reveal}>
        <section className={styles.finalCta}>
          <img src="/logo-transparent.png" alt="" className={styles.finalCtaLogo} />
          <h3 className={styles.finalH3}>
            Are you a Watcher<br />or a Doer?
          </h3>
          <p className={styles.finalSub}>Mulai sekarang — gratis.</p>
          <button onClick={() => router.push("/login")} className={styles.ctaBtn}>
            Mulai Jadi Doer — Gratis →
          </button>
        </section>
      </div>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.footerWordmark}>
          <svg viewBox="0 0 20 20" fill="none">
            <path d="M5 2 L14 2 L18 10 L14 18 L5 18 L5 10 Z" fill="#E8E8E8" opacity="0.9" />
            <path d="M14 2 L18 10 L14 10 Z" fill="#AAAAAA" />
          </svg>
          WE ARE DOERS
        </div>
        <p>© 2026 Doers · Jakarta, Indonesia</p>
      </footer>
    </div>
  );
}
