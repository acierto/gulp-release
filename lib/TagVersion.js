import map from 'map-stream';
import colors from 'ansi-colors';
import flog from 'fancy-log';
import git from 'gulp-git';

/**
 * @param opts {object} Module options, passed _also_ to underlying `git.tag`
 * @param opts.key {string?} The key in package.json from which version is read, defaults to 'version'
 * @param opts.prefix {string?} Prefix prepended to version when creating tag name, defaults to 'v'
 * @param opts.push {boolean?} Push tags tagging? Default: true
 * @param opts.label {string?} Label to use for tagging, defaults to 'Tagging as %t'.
 *        %t will be replaced by the tag name.
 * @param opts.version {string?} Alternatively, just pass the version string here. Default: undefined.
 *
 */
export default (opts) => {
    const tagOpts = opts || {};

    if (!tagOpts.key) {
        tagOpts.key = 'version';
    }
    if (typeof tagOpts.prefix === 'undefined') {
        tagOpts.prefix = 'v';
    }
    if (typeof tagOpts.push === 'undefined') {
        tagOpts.push = true;
    }
    if (typeof tagOpts.label === 'undefined') {
        tagOpts.label = 'Tagging as %t';
    }

    const modifyContents = (file, cb) => {
        let version = tagOpts.version;

        if (!tagOpts.version) {
            if (file.isNull()) {
                return cb(null, file);
            }
            if (file.isStream()) {
                return cb(new Error('gulp-tag-version: streams not supported'));
            }

            const json = JSON.parse(file.contents.toString());
            version = json[tagOpts.key];
        }
        const tag = tagOpts.prefix + version;
        const label = tagOpts.label.replace('%t', tag);

        flog(`Tagging as: ${colors.cyan(tag)}`);
        return git.tag(tag, label, {cwd: tagOpts.cwd}, (err) => {
            if (err) {
                throw err;
            }
            cb();
        });
    };

    return map(modifyContents);
};
