import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, Easing} from 'remotion';
import {loadFont as loadOswald} from '@remotion/google-fonts/Oswald';
import {loadFont as loadRaleway} from '@remotion/google-fonts/Raleway';

const oswald = loadOswald().fontFamily;
const raleway = loadRaleway().fontFamily;

// Colors from Style-Guide.html
const REDFYNN_RED = '#90191B';
const BLACK = '#000000';
const WHITE = '#FFFFFF';

const ease = Easing.out(Easing.cubic);
const reveal = (frame: number, start: number, len = 24) =>
  interpolate(frame, [start, start + len], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});

const Line = ({children, start, size, family, color, weight}: {children: string; start: number; size: number; family: string; color: string; weight: number}) => {
  const frame = useCurrentFrame();
  const p = reveal(frame, start);
  return (
    <div style={{overflow: 'hidden', paddingBottom: 12}}>
      <div style={{fontFamily: family, fontSize: size, fontWeight: weight, color, lineHeight: 1.05, textTransform: 'uppercase', letterSpacing: 2, opacity: p, transform: `translateY(${(1 - p) * 60}px)`}}>
        {children}
      </div>
    </div>
  );
};

export const Inc5000 = () => {
  const frame = useCurrentFrame();
  const bar = reveal(frame, 40, 30);
  return (
    <AbsoluteFill style={{backgroundColor: WHITE}}>
      {/* Logo stays static: the guide says no animation, no opacity change, no effects */}
      <div style={{position: 'absolute', top: 220, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <Img src={staticFile('RedFynn.png')} style={{width: 760, height: 'auto'}} />
      </div>
      <div style={{position: 'absolute', top: 760, left: 90, right: 90}}>
        <Line start={20} size={150} family={oswald} color={BLACK} weight={600}>Inc. 5000,</Line>
        <Line start={40} size={150} family={oswald} color={REDFYNN_RED} weight={600}>two years</Line>
        <Line start={60} size={150} family={oswald} color={REDFYNN_RED} weight={600}>running</Line>
        <div style={{height: 12, width: 720 * bar, backgroundColor: BLACK, marginTop: 40}} />
        <div style={{marginTop: 40, fontFamily: raleway, fontSize: 46, color: '#363636', opacity: reveal(frame, 95)}}>
          RedFynn Technologies
        </div>
      </div>
    </AbsoluteFill>
  );
};
