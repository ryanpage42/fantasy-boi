import { Message } from 'discord.js';
import ESPNFF from '../util/espn-ff';

const espnFF = new ESPNFF();

export default (message: Message) => {
    espnFF.getLeagueMatchups('338828')
        .then((matchups) => {
            message.channel.send(matchups);
        });
};