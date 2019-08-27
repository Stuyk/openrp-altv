import * as alt from 'alt';
import * as configurationJob from '../configuration/job.mjs';
import * as utilityVector from '../utility/vector.mjs';
import { Interaction } from '../systems/interaction.mjs';

const jobs = configurationJob.Configuration;

jobs.forEach((job, index) => {
    //position, type, serverEventName, radius, height, message, indexValue)
    let interact = new Interaction(
        job.start,
        'job',
        'job:StartJob',
        3,
        2,
        job.name,
        index
    );
    interact.addBlip(job.blipSprite, job.blipColor, job.name);
});

/* The way these jobs work....
 1. Load the Jobs from the Configuration.
 2. Create Interaction points for each job.
 3. Player visits the interaction point; and presses E to start the job.
 4. Once the job is started...
 5. Synchronize the Job Data with the player on client-side.
 6. Show the markers for the points.
 7. JobPoint is the current index of the target point in points in the configuration.
 8. Player visits the point; it has a TYPE.
 9. Depending on the TYPE it will invoke various functions on the server.
 10. After visiting all points in the list; the job is considered complete.
 11. Rewards are distributed on an per-objective basis.
 12. Cleanup job after finishing. 
 */

alt.on('job:StartJob', (player, index) => {
    if (index === undefined) return;

    let currentJob = jobs[index];
    if (!player.job) player.job = {};

    if (player.job.active) {
        player.send('Finish what you started.');
        return;
    }

    player.job.active = true;
    player.job.current = currentJob;
    player.job.point = 0;
    player.job.position = currentJob.points[player.job.point].position;
    player.syncJob(JSON.stringify(currentJob));
    player.syncJobPoint(0, true); // The last parameter synchronizes to client-side.
    player.send('Starting job!');
});

// Us
export function testObjective(player) {
    if (player.job.isTesting) return;
    if (!player.job.active) return;

    // Begin testing again.
    player.job.isTesting = true;

    // Failed Distance Check
    if (utilityVector.distance(player.pos, player.job.position) > 3) {
        player.job.isTesting = false;
        return;
    }

    // Add Objective Reard
    if (player.job.current.points[player.job.point].reward > 0) {
        player.addCash(player.job.current.points[player.job.point].reward);
    }

    // Increment the Job Point
    player.send('Objective Complete');
    player.job.point += 1;

    // Check if a objective Exists
    if (player.job.current.points[player.job.point] === undefined) {
        player.send('Job Completed');
        player.syncJob(null, false);
        player.syncJobPoint(null, true);
        player.job.active = false;
        player.job.isTesting = false;
        return;
    }

    // Go to the next objective.
    player.job.position = player.job.current.points[player.job.point].position;
    player.syncJobPoint(player.job.point, true);
    player.send('Proceed to the next point.');
    player.job.isTesting = false;
}
