export default class AudioPlayer {
  constructor(audio) {
    this.audio = new Audio(audio)
  }

  play(props) {
    if (!props) props = {}
    const { loop, volume } = props
    this.audio.loop = loop || false
    this.audio.volume = volume || 1.0
    this.audio.play()
  }

  stop() {
    this.audio.pause()
  }

  fadeOut(duration) {
    const audioElement = this.audio
    const originalVolume = audioElement.volume // Store the original volume
    const fadeOutInterval = 50 // Milliseconds for interval
    const volumeStep = originalVolume / (duration / fadeOutInterval) // Calculate the volume decrement step

    const fadeAudio = setInterval(function () {
      // Reduce the volume
      if (audioElement.volume > volumeStep) {
        audioElement.volume -= volumeStep
      } else {
        // When volume is close to zero, stop the interval and set volume to 0
        audioElement.volume = 0
        clearInterval(fadeAudio)
        // Pause and reset audio if needed
        audioElement.pause()
        audioElement.currentTime = 0
      }
    }, fadeOutInterval)
  }
}
