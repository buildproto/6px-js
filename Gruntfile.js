module.exports = function(grunt) {

    grunt.initConfig({
        jshint: {
            files: ['6px.js'],
            options: {
                globals: {
                    jQuery: true,
                    console: true,
                    devel: true,
                    module: true,
                    document: true
                }
            }
        },
        uglify: {
            options: {
                mangle: false
            },
            build: {
                src: '6px.js',
                dest: '6px.min.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['jshint', 'uglify']);

};
