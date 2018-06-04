let Telegraf = require('telegraf');
let config = require('./config');


let bot = new Telegraf(config.botToken);