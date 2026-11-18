import React from 'react';
import { Composition } from 'remotion';
import { BeerFloodShort } from './BeerFlood';
export const Root: React.FC = () => <Composition id="BeerFloodShort" component={BeerFloodShort} durationInFrames={900} fps={30} width={1080} height={1920} />;
