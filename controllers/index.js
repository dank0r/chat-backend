/*
import login from './login';
import signup from './signup';
import usersRandom from './usersRandom';
import subscribes from './subscribes';
import posts from './posts';
import dialogs from './dialogs';
import messages from './messages';
import participants from './participants';
import sessions from './sessions';
import authorization from './authorization';
*/
import fs from 'fs';

let controllers = {};

fs.readdirSync(__dirname).filter(file => file !== 'index.js').forEach((file) => {
  controllers[file.slice(0, -3)] = require(`./${file}`);
});

module.exports = controllers;
/*
module.exports = {
  login,
  signup,
  usersRandom,
  subscribes,
  posts,
  dialogs,
  messages,
  participants,
  sessions,
  authorization,
};
  */