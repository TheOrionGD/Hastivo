import React, { createContext, useContext, useState, useEffect } from 'react';

export type Theme = 'light' | 'dark';

export type SupportedLanguage = 'en' | 'hi' | 'ta' | 'te' | 'kn' | 'ml' | 'ur';

export interface AccentColor {
  id: string;
  name: string;
  hex: string;
}

export const ACCENT_OPTIONS: AccentColor[] = [
  { id: 'coral', name: 'Coral (Brand)', hex: '#FF6F61' },
  { id: 'blue', name: 'Blue (Brand)', hex: '#6FA3EF' },
  { id: 'yellow', name: 'Yellow (Brand)', hex: '#FFC107' },
  { id: 'teal', name: 'Teal', hex: '#20B2AA' },
  { id: 'amethyst', name: 'Amethyst', hex: '#9B51E0' },
  { id: 'amber', name: 'Amber', hex: '#F2994A' },
  { id: 'emerald', name: 'Emerald', hex: '#27AE60' },
];

export const LANGUAGE_METADATA: Record<SupportedLanguage, { label: string; nativeName: string; dir: 'ltr' | 'rtl' }> = {
  en: { label: 'English', nativeName: 'English', dir: 'ltr' },
  hi: { label: 'Hindi', nativeName: 'हिन्दी', dir: 'ltr' },
  ta: { label: 'Tamil', nativeName: 'தமிழ்', dir: 'ltr' },
  te: { label: 'Telugu', nativeName: 'తెలుగు', dir: 'ltr' },
  kn: { label: 'Kannada', nativeName: 'ಕನ್ನಡ', dir: 'ltr' },
  ml: { label: 'Malayalam', nativeName: 'മലയാളം', dir: 'ltr' },
  ur: { label: 'Urdu', nativeName: 'اردو', dir: 'rtl' },
};

export const TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    brandStatement: 'Vibrant Connections Through Language Colors',
    appName: 'HASTIVO',
    navHome: 'Overview',
    navTextToSign: 'Text to Sign',
    navSignToText: 'Sign to Text',
    navConversation: 'Real-Time',
    navHistory: 'History',
    navDashboard: 'Workspace',
    navProfile: 'Profile',
    navSettings: 'Settings',
    navModeration: 'Moderation',
    signIn: 'Sign In',
    register: 'Create Account',
    logout: 'Sign Out',
    lightTheme: 'Light Theme',
    darkTheme: 'Dark Theme',
    startSession: 'Start Session',
    stopSession: 'Stop Session',
    cameraFeed: 'Camera Workspace',
    avatarViewport: 'Kinematics Viewport',
    readyToTranslate: 'Enter speech or text to generate sign sequence',
    processing: 'Linguistic processing in progress...',
    speed: 'Playback Speed',
    theme: 'Theme',
    language: 'Interface Language',
    accents: 'Accent Preference',
  },
  hi: {
    brandStatement: 'भाषा के रंगों से सशक्त संवाद',
    appName: 'HASTIVO',
    navHome: 'अवलोकन',
    navTextToSign: 'टेक्स्ट से संकेत',
    navSignToText: 'संकेत से टेक्स्ट',
    navConversation: 'लाइव संवाद',
    navHistory: 'इतिहास',
    navDashboard: 'कार्यक्षेत्र',
    navProfile: 'प्रोफ़ाइल',
    navSettings: 'सेटिंग्स',
    navModeration: 'मॉडरेशन',
    signIn: 'साइन इन करें',
    register: 'खाता बनाएं',
    logout: 'साइन आउट',
    lightTheme: 'लाइट थीम',
    darkTheme: 'डार्क थीम',
    startSession: 'सत्र शुरू करें',
    stopSession: 'सत्र समाप्त करें',
    cameraFeed: 'कैमरा कार्यक्षेत्र',
    avatarViewport: '3D अवतार व्यूपोर्ट',
    readyToTranslate: 'संकेत अनुक्रम बनाने के लिए बोलें या लिखें',
    processing: 'भाषा प्रसंस्करण जारी है...',
    speed: 'प्लेबैक गति',
    theme: 'थीम',
    language: 'इंटरफ़ेस भाषा',
    accents: 'पसंदीदा रंग',
  },
  ta: {
    brandStatement: 'மொழி வண்ணங்களின் வழியாக துடிப்பான தொடர்புகள்',
    appName: 'HASTIVO',
    navHome: 'மேலோட்டம்',
    navTextToSign: 'உரை → சைகை',
    navSignToText: 'சைகை → உரை',
    navConversation: 'நேரலை உரையாடல்',
    navHistory: 'வரலாறு',
    navDashboard: 'பணியிடம்',
    navProfile: 'சுயவிவரம்',
    navSettings: 'அமைப்புகள்',
    navModeration: 'மதிப்பாய்வு',
    signIn: 'உள்நுழைக',
    register: 'கணக்கு உருவாக்குக',
    logout: 'வெளியேறு',
    lightTheme: 'வெளிர் தீம்',
    darkTheme: 'இருண்ட தீம்',
    startSession: 'அமர்வைத் தொடங்கு',
    stopSession: 'அமர்வை நிறுத்து',
    cameraFeed: 'கேமரா பணியிடம்',
    avatarViewport: 'சைகை காட்சி சாளரம்',
    readyToTranslate: 'சைகை வரிசையை உருவாக்க உரை அல்லது குரலை உள்ளிடவும்',
    processing: 'மொழி செயலாக்கம் நடைபெறுகிறது...',
    speed: 'வேகம்',
    theme: 'தீம்',
    language: 'மொழி',
    accents: 'வண்ண விருப்பம்',
  },
  te: {
    brandStatement: 'భాషా వర్ణాల ద్వారా ఉత్తేజకరమైన అనుసంధానం',
    appName: 'HASTIVO',
    navHome: 'అవలోకనం',
    navTextToSign: 'టెక్స్ట్ → సంకేతం',
    navSignToText: 'సంకేతం → టెక్స్ట్',
    navConversation: 'ప్రత్యక్ష సంభాషణ',
    navHistory: 'చరిత్ర',
    navDashboard: 'కార్యక్షేత్రం',
    navProfile: 'ప్రొఫైల్',
    navSettings: 'సెట్టింగ్‌లు',
    navModeration: 'సమీక్ష',
    signIn: 'సైన్ ఇన్',
    register: 'ఖాతా సృష్టించండి',
    logout: 'లాగ్ అవుట్',
    lightTheme: 'లైట్ థీమ్',
    darkTheme: 'డార్క్ థీమ్',
    startSession: 'సెషన్ ప్రారంభించు',
    stopSession: 'సెషన్ ఆపు',
    cameraFeed: 'కెమెరా వర్క్‌స్పేస్',
    avatarViewport: 'సంకేత వ్యూపోర్ట్',
    readyToTranslate: 'సైన్ సీక్వెన్స్ కోసం టెక్స్ట్ లేదా వాయిస్ ఇవ్వండి',
    processing: 'ప్రాసెసింగ్ జరుగుతోంది...',
    speed: 'ప్లేబ్యాక్ వేగం',
    theme: 'థీమ్',
    language: 'భాష',
    accents: 'యాస రంగు',
  },
  kn: {
    brandStatement: 'ಭಾಷಾ ಬಣ್ಣಗಳ ಮೂಲಕ ಜೀವಂತ ಸಂಪರ್ಕಗಳು',
    appName: 'HASTIVO',
    navHome: 'ಅವಲೋಕನ',
    navTextToSign: 'ಪಠ್ಯ → ಸಂಕೇತ',
    navSignToText: 'ಸಂಕೇತ → ಪಠ್ಯ',
    navConversation: 'ನೈಜ ಸಮಯ ಸಂಭಾಷಣೆ',
    navHistory: 'ಇತಿಹಾಸ',
    navDashboard: 'ಕಾರ್ಯಸ್ಥಳ',
    navProfile: 'ಪ್ರೊಫೈಲ್',
    navSettings: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
    navModeration: 'ಮಧ್ಯಸ್ಥಿಕೆ',
    signIn: 'ಸೈನ್ ಇನ್',
    register: 'ಖಾತೆ ರಚಿಸಿ',
    logout: 'ಸೈನ್ ಔಟ್',
    lightTheme: 'ಲೈಟ್ ಥೀಮ್',
    darkTheme: 'ಡಾರ್ಕ್ ಥೀಮ್',
    startSession: 'ಅಧಿವೇಶನ ಪ್ರಾರಂಭಿಸಿ',
    stopSession: 'ಅಧಿವೇಶನ ನಿಲ್ಲಿಸಿ',
    cameraFeed: 'ಕ್ಯಾಮೆರಾ ಕಾರ್ಯಸ್ಥಳ',
    avatarViewport: 'ಸಂಕೇತ ವೀಕ್ಷಣೆ',
    readyToTranslate: 'ಸಂಕೇತ ಅನುಕ್ರಮಕ್ಕಾಗಿ ಪಠ್ಯ ಅಥವಾ ಧ್ವನಿ ನಮೂದಿಸಿ',
    processing: 'ಸಂಸ್ಕರಿಸಲಾಗುತ್ತಿದೆ...',
    speed: 'ವೇಗ',
    theme: 'ಥೀಮ್',
    language: 'ಭಾಷೆ',
    accents: 'ಬಣ್ಣದ ಆಯ್ಕೆ',
  },
  ml: {
    brandStatement: 'ഭാഷാ വർണ്ണങ്ങളിലൂടെ ഊർജ്ജസ്വലമായ ബന്ധങ്ങൾ',
    appName: 'HASTIVO',
    navHome: 'അവലോകനം',
    navTextToSign: 'വാചകം → ആംഗ്യം',
    navSignToText: 'ആംഗ്യം → വാചകം',
    navConversation: 'തത്സമയ സംഭാഷണം',
    navHistory: 'ചരിത്രം',
    navDashboard: 'പ്രവർത്തന മേഖല',
    navProfile: 'പ്രൊഫൈൽ',
    navSettings: 'ക്രമീകരണങ്ങൾ',
    navModeration: 'മോഡറേഷൻ',
    signIn: 'പ്രവേശിക്കുക',
    register: 'അക്കൗണ്ട് സൃഷ്ടിക്കുക',
    logout: 'പുറത്തുകടക്കുക',
    lightTheme: 'ലൈറ്റ് തീം',
    darkTheme: 'ഡാർക്ക് തീം',
    startSession: 'സെഷൻ ആരംഭിക്കുക',
    stopSession: 'സെഷൻ നിർത്തുക',
    cameraFeed: 'ക്യാമറ വർക്ക്‌സ്‌പേസ്',
    avatarViewport: 'ആംഗ്യ കാഴ്ച',
    readyToTranslate: 'ആംഗ്യ ക്രമം ഉണ്ടാക്കാൻ ശബ്ദമോ വാചകമോ നൽകുക',
    processing: 'പ്രോസസ്സിംഗ് നടക്കുന്നു...',
    speed: 'വേഗത',
    theme: 'തീം',
    language: 'ഭാഷ',
    accents: 'നിറങ്ങൾ',
  },
  ur: {
    brandStatement: 'زبان کے رنگوں کے ذریعے پرجوش روابط',
    appName: 'HASTIVO',
    navHome: 'جائزہ',
    navTextToSign: 'متن سے اشارہ',
    navSignToText: 'اشارے سے متن',
    navConversation: 'براہ راست گفتگو',
    navHistory: 'تاریخچہ',
    navDashboard: 'ورک اسپیس',
    navProfile: 'پروفائل',
    navSettings: 'ترتیبات',
    navModeration: 'نگرانی',
    signIn: 'سائن ان',
    register: 'اکاؤنٹ بنائیں',
    logout: 'لاگ آؤٹ',
    lightTheme: 'روشن تھیم',
    darkTheme: 'تاریک تھیم',
    startSession: 'سیشن شروع کریں',
    stopSession: 'سیشن ختم کریں',
    cameraFeed: 'کیمرہ ورک اسپیس',
    avatarViewport: 'اشاروں کی ونڈو',
    readyToTranslate: 'اشاروں کی ترتیب کے لیے متن یا آواز درج کریں',
    processing: 'پروسیسنگ جاری ہے...',
    speed: 'رفتار',
    theme: 'تھیم',
    language: 'زبان',
    accents: 'پسندیدہ رنگ',
  },
};

export type TerminologyMode = 'english' | 'sign-gloss';

interface ThemeContextType {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  accent: string;
  setAccent: (accentId: string) => void;
  terminologyMode: TerminologyMode;
  setTerminologyMode: (m: TerminologyMode) => void;
  toggleTerminologyMode: () => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('hastivo_theme');
    return (saved === 'dark' || saved === 'light') ? saved : 'dark';
  });

  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    const saved = localStorage.getItem('hastivo_lang') as SupportedLanguage;
    return saved && LANGUAGE_METADATA[saved] ? saved : 'en';
  });

  const [terminologyMode, setTerminologyModeState] = useState<TerminologyMode>(() => {
    const saved = localStorage.getItem('hastivo_terminology') as TerminologyMode;
    return saved === 'sign-gloss' ? 'sign-gloss' : 'english';
  });

  const [accent, setAccentState] = useState<string>(() => {
    return localStorage.getItem('hastivo_accent') || 'coral';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('hastivo_theme', theme);
  }, [theme]);

  useEffect(() => {
    const meta = LANGUAGE_METADATA[language];
    document.documentElement.setAttribute('lang', language);
    document.documentElement.setAttribute('dir', meta.dir);
    localStorage.setItem('hastivo_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('hastivo_terminology', terminologyMode);
  }, [terminologyMode]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
  };

  const setAccent = (accentId: string) => {
    setAccentState(accentId);
    localStorage.setItem('signa_accent', accentId);
  };

  const toggleTerminologyMode = () => {
    setTerminologyModeState(prev => (prev === 'english' ? 'sign-gloss' : 'english'));
  };

  const setTerminologyMode = (mode: TerminologyMode) => {
    setTerminologyModeState(mode);
  };

  const t = (key: string): string => {
    const dict = TRANSLATIONS[language] || TRANSLATIONS.en;
    return dict[key] || TRANSLATIONS.en[key] || key;
  };

  const isRTL = LANGUAGE_METADATA[language]?.dir === 'rtl';

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        language,
        setLanguage,
        accent,
        setAccent,
        terminologyMode,
        setTerminologyMode,
        toggleTerminologyMode,
        t,
        isRTL,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

