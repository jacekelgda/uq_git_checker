import rp from 'request-promise'

const dotenv = require('dotenv').config()
const DEFAULT_REPO = 'uq_git_w1_student'
const DEFAULT_FILE = 'state.txt'

/* github service */
const commonOptions = {
  headers: {
    'User-Agent': 'Request-Promise',
    'Authorization': `token ${process.env.GITHUB_API_TOKEN}`
  },
  json: true
}

const fetchBranches = (user, repo = null) => {
  repo = repo || DEFAULT_REPO
  const options = commonOptions
  options.uri = `https://api.github.com/repos/${user}/${repo}/branches`
  return rp(options)
}

const fetchCommits = (user, branch, repo = null) => {
  repo = repo || DEFAULT_REPO
  const options = commonOptions
  options.uri = `https://api.github.com/repos/${user}/${repo}/commits?sha=${branch}`
  return rp(options)
}

const fetchFileMeta = (user, branch = null, repo = null, file = null) => {
  repo = repo || DEFAULT_REPO
  file = file || DEFAULT_FILE
  const options = commonOptions
  options.uri = `https://api.github.com/repos/${user}/${repo}/contents/${file}?ref=${branch}`
  return rp(options)
}

const fetchFileContents = (fileMeta) => {
  const options = commonOptions
  options.uri = fileMeta.download_url
  return rp(options)
}
/* github service */

/* util: extractors */
const extractNames = objectArray => objectArray.map(a => a.name)
const extractStates = objectArray => objectArray.map(a => a.state)
const extractMessage = objectArray => objectArray.map(a => a.commit.message)
const stringifyArray = array => JSON.stringify(array)
const sortNames = (content) => {
  return content.sort((a, b) => {
    if(a < b) return -1;
    if(a > b) return 1;
    return 0;
  })
}
const extractCommitsFromBranches = objectArray => {
  let results = {}
  for (let i = 0; i < objectArray.length; i += 1) {
    results[objectArray[i].name] = stringifyArray(objectArray[i].commits)
  }
  return results
}
/* util: extractors */

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

  try {
    const results = await getResults(user)
    const result = compareRequirements(results, requirements)
    console.log('Congrats!')
  } catch (e) {
    console.log(`Error occured: ${e}`)
  }
}
