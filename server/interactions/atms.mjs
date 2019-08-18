import * as alt from 'alt';
import * as interactions from '../systems/interactionsystem.mjs';
import * as atmList from '../configuration/atms.mjs';

console.log('Loaded: interactions->atms.mjs');

const atms = [];

// Go through the ATM Configuration List
// Create a Interaction for each one.
// Put them into the above list.
// We also subtract 1 from the z position to ensure
// that the player is not below the point.
for (let i = 0; i < atmList.Atms.length; i++) {
    let pos = atmList.Atms[i];
    pos.z -= 1;

    // position, type, serverEventName, radius, height
    let res = new interactions.Interaction(
        pos,
        'atm', // type
        'atm:ShowDialogue', // The event to call when the player presses 'E'.
        2,
        3
    );

    atms.push(res);
}

// We go through the atm list; create a blip for each one.
// This is called when the player joins the server.
export function synchronizeBlips(player) {
    atms.forEach(element => {
        player.createBlip(element.pos, 108, 2, 'ATM');
    });
}

// Called when the player wants to make a withdrawl from the ATM.
export function withdraw(player, value) {
    const result = player.subBank(value);

    if (!result) {
        // Add alert.
        console.log(`${player.name} is trying to break the system.`);
        return;
    }

    player.addCash(value);
    player.updateAtmCash(player.getCash());
    player.updateAtmBank(player.getBank());
    player.showAtmSuccess(`Successfully withdrew $${value}.`);
}

// Called when the player wants to make a deposit to the ATM.
export function deposit(player, value) {
    const result = player.subCash(value);

    if (!result) {
        // Add alert.
        console.log(`${player.name} is trying to break the system.`);
        return;
    }

    player.addBank(value);
    player.updateAtmCash(player.getCash());
    player.updateAtmBank(player.getBank());
    player.showAtmSuccess(`Successfully deposited $${value}.`);
}

// Called when the player presses 'E'. The data gets forwarded here.
alt.on('atm:ShowDialogue', player => {
    player.showAtmPanel();
    player.updateAtmCash(player.data.cash);
    player.updateAtmBank(player.data.bank);
});
