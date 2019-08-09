import * as alt from 'alt';

// Called when a client attempts to Register an account.
alt.onClient('register', (player, username, password) => {
    alt.emit('register:Event', player, username, password);
});

// Called when a client attempts to Login to an account.
alt.onClient('existing', (player, username, password) => {
    alt.emit('login:Event', player, username, password);
});
