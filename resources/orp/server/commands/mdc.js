import * as alt from 'alt';
import * as chat from '../chat/chat.js';

chat.registerCmd('mdc', player => {
    if (!player.job) return;
    if (!player.job.name.includes('Officer')) return;
    alt.emitClient(player, 'mdc:ShowDialogue');
});

chat.registerCmd('officer', player => {
    alt.emit('job:Officer', player);
});
