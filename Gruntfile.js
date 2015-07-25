module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);
    var config = {
        display: 'display',
        dist: 'dist',
        demo: 'dist/demo'
    };
    
    grunt.initConfig({
        config: config,
        watch: {
            sass: {
                files: [
                    '<%= config.display %>/styles/{,*/}*.scss'
                ],
                tasks: ['sass:dev']
            }
        },
        browserSync: {
            dev:{
                bsFiles: {
                    src: [
                        '<%= config.display %>/index.html',
                        '<%= config.display %>/scripts/{,*/}*.*', 
                        '<%= config.display %>/images/{,*/}*.*', 
                        'src/{,*/}*.*', 
                        '.tmp/styles/{,*/}*.css'
                    ]
                },
                options: {
                    watchTask: true,
                    server: {
                        baseDir: ["./display", "./src", "./.tmp"]
                    },
                    browser: "google chrome",
                    open: false
                }
            },
            demo:{
                bsFiles: {
                    src: 'dist/demo/*'   
                },
                options: {
                    server: {
                        baseDir: ['dist/demo']   
                    },
                    browser: 'google chrome'
                }
            }
        },
        clean: {
            demo: {
                dot: false,
                src: 'dist/demo/*'
            },
            tmp: {
                src: '.tmp'
            }
//            build: 
//            [
//                'dist/drawing-kit/drawing-kit.js',
//                'dist/drawing-kit/drawing-kit.min.js',
//                'dist/histogram-analyze/histogram-analyze.js', 
//                'dist/histogram-analyze/histogram-analyze.min.js', 
//                'dist/rothko/rothko.js',
//                'dist/rothko/rothko.min.js'
//            ]   
        },
        concat: {
//            generated: {
//                files: [
//                    {
//                        dest: 'dist/demo/script/main.js',
//                        src: [
//                            'display/scripts/main.js',
//                            'display/scripts/something.js'
//                        ]
//                    }
//                ]
//            },
            hA: {
                src: 
                [
                    'src/hA-wrapper-start.js', 
                    'src/hA-util.js', 
                    'src/histogram1D.js',
                    'src/circularHistogram1D.js',
                    'src/histogram2D.js',
                    'src/hA-wrapper-end.js'
                ],
                dest: 'dist/histogram-analyze/histogram-analyze.js',
            },
            dK: {
                src: 
                [
                    'src/dk-wrapper-start.js', 
                    'src/dk-core.js', 
                    'src/dk-wrapper-end.js'
                ],
                dest: 'dist/drawing-kit/drawing-kit.js',
            },
            Rothko: {
                src: 
                [
                    'src/Rothko-wrapper-start.js', 
                    'src/Rothko-const.js', 
                    'src/Rothko-core.js',
                    'src/Rothko-wrapper-end.js', 
                ],
                dest: 'dist/rothko/rothko.js',
            }
        },
        useminPrepare: {
            html: 'display/index.html',
            options: {
                dest: 'dist/demo'   
            }
        },
        usemin: {
            html: ['dist/demo/index.html']
        },
        copy: {
            demo: {
                cwd: 'display/',
                expand: true,
                src: ['index.html', 'scripts/*', 'images/DanielGarber_StudentsPainting.jpg'],
                dest: 'dist/demo/'
            },
            hA: {
                cwd: 'dist/histogram-analyze/',
                expand: true,
                src: ['histogram-analyze.js'],
                dest: 'dist/demo/scripts/vendor'
            },
            dK: {
                cwd: 'dist/drawing-kit/',
                expand: true,
                src: ['drawing-kit.js'],
                dest: 'dist/demo/scripts/vendor'
            },
            rothko: {
                cwd: 'dist/rothko/',
                expand: true,
                src: ['rothko.js'],
                dest: 'dist/demo/scripts/vendor'
            },
        },
        sass: {
            options: {
                sourceMap: false,
                styles: 'expanded'
//                includePaths: [''];
            },
            dev: {
                files: [{
                    expand: true,
                    cwd: '<%= config.display %>/styles/',
                    src: ['*.scss'],
                    dest: '.tmp/styles',
                    ext: '.css'
                }]
            },
            demo: {
                files: [{
                    expand: true,
                    cwd: '<%= config.display %>/styles/',
                    src: ['*.scss'],
                    dest: '<%= config.demo %>/styles',
                    ext: '.css'
                }]
            }
        }
    });
    grunt.registerTask('serve', function(target) {
        if (target === 'dev') {
            grunt.task.run([
                'clean:tmp',
                'sass:dev',
                'browserSync:dev',
                'watch'
            ])
        } else if (target === 'demo') {
            grunt.task.run([
                'sass:demo',
                'browserSync:demo'
            ])
        }
    })
//    grunt.registerTask('serve', [
//        'clean:tmp',
//        'sass:dev',
//        'browserSync:dev',
//        'watch'
//    ]);
    grunt.registerTask('build', [
        'clean:demo',
//        'useminPrepare',
        'concat',
        'copy',
        'usemin',
        
    ]);
    grunt.registerTask('default', ['build', 'browserSync:demo']);
}