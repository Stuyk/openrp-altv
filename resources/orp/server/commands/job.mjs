import * as alt from 'alt';
import * as chat from '../chat/chat.mjs';
import { quitJob, quitTarget } from '../systems/job.mjs';

chat.registerCmd('quitjob', player => {
    quitJob(player);
});

chat.registerCmd('cancel', player => {
    if (player.jobber) {
        quitTarget(player);
    }
});
