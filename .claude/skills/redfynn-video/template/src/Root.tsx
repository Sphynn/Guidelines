import {Composition} from 'remotion';
import {Announcement, defaultProps, Props} from './Announcement';
import {Celebration, celebrationDefaults} from './Celebration';

const FPS = 30;

const make = (id: string, width: number, height: number) => (
  <Composition
    id={id}
    component={Announcement}
    width={width}
    height={height}
    fps={FPS}
    durationInFrames={FPS * defaultProps.durationSeconds}
    defaultProps={defaultProps}
    calculateMetadata={({props}: {props: Props}) => ({durationInFrames: Math.round(FPS * props.durationSeconds)})}
  />
);

export const Root = () => (
  <>
    {make('Vertical', 1080, 1920)}
    {make('Landscape', 1920, 1080)}
    {make('Square', 1080, 1080)}
    <Composition id="Celebration" component={Celebration} width={1080} height={1920} fps={FPS} durationInFrames={FPS * 28} defaultProps={celebrationDefaults} />
  </>
);
