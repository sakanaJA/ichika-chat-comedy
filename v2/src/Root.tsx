import React from 'react';
import { Composition } from 'remotion';
import { Short } from './Short';
import { TL } from './state';

export const Root: React.FC = () => (
  <Composition id="Short" component={Short} width={1080} height={1920} fps={30} durationInFrames={Math.ceil(TL.duration * 30)} />
);
