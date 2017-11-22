import {
  fetchBranches,
  fetchCommits,
  fetchFileMeta,
  fetchFileContents } from '../services/github'
import {
  extractNames,
  extractMessage,
  extractCommitsFromBranches,
  extractStates } from '../utils/extract'
import { sortNames } from '../utils/sort'

const getResults = async (user) => {
  const branches = await fetchBranches(user).then(extractNames).catch(() => {
    throw 'Not found - repository'
  })
  let results = []
  for (let i = 0; i < branches.length; i += 1) {
    const name = branches[i]
    const commits = await fetchCommits(user, name).then(extractMessage).catch(() => {
      throw 'Not found - commits'
    })
    const state = await fetchFileMeta(user, name).then(fetchFileContents).catch(() => {
      throw 'Not found - file'
    })
    results.push({name, state, commits})
  }

  return results
}

const compareRequirements = (results, requirements) => {
  /* number of branches should match */
  if (results.length < 1 || results.length != requirements.length) {
    throw 'No match - length'
  }
  /* branch names should match */
  if (JSON.stringify(sortNames(extractNames(results))).toLowerCase() !== JSON.stringify(sortNames(extractNames(requirements))).toLowerCase()) {
    throw 'No match - names'
  }
  /* commits array of each branch should match */
  const commitsInResults = extractCommitsFromBranches(results)
  const commitsInRequitements = extractCommitsFromBranches(requirements)
  for (let i in commitsInResults) {
    if (commitsInResults[i].toLowerCase() !== commitsInRequitements[i].toLowerCase()) {
      throw 'No match - commits'
    }
  }
  /* state content of each array should match */
  if (JSON.stringify(sortNames(extractStates(results))).toLowerCase() !== JSON.stringify(sortNames(extractStates(requirements))).toLowerCase()) {
    throw 'No match - states'
  }

  return true
}

const checkStepOne = async (user) => {
  const requirements = [
    {
      name: 'master',
      commits: ['update 3', 'merge branch \'f1\'', 'update 2', 'update 1', 'init'],
      state: 'init,one,two,three\n'
    },
    {
      name: 'f1',
      commits: ['update 2', 'update 1', 'init'],
      state: 'init,one,two\n'
    }
  ]

  let result = false
  try {
    const results = await getResults(user)
    result = compareRequirements(results, requirements)
    console.log('Congrats!')
  } catch (e) {
    console.log(`Error occured: ${e}`)
  }

  return result
}

module.exports = {
  checkStepOne
}
