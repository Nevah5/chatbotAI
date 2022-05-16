const validate = input => {
  if(input === null) return false
  if(input === undefined) return false
  if(input === "undefined") return false
  if(input === "") return false
  return true
}

module.exports = validate