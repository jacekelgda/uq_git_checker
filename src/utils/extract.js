const extractNames = objectArray => objectArray.map(a => a.name)

const extractStates = objectArray => objectArray.map(a => a.state)

const extractMessage = objectArray => objectArray.map(a => a.commit.message)

const extractCommitsFromBranches = objectArray => {
  let results = {}
  for (let i = 0; i < objectArray.length; i += 1) {
    results[objectArray[i].name] = JSON.stringify((objectArray[i].commits))
  }
  return results
}

module.exports = {
  extractNames,
  extractStates,
  extractMessage,
  extractCommitsFromBranches
}
