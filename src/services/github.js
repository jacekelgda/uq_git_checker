import rp from 'request-promise'
import dotenv from 'dotenv'

const DEFAULT_REPO = 'uq_git_w1_student'
const DEFAULT_FILE = 'state.txt'

dotenv.config()

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

module.exports = {
  fetchBranches,
  fetchCommits,
  fetchFileMeta,
  fetchFileContents
}
