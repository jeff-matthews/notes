/*
*********************
* Local development *
*********************
*/

/*
* Compile the site.
*/
gulp.task('jekyll-build', function (cb) {
  browsersync.notify(messages.jekyllBuild);
  exec('jekyll build --config _config.yml,_config.local.yml', function (err, stdout, stderr) {
      gutil.log(gutil.colors.white(stdout));
      gutil.log(gutil.colors.red(stderr));
  cb(err);
  });
});

/*
* Rebuild the page after changing a file.
*/
gulp.task('jekyll-rebuild', function () {
  runSequence('jekyll-build', 'reload');
});

/*
* Call the jekyll-rebuild task to recompile the site whenever a file changes.
*/
gulp.task('watch-files', function () {
  gulp.watch(['*.html', '_data/*.yml', '_includes/**/*', '_layouts/*.html', 'guides/**/*', 'css/*.css', 'js/*.js', 'images/**/*.+(png|jpeg|jpg|gif|svg)', '_config.yml'], ['jekyll-rebuild']);
});

/*
* Launch a local web server using BrowserSync and serve the _site directory on port 4000.
*/
gulp.task('browser-sync2', function() {
  browsersync({
    port: 4000,
    server: {
      baseDir: '_site'
    }
  });
});

/*
* Reload the page after changing, adding, or removing a file.
*/
gulp.task('reload', function (done) {
  browsersync.reload();
  done();
});

/*
* Compile the site, launch BrowserSync, and watch files for changes.
*/
gulp.task('dev-sync', function() {
  runSequence('jekyll-build', 'watch-files', 'browser-sync2');
});



/*
* Recompile the site and reload the browser whenever changing, adding, or removing a file. Uses the gulp.watch API.
*/
gulp.task('watcher', function(done) {
  browsersync(bsconfig);
  var watcher =
    gulp.watch(paths.html, ['jekyll']);
    gulp.watch(paths.scripts, ['scripts']);
    gulp.watch(paths.images, ['images']);
    gulp.watch(paths.styles, ['styles']);
    watcher.on('change', function(event) {
      gutil.log(gutil.colors.bgYellow.black('File: ' + event.path + ' was ' + event.type + ', running tasks...'));
    });
  done();
});

/*
* Validate HTML, but ignore custom_404.html, custom_50x.html, search.html, and missing image alt tags. This task relies on the html-proofer rubygem that gets installed from the Gemfile.
* Also ignores _site/reference b/c API links aren't generated during build; they're generated dynamically by jquery.tocify.js on page load. If we don't ignore this, we get loads of non-error errors.
* To ignore specific links, just add a 'data-proofer-ignore' attribute to any tag (e.g., <a href="http://notareallink" data-proofer-ignore>Not checked.</a>).
*/
gulp.task('htmlproofer', function (cb) {
  exec('htmlproofer ./_site --only-4xx --url-ignore "/reference/" --alt-ignore "/.*/" --allow-hash-href "true" --file-ignore "/custom|search/"',
  function (err, stdout, stderr) {
    gutil.log(gutil.colors.green(stdout));
    gutil.log(gutil.colors.red(stderr));
    cb(err);
  });
});
