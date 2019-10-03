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
    if (item.props.armor !== undefined) {
        player.armor += item.props.armor;
    }

    player.send(`You consume the ${item.name}`);
});
