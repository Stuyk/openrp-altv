import * as alt from 'alt';
import * as chat from '../chat/chat.mjs';
import { quitJob } from '../systems/job.mjs';

chat.registerCmd('quitjob', player => {
    quitJob(player);
});
