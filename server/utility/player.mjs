import * as alt from 'alt';
import SQL from '../../../postgres-wrapper/database.mjs';

console.log('Loaded: utility->player.mjs');

// Load the database handler.
const db = new SQL();

export function setupPlayerFunctions(player) {
    // ====================================
    // Enable Player Saving
    player.save = () => {
        db.upsertData(player.data, 'Character', res => {
            if (player.data.name === null) {
                console.log(`${player.name} was saved.`);
            } else {
                console.log(`${player.data.name} was saved.`);
            }
        });
    };

    // ====================================
    // Registration Webview Related Events
    player.showRegisterDialogue = (regCamCoord, regCamPointAtCoord) => {
        alt.emitClient(
            player,
            'register:ShowDialogue',
            regCamCoord,
            regCamPointAtCoord
        );
    };

    // Show Error Message
    player.showRegisterEventError = msg => {
        alt.emitClient(player, 'register:EmitEventError', msg);
    };

    // Show Success Message
    player.showRegisterEventSuccess = msg => {
        alt.emitClient(player, 'register:EmitEventSuccess', msg);
    };

    // Show Success Message
    player.showRegisterLogin = () => {
        alt.emitClient(player, 'register:ShowLogin');
    };

    // Close Dialogue
    player.closeRegisterDialogue = () => {
        alt.emitClient(player, 'register:CloseDialogue');
    };

    // ====================================
    // Screen Effects
    player.screenFadeOutFadeIn = (fadeInOutMS, timeoutMS) => {
        alt.emitClient(player, 'screen:FadeOutFadeIn', fadeInOutMS, timeoutMS);
    };

    player.screenFadeOut = timeInMS => {
        alt.emitClient(player, 'screen:FadeOut', timeInMS);
    };

    player.screenFadeIn = timeInMS => {
        alt.emitClient(player, 'screen:FadeIn', timeInMS);
    };

    player.screenBlurOut = timeInMS => {
        alt.emitClient(player, 'screen:BlurOut', timeInMS);
    };

    player.screenBlurIn = timeInMS => {
        alt.emitClient(player, 'screen:BlurIn', timeInMS);
    };

    // ====================================
    // Face Customizer
    player.showFaceCustomizerDialogue = () => {
        alt.emitClient(player, 'facecustomizer:ShowDialogue');
    };

    // ====================================
    // Roleplay Name Dialogues
    player.showRoleplayNameDialogue = () => {
        alt.emitClient(player, 'roleplayname:ShowDialogue');
    };

    player.closeRoleplayNameDialogue = () => {
        alt.emitClient(player, 'roleplayname:CloseDialogue');
    };

    player.showRoleplayNameTaken = () => {
        alt.emitClient(player, 'roleplayname:ShowNameTaken');
    };
}
