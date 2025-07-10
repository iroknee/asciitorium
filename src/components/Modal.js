import Screen from './Screen.js'

export default class Modal extends Screen {
  constructor(props) {
    super(props)
  }

  close() {
    console.log('closing modal: ', this)
    this.parent.removeComponent(this.id)
  }
}
