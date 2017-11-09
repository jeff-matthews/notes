gulp.task('check-links', function() {

// Sticking mostly with the defaults
var options = {filterLevel: 1};

var handlers =
    {
        html: function(tree, robots) {
        },
        junk: function(result) {
          console.log(result);
        },
        link: function(result) {
         if (result.broken) {
            console.log(blc[result.brokenReason]);
          } else if (result.excluded) {
            console.log(blc[result.excludedReason]);
          }
        },
        complete: function() {
          console.log("complete");
        }
    };

//Scans an HTML document to find broken links.
var htmlChecker = new blc.HtmlChecker(options, handlers);

//define the html to be scanned
htmlChecker.scan('_site');

});

gulp.task('check-links', function() {

var htmlChecker = new blc.HtmlChecker( {
    html: function(tree, robots) {
    },
    junk: function(result) {
      console.log(result);
    },
    link: function(result) {
      if (result.broken) {
        console.log(blc[result.brokenReason]);
      } else if (result.excluded) {
        console.log(blc[result.excludedReason]);
      }
    },
    complete: function() {
        console.log("complete");
    }
});

//scan all site html files
htmlChecker.scan('_site/**/*.html', '/');

});
