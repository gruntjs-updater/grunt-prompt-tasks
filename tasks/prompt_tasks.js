//
// grunt-prompt-tasks
// https://github.com/matthewoates/grunt-prompt-tasks
//
// Copyright (c) 2014 matt
// Licensed under the MIT license.
//

'use strict';

module.exports = function(grunt) {
    grunt.registerPromptTask = function (name, desc, tasks) {
        if (arguments.length < 3) {
            // desc was not specified, so let's swap tasks and desc
            tasks = desc;
            desc = null;
        }

        desc = desc || '';

        grunt.writeln('registered task:' + name);
    };

    grunt.registerTask('prompt_tasks', 'Prompt the user with a list of tasks to choose from.', function() {
        grunt.log.writeln('hello world');
    });
};

