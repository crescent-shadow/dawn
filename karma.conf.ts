// Karma configuration

module.exports = (config) => {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '.',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine', "karma-typescript"],


    // list of files / patterns to load in the browser
    files: [
      { pattern: 'src/renderer/scss/main.scss', watched: true,  included: true, served: true },
      { pattern: 'src/renderer/**/*.ts' },
      { pattern: 'test/**/*.ts' }
    ],


    // list of files / patterns to exclude
    exclude: [
      'src/renderer/index.ts'
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      "src/**/*.scss": ['scss'],
      "src/renderer/**/*.ts": ["karma-typescript", "coverage"],
      "test/**/*.ts": ["karma-typescript"]
    },

    karmaTypescriptConfig: {
      reports:
        {
          "html": "coverage",
          "text": ""
          //"text-summary": ""
        }
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', "coverage", "karma-typescript"],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
};
