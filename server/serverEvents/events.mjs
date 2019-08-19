import * as alt from 'alt';
import * as chatChat from '../chat/chat.mjs';

// On load; send a message.
console.log('Loaded: serverEvents->serverEventRouting.mjs');

// This file is meant as a way to organize server events and import accordingly.
alt.on('chatIntercept', chatChat.relayChat);
