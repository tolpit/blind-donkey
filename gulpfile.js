var gulp = require('gulp');
var gls = require('gulp-live-server');

gulp.task('serve', function() {
    //1. serve with default settings
    var server = gls.static(); //equals to gls.static('public', 3000);
    server.start();

    //2. serve at custom port
    var server = gls.static('./', 1337);
    server.start();
});