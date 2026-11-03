import { delayRender, continueRender, staticFile } from "remotion";

let fontsInitialized = false;

export const loadFonts = () => {
  if (typeof window === "undefined" || fontsInitialized) return;
  fontsInitialized = true;

  const handle = delayRender("fonts-preload");

  try {
    const styleId = "survival-arabic-offline-fonts";
    if (!document.getElementById(styleId)) {
      const styleEl = document.createElement("style");
      styleEl.id = styleId;
      styleEl.textContent = `
        @font-face {
          font-family: 'Hind Siliguri';
          font-style: normal;
          font-weight: 400;
          font-display: block;
          src: url('${staticFile("fonts/HindSiliguri-Regular.ttf")}') format('truetype');
        }
        @font-face {
          font-family: 'Hind Siliguri';
          font-style: normal;
          font-weight: 600;
          font-display: block;
          src: url('${staticFile("fonts/HindSiliguri-SemiBold.ttf")}') format('truetype');
        }
        @font-face {
          font-family: 'Hind Siliguri';
          font-style: normal;
          font-weight: 700;
          font-display: block;
          src: url('${staticFile("fonts/HindSiliguri-Bold.ttf")}') format('truetype');
        }
        @font-face {
          font-family: 'Noto Sans Arabic';
          font-style: normal;
          font-weight: 100 900;
          font-display: block;
          src: url('${staticFile("fonts/NotoSansArabic.ttf")}') format('truetype');
        }
      `;
      document.head.appendChild(styleEl);
    }

    document.fonts.ready
      .then(() => {
        return Promise.all([
          document.fonts.load("400 16px 'Hind Siliguri'"),
          document.fonts.load("600 16px 'Hind Siliguri'"),
          document.fonts.load("700 16px 'Hind Siliguri'"),
          document.fonts.load("700 16px 'Noto Sans Arabic'"),
        ]);
      })
      .then(() => {
        continueRender(handle);
      })
      .catch((err) => {
        console.warn("Font loading error:", err);
        continueRender(handle);
      });
  } catch (err) {
    console.warn("Font injection error:", err);
    continueRender(handle);
  }
};

loadFonts();
