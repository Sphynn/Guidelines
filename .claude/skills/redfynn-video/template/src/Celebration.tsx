import {AbsoluteFill, Easing, Img, interpolate, interpolateColors, random, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {fontFamily} from './font';

export type CelebrationProps = {
  year: number;
  rank: number;
  prevYear: number;
  prevRank: number;
  growth: number;
  growthWindow: string;
  quote: string;
  quoteBy: string;
  closing: string[];
  url: string;
};

export const celebrationDefaults: CelebrationProps = {
  year: 2026,
  rank: 2440,
  prevYear: 2025,
  prevRank: 2381,
  growth: 135,
  growthWindow: 'over three years, 2022 to 2025.',
  quote: 'This ranking belongs to our partner channel first.',
  quoteBy: 'Shane Hurley, CEO',
  closing: ['Built with', 'our partners.'],
  url: 'redfynn.com/partners',
};

// Palette: RedFynn 2024 guide (Charcoal, Red, White, Slate) plus the warm tints of its gradient artwork.
const CH = '#1C1B1F';
const RED = '#ED3E25';
const ORANGE = '#FF8A3D';
const PEACH = '#F7B58A';
const CREAM = '#FFE3CC';
const SLATE = '#4D4C4E';
const GRAIN =
  "url(\"data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .9 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const W = 1080;
const H = 1920;
const HORIZON = 1080;
const WATER_Y = 1480; // yacht waterline
const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = Easing.out(Easing.cubic);

const wavePath = (baseY: number, amp: number, len: number, phase: number) => {
  let d = `M 0 ${H} L 0 ${baseY + amp * Math.sin(phase)}`;
  for (let x = 20; x <= W + 20; x += 20) d += ` L ${x} ${baseY + amp * Math.sin(x / len + phase)}`;
  return d + ` L ${W} ${H} Z`;
};

// ---------- people ----------
type PersonProps = {x: number; y: number; phase: number; top: string; dress?: boolean; glass?: boolean; s?: number; frame: number; boost: number};

const Person = ({x, y, phase, top, dress, glass, s = 1, frame, boost}: PersonProps) => {
  const bob = -Math.abs(Math.sin(frame * 0.16 + phase)) * (6 + 16 * boost);
  const tilt = Math.sin(frame * 0.12 + phase) * 3;
  const swing = 14 + 12 * boost;
  const armL = 150 + Math.sin(frame * 0.3 + phase) * swing;
  const armR = -(150 + Math.sin(frame * 0.3 + phase + 1.7) * swing);
  return (
    <g transform={`translate(${x} ${y + bob}) scale(${s}) rotate(${tilt})`}>
      {dress ? (
        <>
          <line x1={-6} y1={-28} x2={-7} y2={0} stroke={CH} strokeWidth={10} strokeLinecap="round" />
          <line x1={6} y1={-28} x2={7} y2={0} stroke={CH} strokeWidth={10} strokeLinecap="round" />
          <path d="M -14 -90 L 14 -90 L 24 -26 L -24 -26 Z" fill={top} />
        </>
      ) : (
        <>
          <line x1={-7} y1={-50} x2={-9} y2={0} stroke={CH} strokeWidth={11} strokeLinecap="round" />
          <line x1={7} y1={-50} x2={9} y2={0} stroke={CH} strokeWidth={11} strokeLinecap="round" />
          <rect x={-16} y={-90} width={32} height={44} rx={10} fill={top} />
        </>
      )}
      <circle cx={0} cy={-106} r={14} fill={CH} />
      {[
        {sx: -15, ang: armL, g: false},
        {sx: 15, ang: armR, g: glass},
      ].map((a, i) => (
        <g key={i} transform={`rotate(${a.ang} ${a.sx} -84)`}>
          <line x1={a.sx} y1={-84} x2={a.sx} y2={-46} stroke={CH} strokeWidth={9} strokeLinecap="round" />
          {a.g && <path d={`M ${a.sx - 3} -44 L ${a.sx + 3} -44 L ${a.sx + 6} -26 L ${a.sx - 6} -26 Z`} fill="#fff" opacity={0.95} />}
        </g>
      ))}
    </g>
  );
};

// ---------- yacht ----------
const Yacht = ({frame, boost}: {frame: number; boost: number}) => {
  const main: Omit<PersonProps, 'frame' | 'boost'>[] = [
    {x: -330, y: -120, phase: 0.2, top: '#fff'},
    {x: -240, y: -120, phase: 1.4, top: RED, dress: true, glass: true},
    {x: -150, y: -120, phase: 2.6, top: PEACH},
    {x: -50, y: -120, phase: 0.9, top: '#fff', glass: true},
    {x: 50, y: -120, phase: 3.3, top: RED},
    {x: 150, y: -120, phase: 4.1, top: '#fff', dress: true},
    {x: 255, y: -120, phase: 5.2, top: PEACH, glass: true},
    {x: 340, y: -120, phase: 2.1, top: RED},
  ];
  const fly: Omit<PersonProps, 'frame' | 'boost'>[] = [
    {x: -200, y: -275, phase: 1.1, top: RED, glass: true},
    {x: -100, y: -275, phase: 3.9, top: '#fff', dress: true},
    {x: 0, y: -275, phase: 0.4, top: PEACH, glass: true},
    {x: 95, y: -275, phase: 2.8, top: '#fff'},
  ];
  const flags = Array.from({length: 15}, (_, i) => i);
  const sag = (x: number) => -440 + 40 * Math.sin(((x + 290) / 470) * Math.PI);
  const flagCols = [RED, '#fff', CH, PEACH];
  return (
    <g>
      {/* hull */}
      <defs>
        <clipPath id="hull">
          <path d="M -380 -120 L 380 -120 Q 430 -125 450 -175 L 390 0 L -340 0 Q -380 0 -380 -60 Z" />
        </clipPath>
      </defs>
      <path d="M -380 -120 L 380 -120 Q 430 -125 450 -175 L 390 0 L -340 0 Q -380 0 -380 -60 Z" fill="#fff" />
      <g clipPath="url(#hull)">
        <polygon points="-390,-62 460,-100 460,-84 -390,-46" fill={CH} />
        <polygon points="-390,-30 460,-60 460,-54 -390,-24" fill={RED} />
      </g>
      {/* salon */}
      <rect x={-300} y={-270} width={500} height={150} rx={14} fill="#fff" />
      <rect x={-280} y={-250} width={460} height={42} rx={8} fill={PEACH} opacity={0.9} />
      <rect x={-280} y={-250} width={460} height={42} rx={8} fill="none" stroke={CH} strokeWidth={3} opacity={0.5} />
      {[-190, -70, 50, 150].map((x) => (
        <line key={x} x1={x} y1={-250} x2={x} y2={-208} stroke={CH} strokeWidth={3} opacity={0.5} />
      ))}
      {/* flybridge */}
      <rect x={-270} y={-282} width={430} height={14} rx={5} fill="#fff" />
      <line x1={-268} y1={-332} x2={158} y2={-332} stroke="#fff" strokeWidth={5} />
      {[-268, -130, 10, 158].map((x) => (
        <line key={x} x1={x} y1={-332} x2={x} y2={-282} stroke="#fff" strokeWidth={4} />
      ))}
      {/* hardtop */}
      <line x1={-262} y1={-282} x2={-262} y2={-470} stroke={CH} strokeWidth={8} />
      <line x1={150} y1={-282} x2={150} y2={-470} stroke={CH} strokeWidth={8} />
      <rect x={-300} y={-486} width={490} height={18} rx={8} fill={CH} />
      <line x1={-50} y1={-486} x2={-50} y2={-590} stroke={CH} strokeWidth={5} />
      <circle cx={-50} cy={-596} r={7} fill={RED} />
      {/* people on flybridge, then main deck */}
      {fly.map((p, i) => (
        <Person key={`f${i}`} {...p} frame={frame} boost={boost} />
      ))}
      {main.map((p, i) => (
        <Person key={`m${i}`} {...p} frame={frame} boost={boost} />
      ))}
      {/* bunting */}
      <path d={`M -300 -468 Q -50 -400 190 -468`} stroke={CH} strokeWidth={2} fill="none" opacity={0} />
      {flags.map((i) => {
        const x = -290 + (i / 14) * 470;
        const y = sag(x) + 28;
        const wob = Math.sin(frame * 0.2 + i) * 5;
        return <polygon key={i} points={`${x - 12},${y - 8} ${x + 12},${y - 8} ${x},${y + 26}`} fill={flagCols[i % 4]} transform={`rotate(${wob} ${x} ${y - 8})`} />;
      })}
      <path d={`M -290 -440 Q -50 ${-440 + 80} 180 -440`} stroke={CH} strokeWidth={2} fill="none" opacity={0.6} />
    </g>
  );
};

// ---------- backdrop pieces ----------
const Skyline = ({frame}: {frame: number}) => {
  const drift = frame * 0.05;
  const blds = Array.from({length: 22}, (_, i) => {
    const x = -30 + i * 52;
    const c = 1 - Math.abs(i - 11) / 14;
    const h = 60 + random(`b${i}`) * 110 + c * 110;
    const w = 40 + random(`w${i}`) * 30;
    return {x: x - drift, h, w, i};
  });
  return (
    <g opacity={0.92}>
      {blds.map((b) => (
        <g key={b.i}>
          <rect x={b.x} y={HORIZON - b.h} width={b.w} height={b.h + 4} fill="#7A2A24" />
          {Array.from({length: Math.floor(b.h / 34)}, (_, r) =>
            random(`l${b.i}-${r}`) > 0.55 ? <rect key={r} x={b.x + 8 + random(`lx${b.i}-${r}`) * (b.w - 24)} y={HORIZON - b.h + 14 + r * 30} width={8} height={10} fill={PEACH} opacity={0.8} /> : null,
          )}
        </g>
      ))}
    </g>
  );
};

const Palm = ({x, scale, frame}: {x: number; scale: number; frame: number}) => {
  const sway = Math.sin(frame * 0.05 + x) * 3;
  return (
    <g transform={`translate(${x} ${HORIZON + 6}) scale(${scale})`}>
      <path d="M 0 0 Q 18 -90 6 -190" stroke={CH} strokeWidth={9} fill="none" strokeLinecap="round" />
      <g transform={`translate(6 -190) rotate(${sway})`}>
        {[-80, -50, -20, 20, 50, 80, 120, -120].map((a) => (
          <ellipse key={a} cx={0} cy={-34} rx={9} ry={50} fill={CH} transform={`rotate(${a})`} />
        ))}
      </g>
    </g>
  );
};

const SmallYacht = ({x}: {x: number}) => (
  <g transform={`translate(${x} ${HORIZON + 26}) scale(0.34)`} fill={CH}>
    <path d="M -300 0 L 330 0 L 400 -70 L -300 -70 Z" />
    <rect x={-220} y={-170} width={380} height={100} rx={10} />
    <rect x={-180} y={-250} width={290} height={80} rx={8} />
    <rect x={-210} y={-266} width={350} height={16} rx={6} />
  </g>
);

const Fireworks = ({frame, fps}: {frame: number; fps: number}) => {
  const bursts = [
    {t: 15.6, x: 800, y: 470}, {t: 16.3, x: 560, y: 700}, {t: 17.1, x: 900, y: 280}, {t: 17.9, x: 720, y: 640},
    {t: 19.2, x: 600, y: 420}, {t: 19.9, x: 930, y: 620}, {t: 20.6, x: 780, y: 330},
  ];
  const cols = ['#fff', CREAM, PEACH];
  return (
    <g>
      {bursts.map((b, bi) => {
        const age = frame / fps - b.t;
        if (age < 0 || age > 1.8) return null;
        const r = interpolate(age, [0, 1.3], [0, 190], {...CLAMP, easing: ease});
        const o = interpolate(age, [0.5, 1.8], [1, 0], CLAMP);
        const col = cols[bi % 3];
        return (
          <g key={bi} opacity={o}>
            {Array.from({length: 26}, (_, i) => {
              const a = (i / 26) * Math.PI * 2;
              const dx = Math.cos(a);
              const dy = Math.sin(a) + age * 0.35;
              return (
                <g key={i}>
                  <line x1={b.x + dx * r * 0.62} y1={b.y + dy * r * 0.62} x2={b.x + dx * r} y2={b.y + dy * r} stroke={col} strokeWidth={4} strokeLinecap="round" />
                  <circle cx={b.x + dx * r * 1.04} cy={b.y + dy * r * 1.04} r={4} fill={col} />
                </g>
              );
            })}
          </g>
        );
      })}
    </g>
  );
};

const Confetti = ({frame, fps}: {frame: number; fps: number}) => {
  const bursts = [4.0, 15.5, 22.0];
  const cols = [RED, '#fff', CH, PEACH, ORANGE];
  return (
    <g>
      {bursts.flatMap((b, bi) => {
        const age = frame / fps - b;
        if (age < 0 || age > 3.4) return [];
        return Array.from({length: 70}, (_, i) => {
          const id = `c${bi}-${i}`;
          const vx = (random(id + 'x') - 0.5) * 900;
          const vy = -400 - random(id + 'y') * 700;
          const x = 540 + (random(id + 'p') - 0.5) * 400 + vx * age;
          const y = 1180 + vy * age + 0.5 * 900 * age * age;
          const rot = random(id + 'r') * 360 + age * 400 * (random(id + 's') - 0.5);
          const o = interpolate(age, [2.4, 3.4], [1, 0], CLAMP);
          return <rect key={id} x={-8} y={-5} width={16} height={9} fill={cols[i % 5]} opacity={o} transform={`translate(${x} ${y}) rotate(${rot})`} />;
        });
      })}
    </g>
  );
};

// ---------- text ----------
const Block = ({from, to, children}: {from: number; to: number; children: React.ReactNode}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const a = interpolate(frame, [from * fps, (from + 0.8) * fps], [0, 1], {...CLAMP, easing: ease});
  const b = interpolate(frame, [(to - 0.5) * fps, to * fps], [1, 0], CLAMP);
  return <div style={{position: 'absolute', left: 80, right: 80, top: 140, opacity: Math.min(a, b), transform: `translateY(${(1 - a) * 50}px)`, color: CH}}>{children}</div>;
};
const Over = ({children}: {children: React.ReactNode}) => (
  <div style={{fontWeight: 300, fontSize: 34, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 30}}>{children}</div>
);
const fmt = (n: number) => n.toLocaleString('en-US');

export const Celebration = (p: CelebrationProps) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const t = frame / fps;
  const count = (s: number, d: number, from: number, to: number) => Math.round(interpolate(frame, [s * fps, (s + d) * fps], [from, to], {...CLAMP, easing: ease}));
  const boost = [4.0, 15.5, 22.0].reduce((acc, b) => (t > b ? acc + Math.exp(-(t - b) / 0.9) : acc), 0);

  const sky = (a: string, b: string) => interpolateColors(t, [0, 16], [a, b]);
  const yachtX = interpolate(t, [0, 4], [900, 0], {...CLAMP, easing: Easing.out(Easing.quad)});
  const yachtBob = Math.sin(frame / 22) * 7;
  const yachtRoll = Math.sin(frame / 30) * 1.1;
  const sunY = interpolate(t, [0, 26], [900, 1070], CLAMP);
  const skylineO = interpolate(t, [8, 11], [0, 1], CLAMP);
  const smallX = interpolate(t, [9, 23], [1300, -300], CLAMP);
  const sceneO = interpolate(t, [25.2, 26.2], [1, 0], CLAMP);
  const endIn = interpolate(t, [26.4, 27.2], [0, 1], {...CLAMP, easing: ease});
  const phase = frame / 18;

  return (
    <AbsoluteFill style={{backgroundColor: '#fff', fontFamily}}>
      {/* end card, revealed when the scene fades out. The logo itself never animates. */}
      <div style={{position: 'absolute', top: 430, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <Img src={staticFile('logo.png')} style={{width: 760, height: 'auto'}} />
      </div>
      <div style={{position: 'absolute', left: 80, right: 80, top: 800, opacity: endIn, transform: `translateY(${(1 - endIn) * 40}px)`, color: CH}}>
        {p.closing.map((l) => (
          <div key={l} style={{fontWeight: 400, fontSize: 150, lineHeight: 1.04}}>{l}</div>
        ))}
        <div style={{height: 3, width: 700, background: CH, margin: '60px 0 36px'}} />
        <div style={{fontWeight: 300, fontSize: 52, color: SLATE}}>{p.url}</div>
      </div>

      <AbsoluteFill style={{opacity: sceneO}}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', inset: 0}}>
          <defs>
            <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={sky(ORANGE, RED)} />
              <stop offset="0.55" stopColor={sky(PEACH, ORANGE)} />
              <stop offset="1" stopColor={sky(CREAM, PEACH)} />
            </linearGradient>
            <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stopColor={CREAM} stopOpacity="0.9" />
              <stop offset="1" stopColor={PEACH} stopOpacity="0" />
            </radialGradient>
            <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#B8301F" />
              <stop offset="0.35" stopColor="#5A2222" />
              <stop offset="1" stopColor={CH} />
            </linearGradient>
          </defs>
          <rect width={W} height={HORIZON + 2} fill="url(#sky)" />
          <circle cx={540} cy={sunY} r={430} fill="url(#glow)" opacity={0.7} />
          <circle cx={540} cy={sunY} r={170} fill={CREAM} />
          <g opacity={skylineO}>
            <Skyline frame={frame} />
            <Palm x={70} scale={0.9} frame={frame} />
            <Palm x={150} scale={0.65} frame={frame} />
            <Palm x={980} scale={0.85} frame={frame} />
          </g>
          <rect y={HORIZON} width={W} height={H - HORIZON} fill="url(#sea)" />
          {/* sun glitter */}
          {Array.from({length: 16}, (_, i) => {
            const w = 360 * (1 - i / 18) + Math.sin(phase + i) * 24;
            return <rect key={i} x={540 - w / 2 + Math.sin(phase * 1.3 + i * 2) * 14} y={HORIZON + 10 + i * i * 1.9} width={w} height={5 + i * 0.5} rx={3} fill={PEACH} opacity={Math.max(0.12, 0.7 - i * 0.04)} />;
          })}
          <SmallYacht x={smallX} />
          <path d={wavePath(1130, 4, 50, phase)} fill="#fff" opacity={0.06} />
          <path d={wavePath(1250, 7, 70, -phase * 1.1)} fill="#fff" opacity={0.05} />
          <path d={wavePath(1360, 9, 90, phase * 0.9)} fill="#000" opacity={0.12} />
          {/* wake */}
          {[0, 1, 2].map((i) => (
            <line key={i} x1={yachtX + 150 - i * 60 - ((frame * 3) % 80)} y1={WATER_Y - 6 + i * 6} x2={yachtX - 80 - i * 120 - ((frame * 3) % 80)} y2={WATER_Y - 4 + i * 6} stroke="#fff" strokeWidth={5} strokeLinecap="round" opacity={0.35} />
          ))}
          {/* yacht */}
          <g transform={`translate(${540 + yachtX} ${WATER_Y + yachtBob}) rotate(${yachtRoll})`}>
            <Yacht frame={frame} boost={boost} />
          </g>
          <path d={wavePath(WATER_Y - 6, 8, 80, phase)} fill="#2B1B1F" opacity={0.92} />
          <path d={wavePath(1600, 11, 110, -phase * 0.8)} fill={CH} opacity={0.94} />
          <path d={wavePath(1760, 12, 130, phase * 0.7)} fill={CH} />
          <Fireworks frame={frame} fps={fps} />
          <Confetti frame={frame} fps={fps} />
        </svg>
        <div style={{position: 'absolute', inset: 0, backgroundImage: GRAIN, mixBlendMode: 'soft-light', opacity: 0.4, pointerEvents: 'none'}} />

        <Block from={0.5} to={4.6}>
          <Over>Inc. {p.year}</Over>
          <div style={{fontWeight: 400, fontSize: 128, lineHeight: 1.05}}>Named to</div>
          <div style={{fontWeight: 400, fontSize: 128, lineHeight: 1.05}}>the Inc. 5000.</div>
        </Block>
        <Block from={5} to={9.6}>
          <Over>Ranked</Over>
          <div style={{fontWeight: 400, fontSize: 176, lineHeight: 1.02}}>No. {fmt(count(5.2, 1.4, 5000, p.rank))}</div>
          <div style={{fontWeight: 300, fontSize: 52, lineHeight: 1.2, marginTop: 24}}>of America's fastest-growing private companies.</div>
        </Block>
        <Block from={10} to={15.2}>
          <Over>Revenue growth</Over>
          <div style={{fontWeight: 400, fontSize: 320, lineHeight: 1}}>{count(10.2, 1.6, 0, p.growth)}%</div>
          <div style={{fontWeight: 300, fontSize: 52, lineHeight: 1.2, marginTop: 24}}>{p.growthWindow}</div>
        </Block>
        <Block from={15.6} to={21.4}>
          <Over>Second year in a row</Over>
          <div style={{fontWeight: 400, fontSize: 140, lineHeight: 1.04}}>Back on</div>
          <div style={{fontWeight: 400, fontSize: 140, lineHeight: 1.04}}>the list.</div>
          <div style={{fontWeight: 300, fontSize: 56, marginTop: 40}}>{p.prevYear} · No. {fmt(p.prevRank)}</div>
          <div style={{fontWeight: 400, fontSize: 56, marginTop: 8}}>{p.year} · No. {fmt(p.rank)}</div>
        </Block>
        <Block from={21.8} to={25.4}>
          <div style={{fontWeight: 400, fontSize: 88, lineHeight: 1.08}}>“{p.quote}”</div>
          <div style={{fontWeight: 300, fontSize: 36, letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 36}}>{p.quoteBy}</div>
        </Block>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
