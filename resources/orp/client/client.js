/* eslint-disable no-unused-vars */
import * as alt from 'alt';
import * as native from 'natives';
import { showCursor } from '/client/utility/cursor.js';
import { Ped } from '/client/systems/peds.js';

alt.log('Loaded: client.js');

// Import Events that need to be imported.
// Importing these pretty much imports the rest.
import * as serverEvents from '/client/serverEvents/events.js';
import * as eventsDisconnect from '/client/events/disconnect.js';
import * as eventsUpdate from '/client/events/update.js';
import * as keybinds from '/client/events/keybinds.js';
import * as eventsConnectionComplete from '/client/events/connectionComplete.js';
import * as panelsTrade from '/client/panels/trade.js';
import * as panelsInventory from '/client/panels/vehicleinventory.js';
import * as panelsFactions from '/client/panels/factions.js';
import * as systemsArrest from '/client/systems/arrest.js';
import * as systemsEquip from '/client/systems/equip.js';
import * as systemsInteraction from '/client/systems/interaction.js';
import * as systemsWeather from '/client/systems/weather.js';
import * as systemsCallbacks from '/client/systems/callbacks.js';
import * as systemsContext from '/client/systems/context.js';
import * as systemsCombat from '/client/systems/combat.js';
import * as systemsDeathBox from '/client/systems/deathbox.js';
import * as systemsDoors from '/client/systems/doors.js';
import * as systemsInteriors from '/client/systems/interiors.js';
import * as systemsFactions from '/client/systems/factions.js';
import * as systemsJob from '/client/systems/job.js';
import * as systemsRefinery from '/client/systems/refinery.js';
import * as systemsLumber from '/client/systems/lumber.js';
import * as systemsShop from '/client/systems/shop.js';
import * as systemsSkills from '/client/systems/skills.js';
import * as systemsTime from '/client/systems/time.js';
import * as systemsProps from '/client/systems/props.js';
import * as systemsSkyCam from '/client/systems/skycam.js';
import * as systemsJobTwo from '/client/systems/job2.js';

import * as utilitySandbox from '/client/utility/sandbox.js';
import * as hud from '/client/hud/hud.js';
import * as discord from '/client/panels/discord.js';

// Context
import * as contextmenuObject from '/client/contextmenus/object.js';
import * as contextmenuPed from '/client/contextmenus/ped.js';
import * as contextmenuVehicle from '/client/contextmenus/vehicle.js';
import * as contextmenuPlayer from '/client/contextmenus/player.js';

// Extender
import * as systemsObjectExtender from '/client/systems/objectextender.js';
