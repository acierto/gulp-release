
## Usage
`npm install gulp-release-it --save-dev`

```javascript
var gulp = require('gulp');
require('gulp-release-it')(gulp);
```

## Requirements

Gulp 3

## How release works

### First approach ``` gulp complete-release```

1. Creates a tag based on *current* version specified in package.json
2. Publishes the project to Git repository 
3. Bumps the version of package.json, bower.json or/and manifest.json

So if you have package.json with version v1.0.0 and do ``` gulp release``` 
you will have in GitH tag v1.0.0, the same in NPM Repo and your package.json 
will be bumped up to version v1.0.1 (future release version) and committed to Git

### Second approach ``` gulp bump-complete-release```

1. Bumps the version of package.json, bower.json or/and manifest.json
2. Creates a tag based on *current* version specified in package.json
3. Publishes the project to Git repository 

So if you have package.json with version v1.0.0 and do ``` gulp bump-release``` 
your package.json will be bumped up and committed to Git to v1.0.1 (last released version) 
and you will have in Git tag v1.0.1, the same in NPM Repo.

The big difference between two approaches is in - what do you want to save in your configuration file -
the last released version or the future version. The most suitable case you can choose by yourself.

## How is bumping works

Currently the plugin watches 3 files to bump up - bower.json, package.json and manifest.json.
To keep all of them in sync (even if you have in your current repository state different versions),
plugin fetches the version of package.json, bumps it and applies the same version to other files.
It can be very handy, especially if somebody from the team decided to update manually one of the files but 
forgot to do it for another files too.

## How to publish and bump to a new version

```gulp complete-release``` # publish to NPM repo and Git

```gulp release``` # publish to Git

## How to bump  to a new version and then release

```gulp bump-complete-release``` # publish to NPM repo and Git

```gulp bump-release``` # publish to Git


## Different ways to bump the version after release

command                              | version
-------------------------------------|-----------------
gulp release                         | v0.0.1 -> v0.0.2 
gulp release --minor                 | v0.0.1 -> v0.1.0 
gulp release --major                 | v0.0.1 -> v1.0.0
gulp release --alpha                 | v0.0.1 -> v0.0.1-alpha.0
gulp release --beta                  | v0.0.1 -> v0.0.1-beta.0
gulp release --RC                    | v0.0.1 -> v0.0.1-RC.0
gulp release --pre-release gamma     | v0.0.1 -> v0.0.1-gamma.0

### If you want only to bump the version

command                              | version
-------------------------------------|-----------------
gulp bump                            | v0.0.1 -> v0.0.2 
gulp bump --minor                    | v0.0.1 -> v0.1.0 
gulp bump --major                    | v0.0.1 -> v1.0.0
gulp bump --alpha                    | v0.0.1 -> v0.0.1-alpha.0
gulp bump --beta                     | v0.0.1 -> v0.0.1-beta.0
gulp bump --RC                       | v0.0.1 -> v0.0.1-RC.0
gulp bump --pre-release gamma        | v0.0.1 -> v0.0.1-gamma.0
 
## How to release from different branch
 
```gulp release --branch=branch_name```

## How to release from different folder

```gulp release --rootDir=/path/to/project```

## You can also have a pre-hook before executing tag-and-push task.

It can be helpful if you want to run some check first and only then release do a release.
For a example it can be a check that you don't use any forbidden licenses.
For that you need to do this:

```javascript
    import gulp from 'gulp';
    import initReleaseIt from 'gulp-release-it';
    
    import appfy from 'gulp-appfy-tasks';
    appfy.init(__dirname);
    appfy.defineTasks();
    
    initReleaseIt(gulp);
    
    gulp.task('pre-tag-and-push', function (cb) {
        console.log('i can override pre tag and push task');
        cb();
    });
```

What is happening here actually, by means of plugin `gulp-appfy-tasks` we
override default `pre-tag-and-push` task which by default does nothing. 
`pre-tag-and-push` task triggers every time before executing `tag-and-push`
task. 
  
