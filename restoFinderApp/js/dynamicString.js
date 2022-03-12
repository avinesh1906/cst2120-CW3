// Entire script will be in script mode
"use strict";

// variables
var speed = 100;
var speed2 = 150;
var str = document.getElementById('typewriter');
var messages = [
    "Feeling hungry?",
    "Unexpected guests?",
    "Cooking gone wrong?",
    "Game night?",
    "Movie marathon?"
]

var i = 0;
var isRemoving = false;

// function to display the dynamic string
function action() {
  if (isRemoving) {
    if (str.innerText.length > 0) {
      str.innerText = str.innerText.substr(0, str.innerHTML.length - 1);
      setTimeout( action, speed2 );
      return;
    }
    isRemoving = false;
    i++;
    if (i >= messages.length) {
      i = 0;
    }
    setTimeout( action, speed );
    return;
  }
  var message = messages[i];
  str.innerText = message.substr(0, str.innerHTML.length + 1);
  if (str.innerText.length === message.length) {
    isRemoving = true;
  }
  setTimeout( action, isRemoving ? speed2 : speed );
}

setTimeout( action, speed ) ;