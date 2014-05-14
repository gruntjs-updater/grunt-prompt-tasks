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

    function findChoice(name) {
        var choice;

        for (var i = 0; i < choices.length; i++) {
            if (choices[i].name === name) {
                choice = choices[i];
            }
        }

        return choice;
    }

    function pad(str, len) {
        var result = str;

        while (result.length < len) {
            result += ' ';
        }

        return result;
    }

    function getOptions() {
        var options = [];
        var max = function (a, b) {return Math.max(a, b)};
        var getLength = function (str) {return str.length};

        for (var i = 0; i < choices.length; i++) {
            options.push(choices[i].name);
        }

        var longestChoiceLength = options.map(getLength).reduce(max);

        for (var i = 0; i < options.length; i++) {
            options[i] = {
                name: pad(options[i], longestChoiceLength + 4) + choices[i].desc,
                value: options[i]
            };
        }

        return options;
    }

    grunt.registerPromptTask = function (name, desc, tasks) {
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

        grunt.registerTask(name, desc, tasks);
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
            } else {
                grunt.log.writeln('Exiting');
            }

            done();
        });
    });
};

