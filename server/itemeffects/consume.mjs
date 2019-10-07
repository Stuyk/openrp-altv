import * as alt from 'alt';

// Props is defined in the configuration.
alt.on('itemeffects:Consume', (player, item, hash) => {
    console.log(item);

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
        console.log(player.armour);
    }

    player.send(`You consume the ${item.name}`);
});
