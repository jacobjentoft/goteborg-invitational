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
    nickname: 'The Machine',
    hcp: 9,
    badge: '🏆 Defending Champ*',
    bio: 'The only single-digit handicap in the field. Plays like he’s got a sponsorship deal on the line.',
    weakness: 'Everyone else’s terrible energy dragging him down.',
    avatar: '⛳',
    stats: [['Drive', 88], ['Irons', 85], ['Mercy', 12]],
  },
  {
    name: 'Konrad Blix',
    nickname: 'Mr. Steady',
    hcp: 12,
    badge: '🎯 Most Consistent',
    bio: 'Never the flashiest round, always in the mix. The dark horse everyone forgets about until Sunday.',
    weakness: 'Getting cocky on the front nine.',
    avatar: '🏌️',
    stats: [['Consistency', 92], ['Flash', 15], ['Sunday surge', 81]],
  },
  {
    name: 'Adrian Kristiansen',
    nickname: 'The Ninja',
    hcp: 13.4,
    badge: '🥷 Sneaky Good',
    bio: 'Says he “hasn’t played much this year.” Shoots 82 anyway.',
    weakness: 'False modesty.',
    avatar: '🥷',
    stats: [['Claimed rust', 95], ['Actual rust', 8], ['Sandbagging', 97]],
  },
  {
    name: 'Karl-Henrik Stenkjær',
    nickname: 'KH',
    hcp: 14.7,
    badge: '🎲 The Wildcard',
    bio: 'Capable of a 75 and a 95 in the same weekend. Nobody, including him, knows which one shows up.',
    weakness: 'The first tee shot with everyone watching.',
    avatar: '🎲',
    stats: [['Ceiling', 94], ['Floor', 9], ['Predictability', 4]],
  },
  {
    name: 'Christoffer Frantzen',
    nickname: 'Chris',
    hcp: 25.3,
    badge: '📈 Most Improved (Allegedly)',
    bio: 'Took a lesson once in 2019 and has been dining out on it ever since.',
    weakness: 'Bunkers, rough, and fairways.',
    avatar: '📈',
    stats: [['Lessons taken', 1], ['Talking about it', 99], ['Bunker escape', 14]],
  },
  {
    name: 'Rudi Fozzen Holdal',
    nickname: 'Splash',
    hcp: 31.5,
    badge: '🌊 Aqua Man',
    bio: 'Single-handedly keeps the course’s ball-diving business profitable.',
    weakness: 'Literally any body of water.',
    avatar: '🌊',
    stats: [['Power', 90], ['Aim', 20], ['Ball retention', 5]],
  },
  {
    name: 'Jacob Fæste Jentoft',
    nickname: 'The Webmaster',
    hcp: 36.7,
    badge: '💻 Commissioner & Website Guy',
    bio: 'Built this entire website himself, presumably to distract everyone from his handicap.',
    weakness: 'Golf, in general.',
    avatar: '💻',
    stats: [['Golf', 8], ['HTML', 96], ['Excuses', 91]],
  },
];

export const CONFETTI_COLORS = ['#d9a441', '#2f86c9', '#f4ede0', '#e8bd6a'];

export const fmtHcp = (n) =>
  n.toLocaleString('sv-SE', { minimumFractionDigits: Number.isInteger(n) ? 0 : 1, maximumFractionDigits: 1 });
