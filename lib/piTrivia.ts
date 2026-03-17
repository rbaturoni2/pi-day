export interface PiTrivia {
  fact: string;
  category: 'math' | 'history' | 'culture';
}

export const PI_TRIVIA: PiTrivia[] = [
  // Mathematical facts
  { fact: "π is irrational — its decimal expansion never terminates or repeats", category: "math" },
  { fact: "π is also transcendental — it's not the root of any polynomial with rational coefficients", category: "math" },
  { fact: "The first 144 digits of π add up to 666", category: "math" },
  { fact: "There is no 0 in the first 31 digits of π", category: "math" },
  { fact: "At position 762, there are six 9s in a row — known as the Feynman Point", category: "math" },
  { fact: "π to 39 decimal places is enough to calculate the circumference of the observable universe to within the width of a hydrogen atom", category: "math" },
  { fact: "The fraction 355/113 approximates π to six decimal places — remarkably accurate!", category: "math" },
  { fact: "π has been calculated to over 105 trillion digits as of 2024", category: "math" },
  { fact: "Every finite sequence of digits is believed to appear somewhere in π — including your phone number", category: "math" },
  { fact: "π appears in the formula for a normal distribution, the most important curve in statistics", category: "math" },
  { fact: "The digits of π pass all known tests for randomness, even though it's completely deterministic", category: "math" },
  { fact: "If π is a 'normal' number, every sequence of digits appears with equal frequency — though this hasn't been proven", category: "math" },

  // Historical facts
  { fact: "The symbol π was first used by Welsh mathematician William Jones in 1706", category: "history" },
  { fact: "Archimedes approximated π around 250 BC using 96-sided polygons, getting between 3.1408 and 3.1429", category: "history" },
  { fact: "Ancient Egyptians estimated π as 3.1605 — pretty close for 1650 BC!", category: "history" },
  { fact: "Leonhard Euler popularized the π symbol starting in 1737, and it stuck forever", category: "history" },
  { fact: "In 1897, Indiana almost legislated π to be 3.2 — the bill passed the House but failed in the Senate", category: "history" },
  { fact: "Pi Day (March 14) was first celebrated in 1988 at the San Francisco Exploratorium, organized by physicist Larry Shaw", category: "history" },
  { fact: "March 14 is also Albert Einstein's birthday — a cosmic coincidence", category: "history" },
  { fact: "The Babylonians used π ≈ 25/8 = 3.125 as early as 1900 BC", category: "history" },
  { fact: "In 2019, Emma Haruka Iwao at Google calculated π to 31.4 trillion digits — a nod to 3.14", category: "history" },
  { fact: "Chinese mathematician Zu Chongzhi calculated π to 7 decimal places in the 5th century — a record that stood for 900 years", category: "history" },

  // Cultural & fun facts
  { fact: "In the Star Trek episode 'Wolf in the Fold,' Spock defeats an evil entity by commanding a computer to compute π to its last digit", category: "culture" },
  { fact: "There's an entire literary genre called Pilish where word lengths follow the digits of π — 'How I wish I could calculate pi' (3.14159...)", category: "culture" },
  { fact: "The world record for memorizing π is 70,030 digits, held by Suresh Kumar Sharma of India", category: "culture" },
  { fact: "If you search hard enough, your phone number, birthday, and social security number are probably all in π", category: "culture" },
  { fact: "Kate Bush released a song called 'π' in 2005 that includes her singing over 150 digits", category: "culture" },
  { fact: "The probability of your 4-digit birthday NOT appearing in 1 million digits of π is essentially zero — about 0.004%", category: "culture" },
  { fact: "A 'Pi-ku' is a haiku where syllables per line follow 3-1-4 — the first three digits of π", category: "culture" },
  { fact: "The number of seconds in a year is approximately π × 10 million — within 0.5%!", category: "culture" },
];

export function getShuffledTrivia(): PiTrivia[] {
  const shuffled = [...PI_TRIVIA];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
