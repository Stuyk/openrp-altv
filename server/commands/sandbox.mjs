import * as alt from 'alt';
import * as chat from '../chat/chat.mjs';
import * as configurationItems from '../configuration/items.mjs';
import { addWeapon } from '../systems/inventory.mjs';
import { addXP, setXP } from '../systems/skills.mjs';

console.log('Loaded: commands->sandbox.mjs');

<<<<<<< HEAD
<<<<<<< HEAD
const sandboxhelp = [
    //
    '/b, /me, /do',
    '/addveh (model)',
    '/addcash (amount)',
    '/addwep (name)',
    '/face, /addxp, /setxp',
    '/granola, /coffee',
    '/tpto (rp-name)',
    '/players, /clearchat',
    '/taxi, /mechanic',
    '/cancel',
    '/quitjob, /getsector',
    '/tryparticle',
    '/phonenumber',
    '/t, /call, /addcontact, /removecontact, /hangup',
    'Press TAB for context cursor.',
    'I for Inventory'
];

=======
>>>>>>> adding help dialogue
chat.registerCmd('help', player => {
    player.showHelp();
});

=======
>>>>>>> reworking help; using preact and different design
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

chat.registerCmd('addxp', (player, args) => {
    const _skill = args[0];
    const _amount = parseInt(args[1]);

    if (!_skill || !_amount) {
        player.send(`/addxp <skill> <amount>`);
        return;
    }

    addXP(player, _skill, _amount);
});

chat.registerCmd('setxp', (player, args) => {
    const _skill = args[0];
    const _amount = parseInt(args[1]);

    if (!_skill || !_amount) {
        player.send(`/setxp <skill> <amount>`);
        return;
    }

    setXP(player, _skill, _amount);
});

chat.registerCmd('tryparticle', (player, args) => {
    const _dict = args[0];
    const _name = args[1];
    const _duration = args[2];
    const _scale = args[3];

    if (!_dict || !_name || !_duration || !_scale) {
        player.send(`/tryparticle <dict> <name> <duration> <scale>`);
        return;
    }

    alt.emitClient(
        player,
        'tryParticle',
        _dict,
        _name,
        parseFloat(_duration),
        parseFloat(_scale)
    );
});
