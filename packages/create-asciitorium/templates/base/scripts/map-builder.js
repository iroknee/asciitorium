import fs from 'fs/promises'
import process from 'process'
import path from 'path'

function parseArgs() {
  const args = process.argv.slice(2)
  
  // Check for flags
  let smooth = false
  let filteredArgs = []
  
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--smooth' || args[i] === '--unicode') {
      smooth = true
    } else {
      filteredArgs.push(args[i])
    }
  }
  
  if (filteredArgs.length !== 3) {
    console.error('Usage: node map-builder.js <width> <height> <directory-name> [--smooth]')
    console.error('Example: node map-builder.js 10 10 dungeon-level-1 --smooth')
    console.error('Maps will be saved to public/art/maps/<directory-name>/map.art')
    console.error('Use --smooth flag to enable Unicode box drawing characters')
    process.exit(1)
  }
  
  const width = parseInt(filteredArgs[0])
  const height = parseInt(filteredArgs[1])
  const directoryName = filteredArgs[2]

  if (isNaN(width) || width <= 0) {
    console.error('Width must be a positive integer')
    process.exit(1)
  }

  if (isNaN(height) || height <= 0) {
    console.error('Height must be a positive integer')
    process.exit(1)
  }

  // Construct the full path to the map directory
  const mapDir = path.join(process.cwd(), '../public/art/maps', directoryName)
  const fullPath = path.join(mapDir, 'map.art')

  return { width, height, filename: fullPath, mapDir, smooth }
}

class MapBuilder {
  // Map is a 2D array of chars.
  // example 10x10 grid = [
  //      0123456789012345678
  //    0'+-0-+---+---+---+---+',
  //    1'0 1 2 3 4 5 6 7 8 9 |',
  //    2'+-2-+---+---+---+---+',
  //    3'| 3 |   |           |',
  //    4'+-4-+   +   +   +   +',
  //    5'| 5 |       |   |   |',
  //    6'+-6-+   +---+   +   +',
  //    7'| 7 |   |       |   |',
  //    8'+-8-+   +   +---+   +',
  //    9'| 9 |   |           |',
  //     '+---+---+---+---+---+',
  //     ]
  // is actually a 11x19 2d array
  // conversion: y = y, x = x*2
  // only place items and creatures on odd values of y and x

  constructor(width, height, fileName, mapDir, smooth = false) {
    this.fileName = fileName
    this.mapDir = mapDir
    this.width = width
    this.height = height
    this.smooth = smooth
    this.map = []
  }

  async build() {
    console.log(`--- building Map (${this.width}x${this.height}) ---`)

    try {
      this.map = this.createMap()
      console.log(' - created base Map')

      // Add rooms
      this.addRooms()
      console.log(' - added rooms')

      // Smooth the Map with Unicode box drawing characters (if requested)
      if (this.smooth) {
        this.mapUpdate(this.map)
        console.log(' - smoothed Map appearance with Unicode characters')
      }

      // Save the Map to text file
      await this.saveToText()
      console.log('--- Map build complete ---')
    } catch (error) {
      console.error(`Error building Map: ${error.message}`)
      console.error(error)
    }
  }

  async saveToText() {
    try {
      // Ensure the map directory exists
      await fs.mkdir(this.mapDir, { recursive: true })
      
      // Join the map array with newlines to create plain text
      const textOutput = this.map.join('\n')
      
      await fs.writeFile(this.fileName, textOutput, 'utf-8')
      console.log(` - successfully wrote map data to ${this.fileName}`)
    } catch (error) {
      console.error(`Error writing text to file: ${error.message}`)
    }
  }

  xOffset(x) {
    return x * 4 + 2
  }

  yOffset(y) {
    return y * 2 + 1
  }

  // Doors are placed at all dead ends with openings to the north and south.
  addRooms() {
    for (let y = 0; y < this.height; y++) {
      const yPos = this.yOffset(y)
      for (let x = 0; x < this.width; x++) {
        const xPos = this.xOffset(x)
        this.replaceSpacesWithDoors(xPos, yPos)
      }
    }
  }

  // identify dead ends to the north or south.
  // If there is a dead end to the north or south, then specify the x and y position of the opening.
  replaceSpacesWithDoors(xPos, yPos) {
    if (this.map[yPos][xPos] != ' ') return
    const wallDirections = []
    if (this.map[yPos][xPos - 2] != ' ' && this.map[yPos][xPos - 2] != 'o') wallDirections.push('west')
    if (this.map[yPos][xPos + 2] != ' ' && this.map[yPos][xPos + 2] != 'o') wallDirections.push('east')
    if (this.map[yPos - 1][xPos] != ' ' && this.map[yPos - 1][xPos] != 'o') wallDirections.push('north')
    if (this.map[yPos + 1][xPos] != ' ' && this.map[yPos + 1][xPos] != 'o') wallDirections.push('south')
    if (wallDirections.length == 3) {
      if (wallDirections.includes('north') && !wallDirections.includes('south')) {
        this.map[yPos + 1] = this.replaceAt(this.map[yPos + 1], xPos - 1, '-')
        this.map[yPos + 1] = this.replaceAt(this.map[yPos + 1], xPos, 'o')
        this.map[yPos + 1] = this.replaceAt(this.map[yPos + 1], xPos + 1, '-')
      } else if (!wallDirections.includes('north') && wallDirections.includes('south')) {
        this.map[yPos - 1] = this.replaceAt(this.map[yPos - 1], xPos - 1, '-')
        this.map[yPos - 1] = this.replaceAt(this.map[yPos - 1], xPos, 'o')
        this.map[yPos - 1] = this.replaceAt(this.map[yPos - 1], xPos + 1, '-')
      }
    }
  }

  replaceAt(string, index, replacement) {
    return string.substr(0, index) + replacement + string.substr(index + replacement.length)
  }

  mapUpdate(map) {
    const copy = [...map]
    for (let y = 0; y < copy.length; y++) {
      for (let x = 0; x < copy[y].length; x++) {
        if (copy[y][x] === '-') copy[y] = copy[y].substring(0, x) + '─' + copy[y].substring(x + 1)
        if (copy[y][x] === '|') copy[y] = copy[y].substring(0, x) + '│' + copy[y].substring(x + 1)
        if (copy[y][x] === '+') {
          let north = y > 0 && copy[y - 1][x] !== ' '
          let south = y < copy.length - 1 && copy[y + 1][x] !== ' '
          let west = x > 0 && copy[y][x - 1] !== ' '
          let east = x < copy[y].length - 1 && copy[y][x + 1] !== ' '
          if (north && south && west && east) copy[y] = copy[y].substring(0, x) + '┼' + copy[y].substring(x + 1)
          else if (north && south && west) copy[y] = copy[y].substring(0, x) + '┤' + copy[y].substring(x + 1)
          else if (north && south && east) copy[y] = copy[y].substring(0, x) + '├' + copy[y].substring(x + 1)
          else if (north && east && west) copy[y] = copy[y].substring(0, x) + '┴' + copy[y].substring(x + 1)
          else if (south && east && west) copy[y] = copy[y].substring(0, x) + '┬' + copy[y].substring(x + 1)
          else if (north && south) copy[y] = copy[y].substring(0, x) + '│' + copy[y].substring(x + 1)
          else if (west && east) copy[y] = copy[y].substring(0, x) + '─' + copy[y].substring(x + 1)
          else if (north && east) copy[y] = copy[y].substring(0, x) + '╰' + copy[y].substring(x + 1)
          else if (north && west) copy[y] = copy[y].substring(0, x) + '╯' + copy[y].substring(x + 1)
          else if (south && east) copy[y] = copy[y].substring(0, x) + '╭' + copy[y].substring(x + 1)
          else if (south && west) copy[y] = copy[y].substring(0, x) + '╮' + copy[y].substring(x + 1)
          else if (east) copy[y] = copy[y].substring(0, x) + '╶' + copy[y].substring(x + 1)
          else if (west) copy[y] = copy[y].substring(0, x) + '╴' + copy[y].substring(x + 1)
          else if (north) copy[y] = copy[y].substring(0, x) + '╵' + copy[y].substring(x + 1)
          else if (south) copy[y] = copy[y].substring(0, x) + '╷' + copy[y].substring(x + 1)
        }
      }
    }
    this.map = copy
  }

  createMap() {
    // Establish variables and starting grid
    const totalCells = this.height * this.width
    const unvisited = [] // cells that are unvisited.
    const map = []
    for (let y = 0; y < this.height; y++) {
      unvisited[y] = []
      map[y * 2] = ''
      map[y * 2 + 1] = ''
      for (let x = 0; x < this.width; x++) {
        map[y * 2] += '+---'
        map[y * 2 + 1] += '|   '
        unvisited[y][x] = true
      }
      map[y * 2] += '+'
      map[y * 2 + 1] += '|'
    }
    map[this.height * 2] = ''
    for (let x = 0; x < this.width; x++) {
      map[this.height * 2] += '+---'
    }
    map[this.height * 2] += '+'

    // Set a random position to start from
    let current = [Math.floor(Math.random() * this.height), Math.floor(Math.random() * this.width)]
    const path = [current]
    unvisited[current[0]][current[1]] = false
    let visited = 1

    // // Loop through all available cell positions (given walls take up half the cells, we divide the total by two)
    while (visited < totalCells) {
      // Determine neighboring cells (0,1) and pathways to them (2,3)
      const south = [current[0] - 1, current[1], 'north']
      const north = [current[0] + 1, current[1], 'south']
      const east = [current[0], current[1] - 1, 'west']
      const west = [current[0], current[1] + 1, 'east']
      const possibleNeighbors = [south, north, east, west]
      const neighbors = []

      // Determine if each neighboring cell is in game grid, and whether it has already been checked
      for (let i = 0; i < possibleNeighbors.length; i++) {
        if (
          possibleNeighbors[i][0] > -1 &&
          possibleNeighbors[i][0] < this.height &&
          possibleNeighbors[i][1] > -1 &&
          possibleNeighbors[i][1] < this.width &&
          unvisited[possibleNeighbors[i][0]][possibleNeighbors[i][1]] == true
        ) {
          neighbors.push(possibleNeighbors[i])
        }
      }

      // If at least one active neighboring cell has been found
      if (neighbors.length > 0) {
        // Choose one of the neighbors at random
        const next = neighbors[Math.floor(Math.random() * neighbors.length)]

        // Remove the wall between the current cell and the chosen neighboring cell in the map view.
        // split map
        let xBorderToRemove = 0
        let yBorderToRemove = 0
        if (next[2] == 'south') {
          yBorderToRemove = this.yOffset(next[0]) - 1
          xBorderToRemove = this.xOffset(next[1])
          map[yBorderToRemove] = this.replaceAt(map[yBorderToRemove], xBorderToRemove - 1, ' ')
          map[yBorderToRemove] = this.replaceAt(map[yBorderToRemove], xBorderToRemove + 1, ' ')
        } else if (next[2] == 'north') {
          yBorderToRemove = this.yOffset(next[0]) + 1
          xBorderToRemove = this.xOffset(next[1])
          map[yBorderToRemove] = this.replaceAt(map[yBorderToRemove], xBorderToRemove - 1, ' ')
          map[yBorderToRemove] = this.replaceAt(map[yBorderToRemove], xBorderToRemove + 1, ' ')
        } else if (next[2] == 'east') {
          yBorderToRemove = this.yOffset(next[0])
          xBorderToRemove = this.xOffset(next[1]) - 2
        } else if (next[2] == 'west') {
          yBorderToRemove = this.yOffset(next[0])
          xBorderToRemove = this.xOffset(next[1]) + 2
        }

        map[yBorderToRemove] = this.replaceAt(map[yBorderToRemove], xBorderToRemove, ' ')

        // Mark the neighbor as visited, and set it as the current cell
        current = next
        unvisited[current[0]][current[1]] = false
        visited++
        path.push(current)
      }
      // Otherwise go back up a step and keep going
      else {
        current = path.pop()
      }
    }
    return map
  }
}

const { width, height, filename, mapDir, smooth } = parseArgs()
const builder = new MapBuilder(width, height, filename, mapDir, smooth)
builder.build()
