import { EventEmitter } from 'events';
import Discord from 'discord.js';
import { prefix } from './config.json';
import pConfig from './config.private.json';
import Scheduler from './util/scheduler';
import DB from './util/db';

let bot = new Discord.Client();
const maxListeners: Number = 25;
const emitter = new EventEmitter();

DB.init(); // initialize database

/* ready listener */
bot.on('ready', () => {
    console.log('Fantasy Boi has been initialized successfully!');
    bot.user.setActivity(`Throwing for ${bot.guilds.size} yard(s).`);
});

/* message listener */
bot.on('message', message => {
    if (Math.floor((Math.random() * 2)) == 1) // every other msg or so
        bot.user.setActivity(`Throwing for ${bot.guilds.size} yard(s).`);

    const messageArr = message.content.split(' ');
    const command = messageArr[0] + ' ' + messageArr[1]; // risky, fix

    const isBot = message.author.bot;
    if (isBot) {
        // console.log('command received from bot, ignoring!');
        return;
    }

    const startsWithPrefix = message.content.indexOf(prefix) !== 0;
    if (startsWithPrefix) {
        // console.log('does not start with prefix')
        return;
    }

    // console.log('command: ' + command);
    emitter.emit(command, message);
});

// set max listeners
emitter.setMaxListeners(0);

emitter.on('ready', () => {
    console.log('emitter ready');
})

emitter.on('error', (err) => {
    console.log('emitter err: ' + err);
});

emitter.on('close', (msg) => {
    console.log('emitter closed: ' + msg);
});

/* import commands */
import help from './commands/help';
import test from './commands/test';
import matchups from './commands/matchups';
import add from './commands/add';
import remove from './commands/remove';
import disable from './commands/disable';
import enable from './commands/enable';
import scores from './commands/scores';
import rankings from './commands/rankings';
import closeScores from './commands/close-scores';
import trophies from './commands/trophies';

// get a list of commands
emitter.on(prefix + 'help', help);
emitter.on(prefix + '-h', help);

// test bot functionality
emitter.on(prefix + 'test', test);
emitter.on(prefix + '-t', test);

// get this weeks matchups
emitter.on(prefix + 'matchups', matchups);
emitter.on(prefix + 'scoreboard', matchups);
emitter.on(prefix + '-m', matchups);

// add fantasy boi to the channel
emitter.on(prefix + 'add', add);
emitter.on(prefix + '-a', add);

// remove fantasy boi from a channel
emitter.on(prefix + 'remove', remove);
emitter.on(prefix + '-rm', remove);

// disable an event
emitter.on(prefix + 'disable', disable);
emitter.on(prefix + '-d', disable);

// enable an event
emitter.on(prefix + 'enable', enable);
emitter.on(prefix + '-e', enable);

// show current ff team scores
emitter.on(prefix + 'scores', scores);
emitter.on(prefix + '-s', scores);

// show current league rankings
emitter.on(prefix + 'rankings', rankings);
emitter.on(prefix + '-r', rankings);

// show close scores
emitter.on(prefix + 'close-scores', closeScores);
emitter.on(prefix + '-cs', closeScores);

// show trophies
emitter.on(prefix + 'trophies', trophies);
emitter.on(prefix + '-t', trophies);

// link an espn user account

// unlink an espn user account

// set league start date

// set league type

// change league type

// change league id

// betting [enable/disable]

// set initial season coins

// bet on NFL game

// bet on matchup

// list trophies

// list records

// list standings

// list team lineup

// list box score

// enable/disable scheduled jobs

/* start scheduler */
const scheduler = new Scheduler();
scheduler.load();

/* When this baby hits 88mph, we're going to see some serious shit! */
bot.login(pConfig.token);

