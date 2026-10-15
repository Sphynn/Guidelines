import {AbsoluteFill, continueRender, delayRender, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

export type Props = {
  durationSeconds: number;
  overline: string;
  /** One entry per line; each line animates in on its own. */
  headline: string[];
  tagline: string;
  footer: string;
};

export const defaultProps: Props = {
  durationSeconds: 6,
  overline: 'Recognized',
  headline: ['Inc. 5000,', 'two years', 'running.'],
  tagline: 'We make it simple.',
  footer: 'Redfynn.com',
};

// RedFynn 2024 brand guide (see the redfynn-brand skill)
const CHARCOAL = '#1C1B1F';
const SLATE = '#4D4C4E';
const GRAIN =
  "url(\"data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .9 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

// Hanken Grotesk is the stand-in for TWK Everett (licensed). Bundled locally because the render
// browser can't reach Google Fonts through the sandbox proxy.
const fontFamily = 'Hanken Grotesk';
const fontHandle = delayRender('font');
new FontFace(fontFamily, `url(${staticFile('HankenGrotesk.woff2')})`, {weight: '100 900'})
  .load()
  .then((f) => {
    document.fonts.add(f);
    continueRender(fontHandle);
  })
  .catch((e) => {
    console.error(e);
    continueRender(fontHandle);
  });

const ease = Easing.out(Easing.cubic);

export const Announcement = (p: Props) => {
  const frame = useCurrentFrame();
  const {fps, width, height, durationInFrames} = useVideoConfig();
  const sec = (s: number) => s * fps;
  const reveal = (startSec: number, lenSec = 0.85) =>
    interpolate(frame, [sec(startSec), sec(startSec + lenSec)], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
  const rise = (startSec: number): React.CSSProperties => {
    const r = reveal(startSec);
    return {opacity: r, transform: `translateY(${(1 - r) * 50}px)`};
  };

  const landscape = width > height;
  const unit = landscape ? height / 1080 : width / 1080; // scale everything from the 1080 short side
  const u = (n: number) => n * unit;
  const headSize = u(landscape ? 150 : width === height ? 100 : 168);

  const t = frame / durationInFrames;
  const a = Math.sin(t * Math.PI * 2) * 12;
  const b = Math.cos(t * Math.PI * 2) * 12;

  const logo = (
    <Img src={staticFile('logo.png')} style={{width: u(landscape ? 640 : 760), height: 'auto'}} /> // static: never animate the logo
  );

  const panel = (
    <div style={{position: 'relative', flex: 1, borderRadius: u(48), overflow: 'hidden', backgroundColor: '#ED3E25'}}>
      <div
        style={{
          position: 'absolute',
          inset: u(-100),
          background: `radial-gradient(circle at ${30 + a}% ${25 + b}%, #FF8A3D 0%, transparent 55%),
            radial-gradient(circle at ${75 - b}% ${70 + a}%, #F7B58A 0%, transparent 50%),
            radial-gradient(circle at ${50 + b}% ${95 - a}%, #C9201A 0%, transparent 60%)`,
        }}
      />
      <div style={{position: 'absolute', inset: 0, backgroundImage: GRAIN, mixBlendMode: 'soft-light', opacity: 0.55}} />
      <div style={{position: 'absolute', inset: 0, padding: `${u(landscape ? 80 : width === height ? 70 : 110)}px ${u(80)}px`, color: CHARCOAL}}>
        <div style={{...rise(0.3), fontWeight: 300, fontSize: u(34), letterSpacing: '0.12em', textTransform: 'uppercase'}}>{p.overline}</div>
        <div style={{marginTop: u(40)}}>
          {p.headline.map((line, i) => (
            <div key={i} style={{...rise(0.9 + i * 0.65), fontWeight: 400, fontSize: headSize, lineHeight: 1.02}}>
              {line}
            </div>
          ))}
        </div>
        <div style={{height: 3, width: `${70 * reveal(0.9 + p.headline.length * 0.65 + 0.2, 1)}%`, backgroundColor: CHARCOAL, marginTop: u(60)}} />
        <div style={{...rise(0.9 + p.headline.length * 0.65 + 0.8), fontWeight: 300, fontStyle: 'italic', fontSize: u(52), marginTop: u(40)}}>{p.tagline}</div>
      </div>
    </div>
  );

  const footer = (
    <div style={{textAlign: 'center', fontWeight: 300, fontSize: u(34), color: SLATE, opacity: reveal(0.9 + p.headline.length * 0.65 + 1.2)}}>{p.footer}</div>
  );

  return (
    <AbsoluteFill style={{backgroundColor: '#fff', fontFamily}}>
      {landscape ? (
        <div style={{display: 'flex', height: '100%', padding: u(60), gap: u(60)}}>
          <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', width: '38%'}}>
            <div style={{marginTop: u(60)}}>{logo}</div>
            {footer}
          </div>
          {panel}
        </div>
      ) : (
        <div style={{display: 'flex', flexDirection: 'column', height: '100%', padding: `${u(width === height ? 50 : 150)}px ${u(60)}px ${u(width === height ? 50 : 70)}px`, gap: u(width === height ? 30 : 50)}}>
          <div style={{display: 'flex', justifyContent: 'center'}}>{logo}</div>
          {panel}
          {footer}
        </div>
      )}
    </AbsoluteFill>
  );
};
