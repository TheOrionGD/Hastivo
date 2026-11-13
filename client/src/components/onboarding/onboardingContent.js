export const ONBOARDING_SEEN = "hastivo-onboarding-seen";

export const onboardingChapters = [
  {
    chapter: "A shared language",
    title: ["Every voice.", "Every hand.", "One connection."],
    body: "A conversation belongs to everyone. Meet Hastivo — a new space for spoken and signed language to come together.",
    note: "01 / CONNECTION",
    accent: "coral",
    motif: "connection",
  },
  {
    chapter: "Words into movement",
    title: ["Say it.", "See it."],
    body: "From a written thought to a spoken sentence, we’re exploring how language can become expressive movement.",
    note: "02 / TEXT & SPEECH TO SIGN",
    accent: "blue",
    motif: "words",
  },
  {
    chapter: "Movement into meaning",
    title: ["Your hands.", "Your voice."],
    body: "Signing carries a world of meaning. Hastivo is being developed to bring that meaning into readable words.",
    note: "03 / SIGN TO TEXT",
    accent: "yellow",
    motif: "meaning",
  },
  {
    chapter: "In the same conversation",
    title: ["Two languages.", "One moment."],
    body: "Speak. Sign. Respond. Our vision is a shared conversation that makes room for both sides, without leaving anyone behind.",
    note: "04 / REAL-TIME CONNECTION",
    accent: "coral",
    motif: "conversation",
  },
  {
    chapter: "Meet your digital companion",
    title: ["More than", "a pair of hands."],
    body: "Hands, face and body all carry language. Meet the avatar at the heart of Hastivo’s expressive communication vision.",
    note: "05 / EXPRESSION",
    accent: "blue",
    motif: "expression",
  },
  {
    chapter: "Designed around you",
    title: ["Different needs.", "Equal belonging."],
    body: "A readable interface. A choice of light or dark. Respect for your pace. Accessibility begins with making space for you.",
    note: "06 / ACCESSIBILITY",
    accent: "yellow",
    motif: "accessibility",
  },
  {
    chapter: "The beginning of something shared",
    title: ["Let’s make", "every conversation", "count."],
    body: "Hastivo is taking shape, one thoughtful step at a time. Come discover the vision and the people it’s being built for.",
    note: "07 / WELCOME TO HASTIVO",
    accent: "coral",
    motif: "welcome",
  },
  {
    chapter: "Your language, your voice",
    title: ["Choose your", "primary language."],
    body: "Hastivo speaks your language. Select your native language for AI interactions, translations, and regional sign vocabularies.",
    note: "08 / MULTILINGUAL SELECTION",
    accent: "blue",
    motif: "language_selection",
  },
];

export function nextChapter(index) {
  return index < onboardingChapters.length - 1 ? index + 1 : null;
}
