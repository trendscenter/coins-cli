const firstLine = (str) => {
  return (str || '').split('\n')[0]
}

module.exports = (verbose, stderr, stdout) => {
  console.log('is verbose?', verbose)
  const output = stdout + stderr
  if (verbose) return output
  return firstLine(stdout) + firstLine(stderr)
}
