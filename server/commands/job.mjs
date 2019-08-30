import * as alt from 'alt';
import * as chat from '../chat/chat.mjs';
import * as systemsJob from '../systems/job.mjs';

chat.registerCmd('quitjob', player => {
    systemsJob.cancelJob(player);
});
