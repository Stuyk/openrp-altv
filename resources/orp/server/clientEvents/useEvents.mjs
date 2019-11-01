import * as alt from 'alt';
import * as systemsUse from '../systems/use.mjs';

const events = {
    'use:SodaMachine': systemsUse.sodaMachine,
    'use:PayPhone': systemsUse.payPhone,
    'use:MetroTicketMachine': systemsUse.metroTicketMachine,
    'use:PostalBox': systemsUse.postalBox,
    'use:HideDumpster': systemsUse.hideDumpster,
    'use:SearchDumpster': systemsUse.searchDumpster,
    'use:LeaveDumpster': systemsUse.leaveDumpster,
    'use:Atm': systemsUse.atm,
    'use:ExitLabs': systemsUse.exitLabs,
    'use:CuffPlayer': systemsUse.cuffPlayer,
    'use:UncuffPlayer': systemsUse.uncuffPlayer,
    'use:ToggleDoor': systemsUse.toggleDoor,
    'use:BreakCuffs': systemsUse.breakCuffs,
    'use:CuffPlayerFreely': systemsUse.cuffPlayerFreely,
    'use:FriskPlayer': systemsUse.friskPlayer,
    'use:CoffeeMachine': systemsUse.coffeeMachine,
    'use:HospitalBed': systemsUse.hospitalBed,
    'use:FireExtinguisher': systemsUse.fireExtinguisher,
    'use:UseDynamicDoor': systemsUse.useDynamicDoor,
    'use:LockDynamicDoor': systemsUse.lockDynamicDoor,
    'use:ExitDynamicDoor': systemsUse.exitDynamicDoor,
    'use:PurchaseDynamicDoor': systemsUse.purchaseDynamicDoor,
    'use:CookFood': systemsUse.cookFood
};

Object.keys(events).forEach(key => {
    alt.onClient(key, events[key]);
});
