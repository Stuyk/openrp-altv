import * as alt from 'alt';
import * as native from 'natives';

alt.onServer('door:Lock', (type, pos, heading) => {
    alt.log(JSON.stringify(type));
    alt.log(JSON.stringify(pos));

    native.setStateOfClosestDoorOfType(type, pos.x, pos.y, pos.z, true, heading, 0);
});

alt.onServer('door:Unlock', (type, pos, heading) => {
    native.setStateOfClosestDoorOfType(type, pos.x, pos.y, pos.z, false, heading, 0);
});
