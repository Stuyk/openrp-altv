import * as alt from 'alt';

// Called when a client attempts to Register an account.
alt.onClient('register', (player, username, password) => {
    alt.emit('register:Event', player, username, password);
});

// Called when a client attempts to Login to an account.
alt.onClient('existing', (player, username, password) => {
    alt.emit('login:Event', player, username, password);
});

// Save the player face to the database.
alt.onClient('setPlayerFacialData', (player, facialJSON) => {
    player.characterData.characterface = facialJSON;
    player.pos = player.lastLocation;

    const characterFaceData = JSON.parse(facialJSON);

    if (characterFaceData['Sex'].value === 0) {
        player.model = 'mp_f_freemode_01';
    } else {
        player.model = 'mp_m_freemode_01';
    }

    alt.emit('saveCharacter', player);
    alt.emitClient(player, 'applyFacialData', facialJSON);
});

alt.onClient('requestFaceCustomizer', player => {
    player.lastLocation = player.pos;
    alt.emitClient(player, 'requestFaceCustomizer');
});

// Temp
alt.onClient('temporaryTeleport', (player, coords) => {
    player.tempPos = player.pos;
    player.pos = coords;
});
