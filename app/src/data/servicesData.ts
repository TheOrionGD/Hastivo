export interface Service {
  id: string;
  number: string;
  title: string;
  shortDesc: string;
  content: string[];
  capabilities: string[];
}

export const servicesData: Service[] = [
  {
    id: "brand-identity",
    number: "01",
    title: "Brand Identity & Strategy",
    shortDesc: "Your brand story is your unique identity that sets you apart from your competitors.",
    content: [
      "Your brand story is your unique identity that sets you apart from your competitors. It's what people think of when they hear your name, and it's what makes them choose you over someone else.",
      "We help you to create a strong and cohesive brand identity that will resonate with your target audience. We work with you to develop your brand strategy, messaging, and visual identity. We also create interactive online brand guidelines that document your brand identity and how it should be used."
    ],
    capabilities: [
      "Brand Strategy & Positioning",
      "Tone of Voice & Messaging Frameworks",
      "Visual Identity & Logo Design",
      "Online Interactive Brand Guidelines",
      "Stationery & Collateral Design",
      "Typography & Color Systems"
    ]
  },
  {
    id: "information-design",
    number: "02",
    title: "Information Design",
    shortDesc: "We help scientists, researchers, and businesses make complex information accessible and understandable to everyone.",
    content: [
      "We help scientists, researchers, and businesses make complex information accessible and understandable to everyone.",
      "We create infographics, presentations, and videos and animations to communicate complex ideas in a clear and engaging way."
    ],
    capabilities: [
      "Scientific Data Visualization",
      "Complex System Infographics",
      "Technical Illustration",
      "Executive & Board Presentations",
      "Interactive Calculators & Decision Tools",
      "Annual Reports & Whitepapers"
    ]
  },
  {
    id: "storytelling",
    number: "03",
    title: "Storytelling & Immersive Experiences",
    shortDesc: "Stories are a powerful way to connect with people and communicate your ideas.",
    content: [
      "Stories are a powerful way to connect with people and communicate your ideas. We help you to create stories that will engage your audience and leave a lasting impression.",
      "We can help you to develop your brand or project storytelling experiences for a variety of platforms, including websites, social media, and immersive technologies such as AR and VR."
    ],
    capabilities: [
      "Narrative & Script Development",
      "Interactive Web Documentaries",
      "Spatial & Immersive UI/UX",
      "Social Media Campaign Architecture",
      "Augmented & Virtual Reality Experiences",
      "Multisensory Digital Exhibits"
    ]
  },
  {
    id: "film-production",
    number: "04",
    title: "Film Production",
    shortDesc: "State-of-the-art equipment and expertise for shooting films and documentaries.",
    content: [
      "We are equipped to provide state-of-the-art equipment and expertise for shooting films and documentaries, including audio and video editing capabilities.",
      "Our approach emphasizes capturing authentic stories through on-site visits and interviews footage. During post-production, we are committed to crafting a cohesive narrative that aligns with our client's messaging and values."
    ],
    capabilities: [
      "On-Location Field Expeditions",
      "Documentary Short Production",
      "Expert & In-Depth Interviews",
      "Cinematic Drone & Aerial Cinematography",
      "Sound Design & Professional Audio Mastering",
      "Post-Production & Color Grading"
    ]
  },
  {
    id: "illustration-animation",
    number: "05",
    title: "Illustration & Animation",
    shortDesc: "Custom visual assets that communicate complex information in a clear and engaging way.",
    content: [
      "Illustrations and animations are a great way to communicate complex information in a clear and visually appealing way. They can also be used to create engaging stories and experiences.",
      "We create custom illustrations and animations for a variety of purposes, including infographics, data visualization, motion graphics, and video explainer videos."
    ],
    capabilities: [
      "Bespoke Vector & Editorial Illustration",
      "2D Motion Graphics & Micro-interactions",
      "Explainer Video Storyboarding & Animation",
      "Data-Driven Motion Assets",
      "Scientific & Benthic Diagrams",
      "Brand Mascot & Iconography Suites"
    ]
  },
  {
    id: "web-design",
    number: "06",
    title: "Web Design & Development",
    shortDesc: "Designing and developing websites that tell your unique story and engage your audiences.",
    content: [
      "We design and develop websites that tell your unique story and engages your audiences.",
      "We work with you to create a website that will help you to achieve your business goals and attract more visitors."
    ],
    capabilities: [
      "Custom Editorial Web Experiences",
      "Modern Front-End Development",
      "Headless CMS Integration",
      "Interactive WebGL & Canvas Experiences",
      "Accessible & Responsive Architecture",
      "Performance Optimization & SEO"
    ]
  }
];
