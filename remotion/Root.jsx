import React from 'react';
import { Composition } from 'remotion';
import { CosmicAd } from './CosmicAd';
import { MangaAd } from './MangaAd';
import { PremiumAd } from './PremiumAd';

export const Root = () => (
  <>
    <Composition
      id="CosmicAd"
      component={CosmicAd}
      durationInFrames={960}
      fps={30}
      width={1080}
      height={1920}
    />
    <Composition
      id="MangaAd"
      component={MangaAd}
      durationInFrames={480}
      fps={30}
      width={1080}
      height={1920}
    />
    <Composition
      id="PremiumAd"
      component={PremiumAd}
      durationInFrames={480}
      fps={30}
      width={1080}
      height={1920}
    />
  </>
);
