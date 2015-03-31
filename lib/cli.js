var path         = require('path');
var program      = require('commander');
var demeteorizer = require('../lib/demeteorizer');

program
  .version(require('../package.json').version)
  .option('-o, --output <path>', 'Output folder for converted application. Defaults to ./.demeteorized.')
  .option('-r, --release <version>', 'The Meteor version. Defaults to latest installed.')
  .option('-l, --arbitrary '{"xx":"xx"}' ', 'Add arbitrary JSON to package.json')
  .option('-t, --tarball <path>', 'Output tarball path. If specified, creates a tar.gz of demeteorized application instead of directory.')
  .option('-a, --app_name <name>', 'Value to put in the package.json name field. Defaults to the current directory name.')
  .option('-d, --debug', 'Bundle in debug mode (don\'t minify, etc).', false)
  .parse(process.argv);

program.output = program.output || path.join(process.cwd(), '.demeteorized');

if (program.release) {
  console.log('Release:', program.release);
}

demeteorizer.on('progress', console.log.bind(console));

var options = {
  appName : program.app_name,
  debug   : program.debug,
  input   : process.cwd(),
  output  : program.output,
  release : program.release,
  tarball : program.tarball,
  arbJson : program.arbitrary
};

demeteorizer.convert(
  options,
  function (err) {
    if (err) {
      if (!process.env.running_under_istanbul) {
        console.log('Demeteorization failed:', err.message || err);
        process.exit(1);
      }
    } else {
      console.log('Demeteorization complete.');
    }
  }
);
