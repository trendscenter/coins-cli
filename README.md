# coins-cli

## install
`npm i -g coins-cli`

## usage
By default, running `coins` outputs sys status.
```bash
cdieringer@localcoin:/coins/coins-cli$ coins

Services:
SERVICE            UP
apache2            up
coinsnodeapi       up
webpack-dev-server up
nginx              up

Git:
All branches compared to coins_core branch: develop
REPO            BRANCH
blockly         invalid directory: /coins/www/html/blockly
portals         develop
closure-library invalid directory: /coins/www/html/closure-library
coins_core      develop
coins_auth      develop
micis           develop
cas             develop
asmt            bugfix/sa-caching
p2              develop
oCoins          develop
coins           invalid directory: /coins/www/html/coins
nodeapi         (detached from a3de572)
```

## flags
### services
The following services options are provided:
- `coins --services=stop/start/restart/status`
- `coins --services=print`

E.g.
```
cdieringer@localcoin:/coins/coins-cli$ coins --services=stop
cdieringer@localcoin:/coins/coins-cli$ coins

Services:
SERVICE            DOWN
apache2            down
coinsnodeapi       down
webpack-dev-server down
nginx              down

...
```

### git
The following git options are provided:
- `coins --git=checkout:branchName`
- `coins --git=print`

```bash
cdieringer@localcoin:/coins/coins-cli$ coins --git=checkout:develop
REPO            STATUS
blockly         invalid directory: /coins/www/html/blockly
portals         ok
closure-library invalid directory: /coins/www/html/closure-library
coins_core      ok
coins_auth      ok
micis           ok
cas             ok
asmt            ok
p2              ok
oCoins          ok
coins           invalid directory: /coins/www/html/coins
nodeapi         ok
```
