// Test setup file for Vitest
// This file runs before all tests

// Mock environment functions that require Node.js or browser APIs
import { vi } from 'vitest';

// Mock loadArt function for testing
vi.mock('../core/environment', async () => {
  const actual = await vi.importActual('../core/environment');
  return {
    ...actual,
    loadArt: vi.fn().mockResolvedValue('Mocked art content'),
    isState: actual.isState,
  };
});

// Mock render scheduler to prevent actual rendering in tests
vi.mock('../core/RenderScheduler', () => ({
  requestRender: vi.fn(),
  RenderScheduler: class MockRenderScheduler {
    static scheduleRender = vi.fn();
    static cancelScheduledRender = vi.fn();
  },
}));

// Global test timeout
vi.setConfig({ testTimeout: 5000 });