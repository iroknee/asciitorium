export default class ContentFormatter {
  constructor(props = {}) {
    const { width } = props
    this.width = width
  }

  format(text) {}

  _wrapText(text) {
    const words = text.split(' ')
    const lines = []
    let line = ''
    for (let i = 0; i < words.length; i++) {
      const word = words[i]
      if (word === '⏎') {
        lines.push(line)
        line = ''
      } else if (line.length + word.length + 1 < width) {
        line += `${word} `
      } else {
        lines.push(line)
        line = `${word} `
      }
    }
    lines.push(line)
    return lines
  }
}
