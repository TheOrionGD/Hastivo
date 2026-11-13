// Academic research content. Describes the project's planned design and cites public sources;
// no metrics or results are claimed for the Hastivo system itself.
export const RESEARCH = [
  {
    slug: "architecture",
    path: "/research/architecture",
    accent: "blue",
    title: "Architecture & ER Specs",
    lead: "How the planned system is organised: two translation pipelines, one shared conversation space, and a data model kept deliberately small.",
    sections: [
      {
        heading: "System overview",
        body: [
          "Hastivo is designed as two independent pipelines that meet in a shared conversation view. Sign-to-text runs on the user's device; text/speech-to-sign drives a 3D avatar.",
        ],
        list: [
          ["Capture", "Browser camera stream, processed frame by frame on the device."],
          ["Landmarks", "MediaPipe hand, pose and face landmarks extracted per frame."],
          [
            "Recognition",
            "A PyTorch temporal model (sequence classifier) maps landmark sequences to ISL glosses.",
          ],
          [
            "Language layer",
            "Glosses are reordered from ISL grammar into readable English sentences.",
          ],
          [
            "Synthesis",
            "Text or speech is converted to an ISL gloss sequence and played on the signing avatar.",
          ],
        ],
      },
      {
        heading: "Entity relationships",
        body: ["The core data model, as specified for later phases:"],
        list: [
          ["User", "Account, interface language, theme and avatar preferences. Has many Sessions."],
          ["Session", "One conversation. Belongs to a User; has many Utterances."],
          [
            "Utterance",
            "A single turn: direction (sign→text or text→sign), gloss sequence, rendered text, timestamp.",
          ],
          [
            "Gloss",
            "A vocabulary entry with its sign animation reference. Many-to-many with Utterance.",
          ],
          ["Preference", "Avatar speed, size and caption settings. One-to-one with User."],
        ],
      },
      {
        heading: "Status",
        body: [
          "This is the design specification. The pipelines and storage are not yet implemented in this build.",
        ],
      },
    ],
    note: "Specification document — subject to change as the capstone progresses.",
  },
  {
    slug: "corpus",
    path: "/research/corpus",
    accent: "coral",
    title: "Corpus: INCLUDE-50 & ISL-CSLTR",
    lead: "Two public Indian Sign Language datasets anchor training and evaluation — one for isolated words, one for continuous sentences.",
    sections: [
      {
        heading: "INCLUDE",
        body: [
          "INCLUDE is an isolated Indian Sign Language word dataset released by AI4Bharat (Sridhar et al., ACM Multimedia 2020). INCLUDE-50 is its smaller 50-word subset, commonly used for quick experimentation.",
          "It is used here for word-level (isolated sign) recognition.",
        ],
      },
      {
        heading: "ISL-CSLTR",
        body: [
          "ISL-CSLTR is a corpus of Indian Sign Language for continuous sign language translation and recognition (Elakkiya R. & Natarajan B., 2021), containing sentence-level videos with English text.",
          "It is used here for sentence-level recognition and for studying ISL word order.",
        ],
      },
      {
        heading: "How they are used",
        list: [
          [
            "Isolated recognition",
            "Train and validate the temporal model on INCLUDE-50 word clips.",
          ],
          ["Continuous recognition", "Extend to sentences with ISL-CSLTR."],
          [
            "Preprocessing",
            "Convert videos to landmark sequences; raw video is not needed at inference.",
          ],
          [
            "Licensing",
            "Each dataset is used under its own published terms; consult the original sources.",
          ],
        ],
      },
    ],
    note: "Dataset descriptions summarise the original publications. Refer to them for exact sizes and licences.",
  },
  {
    slug: "grammar",
    path: "/research/grammar",
    accent: "yellow",
    title: "Grammar: SOV Topic-Comment",
    lead: "Indian Sign Language is not signed English. Its word order and structure shape how Hastivo translates in both directions.",
    sections: [
      {
        heading: "Subject–Object–Verb",
        body: [
          "ISL generally places the verb at the end of a clause. Where English says “I am going to school”, ISL typically signs closer to I SCHOOL GO.",
        ],
      },
      {
        heading: "Topic–comment",
        body: [
          "ISL frequently introduces a topic first and then comments on it. Question words such as WHAT or WHERE usually appear at the end of the sentence.",
        ],
        list: [
          ["English", "What is your name?"],
          ["ISL gloss", "YOUR NAME WHAT"],
        ],
      },
      {
        heading: "Non-manual markers",
        body: [
          "Facial expression, head movement and eyebrow position carry grammar — for example, marking a question. This is why the avatar must animate the face, not only the hands.",
        ],
      },
      {
        heading: "Implications for translation",
        list: [
          [
            "Text → Sign",
            "English is reordered into ISL gloss order, function words like “is” and “the” are dropped.",
          ],
          [
            "Sign → Text",
            "Recognised glosses are reordered and expanded into grammatical English.",
          ],
        ],
      },
    ],
    note: "Examples are simplified illustrations of common patterns; ISL usage varies by region and signer.",
  },
  {
    slug: "accessibility",
    path: "/research/accessibility",
    accent: "blue",
    title: "Accessibility & Privacy",
    lead: "Built with the Deaf community in mind, and designed so a camera never becomes a liability.",
    sections: [
      {
        heading: "Zero-cloud camera privacy",
        body: [
          "The planned sign-recognition pipeline processes camera frames on the user's device. Video is not uploaded; only the resulting text is shown in the conversation.",
        ],
      },
      {
        heading: "Accessibility commitments",
        list: [
          ["Standard", "Target WCAG 2.2 AA across every screen."],
          ["Keyboard", "All controls reachable and operable without a mouse, with visible focus."],
          ["Readability", "Large default type, high contrast, light and dark themes."],
          ["Motion", "Animations respect the system's reduced-motion setting."],
          ["Language", "Multiple interface languages planned."],
        ],
      },
      {
        heading: "Honesty about limits",
        body: [
          "Automated sign translation is an aid, not a replacement for qualified interpreters — especially in medical, legal or emergency settings.",
        ],
      },
    ],
    note: "Privacy behaviour described here applies to the planned recognition feature, which is not yet active.",
  },
];
