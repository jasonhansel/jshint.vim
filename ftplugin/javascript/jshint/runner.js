#!/usr/bin/env node

var jshint = require('jshint').JSHINT;
var stdin = process.openStdin();
var fs = require('fs');
var jshintrc = process.argv[2] ? fs.readFileSync(process.argv[2], 'utf8') : '';
var body = [];

// This function will produce incorrect results for certain pathological
// expressions involving regexp literals. This is okay, since it's only meant
// to be used on JSON-with-comments, and JSON doesn't have regexp literals.
function removecomments(s) {
  var re = /("([^"]|\\")*")|('([^']|\\')*')|\/\/[^\n]*|\/\*(?:[^\*]|\*(?!\/))*\*\//g;
  return s.replace(re, function(x) {
    return (/^["']/).test(x) ? x : ' ';
  });
}

stdin.on('data', function(chunk) {
  body.push(chunk);
});

stdin.on('end', function() {
  var options, data;

  // Try standard `.jshintrc` JSON format.
  try {
    options = JSON.parse(removecomments(jshintrc));
  } catch(e) {
    console.log('1:1:Invalid ~/.jshintrc file');
  }

  var globals;

  if (options && options.globals) {
    globals = options.globals;
    delete options.globals;
  }

  var source = body.join('');

  if( jshint( source, options, globals ) ){
    return;
  }

  data = jshint.data();

  data.errors.forEach(function(error) {
    if( error && error.reason ){
      console.log( [error.line , error.character, error.reason].join(':') );
    }
  });

});

