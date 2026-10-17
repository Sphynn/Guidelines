import {AbsoluteFill, Audio, Easing, Img, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {fontFamily} from './font';

export type Scene = {
  start: number;
  end: number;
  clip: string;
  pos: 'top' | 'bottom';
  size?: number;
  overline?: string;
  lines: string[];
  /** big count-up number shown above the lines */
  count?: number;
  /** gradient pill under the lines */
  note?: string;
};

export type LifestyleProps = {
  music: boolean;
  /** file in public/ */
  musicFile: string;
  /** file in public/ (e.g. 'voiceover.m4a'); empty = no voiceover */
  voiceover: string;
  scenes: Scene[];
  endStart: number;
  thanks: string[];
  tagline: string;
  url: string;
};

export const LIFESTYLE_SECONDS = 48;

export const lifestyleDefaults: LifestyleProps = {
  music: true,
  musicFile: 'lifestyle-music.m4a',
  voiceover: '',
  scenes: [
    {start: 0, end: 5.0, clip: 'stock/pixabay-114445-vertical.mp4', pos: 'bottom', size: 150, lines: ['We’ve been', 'in the game']},
    {start: 4.6, end: 9.6, clip: 'stock/pixabay-57676-vertical.mp4', pos: 'bottom', size: 138, lines: ['Our partners', 'call their', 'own shots.']},
    {start: 9.2, end: 14.2, clip: 'stock/pixabay-218139-vertical.mp4', pos: 'bottom', size: 150, lines: ['Deal by deal,']},
    {start: 13.8, end: 18.8, clip: 'stock/pixabay-38371-vertical.mp4', pos: 'bottom', size: 150, lines: ['Merchant by', 'merchant.']},
    {start: 18.4, end: 24.0, clip: 'stock/pixabay-282610-vertical.mp4', pos: 'top', size: 112, lines: ['This one belongs', 'to our partners.']},
    {start: 23.6, end: 29.6, clip: 'stock/pixabay-9473-vertical.mp4', pos: 'top', size: 140, count: 2, lines: ['years', 'running.']},
    {start: 29.2, end: 34.7, clip: 'stock/pixabay-219596-vertical.mp4', pos: 'top', size: 116, overline: '2025 · 2026', lines: ['Back to back', 'on the Inc. 5000.'], note: 'No. 2,440 · 135% growth'},
    {start: 34.3, end: 38.9, clip: 'stock/pixabay-199208-vertical.mp4', pos: 'bottom', size: 150, lines: ['Freedom', 'is the point.']},
    {start: 38.5, end: 43.0, clip: 'stock/pixabay-114445-b-vertical.mp4', pos: 'bottom', size: 150, lines: ['Here’s to', 'the next one.']},
  ],
  endStart: 42.6,
  thanks: ['Thank you,', 'partners.'],
  tagline: 'We make it simple.',
  url: 'Redfynn.com/partners',
};

const CHARCOAL = '#1C1B1F';
const ease = Easing.out(Easing.cubic);
const GRAIN =
  "url(\"data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .9 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

/** RedFynn red-orange gradient with grain, generated in code. */
const BrandGradient = ({shift = 0}: {shift?: number}) => (
  <div style={{position: 'absolute', inset: 0, overflow: 'hidden', backgroundColor: '#ED3E25'}}>
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

const Pill = ({children}: {children: React.ReactNode}) => (
  <div style={{position: 'relative', display: 'inline-block', borderRadius: 999, overflow: 'hidden'}}>
    <BrandGradient />
    <div style={{position: 'relative', padding: '18px 40px', color: CHARCOAL, fontWeight: 300, fontSize: 36, letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap'}}>{children}</div>
  </div>
);

export const Lifestyle = (p: LifestyleProps) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
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

  const white = (size: number, weight = 400): React.CSSProperties => ({fontWeight: weight, fontSize: size, lineHeight: 1.04, color: '#fff'});
  const endOpacity = interpolate(frame, [sec(p.endStart), sec(p.endStart + 0.5)], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const musicVol = (f: number) =>
    (p.voiceover ? 0.3 : 1) * interpolate(f, [0, sec(0.3), durationInFrames - sec(2), durationInFrames], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  // brand tag over the opening two scenes
  const tagOpacity = interpolate(frame, [sec(0.3), sec(1.0), sec(p.scenes[1].end - 0.7), sec(p.scenes[1].end)], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{backgroundColor: '#000', fontFamily}}>
      {p.scenes.map((s) => (
        <Sequence key={s.clip + s.start} from={Math.round(sec(s.start))} durationInFrames={Math.round(sec(s.end - s.start))}>
          <AbsoluteFill style={{opacity: sceneFade(s.start, s.end)}}>
            <OffthreadVideo src={staticFile(s.clip)} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
            {/* warm RedFynn grade */}
            <AbsoluteFill style={{background: 'linear-gradient(160deg, #FF8A3D 0%, #ED3E25 100%)', mixBlendMode: 'soft-light', opacity: 0.4}} />
            {/* soft darkening behind the type so white text stays readable */}
            <AbsoluteFill
              style={{
                background:
                  s.pos === 'top'
                    ? 'linear-gradient(to bottom, rgba(28,27,31,0.6) 0%, rgba(28,27,31,0) 52%)'
                    : 'linear-gradient(to top, rgba(28,27,31,0.74) 0%, rgba(28,27,31,0) 62%)',
              }}
            />
          </AbsoluteFill>
        </Sequence>
      ))}

      <div style={{position: 'absolute', top: 120, left: 80, opacity: tagOpacity}}>
        <Pill>Inc. 5000 · 2026</Pill>
      </div>

      {p.scenes.map((s) => {
        const cp = interpolate(local(s.start), [0.5, 2.0], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.quad)});
        const pos: React.CSSProperties = s.pos === 'top' ? {top: s.start < 10 ? 200 : 230} : {bottom: 230};
        return (
          <div key={'t' + s.start} style={{position: 'absolute', left: 80, right: 80, ...pos, opacity: sceneFade(s.start, s.end)}}>
            {s.overline && (
              <div style={{fontWeight: 300, fontSize: 34, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#fff', marginBottom: 28, ...rise(s.start, 0.2)}}>{s.overline}</div>
            )}
            {s.count !== undefined && (
              <div style={{...white(300, 300), fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em', ...rise(s.start, 0.1)}}>{Math.round(cp * s.count).toLocaleString('en-US')}</div>
            )}
            {s.lines.map((l, i) => (
              <div key={i} style={{...white(s.size ?? 140), ...rise(s.start, (s.count !== undefined ? 2.2 : 0.5) + i * 0.45)}}>{l}</div>
            ))}
            {s.note && (
              <>
                <div style={{height: 3, width: `${60 * rev(s.start, 2.0, 1)}%`, backgroundColor: '#fff', margin: '40px 0 36px'}} />
                <div style={rise(s.start, 2.4)}>
                  <Pill>{s.note}</Pill>
                </div>
              </>
            )}
          </div>
        );
      })}

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
                <div key={i} style={{fontWeight: 400, fontSize: 124, lineHeight: 1.04, ...rise(p.endStart, 0.5 + i * 0.4)}}>{l}</div>
              ))}
            </div>
            <div style={{fontWeight: 300, fontStyle: 'italic', fontSize: 56, color: CHARCOAL, opacity: rev(p.endStart, 1.4)}}>{p.tagline}</div>
            <div style={{border: `2px solid ${CHARCOAL}`, borderRadius: 999, padding: '20px 56px', fontWeight: 300, fontSize: 42, color: CHARCOAL, opacity: rev(p.endStart, 1.8)}}>{p.url}</div>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>

      {p.music && <Audio src={staticFile(p.musicFile)} volume={musicVol} />}
      {p.voiceover && <Audio src={staticFile(p.voiceover)} />}
    </AbsoluteFill>
  );
};
