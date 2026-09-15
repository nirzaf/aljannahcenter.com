import {
  ArrowRight,
  ArrowUpRight,
  HeartHandshake,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Play,
} from "lucide-react";

const profiles = [
  { platform: "Facebook", handle: "Al - Jannah Centre", href: "https://www.facebook.com/aljannahcentre/", mark: "f" },
  { platform: "Instagram", handle: "@aljannahcentre", href: "https://www.instagram.com/aljannahcentre/", mark: "◎" },
  { platform: "YouTube", handle: "@al-jannahcentre5619", href: "https://www.youtube.com/@al-jannahcentre5619", icon: Play },
];

const facebookEmbed = (href: string) =>
  "https://www.facebook.com/plugins/post.php?href=" +
  encodeURIComponent(href) +
  "&show_text=false&width=500";

const socialVisuals = [
  {
    title: "42nd National Meelad announcement",
    platform: "Facebook",
    href: "https://www.facebook.com/aljannahcentre/posts/al-jannah-centre-is-coming-were-pleased-to-announce-our-participation-in-the-42n/1444264511082038/",
  },
  {
    title: "Meelad Exhibition directions",
    platform: "Facebook",
    href: "https://www.facebook.com/aljannahcentre/posts/-finding-al-jannah-is-now-easierheading-to-stalls-no-16-17-follow-our-direction-/1445772060931283/",
  },
  {
    title: "National Meelad photo collection",
    platform: "Facebook",
    href: "https://www.facebook.com/aljannahcentre/posts/-42nd-national-meelad-un-nabi-exhibition-photo-collection-03behind-every-picture/1452095086965647/",
  },
  {
    title: "Official National Meelad invitation",
    platform: "Facebook",
    href: "https://www.facebook.com/aljannahcentre/posts/we-are-honoured-to-share-that-al-jannah-centre-for-special-needs-children-has-re/1447499297425226/",
  },
];

const accounts = [
  { bank: "Amãna Bank PLC", account: "010-0482796-001", branch: "Negombo", swift: "AMNALKLX" },
  { bank: "People’s Bank", account: "142-2-001-6-0056821", branch: "Chillaw Rd, Kochchikade", swift: "PSBKLKLX" },
];

function BrandMark() {
  return (
    <span className="brand-logo" aria-hidden="true">
      <img src="/al-jannah-support-poster.png" alt="" />
    </span>
  );
}

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Al-Jannah Centre home">
          <BrandMark />
          <span><strong>Al-Jannah</strong><small>Centre</small></span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#about">About</a><a href="#updates">Updates</a>
          <a href="#support">Support</a><a href="#contact">Contact</a>
        </nav>
        <a className="header-cta" href="#support">Support the Centre <ArrowRight size={16} /></a>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><span /> Kochchikade, Negombo · Sri Lanka</p>
          <h1>A place where every child can <em>shine.</em></h1>
          <p className="hero-lede">
            Al-Jannah Centre is for children with special needs and skills. We welcome
            families, friends and supporters to connect with the Centre.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#contact">Contact the Centre <ArrowRight size={18} /></a>
            <a className="button button-light" href="#updates">See public updates <ArrowUpRight size={17} /></a>
          </div>
          <div className="hero-points">
            <p><HeartHandshake size={18} /> Give hope. <strong>Change a life.</strong></p>
            <p><span className="dot" /> Official links and contact details</p>
          </div>
        </div>
        <div className="hero-visual">
          <i className="orbit orbit-large" /><i className="orbit orbit-small" />
          <div className="poster">
            <div className="poster-caption"><span>Al-Jannah Centre</span><span>Support poster</span></div>
            <img src="/al-jannah-support-poster.png" alt="Al-Jannah Centre support poster with bank-account details" />
          </div>
          <p className="visual-note">Give hope. Change a life.</p>
        </div>
      </section>

      <section className="intro" id="about">
        <p className="kicker">The Centre</p>
        <div>
          <h2>Celebrating abilities, talents, faiths and values.</h2>
          <p>
            The Centre publicly describes its work as education, therapy and vocational
            training for children with special needs. For programme and admission
            enquiries, speak directly with the Centre.
          </p>
        </div>
        <a className="text-link" href="#contact">Start a conversation <ArrowRight size={17} /></a>
      </section>

      <section className="channels" aria-labelledby="channels-title">
        <div className="section-top">
          <div><p className="kicker">Stay connected</p><h2 id="channels-title">Official social channels</h2></div>
          <p>Follow the Centre’s own pages for announcements, celebrations and day-to-day updates.</p>
        </div>
        <div className="profile-grid">
          {profiles.map((profile) => {
            const Icon = profile.icon;
            return (
              <a className="profile-card" href={profile.href} key={profile.platform} target="_blank" rel="noreferrer">
                <span className="profile-icon" aria-hidden="true">{Icon ? <Icon size={23} /> : profile.mark}</span>
                <span><small>{profile.platform}</small><strong>{profile.handle}</strong></span>
                <ArrowUpRight size={19} />
              </a>
            );
          })}
        </div>
      </section>

      <section className="public-updates" id="updates" aria-labelledby="updates-title">
        <div className="section-top">
          <div><p className="kicker">From the official feed</p><h2 id="updates-title">Public moments and milestones</h2></div>
          <p>Selected images are embedded directly from Al-Jannah Centre’s official social accounts, with a link to each original post.</p>
        </div>
        <div className="social-gallery">
          {socialVisuals.map((visual) => (
            <article className="social-embed" key={visual.href}>
              <div className="embed-meta">
                <span>{visual.platform}</span>
                <strong>{visual.title}</strong>
              </div>
              <iframe
                src={facebookEmbed(visual.href)}
                title={visual.platform + ": " + visual.title}
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                allow="encrypted-media; picture-in-picture; web-share"
              />
              <a href={visual.href} target="_blank" rel="noreferrer">
                View original post <ArrowUpRight size={16} />
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="support" id="support" aria-labelledby="support-title">
        <div>
          <p className="kicker kicker-light">Support the Centre</p>
          <h2 id="support-title">Your support helps make room for possibility.</h2>
          <p>Use the bank details shown on the Centre’s support poster, or contact the Centre directly before making a contribution.</p>
          <a className="button button-gold" href="#contact">Confirm donation details <ArrowRight size={18} /></a>
        </div>
        <div className="accounts">
          {accounts.map((item) => (
            <article className="account-card" key={item.bank}>
              <div className="bank"><span>AJ</span><strong>{item.bank}</strong></div>
              <dl>
                <div><dt>Account name</dt><dd>Al-Jannah Centre</dd></div>
                <div><dt>Account number</dt><dd>{item.account}</dd></div>
                <div><dt>Branch</dt><dd>{item.branch}</dd></div>
                <div><dt>SWIFT code</dt><dd>{item.swift}</dd></div>
              </dl>
            </article>
          ))}
        </div>
      </section>

      <section className="contact" id="contact" aria-labelledby="contact-title">
        <div className="contact-copy">
          <p className="kicker">Get in touch</p><h2 id="contact-title">We’re here to connect.</h2>
          <p>Reach out to the Centre for enquiries, visits and support.</p>
        </div>
        <div className="contact-grid">
          <a href="tel:+94771001518"><Phone size={20} /><span><small>Call</small><strong>+94 77 100 1518</strong></span></a>
          <a href="https://wa.me/94752223370" target="_blank" rel="noreferrer"><MessageCircle size={20} /><span><small>WhatsApp</small><strong>+94 75 222 3370</strong></span></a>
          <a href="mailto:aljannahcentresrilanka@gmail.com"><Mail size={20} /><span><small>Email</small><strong>aljannahcentresrilanka@gmail.com</strong></span></a>
          <a href="https://www.google.com/maps/search/?api=1&query=20%2FA%20Negombo%20Road%2C%20Kochchikade%2C%20Sri%20Lanka" target="_blank" rel="noreferrer"><MapPin size={20} /><span><small>Visit</small><strong>20/A Negombo Road, Kochchikade</strong></span></a>
        </div>
      </section>

      <footer>
        <a className="brand" href="#top"><BrandMark /><span><strong>Al-Jannah</strong><small>Centre</small></span></a>
        <p>For children with special needs and skills.</p><a href="#top">Back to top ↑</a>
      </footer>
    </main>
  );
}
