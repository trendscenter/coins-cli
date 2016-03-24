# coins-cli

Perform bulk operations on COINS code and services

## install
`npm i -g coins-cli`

## usage

run `coins` to get a help page

```
cdieringer@localcoin:~$ coins

  Usage: coins [options] [command]


  Commands:

    git [action]       perform bulk git operations on one or more coins packages
    services [action]  manage coins services
    help [cmd]         display help for [cmd]

  Options:

    -h, --help     output usage information
    -V, --version  output the version number

    Please provide a git command (e.g. pull, push, checkout, etc), or
    a service command.

    Examples:

	coins git checkout release
	coins services status
```

now run something!
