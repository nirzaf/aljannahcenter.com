// Public contact and support details shared by the layout and the homepage.
export const centre = {
  name: "Al-Jannah Centre",
  tagline: "For children with special needs & skills",
  since: 2018,
  phone: { label: "+94 77 100 1518", href: "tel:+94771001518" },
  whatsapp: {
    label: "+94 75 222 3370",
    href: "https://wa.me/94752223370",
    donationHref:
      "https://wa.me/94752223370?text=" +
      encodeURIComponent("Assalamu alaikum, I would like to support Al-Jannah Centre. Could you confirm the donation details?"),
  },
  email: { label: "info@aljannahcentre.com", href: "mailto:info@aljannahcentre.com" },
  address: {
    lines: ["20/A Negombo Road", "Kochchikade, Sri Lanka"],
    mapHref: "https://www.google.com/maps/search/?api=1&query=20%2FA%20Negombo%20Road%2C%20Kochchikade%2C%20Sri%20Lanka",
    embedSrc: "https://www.google.com/maps?q=20%2FA%20Negombo%20Road%2C%20Kochchikade%2C%20Sri%20Lanka&output=embed",
  },
};

export const socialProfiles = [
  { platform: "TikTok", handle: "@aljannah.centre", href: "https://www.tiktok.com/@aljannah.centre" },
  { platform: "Facebook", handle: "Al - Jannah Centre", href: "https://www.facebook.com/aljannahcentre/" },
  { platform: "Instagram", handle: "@aljannahcentre", href: "https://www.instagram.com/aljannahcentre/" },
];

export const bankAccounts = [
  { bank: "Amãna Bank PLC", account: "010-0482796-001", branch: "Negombo", swift: "AMNALKLX" },
  { bank: "People’s Bank", account: "142-2-001-6-0056821", branch: "Chillaw Rd, Kochchikade", swift: "PSBKLKLX" },
];
