import {AbsoluteFill, Audio, Easing, Img, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {fontFamily} from './font';

export type LifestyleProps = {
  music: boolean;
  scene1: string[];
  scene2: string[];
  count: number;
  countLabel: string[];
  scene4Overline: string;
  scene4: string[];
  scene4Note: string;
  thanks: string[];
  url: string;
  tagline: string;
  /** file in public/ (e.g. 'voiceover.m4a'); empty = no voiceover */
  voiceover: string;
};

export const lifestyleDefaults: LifestyleProps = {
  music: true,
  scene1: ['We’ve been', 'in the game'],
  scene2: ['Our partners', 'call their', 'own shots.'],
  count: 2,
  countLabel: ['years', 'running.'],
  scene4Overline: '2025 · 2026',
  scene4: ['Back to back', 'on the Inc. 5000.'],
  scene4Note: 'No. 2,440 · 135% growth',
  thanks: ['Thank you,', 'partners.'],
  url: 'Redfynn.com/partners',
  tagline: 'We make it simple.',
  voiceover: '',
};

export const LIFESTYLE_SECONDS = 22;

const CHARCOAL = '#1C1B1F';
const SLATE = '#4D4C4E';
const ease = Easing.out(Easing.cubic);
const GRAIN =
  "url(\"data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .9 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

/** RedFynn red-orange gradient with grain, generated in code. */
const BrandGradient = ({shift = 0, radius = 0}: {shift?: number; radius?: number}) => (
  <div style={{position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: radius, backgroundColor: '#ED3E25'}}>
    <div
      style={{
        position: 'absolute',
        inset: -100,
        background: `radial-gradient(circle at ${30 + shift}% ${25 - shift}%, #FF8A3D 0%, transparent 55%),
          radial-gradient(circle at ${75 - shift}% ${70 + shift}%, #F7B58A 0%, transparent 50%),
          radial-gradient(circle at ${50 + shift}% ${95 - shift}%, #C9201A 0%, transparent 60%)`,
      }}
    />
    <div style={{position: 'absolute', inset: 0, backgroundImage: GRAIN, mixBlendMode: 'soft-light', opacity: 0.55}} />
  </div>
);

const Pill = ({children, style}: {children: React.ReactNode; style?: React.CSSProperties}) => (
  <div style={{position: 'relative', display: 'inline-block', borderRadius: 999, overflow: 'hidden', ...style}}>
    <BrandGradient />
    <div style={{position: 'relative', padding: '18px 40px', color: CHARCOAL, fontWeight: 300, fontSize: 36, letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap'}}>{children}</div>
  </div>
);

// [startSec, endSec, clip]
const SCENES: [number, number, string][] = [
  [0, 4.6, 'stock/pixabay-114445-vertical.mp4'],
  [4.2, 8.8, 'stock/pixabay-57676-vertical.mp4'],
  [8.4, 13.9, 'stock/pixabay-9473-vertical.mp4'],
  [13.5, 18.6, 'stock/pixabay-219596-vertical.mp4'],
];
const END_START = 18.2;

export const Lifestyle = (p: LifestyleProps) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sec = (s: number) => s * fps;
  const local = (start: number) => frame / fps - start;
  const rev = (start: number, at: number, len = 0.8) =>
    interpolate(local(start), [at, at + len], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
  const rise = (start: number, at: number): React.CSSProperties => {
    const r = rev(start, at);
    return {opacity: r, transform: `translateY(${(1 - r) * 44}px)`};
  };
  const sceneFade = (start: number, end: number) =>
    interpolate(frame, [sec(start), sec(start + 0.4), sec(end - 0.4), sec(end)], [start === 0 ? 1 : 0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  const text = (size: number, weight = 300): React.CSSProperties => ({fontWeight: weight, fontSize: size, lineHeight: 1.04, color: '#fff'});
  const over: React.CSSProperties = {fontWeight: 300, fontSize: 34, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#fff', marginBottom: 28};
  const block = (extra?: React.CSSProperties): React.CSSProperties => ({position: 'absolute', left: 80, right: 80, bottom: 230, ...extra});

  // count-up
  const c0 = 8.4;
  const cp = interpolate(local(c0), [0.5, 2.0], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.quad)});
  const countText = Math.round(cp * p.count).toLocaleString('en-US');

  const endOpacity = interpolate(frame, [sec(END_START), sec(END_START + 0.5)], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const musicVol = (f: number) =>
    interpolate(f, [0, sec(1), sec(LIFESTYLE_SECONDS - 2), sec(LIFESTYLE_SECONDS)], [0, 0.7, 0.7, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{backgroundColor: '#000', fontFamily}}>
      {SCENES.map(([s, e, clip], i) => (
        <Sequence key={clip} from={Math.round(sec(s))} durationInFrames={Math.round(sec(e - s))}>
          <AbsoluteFill style={{opacity: sceneFade(s, e)}}>
            <OffthreadVideo src={staticFile(clip)} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
            {/* warm RedFynn grade */}
            <AbsoluteFill style={{background: 'linear-gradient(160deg, #FF8A3D 0%, #ED3E25 100%)', mixBlendMode: 'soft-light', opacity: 0.4}} />
            {/* soft darkening at the bottom so white type stays readable */}
            <AbsoluteFill style={{background: 'linear-gradient(to top, rgba(28,27,31,0.62) 0%, rgba(28,27,31,0.0) 55%)'}} />
          </AbsoluteFill>
        </Sequence>
      ))}

      {/* brand tag over the opening two scenes */}
      <div style={{position: 'absolute', top: 120, left: 80, opacity: interpolate(frame, [sec(0.3), sec(1.0), sec(7.9), sec(8.6)], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
        <Pill>Inc. 5000 · 2026</Pill>
      </div>
      {/* 1 */}
      <div style={{...block(), opacity: sceneFade(SCENES[0][0], SCENES[0][1])}}>
        {p.scene1.map((l, i) => (
          <div key={i} style={{...text(150, 400), ...rise(SCENES[0][0], 0.5 + i * 0.5)}}>{l}</div>
        ))}
      </div>
      {/* 2 */}
      <div style={{...block(), opacity: sceneFade(SCENES[1][0], SCENES[1][1])}}>
        {p.scene2.map((l, i) => (
          <div key={i} style={{...text(138, 400), ...rise(SCENES[1][0], 0.3 + i * 0.45)}}>{l}</div>
        ))}
      </div>
      {/* 3 count-up */}
      <div style={{...block({bottom: 'auto', top: 230}), opacity: sceneFade(SCENES[2][0], SCENES[2][1])}}>
        <div style={{...text(300, 300), fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em', ...rise(SCENES[2][0], 0.1)}}>{countText}</div>
        {p.countLabel.map((l, i) => (
          <div key={i} style={{...text(140, 400), ...rise(SCENES[2][0], 2.2 + i * 0.4)}}>{l}</div>
        ))}
      </div>
      {/* 4 */}
      <div style={{...block({bottom: 'auto', top: 230}), opacity: sceneFade(SCENES[3][0], SCENES[3][1])}}>
        <div style={{...over, ...rise(SCENES[3][0], 0.2)}}>{p.scene4Overline}</div>
        {p.scene4.map((l, i) => (
          <div key={i} style={{...text(130, 400), ...rise(SCENES[3][0], 0.6 + i * 0.45)}}>{l}</div>
        ))}
        <div style={{height: 3, width: `${60 * rev(SCENES[3][0], 2.2, 1)}%`, backgroundColor: '#fff', margin: '40px 0 36px'}} />
        <div style={rise(SCENES[3][0], 2.6)}><Pill>{p.scene4Note}</Pill></div>
      </div>

      {/* end card: brand gradient, logo on a white card */}
      <AbsoluteFill style={{opacity: endOpacity}}>
        <BrandGradient shift={Math.sin(frame / 60) * 10} />
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 64}}>
            <div style={{backgroundColor: '#fff', borderRadius: 48, padding: '56px 70px'}}>
              <Img src={staticFile('logo.png')} style={{width: 700, height: 'auto', display: 'block'}} />
            </div>
            <div style={{textAlign: 'center', color: CHARCOAL}}>
              {p.thanks.map((l, i) => (
                <div key={i} style={{fontWeight: 400, fontSize: 124, lineHeight: 1.04, ...rise(END_START, 0.5 + i * 0.4)}}>{l}</div>
              ))}
            </div>
            <div style={{fontWeight: 300, fontStyle: 'italic', fontSize: 56, color: CHARCOAL, opacity: rev(END_START, 1.4)}}>{p.tagline}</div>
            <div style={{border: `2px solid ${CHARCOAL}`, borderRadius: 999, padding: '20px 56px', fontWeight: 300, fontSize: 42, color: CHARCOAL, opacity: rev(END_START, 1.8)}}>{p.url}</div>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>

      {p.music && <Audio src={staticFile('celebration-music.m4a')} volume={(f) => musicVol(f) * (p.voiceover ? 0.3 : 1)} />}
      {p.voiceover && <Audio src={staticFile(p.voiceover)} />}
    </AbsoluteFill>
  );
};
