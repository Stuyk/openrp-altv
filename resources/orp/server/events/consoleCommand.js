import * as alt from 'alt';

const bindings = {
    kick: kick,
    setadmin: setAdmin
};

alt.on('consoleCommand', (command, ...args) => {
    if (bindings[command]) {
        bindings[command](args);
    }
});

function kick(args) {
    const player = alt.Player.all.find(player => player.data.name.includes(args[0]));
    if (!player) {
        alt.log('Player was not found.');
        return;
    }
    player.kick();
}

function setAdmin(args) {
    const id = args[0];
    const rank = args[1];
    if ((rank = undefined || id === undefined)) {
        alt.log('setadmin <id> <rank>');
        return;
    }

    const player = alt.Player.all.find(player => player.data.id === id);
    if (!player) {
        alt.log('Player was not found...');
        return;
    }

    player.rank = rank;
    alt.log(`${player.data.name} has been given the temporary rank of ${rank}`);
}
