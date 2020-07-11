"use strict";
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
exports.__esModule = true;
exports.fileLoader = void 0;
var fs_1 = require("fs");
var path_1 = require("path");
var is_glob_1 = require("is-glob");
var glob_1 = require("glob");
var _config_1 = require("@config");
var DEFAULT_EXTENSIONS = ['.ts', '.js'];
var DIRS = {
    routes: _config_1.config.server.dirs.routes.map(function (d) {
        return path_1["default"].join(process.cwd(), d);
    })
};
/**
 * Recursively finds files within a given directory
 *
 * @remarks
 * Synchronous
 *
 * @param dir - A glob directory
 * @returns An array of file paths
 */
var recursiveReadDirSync = function (dir) {
    return fs_1["default"]
        .readdirSync(dir)
        .reduce(function (files, file) {
        return fs_1["default"].statSync(path_1["default"].join(dir, file)).isDirectory()
            ? files.concat(recursiveReadDirSync(path_1["default"].join(dir, file)))
            : files.concat(path_1["default"].join(dir, file));
    }, []);
};
/**
 * Finds files within a given directory
 *
 * @remarks
 * Synchronous
 *
 * @param dir - A glob directory
 * @returns An array of file paths
 */
var readDirSync = function (dir) {
    return fs_1["default"]
        .readdirSync(dir)
        .reduce(function (files, file) {
        return fs_1["default"].statSync(path_1["default"].join(dir, file)).isDirectory()
            ? files
            : files.concat(path_1["default"].join(dir, file));
    }, []);
};
/**
 * Interprets a glob pattern
 *
 * @remarks
 * Synchronous
 *
 * @param pattern - A Glob pattern
 * @param options - Glob options
 * @returns An array of file path strings
 */
var readGlobSync = function (pattern, options) {
    return glob_1["default"].sync(pattern, options);
};
/**
 * Get a list of files to be read
 *
 * @remarks
 * Synchronous
 *
 * @param dir - The directory glob to search
 * @param recursive - Boolean
 * @param globOptions - Glob options
 * @returns An array of file path strings
 */
var getSchemaFiles = function (dirs, recursive, globOptions) {
    return dirs
        .map(function (dir) {
        if (is_glob_1["default"](dir)) {
            return readGlobSync(dir, globOptions);
        }
        if (recursive === true) {
            return recursiveReadDirSync(dir);
        }
        return readDirSync(dir);
    })
        .flat();
};
/**
 * Load contexts of given files
 *
 * @remarks
 * Synchronous
 *
 * @param type - The directory glob to search
 * @param options - Available options
 * @param options.recursive - A boolean whether to search recursively
 * @param options.globOptions - Glob options
 * @param options.flatten - A boolean whether to flatten to single array
 * @returns An array of file contents from each file
 */
exports.fileLoader = function (type, _a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.recursive, recursive = _c === void 0 ? false : _c, _d = _b.globOptions, globOptions = _d === void 0 ? {} : _d, _e = _b.flatten, flatten = _e === void 0 ? false : _e;
    var schemafiles = getSchemaFiles(DIRS[type], recursive, globOptions);
    var files = schemafiles
        .map(function (f) { return ({ f: f, pathObj: path_1["default"].parse(f) }); })
        .filter(function (_a) {
        var pathObj = _a.pathObj;
        return DEFAULT_EXTENSIONS.includes(pathObj.ext);
    })
        .map(function (_a) {
        var f = _a.f, pathObj = _a.pathObj;
        var returnVal;
        switch (pathObj.ext) {
            case '.ts':
            case '.js': {
                var file = require(f);
                returnVal = file["default"] || file;
                break;
            }
            default:
                break;
        }
        return returnVal;
    })
        .filter(function (v) { return !!v; }); // filter files we don't know how to handle
    if (flatten) {
        files = files.flat();
    }
    return files;
};
