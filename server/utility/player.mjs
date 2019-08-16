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

    // Save only a specific field.
    player.saveField = (id, fieldName, fieldValue) => {
        db.updatePartialData(
            id,
            { [fieldName]: fieldValue },
            'Character',
            () => {}
        );
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

    // ====================================
    // Money Functions
    player.subCash = value => {
        let absValue = Math.abs(parseFloat(value)) * 1;

        if (player.data.cash < absValue) return false;

        player.data.cash -= absValue;
        player.data.cash = Number.parseFloat(player.data.cash).toFixed(2) * 1;
        player.saveField(player.data.id, 'cash', player.data.cash);
        return true;
    };

    player.addCash = value => {
        let absValue = Math.abs(parseFloat(value));

        if (player.data.cash + absValue > 92233720368547758.07) {
            absValue = 0;
        }

        player.data.cash += absValue;
        player.data.cash = Number.parseFloat(player.data.cash).toFixed(2) * 1;
        player.saveField(player.data.id, 'cash', player.data.cash);
        return true;
    };

    player.addBank = value => {
        let absValue = Math.abs(parseFloat(value));

        if (player.data.bank + absValue > 92233720368547758.07) {
            absValue = 0;
        }

        player.data.bank += absValue;
        player.data.bank = Number.parseFloat(player.data.bank).toFixed(2) * 1;
        player.saveField(player.data.id, 'bank', player.data.bank);
        return true;
    };

    player.subBank = value => {
        let absValue = Math.abs(parseFloat(value)) * 1;

        if (player.data.bank < absValue) return false;

        player.data.bank -= absValue;
        player.data.bank = Number.parseFloat(player.data.bank).toFixed(2) * 1;
        player.saveField(player.data.id, 'bank', player.data.bank);
        return true;
    };

    player.getCash = () => {
        return player.data.cash;
    };

    player.getBank = () => {
        return player.data.bank;
    };
}
