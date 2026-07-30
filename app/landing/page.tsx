"use client";

import Image from "next/image";
import {
  AlertTriangle,
  Bell,
  Globe,
  MapPin,
  Menu,
  Play,
  Shield,
  ShieldCheck,
  Siren,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./landing.module.css";

export default function LandingPage() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = () => setMobileOpen(false);

  const navItems = [
    { href: "#features", label: "Features" },
    { href: "#how-it-works", label: "How It Works" },
  ] as const;

  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <div className={styles.container}>
          <div className={styles.navInner}>
            <a href="#" className={styles.brand} aria-label="Aegis+ home">
              <Image
                src="/logo_na.png"
                alt="Aegis+"
                width={260}
                height={60}
                priority
                className={styles.wordmark}
              />
            </a>

            <div className={styles.navLinks} aria-label="Primary navigation">
              {navItems.map((item) => (
                <a key={item.href} className={styles.navLink} href={item.href}>
                  {item.label}
                </a>
              ))}
            </div>

            <div className={styles.navRight}>
              <button
                type="button"
                onClick={() => router.push("/login")}
                className={styles.ghostBtn}
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => router.push("/register")}
                className={styles.primaryBtn}
              >
                Get Started
              </button>

              <button
                type="button"
                className={styles.menuBtn}
                aria-expanded={mobileOpen}
                aria-controls="mobile-nav"
                onClick={() => setMobileOpen((v) => !v)}
              >
                {mobileOpen ? (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                    <X size={16} /> Close
                  </span>
                ) : (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                    <Menu size={16} /> Menu
                  </span>
                )}
              </button>
            </div>
          </div>

          {mobileOpen ? (
            <div className={styles.mobilePanel} id="mobile-nav">
              <div className={styles.mobilePanelInner}>
                {navItems.map((item) => (
                  <a key={item.href} href={item.href} onClick={closeMobile}>
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </nav>

      <header className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroGrid}>
            <div>
              <div className={styles.badge}>
                <Globe size={16} />
                <span>Now live across all 77 districts of Nepal</span>
              </div>

              <h1 className={styles.heroH1}>
                Stay Safe. Stay Alert. <strong>Stay Together.</strong>
              </h1>

              <p className={styles.heroP}>
                Aegis+ is Nepal&apos;s personal safety platform. Get emergency alerts, share
                your location with trusted contacts, and report incidents anonymously, all in
                one app.
              </p>

              <div className={styles.heroButtons}>
                <button
                  type="button"
                  onClick={() => router.push("/register")}
                  className={styles.ctaBtn}
                >
                  Get Started Free
                </button>
                <button type="button" className={styles.secondaryBtn}>
                  <span className={styles.btnIcon} aria-hidden="true">
                    <Play size={16} />
                  </span>
                  Watch Demo
                </button>
              </div>

              <div className={styles.stats} aria-label="Aegis+ impact stats">
                <div className={styles.stat}>
                  <span
                    className={styles.statIcon}
                    style={{
                      background: "rgba(34,197,94,0.10)",
                      borderColor: "rgba(34,197,94,0.18)",
                    }}
                    aria-hidden="true"
                  >
                    <Users size={18} color="var(--aegis-primary)" />
                  </span>
                  <div>
                    <div className={styles.statValue}>50K+</div>
                    <div className={styles.statLabel}>Active Users</div>
                  </div>
                </div>

                <div className={styles.stat}>
                  <span
                    className={styles.statIcon}
                    style={{
                      background: "rgba(14,165,233,0.10)",
                      borderColor: "rgba(14,165,233,0.18)",
                    }}
                    aria-hidden="true"
                  >
                    <MapPin size={18} color="rgba(14,165,233,1)" />
                  </span>
                  <div>
                    <div className={styles.statValue}>77</div>
                    <div className={styles.statLabel}>Districts Covered</div>
                  </div>
                </div>

                <div className={styles.stat}>
                  <span
                    className={styles.statIcon}
                    style={{
                      background: "rgba(168,85,247,0.10)",
                      borderColor: "rgba(168,85,247,0.18)",
                    }}
                    aria-hidden="true"
                  >
                    <ShieldCheck size={18} color="rgba(168,85,247,1)" />
                  </span>
                  <div>
                    <div className={styles.statValue}>Partnered</div>
                    <div className={styles.statLabel}>Nepal Police</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className={styles.previewWrap} aria-label="Aegis+ preview">
                <div className={styles.previewCard}>
                  <div className={styles.previewHeader}>
                    <div>
                      <div className={styles.previewTitle}>Good Morning, Aakriti</div>
                      <div className={styles.previewSubtitle}>Kathmandu, Nepal</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span className={styles.previewBell} aria-hidden="true">
                        <Bell size={18} />
                      </span>
                      <span className={styles.previewAvatar} aria-hidden="true">
                        <img
                          src="/profile.png"
                          alt=""
                          style={{
                            width: "100%",
                            height: "100%",
                            borderRadius: 999,
                            objectFit: "cover",
                            display: "block",
                          }}
                        />
                      </span>
                    </div>
                  </div>

                  <div className={styles.previewList}>
                    <div className={`${styles.previewItem} ${styles.previewItemGreen}`}>
                      <div
                        className={`${styles.previewItemIcon} ${styles.previewItemIconGreen}`}
                        aria-hidden="true"
                      >
                        <ShieldCheck size={18} />
                      </div>
                      <div>
                        <div className={styles.previewItemTitle}>All systems active</div>
                        <div className={styles.previewItemDesc}>
                          Real-time guardian monitoring
                        </div>
                      </div>
                    </div>

                    <div className={`${styles.previewItem} ${styles.previewItemGray}`}>
                      <div
                        className={`${styles.previewItemIcon} ${styles.previewItemIconGray}`}
                        aria-hidden="true"
                      >
                        <AlertTriangle size={18} />
                      </div>
                      <div>
                        <div className={styles.previewItemTitle}>Moderate Risk — Thamel</div>
                        <div className={styles.previewItemDesc}>Increased reports nearby</div>
                      </div>
                    </div>
                  </div>

                  <div className={styles.quickActions} aria-label="Quick actions">
                    <div className={`${styles.quickCard} ${styles.quickRed}`}>
                      <span className={styles.quickIcon} aria-hidden="true">
                        <Siren size={18} />
                      </span>
                      <div>
                        <div className={styles.quickTitle}>SOS</div>
                        <div className={styles.quickSubtitle}>Instant emergency alert</div>
                      </div>
                    </div>

                    <div className={`${styles.quickCard} ${styles.quickPurple}`}>
                      <span className={styles.quickIcon} aria-hidden="true">
                        <MapPin size={18} />
                      </span>
                      <div>
                        <div className={styles.quickTitle}>Trip Mode</div>
                        <div className={styles.quickSubtitle}>Safer travel tracking</div>
                      </div>
                    </div>

                    <div className={`${styles.quickCard} ${styles.quickAmber}`}>
                      <span className={styles.quickIcon} aria-hidden="true">
                        <Shield size={18} />
                      </span>
                      <div>
                        <div className={styles.quickTitle}>Report Alert</div>
                        <div className={styles.quickSubtitle}>Anonymous incident report</div>
                      </div>
                    </div>

                    <div className={`${styles.quickCard} ${styles.quickGreen}`}>
                      <span className={styles.quickIcon} aria-hidden="true">
                        <Users size={18} />
                      </span>
                      <div>
                        <div className={styles.quickTitle}>Safety Circle</div>
                        <div className={styles.quickSubtitle}>Your trusted contacts</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section id="features" className={`${styles.sectionAlt} ${styles.anchorTarget}`}>
        <div className={styles.container}>
          <div className={styles.sectionTitle}>
            <h2>Built for your safety</h2>
            <p>Everything you need to stay protected.</p>
          </div>

          <div className={styles.cardGrid}>
            {[
              {
                icon: Shield,
                title: "Emergency SOS",
                description: "Instant alerts to trusted contacts",
                accent: styles.cardAccentRed,
              },
              {
                icon: MapPin,
                title: "Live Location",
                description: "Real-time sharing with your network",
                accent: styles.cardAccentPurple,
              },
              {
                icon: Users,
                title: "Trusted Contacts",
                description: "Quick access to emergency contacts",
                accent: styles.cardAccentGreen,
              },
              {
                icon: Globe,
                title: "Incident Reports",
                description: "Anonymous community safety reports",
                accent: styles.cardAccentAmber,
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className={[styles.card, feature.accent].filter(Boolean).join(" ")}
              >
                <div className={styles.cardIcon} aria-hidden="true">
                  <feature.icon size={18} />
                </div>
                <div className={styles.cardTitle}>{feature.title}</div>
                <div className={styles.cardDesc}>{feature.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className={`${styles.section} ${styles.anchorTarget}`}
        aria-label="How Aegis+ works"
      >
        <div className={styles.container}>
          <div className={styles.sectionTitle}>
            <h2>Simple to get started</h2>
            <p>Three steps to complete peace of mind.</p>
          </div>

          <div className={styles.steps}>
            {[
              { title: "Create account", icon: Users, step: "01" },
              { title: "Add contacts", icon: Users, step: "02" },
              { title: "Stay protected", icon: Shield, step: "03" },
            ].map((item) => (
              <div key={item.step} className={styles.stepCard}>
                <div className={styles.stepIconWrap} aria-hidden="true">
                  <item.icon size={22} />
                  <span className={styles.stepBadge}>{item.step}</span>
                </div>
                <div className={styles.stepTitle}>{item.title}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.sectionAlt}>
        <div className={styles.container}>
          <div className={styles.ctaBox}>
            <h2 style={{ fontSize: 34, letterSpacing: "-0.03em", fontWeight: 950 }}>
              Ready to feel safer?
            </h2>
            <p>Join thousands who trust Aegis+ for their personal safety.</p>
            <div className={styles.ctaActions}>
              <button
                type="button"
                onClick={() => router.push("/register")}
                className={styles.ctaBtn}
              >
                Get Started Free
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerInner}>
            <a href="#" className={styles.brand} aria-label="Aegis+ home">
              <Image
                src="/logo_na.png"
                alt="Aegis+"
                width={210}
                height={50}
                className={styles.wordmark}
              />
            </a>

            <div className={styles.footerLinks}>
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
              <a href="#">Contact</a>
            </div>

            <div className={styles.footerCopy}>© 2026 Aegis+</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
