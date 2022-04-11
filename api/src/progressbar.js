var last = 0

exports.render = (percentage, startedTime) => {
  if(Math.floor(percentage) == last) return
  last = percentage
  // process.stdout.clearLine(0)
  // process.stdout.cursorTo(0)

  let filled = ">"
  let spacer = "-"
  let size = 20

  let bar = `[${filled.repeat(size / 100 * percentage)}${spacer.repeat(size - (size / 100 * percentage))}]`

  process.stdout.write(`\r${bar} ${percentage}% - ${Math.round((new Date - startedTime) / 100) / 10} sec\n`);
  // process.stdout.write("Estimated time remaining: 15 seconds\n");
}