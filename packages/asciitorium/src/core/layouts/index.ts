import { LayoutRegistry } from './LayoutStrategy';
import { HorizontalLayoutStrategy } from './HorizontalLayoutStrategy';
import { VerticalLayoutStrategy } from './VerticalLayoutStrategy';
import { AbsoluteLayoutStrategy } from './AbsoluteLayoutStrategy';

// Register all available layout strategies
LayoutRegistry.register('horizontal', HorizontalLayoutStrategy);
LayoutRegistry.register('vertical', VerticalLayoutStrategy);
LayoutRegistry.register('absolute', AbsoluteLayoutStrategy);
