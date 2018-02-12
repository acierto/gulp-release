import fs from 'fs';
import path from 'path';
import {argv} from 'yargs';

const rootDir = `${path.resolve(argv.rootDir || './')}/`;
const currentVersion = () => JSON.parse(fs.readFileSync(`${rootDir}package.json`)).version;
const srcConfig = {allowEmpty: true, cwd: rootDir};

const paths = {versionsToBump: ['package.json', 'bower.json', 'manifest.json'].map((fileName) => rootDir + fileName)};

export default {
    branch: argv.branch || 'master',
    currentVersion,
    paths,
    rootDir,
    srcConfig
};