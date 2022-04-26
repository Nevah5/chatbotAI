const spacer = "."
const filled = ">"
const size = 30
var update = -1

exports.render = (data, startedTime, iterations) => {
  let timeElapsed = new Date - startedTime
  let percentage = 100 / iterations * data.iteration

  if(Math.floor(timeElapsed / 1000) == update) return //continue every second
  update = Math.floor(timeElapsed / 1000)

  //clear last
  process.stdout.clearLine(0)
  process.stdout.cursorTo(0)

  //print bar
  let bar = `[ ${filled.repeat(size / 100 * percentage)}${spacer.repeat(size - Math.floor((size / 100 * percentage)))} ]`
  let estimated = (timeElapsed / percentage * 100)
  let remaining = this.calculateReadableTime((estimated - timeElapsed))
  let remainingOutput = remaining === Infinity ? `(Unknown time left)` : `(~${remaining} remaining)`

  process.stdout.write(`${bar} ${percentage.toFixed(2)}% - ${Math.floor(timeElapsed / 1000)}s elapsed ${remainingOutput}`)

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

exports.calculateReadableTime = ms => {
  if(ms === Infinity) return Infinity

  let string = ""

  let seconds = Math.floor(ms / 1000)
  let minutes = Math.floor(seconds / 60)
  seconds -= minutes * 60
  let hours = Math.floor(minutes / 60)
  minutes -= hours * 60

  string += hours != 0 ? `${hours}h` : ""
  string += minutes != 0 ? ` ${minutes}m` : ""
  string += ` ${seconds}s`

  return string.trimStart()
}