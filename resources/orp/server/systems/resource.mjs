import * as alt from 'alt';
import { distance } from '../utility/vector.mjs';
import { Items } from '../configuration/items.mjs';
import { addXP } from './skills.mjs';

const resources = {
    rock: {},
    tree: {}
};

const rewards = {
    rock: {
        key: 'unrefinedmetal',
        skill: {
            name: 'mining',
            xp: 83.5
        }
    },
    tree: {
        key: 'unrefinedwood',
        skill: {
            name: 'woodcutting',
            xp: 83.5
        }
    }
};

alt.onClient('resource:Prospect', (player, data) => {
    const coords = JSON.stringify(data.coords);
    const type = data.type;

    if (!coords || !type) {
        return;
    }

    if (!resources[type]) {
        return;
    }

    if (!resources[type][coords]) {
        resources[type][coords] = {
            amount: Math.floor(Math.random() * 50)
        };
    }

    const resourceData = resources[type][coords];
    alt.emitClient(player, 'resource:Update', type, data.coords, resourceData);
});

alt.onClient('resource:BeginFarming', (player, coords, type) => {
    player.farming = {
        coords,
        type
    };
    player.notify(`You have begun resource harvesting.`);
});

// Called every 10 seconds.
alt.on('resource:Farm', player => {
    if (!player.farming) {
        alt.emitClient(player, 'resource:StopFarming');
        return;
    }

    const type = player.farming.type;
    const coords = player.farming.coords;

    if (!type || !coords) {
        player.farming = undefined;
        alt.emitClient(player, 'resource:StopFarming');
        return;
    }

    if (distance(coords, player.pos) > 3) {
        player.farming = undefined;
        player.send(`{FF0000} Exceeded range of resource point.`);
        alt.emitClient(player, 'resource:StopFarming');
        return;
    }

    const resourceData = resources[type][JSON.stringify(coords)];
    if (!resourceData || resourceData.amount === 0) {
        player.farming = undefined;
        player.notify('Resources have been exhausted.');
        alt.emitClient(player, 'resource:StopFarming');
        return;
    }

    const reward = rewards[type];
    if (!reward || !Items[reward.key]) {
        player.farming = undefined;
        alt.log(`Reward not defined for ${type}.`);
        alt.emitClient(player, 'resource:StopFarming');
        return;
    }

    const slots = player.getNullSlots();
    if (slots <= 0) {
        player.farming = undefined;
        player.send(`{FF0000} Inventory is full.`);
        alt.emitClient(player, 'resource:StopFarming');
        return;
    }

    let quantity = 1;

    // Maxed out.
    if (resourceData.amount < quantity) {
        quantity = resourceData.amount;
    }

    // All valid. Let's try adding a resource.
    if (!player.addItem(reward.key, quantity, Items[reward.key].props)) {
        player.farming = undefined;
        player.send(`{FF0000} Inventory is full.`);
        alt.emitClient(player, 'resource:StopFarming');
        return;
    }

    resourceData.amount -= quantity;
    alt.emitClient(player, 'resource:FarmTick', coords, type);
    alt.emitClient(player, 'resource:Update', type, coords, resourceData);

    if (reward.skill) {
        addXP(player, reward.skill.name, Math.floor(reward.skill.xp * quantity));
    }

    player.notify(`${Items[reward.key].name} x${quantity} was added to inventory.`);
});
