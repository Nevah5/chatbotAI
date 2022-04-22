const spacer = "."
const filled = ">"
const size = 30
var update = -1

exports.render = (data, startedTime, iterations) => {
  let timeElapsed = (new Date - startedTime) / 1000
  let percentage = 100 / iterations * data.iteration

  if(Math.floor(timeElapsed) == update) return
  update = Math.floor(timeElapsed)

  //clear last
  process.stdout.clearLine(0)
  process.stdout.cursorTo(0)

  //print bar
  let bar = `[ ${filled.repeat(size / 100 * percentage)}${spacer.repeat(size - Math.floor((size / 100 * percentage)))} ]`
  let estimated = (timeElapsed / percentage * 100).toFixed(2)
  let remaining = this.calculateReadableTime((estimated - timeElapsed).toFixed(2))
  let remainingOutput = remaining !== "Infinityh Infinitym NaNs" ? ` (~${remaining} remaining)` : ``

  process.stdout.write(`${bar} ${percentage.toFixed(2)}% - ${Math.floor(timeElapsed)}s${remainingOutput}`)

  //write new line when finished
  if(percentage == 100) process.stdout.write("\n")
}

exports.finished = startedTime => {
  //clear last
  process.stdout.clearLine(0)
  process.stdout.cursorTo(0)

  let bar = `[ ${filled.repeat(size)} ]`
  process.stdout.write(`${bar} 100.00% - ${Math.floor((new Date - startedTime) / 1000)}s\n`)
}

exports.calculateReadableTime = seconds => {
  let string = ""

  let hours =  Math.floor(seconds / 60 / 60)
  let minutes = Math.floor(seconds / 60)
  let secs = parseFloat(seconds)

  secs -= hours >= 1 ? hours * 60 * 60 : 0
  secs -= minutes >= 1 ? minutes * 60 : 0

  string += hours >= 1 ? `${hours}h` : ""
  string += minutes >= 1 ? ` ${minutes}m` : ""
  string += ` ${secs.toFixed(2)}s`

  return string.trimStart()
}