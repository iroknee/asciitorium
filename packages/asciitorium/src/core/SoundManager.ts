import { isWebEnvironment } from './environment.js';

export class SoundManager {
  private static audioCache: Map<string, HTMLAudioElement> = new Map();
  private static enabled: boolean = true;

  static setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  static isEnabled(): boolean {
    return this.enabled;
  }

  static async playSound(soundPath: string): Promise<void> {
    // Only play sounds in web environment
    if (!isWebEnvironment()) {
      return;
    }

    if (!this.enabled) {
      return;
    }

    try {
      // Check cache first
      let audio = this.audioCache.get(soundPath);

      if (!audio) {
        // Create new audio element
        audio = new Audio(`art/sounds/${soundPath}`);
        this.audioCache.set(soundPath, audio);
      }

      // Clone the audio element to allow overlapping sounds
      const audioClone = audio.cloneNode() as HTMLAudioElement;
      await audioClone.play();
    } catch (error) {
      console.warn(`Failed to play sound "${soundPath}":`, error);
    }
  }

  static clearCache(): void {
    this.audioCache.clear();
  }
}
