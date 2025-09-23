import { BrickScenery } from './BrickScenery';

export const ScenerySprites = {
  brick: BrickScenery
};

export type SceneryTheme = keyof typeof ScenerySprites;
export type { ScenerySpriteSet, LayerSpriteSet } from './BrickScenery';