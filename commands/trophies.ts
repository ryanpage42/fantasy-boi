import {
    Message
} from 'discord.js';
import ESPNFF from '../util/espn-ff';
import eFF from 'espn-ff-api-2';
import db from '../util/db';

const espnFF = new ESPNFF();
export default (message: Message) => {
    db.getLeague(message.channel.id)
        .then((leagueId) => espnFF.getTrophies(leagueId))
        .then((res) => message.channel.send(res))
        .catch((err) => {
            message.channel.send('Could not get trophies. Reason: ' + err);
        });
};