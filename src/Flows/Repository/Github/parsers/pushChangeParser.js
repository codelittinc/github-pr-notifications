const parse = (json) => {
  const branchNameMatches = json.ref.match(/refs\/heads\/(.*)/);

  return {
    branchName: branchNameMatches ? branchNameMatches[1] : null,
    repositoryName: json.repository.name
  }
}

export default {
  parse
}