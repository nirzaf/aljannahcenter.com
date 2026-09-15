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

const updates = [
  { title: "A place of love, care and inclusion", detail: "A public photo update from the Centre.", date: "November 2025", platform: "Facebook", href: "https://www.facebook.com/aljannahcentre/photos/1216389243869567/" },
  { title: "A day out at Lotus Tower", detail: "A public outing update shared by the Centre.", date: "Official post", platform: "Facebook", href: "https://www.facebook.com/aljannahcentre/posts/the-children-of-al-jannah-centre-for-special-need-children-has-enjoyed-an-exciti/1261612042680620/" },
  { title: "Children’s Day celebration", detail: "Performances, art, games and gifts.", date: "2 October 2025", platform: "Facebook", href: "https://www.facebook.com/aljannahcentre/posts/childrens-day-celebration-2025-al-jannah-centre-for-special-needs-children-toget/1181555450686280/" },
  { title: "Celebrating a learner achievement", detail: "A public milestone shared by the Centre.", date: "Official post", platform: "Facebook", href: "https://www.facebook.com/aljannahcentre/photos/1284320707076420/" },
  { title: "Preparing for the Grade 5 Scholarship", detail: "A public classroom update shared by the Centre.", date: "August 2026", platform: "Facebook", href: "https://www.facebook.com/aljannahcentre/photos/1432464135595409/" },
  { title: "Celebrating our young achievers", detail: "An official Instagram update from Al-Jannah Centre.", date: "2 September 2026", platform: "Instagram", href: "https://www.instagram.com/p/DdMYX5tt63-/" },
];

const accounts = [
  { bank: "Amãna Bank PLC", account: "010-0482796-001", branch: "Negombo", swift: "AMNALKLX" },
  { bank: "People’s Bank", account: "142-2-001-6-0056821", branch: "Chillaw Rd, Kochchikade", swift: "PSBKLKLX" },
];

function BrandMark() {
  return <span className="brand-mark" aria-hidden="true"><span>A</span><span>J</span></span>;
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
          <p>These links open the original posts. The site does not copy children’s photos, helping the Centre keep control of images and privacy.</p>
        </div>
        <div className="updates-grid">
          {updates.map((update, index) => (
            <a className="update-card" href={update.href} key={update.href} target="_blank" rel="noreferrer">
              <span className="update-number">0{index + 1}</span><span className="platform-tag">{update.platform}</span>
              <h3>{update.title}</h3><p>{update.detail}</p>
              <span className="update-link">{update.date} <ArrowUpRight size={16} /></span>
            </a>
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
