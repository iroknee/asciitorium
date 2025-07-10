import Component from './Component.js'
import state from '../game/SharedState.js'

export default class Tabs extends Component {
  constructor(props) {
    super(props)
    this.tabs = props.tabs || []
    this.selectedTab = state.get(this.id + '-SelectedTab')
    if (this.selectedTab === undefined) this.selectedTab = props.defaultSelectedTab
    if (this.selectedTab === undefined) this.selectedTab = 0
    this.activeGrid = this.tabs[this.selectedTab].grid
    this._build()
  }

  _build() {
    this.clear()
    let tabLine1 = '╭'
    let tabLine2 = '⏐'
    let tabLine3 = '╰'

    let highlight = false
    for (let i = 0; i < this.tabs.length; i++) {
      const name = this.tabs[i].name
      tabLine1 += '⎯' + '⎯'.repeat(name.length) + '⎯┬'
      let tabLabel = ' ' + name + ' '
      if (i === this.selectedTab) {
        highlight = { x: tabLine2.length, y: 1, length: tabLabel.length }
      }
      tabLine2 += tabLabel + '⏐'
      tabLine3 += '⎯' + '⎯'.repeat(name.length) + '⎯┴'
    }
    tabLine1 = tabLine1.slice(0, -1) + '╮'
    tabLine2 = tabLine2.slice(0, -1) + '⏐'
    tabLine3 = tabLine3.slice(0, -1) + '╯'

    const tabBlock = [tabLine1, tabLine2, tabLine3]
    this.add({ x: 'center', y: 0, block: tabBlock, highlight })

    this.add({ x: 'center', y: 4, grid: this.activeGrid })
  }

  keyPressed(e) {
    if (e.key === 'a' || e.key === 'ArrowLeft') {
      if (this.selectedTab > 0) {
        this.selectedTab--
        state.set({ key: this.id + '-SelectedTab', value: this.selectedTab })
        this.activeGrid = this.tabs[this.selectedTab].grid
        this._build()
      }
    } else if (e.key === 'd' || e.key === 'ArrowRight') {
      if (this.selectedTab < this.tabs.length - 1) {
        this.selectedTab++
        state.set({ key: this.id + '-SelectedTab', value: this.selectedTab })
        this.activeGrid = this.tabs[this.selectedTab].grid
        this._build()
      }
    } else {
      console.log('Tabs keyPressed:', e.key)
      this.activeGrid.keyPressed(e)
    }
  }
}
