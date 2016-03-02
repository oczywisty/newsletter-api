module.exports = function(grunt) {
  "use strict";

  grunt.loadNpmTasks("grunt-mocha-test");

  grunt.initConfig({
    // Configure a mochaTest task 
    mochaTest: {
      test: {
        options: {
          reporter: "spec",
        },
        src: ["test/**/*.js"]
      }
    }
  });
 
  grunt.registerTask("default", "mochaTest");
};
