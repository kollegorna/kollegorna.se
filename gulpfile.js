var gulp = require('gulp');
var gutil = require('gulp-util');
var browserSync = require('browser-sync');
var cp = require('child_process');
var fs = require('fs');
var imagemin = require('gulp-imagemin');

var messages = {
  reload: 'Reloading...',
  build:  'Building Middleman...'
};

var setBuildTime = function() {
  fs.writeFileSync('.build-time', (new Date()).getTime());
};

gulp.task('middleman-build', function(done) {
  setBuildTime();
  browserSync.notify(messages.build);
  cp.spawn('bundle', ['exec', 'middleman', 'build'], { stdio: 'inherit' }).on('close', function(){
    var stream = gulp.src('./build/**/*.{jpg,jpeg,png,gif,svg}')
    .pipe(imagemin([
      // {
      //   progressive: true,
      //   svgoPlugins: [{ cleanupIDs: false }, { removeUselessDefs: false }]
      // }
    	imagemin.jpegtran({progressive: true}),
    	imagemin.svgo({plugins: [
        { cleanupIDs: false },
        { removeUselessDefs: false }
      ]})
    ], {verbose: true}))
    .pipe(gulp.dest('./build/'));
    stream.on('end', function() {
      done();
    });
    stream.on('error', function(err) {
      done(err);
    });
  });
});

gulp.task('browser-reload', ['middleman-build'], function() {
  browserSync.notify(messages.reload);
  browserSync.reload();
});

gulp.task('browser-sync', ['middleman-build'], function() {
  browserSync({
    server: {
      baseDir: 'build'
    },
    port: 4060
  });
});

gulp.task('watch', function() {
  gulp.watch('source/**/*.*', ['browser-reload']);
});

gulp.task('middleman', function(done) {
  setBuildTime();
  cp.spawn('bundle', ['exec', 'middleman'], { stdio: 'inherit' }).on('close', done);
});

gulp.task('serve', ['browser-sync', 'watch']);
gulp.task('build', ['middleman-build']);
gulp.task('install-bower', function(done) {
  cp.spawn('bower', ['install'], { stdio: 'inherit' }).on('close', done);
});
gulp.task('update-bower', function(done) {
  cp.spawn('bower', ['update'], { stdio: 'inherit' }).on('close', done);
});
gulp.task('install-bundle', function(done) {
  cp.spawn('bundle', ['install'], { stdio: 'inherit' }).on('close', done);
});
gulp.task('install', ['install-bundle', 'install-bower', 'update-bower']);
