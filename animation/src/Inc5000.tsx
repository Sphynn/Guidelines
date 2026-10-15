import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, Easing} from 'remotion';
import {staticFile as sf, continueRender, delayRender} from 'remotion';

// Hanken Grotesk is the stand-in for TWK Everett (licensed, not available).
// Bundled locally (variable font): the render browser can't reach Google Fonts through the sandbox proxy.
const fontFamily = 'Hanken Grotesk';
const handle = delayRender('font');
new FontFace(fontFamily, `url(${sf('HankenGrotesk.woff2')})`, {weight: '100 900'})
  .load()
  .then((f) => { document.fonts.add(f); continueRender(handle); })
  .catch((e) => { console.error(e); continueRender(handle); });

// RedFynn 2024 brand guide
const CHARCOAL = '#1C1B1F';
const SLATE = '#4D4C4E';
const GRAIN =
  "url(\"data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .9 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const ease = Easing.out(Easing.cubic);
const reveal = (f: number, start: number, len = 26) =>
  interpolate(f, [start, start + len], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});

const Rise = ({start, children, style}: {start: number; children: React.ReactNode; style: React.CSSProperties}) => {
  const p = reveal(useCurrentFrame(), start);
  return <div style={{...style, opacity: p, transform: `translateY(${(1 - p) * 50}px)`}}>{children}</div>;
};

export const Inc5000 = () => {
  const frame = useCurrentFrame();
  const t = frame / 180;
  const a = Math.sin(t * Math.PI * 2) * 12;
  const b = Math.cos(t * Math.PI * 2) * 12;
  return (
    <AbsoluteFill style={{backgroundColor: '#fff', fontFamily}}>
      {/* Logo: static, on white, at 760px wide (min 144px). Not animated or faded. */}
      <div style={{position: 'absolute', top: 150, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <Img src={staticFile('logo.png')} style={{width: 760, height: 'auto'}} />
      </div>
      {/* Noisy red-orange gradient panel with black type */}
      <div style={{position: 'absolute', left: 60, right: 60, top: 520, bottom: 150, borderRadius: 48, overflow: 'hidden', backgroundColor: '#ED3E25'}}>
        <div
          style={{
            position: 'absolute', inset: -100,
            background: `radial-gradient(circle at ${30 + a}% ${25 + b}%, #FF8A3D 0%, transparent 55%),
              radial-gradient(circle at ${75 - b}% ${70 + a}%, #F7B58A 0%, transparent 50%),
              radial-gradient(circle at ${50 + b}% ${95 - a}%, #C9201A 0%, transparent 60%)`,
          }}
        />
        <div style={{position: 'absolute', inset: 0, backgroundImage: GRAIN, mixBlendMode: 'soft-light', opacity: 0.55}} />
        <div style={{position: 'absolute', inset: 0, padding: '110px 80px', color: CHARCOAL}}>
          <Rise start={10} style={{fontWeight: 300, fontSize: 34, letterSpacing: '0.12em', textTransform: 'uppercase'}}>
            Recognized
          </Rise>
          <Rise start={28} style={{fontWeight: 400, fontSize: 168, lineHeight: 1.02, marginTop: 40}}>Inc. 5000,</Rise>
          <Rise start={48} style={{fontWeight: 400, fontSize: 168, lineHeight: 1.02}}>two years</Rise>
          <Rise start={68} style={{fontWeight: 400, fontSize: 168, lineHeight: 1.02}}>running.</Rise>
          <div style={{height: 3, width: 760 * reveal(frame, 95, 30), backgroundColor: CHARCOAL, marginTop: 70}} />
          <Rise start={110} style={{fontWeight: 300, fontSize: 52, marginTop: 40, fontStyle: 'italic'}}>We make it simple.</Rise>
        </div>
      </div>
      <div style={{position: 'absolute', bottom: 70, left: 0, right: 0, textAlign: 'center', fontWeight: 300, fontSize: 34, color: SLATE, opacity: reveal(frame, 120)}}>
        Redfynn.com
      </div>
    </AbsoluteFill>
  );
};
