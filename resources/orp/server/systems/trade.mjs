import * as alt from 'alt';
import { distance } from '../utility/vector.mjs';
import { Items, BaseItems } from '../configuration/items.mjs';

alt.on('trade:KillTrade', killTrade);
alt.onClient('trade:Offer', offerTrade);
alt.onClient('trade:Establish', establishTrade);
alt.onClient('trade:OfferItems', offerItems);
alt.onClient('trade:OfferCash', offerCash);
alt.onClient('trade:LockState', lockState);
alt.onClient('trade:KillTrade', killTrade);
alt.onClient('trade:SetTargetSlotsAvailable', setTargetSlotsAvailable);

function offerTrade(player, data) {
    const target = data.target;

    if (target.trading === player) {
        establishTrade(player, target);
        return;
    }

    player.trading = target;
    target.trading = player;

    player.send(`{00FF00}You offered ${target.data.name} to trade.`);
    target.send(`{00FF00}${player.data.name} has offered to trade.`);

    player.emitMeta('trade', target);
    target.emitMeta('trade', player);
}

function establishTrade(player, target) {
    if (distance(player.pos, target.pos) >= 3) {
        player.notify('You are too far away to trade.');
        return;
    }

    player.isTradeLocked = false;
    target.isTradeLocked = false;

    player.tradeData = {
        cash: 0,
        items: []
    };

    target.tradeData = {
        cash: 0,
        items: []
    };

    alt.emitClient(player, 'trade:Establish', target);
    alt.emitClient(target, 'trade:Establish', player);
}

function offerItems(player, items) {
    const target = player.trading;
    if (!target) {
        killTrade(player);
        return;
    }

    const removeHashes = [];
    items.forEach((item, index) => {
        if (!Items[item.key]) {
            return;
        }

        const baseKey = Items[item.key].base;

        if (!BaseItems[baseKey]) {
            return;
        }

        if (BaseItems[baseKey].abilities.sell) {
            return;
        }

        removeHashes.push(item.hash);
    });

    if (removeHashes.length >= 1) {
        removeHashes.forEach(hash => {
            const index = items.findIndex(item => item.hash === hash);
            if (index <= -1) {
                return;
            }

            items.splice(index, 1);
        });

        alt.emitClient(player, 'trade:ResetHashes', removeHashes);
    }

    player.tradeData.items = items;
    alt.emitClient(target, 'trade:SetOfferedItems', items);
}

function offerCash(player, cash) {
    const target = player.trading;
    if (!target) {
        killTrade(player);
        return;
    }

    player.tradeData.cash = cash;
    alt.emitClient(target, 'trade:SetOfferedCash', cash);
}

function lockState(player, lockState) {
    const target = player.trading;
    if (!target) {
        killTrade(player);
        return;
    }

    player.isTradeLocked = lockState;
    if (target.isTradeLocked && player.isTradeLocked) {
        // Trade Confirmed. Finish Up.
        finishTrade(player, target);
        return;
    }

    alt.emitClient(target, 'trade:SetLockState', lockState);
}

function killTrade(player) {
    const target = player.trading;

    player.emitMeta('trade', null);
    player.trading = null;
    alt.emitClient(player, 'trade:KillTrade');

    if (!target) {
        return;
    }

    target.emitMeta('trade', null);
    target.trading = null;
    alt.emitClient(target, 'trade:KillTrade');
}

function setTargetSlotsAvailable(player, slots) {
    const target = player.trading;
    if (!target) {
        killTrade(player);
        return;
    }

    alt.emitClient(target, 'trade:SetTargetSlots', slots);
}

function finishTrade(player, target) {
    const targetItems = target.tradeData.items;
    const targetCash = target.tradeData.cash;

    const playerItems = player.tradeData.items;
    const playerCash = player.tradeData.cash;

    const targetNullSlots = target.getNullSlots();
    const playerNullSlots = player.getNullSlots();

    if (targetNullSlots < playerItems.length) {
        killTrade(player);
        player.send('{FF0000} Target does not have enough slots.');
        target.send('{FF0000} You do not have enough slots.');
        return;
    }

    if (playerNullSlots < targetItems.length) {
        killTrade(player);
        target.send('{FF0000} Target does not have enough slots.');
        player.send('{FF0000} You do not have enough slots.');
        return;
    }

    if (player.getCash() < playerCash) {
        killTrade(player);
        target.send('{FF0000} Target does not have enough cash.');
        player.send('{FF0000} You do not have enough cash.');
        return;
    }

    if (target.getCash() < targetCash) {
        killTrade(player);
        player.send('{FF0000} Target does not have enough cash.');
        target.send('{FF0000} You do not have enough cash.');
        return;
    }

    playerItems.forEach(item => {
        const itemDuplicate = {
            ...player.inventory.find(i => i && i.hash === item.hash)
        };
        if (itemDuplicate === {}) {
            return;
        }
        player.subItemByHash(item.hash);
        target.addItem(
            itemDuplicate.key,
            itemDuplicate.quantity,
            itemDuplicate.props,
            false,
            false,
            itemDuplicate.name,
            itemDuplicate.icon,
            itemDuplicate.key
        );
    });

    targetItems.forEach(item => {
        const itemDuplicate = {
            ...target.inventory.find(i => i && i.hash === item.hash)
        };
        if (itemDuplicate === {}) {
            return;
        }

        target.subItemByHash(item.hash);
        player.addItem(
            itemDuplicate.key,
            itemDuplicate.quantity,
            itemDuplicate.props,
            false,
            false,
            itemDuplicate.name,
            itemDuplicate.icon
        );
    });

    if (playerCash > 0) {
        player.subCash(playerCash);
        target.addCash(playerCash);
    }

    if (targetCash > 0) {
        target.subCash(targetCash);
        player.addCash(targetCash);
    }

    player.notify('The trade is complete!');
    target.notify('The trade is complete!');
    killTrade(player);
}
