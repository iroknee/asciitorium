import Component from './Component.js'
import state from '../game/SharedState.js'

export default class ProgressBar extends Component {
  constructor(props) {
    if (!props || !props.stateKey) throw new Error('ProgressBar must have a state key to subscribe to')
    if (!props.width) props.width = 22
    if (!props.height) props.height = 4
    if (!props.border) props.border = false
    super(props)
    this.update(state.get(props.stateKey))
    this.cleared = true

    state.subscribe({
      key: props.stateKey,
      callback: this.update.bind(this)
    })
  }

  _calcBar(current, max) {
    let bar = Math.round((current / max) * 20)
    if (bar < 0) bar = 0
    return '⎹' + '█'.repeat(bar) + ' '.repeat(20 - bar) + '⎸'
  }

  update(data) {
    if (!this.cleared) {
      this.clear()
      this.cleared = true
    }
    if (data) {
      this.add({ x: 0, y: 0, string: data.label })
      this.add({ x: 1, y: 1, string: '⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽' })
      this.add({
        x: 0,
        y: 2,
        string: this._calcBar(data.current, data.max)
      })
      this.add({ x: 1, y: 3, string: '⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺' })
      this.cleared = false
    }
  }
}
