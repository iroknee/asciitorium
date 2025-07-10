import Component from '../Component.js'
import state from '../game/SharedState.js'

export default class Alert extends Component {
  constructor(props) {
    if (!props || !props.message) throw new Error('Alert must have a message')
    if (!props.sound) props.sound = 'sounds/nope.mp3'
    if (!props.displayTime) props.displayTime = 2000
    props.width = props.message.length + 6
    if (!props.height) props.height = 5
    if (!props.border) props.border = true
    super(props)
    this.add({ x: 'center', y: 'center', string: props.message })
    new Audio(props.sound).play()
    setTimeout(() => {
      if (this.parent) this.parent.removeComponent(this.id)
      state.set({ key: 'request.screen.draw', value: true })
    }, props.displayTime)
  }
}
