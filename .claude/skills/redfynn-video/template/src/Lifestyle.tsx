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
};

export const lifestyleDefaults: LifestyleProps = {
  music: true,
  scene1: ['We’ve been', 'in the game'],
  scene2: ['Our partners', 'call their', 'own shots.'],
  count: 5002,
  countLabel: ['years', 'running.'],
  scene4Overline: 'Okay, fine.',
  scene4: ['Inc. 5000,', 'two years', 'in a row.'],
  scene4Note: 'No. 2,440 · 135% growth',
  thanks: ['Thank you,', 'partners.'],
  url: 'Redfynn.com',
};

export const LIFESTYLE_SECONDS = 22;

const CHARCOAL = '#1C1B1F';
const SLATE = '#4D4C4E';
const ease = Easing.out(Easing.cubic);

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
  const cp = interpolate(local(c0), [0.5, 3.4], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.quad)});
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
            {/* soft darkening at the bottom so white type stays readable */}
            <AbsoluteFill style={{background: 'linear-gradient(to top, rgba(28,27,31,0.62) 0%, rgba(28,27,31,0.0) 55%)'}} />
          </AbsoluteFill>
        </Sequence>
      ))}

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
          <div key={i} style={{...text(140, 400), ...rise(SCENES[2][0], 3.0 + i * 0.4)}}>{l}</div>
        ))}
      </div>
      {/* 4 */}
      <div style={{...block({bottom: 'auto', top: 230}), opacity: sceneFade(SCENES[3][0], SCENES[3][1])}}>
        <div style={{...over, ...rise(SCENES[3][0], 0.2)}}>{p.scene4Overline}</div>
        {p.scene4.map((l, i) => (
          <div key={i} style={{...text(138, 400), ...rise(SCENES[3][0], 0.6 + i * 0.45)}}>{l}</div>
        ))}
        <div style={{height: 3, width: `${60 * rev(SCENES[3][0], 2.2, 1)}%`, backgroundColor: '#fff', margin: '40px 0 28px'}} />
        <div style={{...text(44), fontStyle: 'italic', ...rise(SCENES[3][0], 2.6)}}>{p.scene4Note}</div>
      </div>

      {/* end card */}
      <AbsoluteFill style={{backgroundColor: '#fff', opacity: endOpacity, alignItems: 'center', justifyContent: 'center'}}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 70}}>
          <Img src={staticFile('logo.png')} style={{width: 760, height: 'auto'}} />
          <div style={{textAlign: 'center', color: CHARCOAL}}>
            {p.thanks.map((l, i) => (
              <div key={i} style={{fontWeight: 400, fontSize: 110, lineHeight: 1.05, ...rise(END_START, 0.5 + i * 0.4)}}>{l}</div>
            ))}
          </div>
          <div style={{fontWeight: 300, fontSize: 40, color: SLATE, opacity: rev(END_START, 1.6)}}>{p.url}</div>
        </div>
      </AbsoluteFill>

      {p.music && <Audio src={staticFile('celebration-music.m4a')} volume={musicVol} />}
    </AbsoluteFill>
  );
};
