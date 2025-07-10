import Component from './Component.js'

export default class Screen extends Component {
  constructor(props) {
    const { id, width, height } = props
    if (!id) props.id = 'Screen'
    if (!width) props.width = 80
    if (!height) props.height = 42
    super(props)
  }

  keyPressed(e) {
    console.log(
      `key press '${e.key}' seen by ${this.id} screen... you should override this method in your screen class`
    )
  }
}
