// core/bootstrap.ts
import type { App } from './App';
import { setRenderCallback } from './RenderScheduler';
import { setupKeyboardHandling, validateWebEnvironment } from './utils';

export async function start(app: App): Promise<void> {
  validateWebEnvironment();
  await setupKeyboardHandling((key) => app.handleKey(key));
  setRenderCallback(() => app.render());
}
