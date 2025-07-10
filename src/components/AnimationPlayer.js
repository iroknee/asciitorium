import Component from './Component.js'
import state from '../game/SharedState.js'

/**
 * @typedef {Object} AnimationProps
 * @property {string} [id] - Unique identifier for the animation. Generated if not provided.
 * @property {Array} [frames] - Array of frame images.
 * @property {number} [loop=0] - Number of times to loop the animation (-1 for infinite).
 * @property {number} [frameSpeed=100] - Duration of each frame in milliseconds.
 * @property {boolean} [backfill=false] - Whether to backfill the background color.
 * @property {string} [color] - Color of the frames.
 * @property {string} [sound] - URL of the sound to play.
 * @property {boolean} [autoPlay=false] - Whether to start playing immediately.
 * @property {string} [message] - Message to display during animation.
 */

// Class to hold a set of images that make up a moving sprite.  This component can't be changed after
// being created.  If you need to get get rid of it, use thie kill method.
export default class AnimationPlayer extends Component {
  constructor(props) {
    // generate an id if it doesn't exist
    if (!props.id) props.id = `Animation_${Math.floor(Math.random() * 1000000)}`

    super(props)

    const { frames, loop, frameSpeed, backfill, color, sound, autoPlay, message } = props
    this.color = color || undefined
    this.sound = sound || undefined
    this.message = message || undefined
    this.frames = frames || [] // frames for this animation.
    this.loop = loop || 0 // number of times to loop the animation.
    this.frameSpeed = frameSpeed || 100 // play speed, in milliseconds.
    this.backfill = backfill || false
    if (autoPlay) this.play()
  }

  async play() {
    if (this.sound) new Audio(this.sound).play()
    if (this.message) state.set({ key: 'message.center', value: this.message })
    while (this.loop > -1) {
      for (let i = 0; i < this.frames.length; i++) {
        const frame = this.frames[i]
        this.add({
          x: 'center',
          y: 0,
          block: frame,
          backfill: this.backfill,
          color: this.color
        })
        // console.log('AnimationPlayer.play:', this.id)
        state.set({ key: 'request.screen.draw', value: true })
        // Pause the functioning thread
        if (this.frameSpeed > 0) await new Promise((resolve) => setTimeout(resolve, this.frameSpeed))
      }
      this.loop--
    }
  }

  // Stop the animation and remove the grid from the parent.
  async kill() {
    this.loop = -1
    if (this.parent) this.parent.removeComponent(this.id)
  }
}
