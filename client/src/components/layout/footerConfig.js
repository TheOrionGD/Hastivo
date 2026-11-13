// Central footer content. Set `to` to a real route path once that screen exists;
// items with `to: null` render as non-interactive "coming soon" labels.
export const footerConfig = {
  brand: { name: "Hastivo", suffix: "" },
  description:
    "Final-Year Computer Science and Engineering Capstone Project. Advanced bi-directional Indian Sign Language translation bridging communication between the Deaf community and the hearing world through real-time computer vision and 3D signing avatars.",
  highlights: [
    { icon: "cpu", text: "MediaPipe + PyTorch Temporal Model", tone: "blue" },
    { icon: "shield", text: "Zero-Cloud Camera Privacy", tone: "coral" },
  ],
  columns: [
    {
      heading: "Platform Modules",
      links: [
        { label: "Sign-to-Text Studio", to: null },
        { label: "Speech/Text-to-Sign", to: null },
        { label: "Dual Conversation Mode", to: null },
        { label: "ISL Vocabulary Explorer", to: null },
        { label: "Translation History", to: null },
      ],
    },
    {
      heading: "Academic Research",
      links: [
        { label: "Architecture & ER Specs", to: "/research/architecture", sparkle: true },
        { label: "Corpus: INCLUDE-50 & ISL-CSLTR", to: "/research/corpus" },
        { label: "Grammar: SOV Topic-Comment", to: "/research/grammar" },
        { label: "Accessibility & Privacy", to: "/research/accessibility" },
      ],
    },
    {
      heading: "Legal & Security",
      links: [
        { label: "Accessibility Hub", to: "/accessibility" },
        { label: "Privacy Policy", to: "/privacy" },
        { label: "Terms & Conditions", to: "/terms" },
        { label: "Verify Account", to: "/verify-account" },
        { label: "Forgot Password", to: "/forgot-password" },
      ],
    },
  ],
  // Set to "MIT License" once the project actually ships a LICENSE file.
  license: null,
  attribution: "Engineered with empathy for Deaf Accessibility",
};
