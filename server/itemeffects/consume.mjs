import * as alt from 'alt';

// Props is defined in the configuration.
alt.on('itemeffects:Consume', (player, item, hash) => {
    if (!player.subItem(item.key, 1)) {
        return;
    }

    // Add health to the user.
    if (item.props.health !== undefined) {
        player.health += item.props.health;
    }

    // Add armor to the user.
    if (item.props.armour !== undefined) {
        player.armour += item.props.armour;
    }

    if (item.props.skillbonus) {
        if (!player.skillBonus) {
            player.skillBonus = {};
        }

        item.props.skillbonus.forEach(data => {
            player.skillBonus[data.skill] = {
                level: data.level,
                time: Date.now() + 60000
            };
            player.send(`You feel more adapt in ${data.skill}.`);
        });
        player.emitMeta('skills:Bonus', player.skillBonus);
    }

    player.send(`You consume the ${item.name}`);
});
