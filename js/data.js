// Single source of truth for tournament facts. Do not change facts here
// without changing them in real life first.

export const ROUNDS = [
  { n: 1, day: 'Friday',   date: 'July 10', time: '16:00', label: 'Opening Tee-Off', iso: '2026-07-10T16:00:00+02:00' },
  { n: 2, day: 'Saturday', date: 'July 11', time: '13:00', label: 'Moving Day',      iso: '2026-07-11T13:00:00+02:00' },
  { n: 3, day: 'Sunday',   date: 'July 12', time: '11:03', label: 'The Final Round', iso: '2026-07-12T11:03:00+02:00' },
];

export const PLAYERS = [
  {
    name: 'Jørgen Bugge',
    photo: 'assets/players/jorgen.jpg',
    nickname: 'Bæ-Bu',
    hcp: 9,
    badge: '🏆 Defending Champ*',
    bio: 'Ambulance driver by day; golfer, cyclist and runner by night. The only single-digit handicap in the field — and if your round collapses on the back nine, he can legally declare it dead.',
    weakness: 'Standing still.',
    avatar: '🚑',
    stats: [['Cardio', 99], ['Drive', 88], ['Mercy', 12]],
  },
  {
    name: 'Konrad Blix',
    photo: 'assets/players/konrad.jpg',
    nickname: 'John Fette Daly',
    hcp: 12,
    badge: '🎯 Most Consistent',
    bio: 'Never the flashiest round, always in the mix. The dark horse everyone forgets about until Sunday. Walks to the first tee to his official anthem:',
    weakness: 'Getting cocky on the front nine.',
    avatar: '🏌️',
    stats: [['Consistency', 92], ['Flash', 15], ['Sunday surge', 81]],
    link: { label: '🎵 Official walk-up song', url: 'https://open.spotify.com/track/007P9SVzUuGyyl8Z8ArMCe' },
  },
  {
    name: 'Adrian Kristiansen',
    photo: 'assets/players/adrian.jpg',
    nickname: 'Andreas',
    hcp: 13.4,
    badge: '🥷 Sneaky Good',
    bio: 'Says he “hasn’t played much this year.” Shoots 82 anyway. In an official statement, Frantza adds: “this guy is thirsty as fuck.”',
    weakness: 'False modesty.',
    avatar: '🥷',
    stats: [['Claimed rust', 95], ['Actual rust', 8], ['Sandbagging', 97]],
  },
  {
    name: 'Karl-Henrik Stenkjær',
    nickname: 'The Keeper',
    hcp: 14.7,
    badge: '🎲 The Wildcard',
    bio: 'Former professional handball keeper, current wildcard — capable of a 75 and a 95 in the same weekend. Also a genuinely good guy. Ladies: this is the one you keep.',
    weakness: 'The first tee shot with everyone watching.',
    avatar: '🧤',
    stats: [['Ceiling', 94], ['Floor', 9], ['Saves', 88]],
  },
  {
    name: 'Christoffer Frantzen',
    nickname: 'Frantza',
    hcp: 25.3,
    badge: '📈 Most Improved (Allegedly)',
    bio: 'One golf lesson in 2019, still dining out on it. His real contribution is the birdie drams — make a birdie, Frantza pours. Statistically the safest bar in Scandinavia.',
    weakness: 'Bunkers, rough, and fairways.',
    avatar: '🥃',
    stats: [['Lessons taken', 1], ['Talking about it', 99], ['Drams at risk', 7]],
  },
  {
    name: 'Rudi Fozzen Holdal',
    photo: 'assets/players/rudi.jpg',
    nickname: 'Rude Mcilroy',
    hcp: 31.5,
    badge: '🌊 Aqua Man',
    bio: 'Exactly like Rory McIlroy, minus 27 handicap strokes and plus a magnetic attraction to water. The swing is identical for the first ten centimetres.',
    weakness: 'Literally any body of water.',
    avatar: '🌊',
    stats: [['Power', 90], ['Aim', 20], ['Ball retention', 5]],
  },
  {
    name: 'Jacob Fæste Jentoft',
    photo: 'assets/players/jacob.jpg',
    nickname: 'Daddy',
    hcp: 36.7,
    badge: '💻 Commissioner & Website Guy',
    bio: 'The field’s worst golfer by a margin visible from space. Built this entire website so that at least one thing this weekend goes according to plan.',
    weakness: 'Golf, in general.',
    avatar: '💻',
    stats: [['Golf', 8], ['HTML', 96], ['Excuses', 91]],
  },
];

export const CONFETTI_COLORS = ['#d9a441', '#2f86c9', '#f4ede0', '#e8bd6a'];

export const fmtHcp = (n) =>
  n.toLocaleString('sv-SE', { minimumFractionDigits: Number.isInteger(n) ? 0 : 1, maximumFractionDigits: 1 });
