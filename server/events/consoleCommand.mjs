import * as alt from 'alt';

alt.on('consoleCommand', (command, argA) => {
    if (command === 'kick') {
        const players = alt.getPlayersByName(argA);
        if (players.length === 1) {
            alt.log(`Kicking ${argA} - Roleplay Name ${players[0].username}`);
            players[0].kick();
        }
    }
});
