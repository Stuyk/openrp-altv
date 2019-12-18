import * as alt from 'alt';
import { Config } from '../configuration/config.js';

alt.onClient('atm:Redeem', redeemPoints);

function redeemPoints(player, amount) {
    if (player.isRedeeming) {
        return;
    }

    player.isRedeeming = true;

    if (isNaN(amount)) {
        player.isRedeeming = false;
        return;
    }

    if (amount <= 0) {
        player.isRedeeming = false;
        return;
    }

    if (player.data.rewardpoints - amount <= -1) {
        player.isRedeeming = false;
        return;
    }

    if (!player.removeRewardPoints(amount)) {
        player.isRedeeming = false;
        return;
    }

    const perPoint = Config.defaultPlayerPaycheck;
    const totalCash = amount * perPoint;
    player.addCash(totalCash);
    player.notify(`You redeemed ${amount} points for $${totalCash}.`);
    player.isRedeeming = false;
}
