import {Composition} from 'remotion';
import {Inc5000} from './Inc5000';

export const Root = () => (
  <Composition id="Inc5000" component={Inc5000} durationInFrames={180} fps={30} width={1080} height={1920} />
);
