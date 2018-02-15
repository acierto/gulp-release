## Usage
`npm install gulp-release-it --save-dev`

```javascript
import gulp from 'gulp';
import {release} from 'gulp-release-it';

release(gulp);
```

## Requirements

It will work only with Gulp 4

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

As an additional check, plugin checks which tags are already existed. If you for example have a stale code with 
version "1.0.1" and real version is already "1.0.4" and in between released were already made (1.0.2, 1.0.3, 1.0.4). 
The check would be performed and instead of failing that v1.0.2 tag already existed, version would be bumped up to
1.0.5. This strategy is applied to all kind of bumping: minor, major, alpha, etc.

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

```
    import util from 'util';
    import gulp from 'gulp';
    import {DefaultReleaseRegistry, release} from 'gulp-release-it';
    
    class CustomGulpReleaseRegistry extends DefaultReleaseRegistry {
        init(takerInst) {
            takerInst.task('pre-tag-and-push', (cb) => {
                console.log('i can override default task definition');
                cb();
            })
        }
    }
    
    release(gulp, {before: [new CustomGulpReleaseRegistry()]});

```

You can define your own registries with tasks and decide the way of priority how they will be added. 
One way to define it before: 

```
    release(gulp, {before: [new CustomGulpReleaseRegistry()]});
```

another one after

```
    release(gulp, {after: [new CustomGulpReleaseRegistry()]});
```

The difference is that last defined one wins. 

But be aware that if task was defined twice and you will call this task directly or as a dependency will make 
a difference. So keeping that in mind you can create a proper strategy for your task graph (for example by preventing 
inside of registry duplicated task, or remove previous task from registry and reapply the new one).

You can follow for a more documentation how to work with registries here: https://github.com/gulpjs/undertaker-registry

### Short description of registries

Registry name                         | Tasks
--------------------------------------|---------------------------------------------------------------
DefaultBumpRegistry                   | bump 
DefaultGitUtilsRegistry               | get-current-branch-name 
DefaultNpmPublishRegistry             | npm-publish
DefaultPreTagAndPushRegistry          | pre-tag-and-push
DefaultReleaseRegistry                | release, bump-release, complete-release, bump-complete-release
DefaultTagAndPushRegistry             | tag-and-push
