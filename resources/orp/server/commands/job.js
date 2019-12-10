import * as alt from 'alt';
import * as chat from '../chat/chat.js';
import { quitJob, quitTarget } from '../systems/job.js';

chat.registerCmd('quitjob', player => {
    quitJob(player);
});

chat.registerCmd('cancel', player => {
    if (player.jobber) {
        quitTarget(player);
    }
});
