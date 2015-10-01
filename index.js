var services = require('./lib/services.js');
var git = require('./lib/git.js');
var opts = require('nomnom')
    .option('services', {
        abbr: 's',
        flage: true,
        help: 'Show services statuses'
    })
   .parse();

if (Object.keys(opts).length === 1) { // _
    services.print();
}
if (opts.services) {
    services[opts.services]();
}
