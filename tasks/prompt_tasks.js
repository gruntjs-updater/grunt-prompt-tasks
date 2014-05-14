//
// grunt-prompt-tasks
// https://github.com/matthewoates/grunt-prompt-tasks
//
// Copyright (c) 2014 matt
// Licensed under the MIT license.
//

'use strict';

var inquirer = require('inquirer-longer');

module.exports = function(grunt) {
    var choices = [];

    function pad(str, len) {
        var result = str;

        while (result.length < len) {
            result += ' ';
        }

        return result;
    }

    function getLongestNameLength(arr) {
        var result = 0;

        for (var i = 0; i < arr.length; i++) {
            if (arr[i].name.length > result) {
                result = arr[i].name.length;
            }
        }

        return result;
    }

    function getOptions() {
        var longestChoiceLength = getLongestNameLength(choices);
        var options = [];

        for (var i = 0; i < choices.length; i++) {
            options.push({
                name: pad(choices[i].name, longestChoiceLength + 4) + choices[i].desc,
                value: choices[i].name
            });
        }

        return options;
    }

    function registerTask(name, desc, tasks) {
        if (arguments.length < 3) {
            // desc was not specified, so let's swap tasks and desc
            tasks = desc;
            desc = null;
        }

        choices.push({
            name: name,
            desc: (desc || '').grey,
            tasks: tasks
        });
    }

    grunt.registerPromptTask = function (name, desc, tasks) {
        registerTask(name, desc, tasks);
        grunt.registerTask(name, desc, tasks);
    };

    grunt.registerPromptMultiTask = function (name, desc, tasks) {
        registerTask(name, desc, tasks);
        grunt.registerMultiTask(name, desc, tasks);
    };

    grunt.registerTask('prompt_tasks', 'Prompt the user with a list of tasks to choose from.', function() {
        var done = this.async();
        var options = getOptions();

        options.unshift(new inquirer.Separator());
        options.push(new inquirer.Separator());
        options.push({name: 'exit', value: ''});

        inquirer.prompt([{
            type: 'list',
            name: 'task',
            message: 'Choose a task to run:',
            choices: options
        },
        ], function (answers) {
            var chosenTask = answers.task;

            if (chosenTask) {
                grunt.task.run(chosenTask);
            }

            done();
        });
    });
};

