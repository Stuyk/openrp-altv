import * as alt from 'alt';

// Props is defined in the configuration.
alt.on('itemeffects:UseMedkit', (player, item, hash) => {
    if (!player.subItem(item.key, 1)) {
        return;
    }

    // Add health to the user.
    if (item.props.health !== undefined) {
        player.health += item.props.health;
    }

    player.notify(`You use the ${item.name}`);
});
