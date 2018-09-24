import {
    CronJob
} from 'cron';
import DB from './db';
import bot from './bot';
import ESPNFF from './espn-ff';

const LeagueChannel = DB.league_channel;

const LOCALE = 'America/Los_Angeles';

export default class Scheduler {
    constructor() { }

    load = () => {
        console.log('loading scheduler jobs');
        const startNow = true;
        /* jobs */
        new CronJob('* * * * *', () => {
            console.log('executing matchup announcement');
            this.showMatchups();
        }, null, startNow, LOCALE);

        new CronJob('* * * * *', () => {
            console.log('executing close scores announcement');
            this.showCloseScores();
        }, null, startNow, LOCALE);

        new CronJob('* * * * *', () => {
            console.log('executing trophies announcement');
            this.showTrophies();
        }, null, startNow, LOCALE);
    }

    showMatchups = () => {
        LeagueChannel.findAll({})
            .then((results: any) => {
                for (let result of results) {
                    const espnFF = new ESPNFF();
                    espnFF.getLeagueMatchups(result.league_id)
                        .then((matchups) => {
                            bot.sendMessage(result.channel_id, matchups);
                        })
                        .catch((err) => {
                            console.log(err);
                        })
                }
            })
    }

    showCloseScores = () => {
        LeagueChannel.findAll({})
            .then((results: any) => {
                for (let result of results) {
                    const espnFF = new ESPNFF();
                    espnFF.getCloseScores(result.league_id)
                        .then((scores) => {
                            bot.sendMessage(result.channel_id, scores);
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                }
            })
    }

    showTrophies = () => {
        LeagueChannel.findAll({})
            .then((results: any) => {
                for (let result of results) {
                    const espnFF = new ESPNFF();
                    espnFF.getTrophies(result.league_id)
                        .then((trophies) => {
                            bot.sendMessage(result.channel_id, trophies);
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                }
            });

    }

    showScoreboard = () => {
        // todo
    }

    showBoxScore = () => {
        // todo
    }

}