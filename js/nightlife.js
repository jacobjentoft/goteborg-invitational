// The 19th Hole: Gothenburg nightlife browser.
// Venue data condensed from gothenburg-nightlife-data.md (July 2026 research).
// Ratings: damage 💸 (price), send-it 🔊 (energy), door roulette 🎲 (lower = safer).

const CATS = {
  club: 'Clubs',
  pre: 'Pre-party',
  cocktail: 'Cocktails',
  roof: 'Rooftops',
  alt: 'Off-piste',
};

const VENUES = [
  // clubs
  { name: 'Yaki-Da', cat: 'club', zone: 'Avenyn (edge)',
    blurb: 'Four floors, four vibes: cocktail rooms, live music, DJs, sing-along pop, backyard terrace. Repeatedly voted best club in town. Packed and sticky after midnight — the best single-venue pick for seven.',
    r: [4, 5, 3], url: 'https://yaki-da.se/' },
  { name: 'Lounge(s)', cat: 'club', zone: 'Avenyn',
    blurb: 'Party up through the floors to a rooftop terrace, house DJs on every level, the whole night in one building. Free noodles have been sighted.',
    r: [3, 4, 3], url: 'https://entrgroup.se/' },
  { name: 'Push', cat: 'club', zone: 'Avenyn',
    blurb: 'ENTR’s flagship: house, disco and 80s across multiple zones, open rooftop in summer. Glamour and high energy.',
    r: [4, 4, 4], url: 'https://entrgroup.se/nightlife/push/' },
  { name: 'Trädgår’n · Port Du Soleil', cat: 'club', zone: 'Garden Society',
    blurb: 'One of the city’s biggest clubs — and in summer the glam Port Du Soleil takeover brings house parties with heavy bass to the garden.',
    r: [4, 4, 3], url: 'https://www.tradgarn.se/' },
  { name: 'Nefertiti', cat: 'club', zone: 'Central',
    blurb: 'Legendary jazz club since 1982 that turns into one of the city’s best dancefloors — jazz, hip-hop, soul, electronic. Substance over sparkle.',
    r: [3, 4, 2], url: 'https://www.nefertiti.se/english/' },
  { name: 'Surrounded', cat: 'club', zone: 'Central',
    blurb: 'Intimate industrial club with a Funktion-One system and alternative electronic bookings. The connoisseur’s pick, not a frat night.',
    r: [3, 3, 2], url: 'https://entrgroup.se/' },
  { name: 'Valand', cat: 'club', zone: 'Avenyn',
    blurb: 'One of the city’s oldest clubs: pop anthems and golden oldies under chandeliers. Come for the dancefloor, absolutely not the food.',
    r: [3, 3, 3], url: 'https://www.goteborg.com/en/places/valand' },
  { name: 'Pustervik', cat: 'club', zone: 'Järntorget',
    blurb: 'Historic ~900-capacity former cinema with big-name gigs and club nights. Check the programme for our dates.',
    r: [3, 3, 2], url: 'https://pustervik.nu/' },
  { name: 'Park Lane', cat: 'club', zone: 'Avenyn (top)',
    blurb: 'The place that “never sleeps” — clubbing alongside cabarets and live shows. A long-running Avenyn institution.',
    r: [4, 3, 3], url: 'https://www.goteborg.com/en/guides/discover-gothenburgs-nightlife' },
  { name: '8ight', cat: 'club', zone: 'Avenyn',
    blurb: 'Small, exclusive and members-only — guest list or booked table, walk-ins bounce. Listed for completeness, not optimism.',
    r: [5, 3, 5], url: 'https://thatsup.co.uk/gothenburg/guide/the-guide-to-gothenburgs-best-nightclubs/' },
  // pre-party
  { name: 'Bongo Kök & Bar', cat: 'pre', zone: 'Långgatorna',
    blurb: 'Cocktails, DJs, happy hours, pizza, quiz nights. Festive and unpretentious — the ideal group launchpad.',
    r: [3, 3, 1], url: 'https://thatsup.co.uk/gothenburg/guide/the-guide-to-gothenburgs-best-cocktail-bars/' },
  { name: 'Barabicu · Zamenhof', cat: 'pre', zone: 'Canal-side, Järntorget',
    blurb: 'Canal-side terraces with the city’s best DJs on weekends — hip hop, funk-soul, disco. Zamenhof adds retro arcade games. Rudi walks on the building side.',
    r: [3, 4, 2], url: 'https://www.goteborg.com/en/guides/outdoor-bars-in-gothenburg' },
  { name: 'Brewers Beer Bar', cat: 'pre', zone: 'Tredje Långgatan',
    blurb: 'Craft beer and sourdough pizza for the beer contingent.',
    r: [3, 2, 1], url: 'https://www.goteborg.com/en/guides/outdoor-bars-in-gothenburg' },
  { name: 'Tacos & Tequila', cat: 'pre', zone: 'Tredje Långgatan',
    blurb: 'Margaritas by the glass or the pitcher in a courtyard. Tacos, obviously. Group fuel.',
    r: [2, 3, 1], url: 'https://www.routesnorth.com/sweden/things-to-do-in-sweden/best-bars-gothenburg/' },
  { name: 'Ölrepubliken', cat: 'pre', zone: 'Brunnsparken',
    blurb: '~30 taps, ~200 bottles, whiskey and pub fare. Friendly local crowd, zero pretense.',
    r: [2, 2, 1], url: 'https://www.goteborg.com/en/guides/discover-gothenburgs-nightlife' },
  { name: 'Ölstugan Tullen · Kings Head · Dansken', cat: 'pre', zone: 'Långgatorna',
    blurb: 'Proper pubs for when you just want pints without a concept. Dansken does a relaxed smørrebrød-and-Tuborg thing.',
    r: [2, 2, 1], url: 'https://www.goteborg.com/en/guides/discover-gothenburgs-nightlife' },
  // cocktails
  { name: 'Stranger', cat: 'cocktail', zone: 'Below Pustervik',
    blurb: 'Widely called the best cocktail bar in the city. Hidden downstairs entrance, soundproofed, multi-page menu — order from the “stiff” section.',
    r: [4, 2, 2], url: 'https://www.goteborg.com/en/guides/discover-gothenburgs-nightlife' },
  { name: 'Puta Madre', cat: 'cocktail', zone: 'Magasinsgatan',
    blurb: 'Theatrical “secret” bar: red drapes, chandeliers, magnificent Bloody Marys and a lively rooftop terrace. The most fun cocktail spot for a group.',
    r: [3, 4, 2], url: 'https://thatsup.co.uk/gothenburg/guide/the-guide-to-gothenburgs-best-cocktail-bars/' },
  { name: 'Bar Bruno', cat: 'cocktail', zone: 'Central',
    blurb: 'Tiny, beloved cocktail den. Look for the neon; hope there’s room for seven.',
    r: [3, 2, 2], url: 'https://thatsup.co.uk/gothenburg/guide/the-guide-to-gothenburgs-best-cocktail-bars/' },
  { name: 'Adamo', cat: 'cocktail', zone: 'Near Avenyn',
    blurb: 'The locals’ answer for genuinely top-tier mixology, a wedge shot from Avenyn. Sit at the bar and watch.',
    r: [4, 2, 2], url: 'https://thatsup.co.uk/gothenburg/guide/the-guide-to-gothenburgs-best-cocktail-bars/' },
  // rooftops
  { name: 'Johanna Rooftop', cat: 'roof', zone: 'Södra Hamngatan',
    blurb: 'New for 2026: 7th floor, unobstructed views, sun all day, no bookings — first come, first served. Opens 11:30 on Friday. Top pick for kickoff.',
    r: [4, 2, 1], url: 'https://johannasteakhouse.se/en/' },
  { name: 'Above', cat: 'roof', zone: 'Central Station',
    blurb: 'The city’s highest rooftop: 14th floor, Miami vibes, wide views over river and harbour.',
    r: [4, 2, 1], url: 'https://www.therooftopguide.com/rooftop-bars-in-gothenburg.html' },
  { name: 'Cielo', cat: 'roof', zone: 'Avenyn',
    blurb: 'Italian flair over Avenyn; once named a global top-5 rooftop. Built for lingering all evening.',
    r: [4, 2, 1], url: 'https://www.therooftopguide.com/rooftop-bars-in-gothenburg.html' },
  { name: 'Bar Himmel', cat: 'roof', zone: 'Götaplatsen',
    blurb: 'Huge terrace above the Art Museum with step-seating — always room for seven. Casual, central, easy.',
    r: [3, 3, 1], url: 'https://www.thisisgothenburg.com/sunny-spots' },
  // off-piste
  { name: 'Ivans Pilsnerbar', cat: 'alt', zone: 'Ringön',
    blurb: 'Pilsner, electronic music and projected light art in an industrial district. A true local favorite and the coolest off-track option.',
    r: [2, 3, 1], url: 'https://www.wendyzhou.se/blog/best-bars-and-bar-areas-in-gothenburg-2025-2026/' },
  { name: 'Oceanen', cat: 'alt', zone: 'Stigbergstorget',
    blurb: 'Unusual gigs, musical happenings, and a rowdy fairy-lit beer terrace.',
    r: [2, 3, 1], url: 'https://www.routesnorth.com/sweden/things-to-do-in-sweden/best-bars-gothenburg/' },
];

const dots = (n) =>
  Array.from({ length: 5 }, (_, i) => `<i class="${i < n ? 'on' : ''}"></i>`).join('');

function venueHTML(v, i) {
  return `
  <article class="nl-card" style="animation-delay:${Math.min(i * 45, 400)}ms">
    <div class="nl-card-top">
      <span class="nl-cat">${CATS[v.cat]}</span>
      <span class="nl-zone">📍 ${v.zone}</span>
    </div>
    <h4><a href="${v.url}" target="_blank" rel="noopener" data-cursor>${v.name} ↗</a></h4>
    <p class="nl-blurb">${v.blurb}</p>
    <div class="nl-ratings">
      <span title="Damage — price hit">💸 ${dots(v.r[0])}</span>
      <span title="Send-it — party energy">🔊 ${dots(v.r[1])}</span>
      <span title="Door roulette — bouncer odds, lower is safer">🎲 ${dots(v.r[2])}</span>
    </div>
  </article>`;
}

export function initNightlife() {
  const grid = document.getElementById('nlGrid');
  const tabs = document.querySelectorAll('.nl-tab');
  if (!grid) return;

  function render(cat) {
    const list = cat === 'all' ? VENUES : VENUES.filter((v) => v.cat === cat);
    grid.innerHTML = list.map(venueHTML).join('');
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.toggle('is-active', t === tab));
      render(tab.dataset.cat);
    });
  });

  render('all');
}
