import * as alt from 'alt';
import * as chat from '../chat/chat.mjs';
import { addXP, setXP } from '../systems/skills.mjs';
import { hasPermission, AdminFlags } from '../systems/admin.mjs';
import { addWeapon } from '../systems/inventory.mjs';
import { Items } from '../configuration/items.mjs';

/*
export const AdminFlags = {
    NONE: 0,
    HELPER: 1,
    MODERATOR: 2,
    ADMIN: 4,
    MAX: 7
};
*/

function getPlayerByName(name) {
    const players = [...alt.Player.all];
    const target = players.find(
        player =>
            player &&
            player.data &&
            player.data.name.toLowerCase().includes(name.toLowerCase())
    );
    return target;
}

chat.registerRankedCmd('kick', AdminFlags.MODERATOR, (player, args) => {
    if (args.length <= 0) {
        player.send(`/kick <user_name>`);
        return;
    }

    let name = args[0];
    if (args.length >= 2) {
        name += args[1];
    }

    const target = getPlayerByName(name);
    if (!target) {
        player.send('That user does not exist.');
        return;
    }

    alt.log(`${player.name} has kicked ${target.name}.`);
    player.send('The user has been kicked.');
    target.kick();
});

chat.registerRankedCmd('tpto', AdminFlags.MAX, (player, args) => {
    if (args.length <= 0) {
        player.send(`/tpto <user_name>`);
        return;
    }

    let name = args[0];
    if (args.length >= 2) {
        name += args[1];
    }

    const target = getPlayerByName(name);
    if (!target) {
        player.send('That user does not exist.');
        return;
    }

    player.pos = target.pos;
    player.send('You were teleported.');
});

chat.registerRankedCmd('tphere', AdminFlags.MAX, (player, args) => {
    if (args.length <= 0) {
        player.send(`/tphere <user_name>`);
        return;
    }

    let name = args[0];
    if (args.length >= 2) {
        name += args[1];
    }

    const target = getPlayerByName(name);
    if (!target) {
        player.send('That user does not exist.');
        return;
    }

    target.pos = player.pos;
    target.send('You were teleported by an admin.');
    player.send('You teleported the user to you.');
});

chat.registerRankedCmd('tpall', AdminFlags.MAX, player => {
    alt.Player.all.forEach(target => {
        target.pos = player.pos;
    });

    player.send('You teleported everyone to you.');
});

chat.registerRankedCmd('addcash', AdminFlags.MAX, (player, args) => {
    if (!args[0]) {
        player.send(`/addcash <amount>`);
        return;
    }

    const cash = parseInt(args[0]);
    if (cash > 9007199254740991) return;
    player.addCash(cash);
});

chat.registerRankedCmd('addwep', AdminFlags.MAX, (player, arg) => {
    if (arg === undefined || arg.length == 0) {
        player.send('/addwep <name>');
        return;
    }

    if (!addWeapon(player, arg[0])) {
        player.send('Weapon does not exist');
        return;
    }

    player.send('Weapon was added to inventory.');
});

chat.registerRankedCmd('additem', AdminFlags.MAX, (player, arg) => {
    if (arg == undefined || arg.length == 0) {
        player.send('/additem <item_key> <amount>');
        return;
    }

    let itemTemplate = Items[`${arg[0]}`];
    if (!itemTemplate) {
        player.send('Item does not exist');
        return;
    }

    if (!arg[1]) {
        arg[1] = 1;
    }

    if (player.addItem(arg[0], parseInt(arg[1]), itemTemplate.props)) {
        player.send('Added Item');
    } else {
        player.send('Did not add item.');
    }
});

chat.registerRankedCmd('addveh', AdminFlags.MAX, (player, arg) => {
    if (arg == undefined || arg.length == 0) {
        player.send('Usage: /addveh (vehicle)');
        return;
    }

    try {
        player.addVehicle(arg[0], player.pos, new alt.Vector3(0, 0, 0));
    } catch (e) {
        player.send('Not a valid vehicle model. Must be a plain name. ie. infernus');
    }
});

chat.registerRankedCmd('coord', AdminFlags.MAX, (player, args) => {
    if (args.length <= 2) {
        player.send('Usage: /coord (x, y, z)');
        return;
    }

    player.pos = {
        x: args[0],
        y: args[1],
        z: args[2]
    };
});

chat.registerRankedCmd('tpwp', AdminFlags.MAX, player => {
    const callbackName = `${player.name}tpwp`;
    alt.onClient(callbackName, teleportToWaypoint);
    alt.emitClient(player, 'teleportToWaypoint', callbackName);
});

function teleportToWaypoint(player, callbackName, coords) {
    alt.offClient(callbackName, teleportToWaypoint);
    if (!coords) {
        player.send('Could not parse coords.');
        return;
    }

    player.send('You were teleported.');
    player.pos = coords;
}

chat.registerRankedCmd('addxp', AdminFlags.MAX, (player, args) => {
    const _skill = args[0];
    const _amount = parseInt(args[1]);

    if (!_skill || !_amount) {
        player.send(`/addxp <skill> <amount>`);
        return;
    }

    addXP(player, _skill, _amount);
});

chat.registerRankedCmd('setxp', AdminFlags.MAX, (player, args) => {
    const _skill = args[0];
    const _amount = parseInt(args[1]);

    if (!_skill || !_amount) {
        player.send(`/setxp <skill> <amount>`);
        return;
    }

    setXP(player, _skill, _amount);
});

chat.registerRankedCmd('forcerevive', AdminFlags.MAX, (player, args) => {
    if (args.length !== 1) {
        player.send('The player must be logged into the game to set this.');
        player.send(`/forcerevive <character_id>`);
        return;
    }

    const _id = args[0];
    const id = parseInt(_id);
    const target = alt.Player.all.find(target => target.data.id === id);
    if (!target) {
        player.send('That person is not currently logged in.');
        return;
    }

    target.revive();
});

chat.registerRankedCmd('setadmin', AdminFlags.MAX, (player, args) => {
    if (args.length < 1) {
        player.send('The player must be logged into the game to set this.');
        player.send(`/setadmin <character_id> <rank>`);
        return;
    }

    const _id = args[0];
    const _rank = args[1];

    if (_id === undefined || _id === null) {
        player.send('The player must be logged into the game to set this.');
        player.send(`/setadmin <character_id> <rank>`);
        return;
    }

    if (_rank === undefined || _rank === null) {
        player.send('The player must be logged into the game to set this.');
        player.send(`/setadmin <character_id> <rank>`);
        return;
    }

    const id = parseInt(_id);
    const target = alt.Player.all.find(target => target.data.id === id);
    if (!target) {
        player.send('That person is not currently logged in.');
        return;
    }

    const rank = parseInt(_rank);
    if (rank < 0) {
        rank = 0;
    }

    if (rank > AdminFlags.MAX) {
        rank = AdminFlags.MAX;
    }

    target.setRank(rank);
});
