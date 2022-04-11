const spacer = "."
const filled = ">"
const size = 30
var last = 0

exports.render = (percentage, startedTime) => {
  if(Math.floor(percentage) == last) return
  last = percentage

  //clear last
  process.stdout.clearLine(0)
  process.stdout.cursorTo(0)

  //print bar
  let bar = `[ ${filled.repeat(size / 100 * percentage)}${spacer.repeat(size - Math.floor((size / 100 * percentage)))} ]`
  let duration = ((new Date - startedTime) / 1000).toFixed(2)
  let estimated = (duration / percentage * 100).toFixed(2)
  let remaining = calculateReadableTime((estimated - duration).toFixed(2))
  process.stdout.write(`${bar} ${percentage}% - ${duration}s (~${remaining} remaining)`);

  //write new line when finished
  if(percentage == 100) process.stdout.write("\n")
}

const calculateReadableTime = seconds => {
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