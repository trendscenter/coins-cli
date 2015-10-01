var services = require('./lib/services.js');
var git = require('./lib/git.js');
var opts = require('nomnom')
    .option('services', {
        abbr: 's',
        flag: true,
        help: 'Show services statuses'
    })
    .option('git', {
        abbr: 'g',
        flag: true,
        help: 'Show services statuses'
    })
   .parse();

if (Object.keys(opts).length === 1) { // _
    console.log('');
    services.print();
    console.log('');
    git.print();
    console.log('');
}
if (opts.services) {
    services[opts.services]();
}

if (opts.git) {
    if (typeof opts.git === 'string') {
        var args = opts.git.split(':');
        var fnName = args.shift();
        git[fnName].apply(this, args);
    } else {
        git[opts.git]();
    }
}
