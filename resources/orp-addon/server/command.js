import * as alt from 'alt';

// Register your commands here.
alt.on('orp:Ready', () => {
    // The last parameter is the callback name. test1 is the command name.
    alt.emit('orp:RegisterCmd', 'test1', 'mySpecialCallback');
});

alt.on('mySpecialCallback', (player, args) => {
    console.log(player); // no player. funcs from ORP. Use playerFunc example to emit.
    console.log(args); // array
    alt.emit(
        'orp:PlayerFunc',
        player,
        'send',
        '{00FF00}Wow you found a hidden command. ;)'
    );
});
