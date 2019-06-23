var ghpages = require('gh-pages');
/**
 * This task pushes to the `master` branch of the configured `repo`.
 */
ghpages.publish('build', {
    branch: 'master',
    repo: 'https://github.com/felipefrocha/felipefrocha.github.io'
  }, (err) => {
      console.log(err);
  }
);