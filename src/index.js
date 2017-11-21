import rp from 'request-promise'

const fetchBranches = () => {
  const options = {
      uri: 'https://api.github.com/repos/jacekelgda/uq_git_w1_student/branches',
      headers: {
          'User-Agent': 'Request-Promise'
      },
      json: true
  }
  rp(options)
    .then((response) => {
        for ( let i=0; i<response.length; i+=1 ) {
          console.log(response[i].name)
        }
    })
    .catch((err) => {
        console.log(err)
    });
}

fetchBranches()
