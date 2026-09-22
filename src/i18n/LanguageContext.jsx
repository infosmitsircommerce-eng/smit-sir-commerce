import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

const STORAGE_KEY = "ssc-language-v1";
const DEFAULT_LANGUAGE = "en";

const LanguageContext = createContext({
  language: DEFAULT_LANGUAGE,
  setLanguage: () => {},
  toggleLanguage: () => {},
  isGujarati: false,
});

const GUJARATI_EXACT = {
  "Home": "હોમ",
  "Notes": "નોટ્સ",
  "Practice": "પ્રેક્ટિસ",
  "Premium": "પ્રીમિયમ",
  "More": "વધુ",
  "Board Boosters": "બોર્ડ બૂસ્ટર્સ",
  "Study Tools": "સ્ટડી ટૂલ્સ",
  "Free Diagnostic": "મફત ડાયગ્નોસ્ટિક",
  "Contact": "સંપર્ક",
  "Profile": "પ્રોફાઇલ",
  "Login": "લૉગિન",
  "Logout": "લૉગઆઉટ",
  "Student Login": "સ્ટુડન્ટ લૉગિન",
  "Owner Panel": "ઓનર પેનલ",
  "Admin Studio": "એડમિન સ્ટુડિયો",
  "My Dashboard": "મારું ડેશબોર્ડ",
  "Learning Insights": "લર્નિંગ ઇનસાઇટ્સ",
  "My Study Data": "મારો સ્ટડી ડેટા",
  "My Study Data & Backup": "મારો સ્ટડી ડેટા અને બેકઅપ",
  "Study": "અભ્યાસ",
  "Useful": "ઉપયોગી",
  "Notes & PDFs": "નોટ્સ અને PDFs",
  "Premium Library": "પ્રીમિયમ લાઇબ્રેરી",
  "Contact Smit Sir": "સ્મિત સરનો સંપર્ક",
  "Open Student Library": "સ્ટુડન્ટ લાઇબ્રેરી ખોલો",
  "Notes, practice and revision in one place.": "નોટ્સ, પ્રેક્ટિસ અને રિવિઝન — બધું એક જ જગ્યાએ.",
  "Good morning": "સુપ્રભાત",
  "Good afternoon": "શુભ બપોર",
  "Good evening": "શુભ સાંજ",
  "Commerce Learner!": "કોમર્સ શીખનાર!",
  "Small steps make big careers.": "નાના પગલાં મોટી કારકિર્દી બનાવે છે.",
  "Search study notes and chapters": "સ્ટડી નોટ્સ અને અધ્યાયો શોધો",
  "Search a chapter or topic…": "અધ્યાય અથવા વિષય શોધો…",
  "Search chapters": "અધ્યાયો શોધો",
  "Your personal study desk": "તમારું પોતાનું સ્ટડી ડેસ્ક",
  "Master Commerce": "કોમર્સમાં માસ્ટરી મેળવો",
  "Your Way.": "તમારી રીતે.",
  "Notes · Practice · Revision": "નોટ્સ · પ્રેક્ટિસ · રિવિઝન",
  "All in one place": "બધું એક જ જગ્યાએ",
  "Start learning": "અભ્યાસ શરૂ કરો",
  "Start here": "અહીંથી શરૂ કરો",
  "Find a chapter": "અધ્યાય શોધો",
  "Quick actions": "ઝડપી વિકલ્પો",
  "Study Notes": "સ્ટડી નોટ્સ",
  "Premium study vault": "પ્રીમિયમ સ્ટડી વોલ્ટ",
  "Explore": "જુઓ",
  "Continue Learning": "અભ્યાસ ચાલુ રાખો",
  "A good place to start": "શરૂ કરવા માટે સારી જગ્યા",
  "View all": "બધું જુઓ",
  "FREE · KNOW YOUR STARTING POINT": "મફત · તમારું શરૂઆતનું સ્તર જાણો",
  "Find your strengths in 5 minutes": "5 મિનિટમાં તમારી મજબૂતીઓ શોધો",
  "Completed · review anytime": "પૂર્ણ · ક્યારે પણ રિવ્યૂ કરો",
  "Pick up where you left off": "જ્યાં છોડ્યું હતું ત્યાંથી ચાલુ કરો",
  "Try the board exam diagnostic": "બોર્ડ પરીક્ષા ડાયગ્નોસ્ટિક અજમાવો",
  "Browse by Class": "ધોરણ પ્રમાણે જુઓ",
  "Class 11": "ધોરણ 11",
  "Class 12": "ધોરણ 12",
  "Commerce": "કોમર્સ",
  "Not sure where to start?": "ક્યાંથી શરૂ કરવું તે સમજાતું નથી?",
  "Take the free diagnostic": "મફત ડાયગ્નોસ્ટિક લો",
  "Learn • Practice • Grow": "શીખો • પ્રેક્ટિસ કરો • આગળ વધો",
  "Find notes and tests": "નોટ્સ અને ટેસ્ટ શોધો",
  "Open free study material": "મફત સ્ટડી મટીરિયલ ખોલો",
  "Open learning insights": "લર્નિંગ ઇનસાઇટ્સ ખોલો",
  "Open profile": "પ્રોફાઇલ ખોલો",
  "Log in": "લૉગિન કરો",
  "Open menu": "મેનુ ખોલો",
  "Close menu": "મેનુ બંધ કરો",
  "Close navigation": "નેવિગેશન બંધ કરો",
  "Primary mobile navigation": "મુખ્ય મોબાઇલ નેવિગેશન",
  "Mobile navigation": "મોબાઇલ નેવિગેશન",
  "Skip to main content": "મુખ્ય સામગ્રી પર જાઓ",
  "Search": "શોધો",
  "Download": "ડાઉનલોડ",
  "Preview": "પ્રિવ્યુ",
  "Free": "મફત",
  "Back": "પાછળ",
  "Next": "આગળ",
  "Previous": "પાછલું",
  "Submit": "સબમિટ કરો",
  "Continue": "ચાલુ રાખો",
  "Start": "શરૂ કરો",
  "Try now": "હમણાં અજમાવો",
  "Learn more": "વધુ જાણો",
  "Show more": "વધુ બતાવો",
  "Show less": "ઓછું બતાવો",
  "Chapter": "અધ્યાય",
  "Chapters": "અધ્યાયો",
  "Question": "પ્રશ્ન",
  "Questions": "પ્રશ્નો",
  "Answer": "જવાબ",
  "Answers": "જવાબો",
  "Correct": "સાચું",
  "Incorrect": "ખોટું",
  "Score": "સ્કોર",
  "Result": "પરિણામ",
  "Results": "પરિણામો",
  "Test Series": "ટેસ્ટ સિરીઝ",
  "Quizzes": "ક્વિઝ",
  "Quiz": "ક્વિઝ",
  "Revision": "રિવિઝન",
  "Study Material": "સ્ટડી મટીરિયલ",
  "Free Study Material": "મફત સ્ટડી મટીરિયલ",
  "About": "વિશે",
  "FAQ": "FAQ",
  "Privacy Policy": "પ્રાઇવસી પોલિસી",
  "Terms of Use": "ઉપયોગની શરતો",
  "Disclaimer": "ડિસ્ક્લેમર",
  "Explore": "જુઓ",
  "Legal & Help": "કાનૂની અને મદદ",
  "Contact & Local Area": "સંપર્ક અને સ્થાનિક વિસ્તાર",
  "Email support": "ઈમેલ સપોર્ટ",
  "All rights reserved.": "બધા હકો સુરક્ષિત.",
  "Teacher Guides": "ટીચર ગાઇડ્સ",
  "Free Commerce Study Pack": "મફત કોમર્સ સ્ટડી પેક",
  "Free Paper Analysis / Demo": "મફત પેપર એનાલિસિસ / ડેમો",
  "Free Commerce calculators": "મફત કોમર્સ કેલ્ક્યુલેટર્સ",
  "Commerce tuition in Mehsana": "મહેસાણામાં કોમર્સ ટ્યુશન",
  "Mehsana Student Resources": "મહેસાણા સ્ટુડન્ટ રિસોર્સિસ",
};

const GUJARATI_REPLACEMENTS = [
  ["Master PDFs · Hard practice · Board-focused resources", "માસ્ટર PDFs · હાર્ડ પ્રેક્ટિસ · બોર્ડ-ફોકસ્ડ રિસોર્સિસ"],
  ["Class 11 & 12 Commerce", "ધોરણ 11 અને 12 કોમર્સ"],
  ["Class 11 and 12 Commerce", "ધોરણ 11 અને 12 કોમર્સ"],
  ["Study Material", "સ્ટડી મટીરિયલ"],
  ["Free Study Material", "મફત સ્ટડી મટીરિયલ"],
  ["Board Exam", "બોર્ડ પરીક્ષા"],
  ["Board exam", "બોર્ડ પરીક્ષા"],
  ["Practice Tests", "પ્રેક્ટિસ ટેસ્ટ"],
  ["Practice Test", "પ્રેક્ટિસ ટેસ્ટ"],
  ["Question Bank", "પ્રશ્ન બેંક"],
  ["Chapter-wise", "અધ્યાયવાર"],
  ["chapter-wise", "અધ્યાયવાર"],
  ["Free Notes", "મફત નોટ્સ"],
  ["Premium Notes", "પ્રીમિયમ નોટ્સ"],
  ["Study Notes", "સ્ટડી નોટ્સ"],
  ["View all", "બધું જુઓ"],
  ["Learn more", "વધુ જાણો"],
  ["Get started", "શરૂ કરો"],
  ["Start now", "હમણાં શરૂ કરો"],
  ["Start learning", "અભ્યાસ શરૂ કરો"],
  ["Try for free", "મફતમાં અજમાવો"],
  ["Download PDF", "PDF ડાઉનલોડ કરો"],
  ["Download notes", "નોટ્સ ડાઉનલોડ કરો"],
  ["Open notes", "નોટ્સ ખોલો"],
  ["Open quiz", "ક્વિઝ ખોલો"],
  ["Start quiz", "ક્વિઝ શરૂ કરો"],
  ["Start test", "ટેસ્ટ શરૂ કરો"],
  ["Search notes", "નોટ્સ શોધો"],
  ["Search chapters", "અધ્યાયો શોધો"],
  ["Search topics", "વિષયો શોધો"],
  ["Your progress", "તમારી પ્રગતિ"],
  ["Your score", "તમારો સ્કોર"],
  ["Correct answer", "સાચો જવાબ"],
  ["Wrong answer", "ખોટો જવાબ"],
  ["Next question", "આગળનો પ્રશ્ન"],
  ["Previous question", "પાછલો પ્રશ્ન"],
  ["Back to", "પાછા જાઓ"],
  ["Class 11", "ધોરણ 11"],
  ["Class 12", "ધોરણ 12"],
  ["Student", "સ્ટુડન્ટ"],
  ["Students", "સ્ટુડન્ટ્સ"],
  ["Teacher", "ટીચર"],
  ["Chapter", "અધ્યાય"],
  ["Chapters", "અધ્યાયો"],
  ["Questions", "પ્રશ્નો"],
  ["Question", "પ્રશ્ન"],
  ["Answers", "જવાબો"],
  ["Answer", "જવાબ"],
  ["Practice", "પ્રેક્ટિસ"],
  ["Revision", "રિવિઝન"],
  ["Premium", "પ્રીમિયમ"],
  ["Free", "મફત"],
  ["Notes", "નોટ્સ"],
  ["Results", "પરિણામો"],
  ["Result", "પરિણામ"],
  ["Search", "શોધો"],
  ["Download", "ડાઉનલોડ"],
  ["Preview", "પ્રિવ્યુ"],
  ["Continue", "ચાલુ રાખો"],
  ["Start", "શરૂ કરો"],
  ["Contact", "સંપર્ક"],
];

const SKIP_TAGS = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "CODE", "PRE", "TEXTAREA"]);

function hasEnglishLetters(value) {
  return /[A-Za-z]/.test(value || "");
}

function translateEnglishToGujarati(value) {
  if (!value || !hasEnglishLetters(value)) return value;

  const leading = value.match(/^\s*/)?.[0] || "";
  const trailing = value.match(/\s*$/)?.[0] || "";
  const core = value.slice(leading.length, value.length - trailing.length);

  if (!core) return value;
  if (GUJARATI_EXACT[core]) return `${leading}${GUJARATI_EXACT[core]}${trailing}`;

  let translated = core;
  for (const [english, gujarati] of GUJARATI_REPLACEMENTS) {
    if (translated.includes(english)) translated = translated.split(english).join(gujarati);
  }
  return `${leading}${translated}${trailing}`;
}

function shouldSkipTextNode(node) {
  const parent = node.parentElement;
  if (!parent) return true;
  if (SKIP_TAGS.has(parent.tagName)) return true;
  if (parent.closest('[data-no-translate="true"], [translate="no"]')) return true;
  return false;
}

export function LanguageProvider({ children }) {
  const originalTextRef = useRef(new WeakMap());
  const originalAttributesRef = useRef(new WeakMap());
  const [language, setLanguageState] = useState(() => {
    if (typeof window === "undefined") return DEFAULT_LANGUAGE;
    return window.localStorage?.getItem(STORAGE_KEY) === "gu" ? "gu" : DEFAULT_LANGUAGE;
  });

  useEffect(() => {
    if (typeof document === "undefined") return undefined;

    document.documentElement.lang = language === "gu" ? "gu-IN" : "en-IN";
    document.documentElement.dataset.siteLanguage = language;
    window.localStorage?.setItem(STORAGE_KEY, language);

    const originalText = originalTextRef.current;
    const originalAttributes = originalAttributesRef.current;
    const internalTextMutations = new WeakSet();
    const internalAttributeMutations = new WeakMap();

    const translateTextNode = (node, refreshOriginal = false) => {
      if (!node || shouldSkipTextNode(node)) return;
      const current = node.nodeValue || "";

      if (language === "gu") {
        if (refreshOriginal || !originalText.has(node)) originalText.set(node, current);
        const source = originalText.get(node) || current;
        const next = translateEnglishToGujarati(source);
        if (next !== current) {
          internalTextMutations.add(node);
          node.nodeValue = next;
        }
      } else if (originalText.has(node)) {
        const source = originalText.get(node);
        if (source !== current) {
          internalTextMutations.add(node);
          node.nodeValue = source;
        }
      }
    };

    const translatableAttributes = ["placeholder", "aria-label", "title"];

    const translateAttributes = (element, refreshOriginal = false) => {
      if (!(element instanceof Element)) return;
      if (element.closest('[data-no-translate="true"], [translate="no"]')) return;

      let originals = originalAttributes.get(element);
      if (!originals) {
        originals = new Map();
        originalAttributes.set(element, originals);
      }

      for (const attr of translatableAttributes) {
        if (!element.hasAttribute(attr)) continue;
        const current = element.getAttribute(attr) || "";

        if (language === "gu") {
          if (refreshOriginal || !originals.has(attr)) originals.set(attr, current);
          const source = originals.get(attr) || current;
          const next = translateEnglishToGujarati(source);
          if (next !== current) {
            let attrs = internalAttributeMutations.get(element);
            if (!attrs) {
              attrs = new Set();
              internalAttributeMutations.set(element, attrs);
            }
            attrs.add(attr);
            element.setAttribute(attr, next);
          }
        } else if (originals.has(attr)) {
          const source = originals.get(attr);
          if (source !== current) {
            let attrs = internalAttributeMutations.get(element);
            if (!attrs) {
              attrs = new Set();
              internalAttributeMutations.set(element, attrs);
            }
            attrs.add(attr);
            element.setAttribute(attr, source);
          }
        }
      }
    };

    const processSubtree = (root) => {
      if (!root) return;
      if (root.nodeType === Node.TEXT_NODE) {
        translateTextNode(root);
        return;
      }
      if (!(root instanceof Element) && root !== document.body) return;

      if (root instanceof Element) translateAttributes(root);

      const walker = document.createTreeWalker(
        root,
        NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
      );

      let current = walker.nextNode();
      while (current) {
        if (current.nodeType === Node.TEXT_NODE) translateTextNode(current);
        else if (current instanceof Element) translateAttributes(current);
        current = walker.nextNode();
      }
    };

    const observer = new MutationObserver((records) => {
      for (const record of records) {
        if (record.type === "characterData") {
          const node = record.target;
          if (internalTextMutations.has(node)) {
            internalTextMutations.delete(node);
            continue;
          }
          translateTextNode(node, language === "gu");
          continue;
        }

        if (record.type === "attributes") {
          const element = record.target;
          const attr = record.attributeName;
          const attrs = internalAttributeMutations.get(element);
          if (attrs?.has(attr)) {
            attrs.delete(attr);
            continue;
          }
          translateAttributes(element, language === "gu");
          continue;
        }

        for (const node of record.addedNodes) processSubtree(node);
      }
    });

    observer.observe(document.body, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: translatableAttributes,
    });

    processSubtree(document.body);

    window.dispatchEvent(
      new CustomEvent("ssc-language-changed", { detail: { language } }),
    );

    return () => observer.disconnect();
  }, [language]);

  const value = useMemo(
    () => ({
      language,
      isGujarati: language === "gu",
      setLanguage: (next) => setLanguageState(next === "gu" ? "gu" : "en"),
      toggleLanguage: () =>
        setLanguageState((current) => (current === "gu" ? "en" : "gu")),
    }),
    [language],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}
