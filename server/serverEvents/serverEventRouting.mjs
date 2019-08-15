import * as alt from 'alt';
import * as login from '../registration/login.mjs';
import * as chat from '../chat/chat.mjs';

// On load; send a message.
console.log('Loaded: serverEvents->serverEventRouting.mjs');

// This file is meant as a way to organize server events and import accordingly.
alt.on('chatIntercept', chat.relayChat);
