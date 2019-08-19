import * as alt from 'alt';

// Props is defined in the configuration.
alt.on('itemeffects:Consume', (player, props, message) => {
    // Add health to the user.
    if (props.health !== undefined) {
        player.health += props.health;
    }

    // Add armor to the user.
    if (props.armor !== undefined) {
        player.armor += props.armor;
    }

    if (message !== undefined && message !== null) {
        player.sendMessage(message);
    }
});
