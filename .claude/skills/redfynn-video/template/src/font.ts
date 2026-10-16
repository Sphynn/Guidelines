import {continueRender, delayRender, staticFile} from 'remotion';

// Hanken Grotesk is the stand-in for TWK Everett (licensed). Bundled locally because the render
// browser can't reach Google Fonts through the sandbox proxy.
export const fontFamily = 'Hanken Grotesk';

const handle = delayRender('font');
new FontFace(fontFamily, `url(${staticFile('HankenGrotesk.woff2')})`, {weight: '100 900'})
  .load()
  .then((f) => {
    document.fonts.add(f);
    continueRender(handle);
  })
  .catch((e) => {
    console.error(e);
    continueRender(handle);
  });
