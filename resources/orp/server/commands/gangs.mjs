import * as alt from 'alt';
import * as chat from '../chat/chat.mjs';

chat.registerCmd('acceptgang', player => {
    alt.emit('gang:AcceptInvite', player);
});
