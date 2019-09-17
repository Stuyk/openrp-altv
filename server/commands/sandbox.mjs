import * as alt from 'alt';
import * as chat from '../chat/chat.mjs';
import * as configurationItems from '../configuration/items.mjs';
import { addWeapon } from '../systems/inventory.mjs';

console.log('Loaded: commands->sandbox.mjs');

const sandboxhelp = [
    //
    '/b, /me, /do',
    '/addveh (model)',
    '/addcash (amount)',
    '/addwep (name)',
    '/face',
    '/granola, /coffee',
    '/tpto (rp-name)',
    '/players, /clearchat',
    '/taxi, /taxicancel',
    '/mechanic, /mechaniccancel',
    '/quitjob, /getsector',
    '/t, /call, /addcontact, /removecontact, /hangup',
    'Press TAB for context cursor.',
    'I for Inventory'
];

chat.registerCmd('help', player => {
    sandboxhelp.forEach(helper => {
        player.send(`${helper}`);
    });
});

chat.registerCmd('addcash', (player, value) => {
    let data = value * 1;
    if (value > 600000) return;
    player.addCash(data);
});

chat.registerCmd('addwep', (player, arg) => {
    if (arg === undefined || arg.length == 0) {
        player.send('Usage: /addwep (name)');
        return;
    }

    if (!addWeapon(player, arg[0])) {
        player.send('Weapon does not exist');
        return;
    }

    player.send(`Weapon was added to your inventory.`);
});

chat.registerCmd('face', player => {
    player.showFaceCustomizerDialogue(player.pos);
});

chat.registerCmd('granola', player => {
    let itemTemplate = configurationItems.Items['GranolaBar'];
    player.addItem(itemTemplate, 5);
});

chat.registerCmd('coffee', player => {
    let itemTemplate = configurationItems.Items['Coffee'];
    player.addItem(itemTemplate, 5);
});

chat.registerCmd('additem', (player, arg) => {
    if (arg == undefined || arg.length == 0) {
        player.send('Usage: /additem (item)');
        return;
    }

    let itemTemplate = configurationItems.Items[`${arg[0]}`];
    if (itemTemplate === undefined) {
        player.send('Item does not exist');
        return;
    }
    player.addItem(itemTemplate, 1);
});

chat.registerCmd('addveh', (player, arg) => {
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

chat.registerCmd('coord', (player, args) => {
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

chat.registerCmd('tpto', (player, arg) => {
    if (arg === undefined || arg.length == 0) {
        player.send('Usage: /tpto (roleplay_name)');
        return;
    }

    let target = alt.Player.all.find(x => x.data.name.includes(arg[0]));

    if (target === undefined) {
        player.send('User was not found.');
        return;
    }

    player.pos = target.pos;
});

chat.registerCmd('players', player => {
    alt.Player.all.forEach(t => {
        player.send(`${t.data.name}`);
    });
});

chat.registerCmd('pos', player => {
    player.send(`${JSON.stringify(player.pos)}`);
    console.log(player.pos);
});

chat.registerCmd('save', player => {
    player.data.pos = JSON.stringify(player.pos);
    player.save();
});

chat.registerCmd('sector', player => {
    player.send(`Current Sector -> X: ${player.sector.x}, Y: ${player.sector.y}`);
});
