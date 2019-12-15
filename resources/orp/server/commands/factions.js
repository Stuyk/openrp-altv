import * as alt from 'alt';
import * as chat from '../chat/chat.js';

chat.registerCmd('acceptfaction', player => {
    alt.emit('faction:AcceptMember', player);
});
