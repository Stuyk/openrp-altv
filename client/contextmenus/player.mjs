import * as alt from 'alt';
import * as native from 'natives';
import { ContextMenu } from '/client/systems/context.mjs';

alt.log('Loaded: client->contextmenus->player.mjs');

/**
 * This has to be setup in a way that every player gets
 * default actions. Then additional submenus can be
 * tacked on.
 */

alt.on('menu:Player', ent => {
    new ContextMenu(ent, [
        {
            label: 'You'
        },
        {
            label: 'Animations',
            isServer: false,
            event: 'submenu:PlayerAnimations'
        }
    ]);
});

//data.dict, data.name, data.duration, data.flag
//animation:Play
alt.on('submenu:PlayerAnimations', ent => {
    new ContextMenu(ent, [
        {
            label: 'Animation Types'
        },
        {
            label: 'Clear',
            isServer: false,
            event: 'animation:Clear'
        },
        {
            label: 'Surrender',
            isServer: false,
            event: 'submenu:PlayerAnimSurrender'
        },
        {
            label: 'Emote',
            isServer: false,
            event: 'submenu:Emote'
        },
        {
            label: 'Emote 2',
            isServer: false,
            event: 'submenu:Emote2'
        },
        {
            label: 'Emote 3',
            isServer: false,
            event: 'submenu:Emote3'
        },
        {
            label: 'Assault',
            isServer: false,
            event: 'submenu:Assault'
        }
    ]);
});

alt.on('submenu:PlayerAnimSurrender', ent => {
    new ContextMenu(ent, [
        {
            label: 'Select'
        },
        {
            label: 'Handsup',
            isServer: false,
            event: 'animation:Play',
            data: {
                dict: 'random@mugging3',
                name: 'handsup_standing_base',
                flag: 49,
                duration: -1
            }
        },
        {
            label: 'Kneel',
            isServer: false,
            event: 'animation:Play',
            data: {
                dict: 'random@arrests',
                name: 'kneeling_arrest_idle',
                flag: 2,
                duration: -1
            }
        }
    ]);
});

alt.on('submenu:Emote', ent => {
    new ContextMenu(ent, [
        {
            label: 'Select'
        },
        {
            label: 'Salute',
            isServer: false,
            event: 'animation:Play',
            data: {
                dict: 'anim@mp_player_intuppersalute',
                name: 'idle_a',
                flag: 49,
                duration: -1
            }
        },
        {
            label: 'The Finger',
            isServer: false,
            event: 'animation:Play',
            data: {
                dict: 'anim@mp_player_intselfiethe_bird',
                name: 'idle_a',
                flag: 49,
                duration: -1
            }
        },
        {
            label: 'The Upper Finger',
            isServer: false,
            event: 'animation:Play',
            data: {
                dict: 'anim@mp_player_intupperfinger',
                name: 'idle_a',
                flag: 49,
                duration: -1
            }
        },
        {
            label: 'Facepalm',
            isServer: false,
            event: 'animation:Play',
            data: {
                dict: 'anim@mp_player_intupperface_palm',
                name: 'idle_a',
                flag: 49,
                duration: -1
            }
        },
        {
            label: 'Fold Arms A',
            isServer: false,
            event: 'animation:Play',
            data: {
                dict: 'missfbi_s4mop',
                name: 'guard_idle_a',
                flag: 49,
                duration: -1
            }
        },
        {
            label: 'Fold Arms B',
            isServer: false,
            event: 'animation:Play',
            data: {
                dict: 'oddjobs@assassinate@construction@',
                name: 'unarmed_fold_arms',
                flag: 49,
                duration: -1
            }
        },
        {
            label: 'Damn',
            isServer: false,
            event: 'animation:Play',
            data: {
                dict: 'gestures@m@standing@casual',
                name: 'gesture_damn',
                flag: 49,
                duration: -1
            }
        }
    ]);
});

alt.on('submenu:Emote2', ent => {
    new ContextMenu(ent, [
        {
            label: 'Select'
        },
        {
            label: 'No',
            isServer: false,
            event: 'animation:Play',
            data: {
                dict: 'mp_player_int_upper_nod',
                name: 'mp_player_int_nod_no',
                flag: 49,
                duration: -1
            }
        },
        {
            label: 'Get Picky',
            isServer: false,
            event: 'animation:Play',
            data: {
                dict: 'mp_player_int_upperarse_pick',
                name: 'mp_player_int_arse_pick',
                flag: 49,
                duration: -1
            }
        },
        {
            label: 'Grab Crotch',
            isServer: false,
            event: 'animation:Play',
            data: {
                dict: 'mp_player_int_uppergrab_crotch',
                name: 'mp_player_int_grab_crotch',
                flag: 49,
                duration: -1
            }
        },
        {
            label: 'Peace',
            isServer: false,
            event: 'animation:Play',
            data: {
                dict: 'mp_player_int_upperpeace_sign',
                name: 'mp_player_int_peace_sign',
                flag: 49,
                duration: -1
            }
        },
        {
            label: 'Play Dead',
            isServer: false,
            event: 'animation:Play',
            data: {
                dict: 'misslamar1dead_body',
                name: 'dead_idle',
                flag: 2,
                duration: -1
            }
        },
        {
            label: 'Slow Clap',
            isServer: false,
            event: 'animation:Play',
            data: {
                dict: 'anim@mp_player_intcelebrationmale@slow_clap',
                name: 'slow_clap',
                flag: 49,
                duration: -1
            }
        },
        {
            label: 'Lean on Wall',
            isServer: false,
            event: 'animation:Play',
            data: {
                dict: 'amb@lo_res_idles@',
                name: 'world_human_lean_male_foot_up_lo_res_base',
                flag: 49,
                duration: -1
            }
        }
    ]);
});

alt.on('submenu:Emote3', ent => {
    new ContextMenu(ent, [
        {
            label: 'Select'
        },
        {
            label: 'Sit Male',
            isServer: false,
            event: 'animation:Play',
            data: {
                dict: 'amb@world_human_picnic@male@base',
                name: 'base',
                flag: 1,
                duration: -1
            }
        },
        {
            label: 'Sit Female',
            isServer: false,
            event: 'animation:Play',
            data: {
                dict: 'amb@world_human_picnic@female@base',
                name: 'base',
                flag: 1,
                duration: -1
            }
        },
        {
            label: 'Bum',
            isServer: false,
            event: 'animation:Play',
            data: {
                dict: 'amb@world_human_bum_slumped@male@laying_on_left_side@base',
                name: 'base',
                flag: 2,
                duration: -1
            }
        },
        {
            label: 'Sit Ups',
            isServer: false,
            event: 'animation:Play',
            data: {
                dict: 'amb@world_human_sit_ups@male@base',
                name: 'base',
                flag: 1,
                duration: -1
            }
        },
        {
            label: 'Push Ups',
            isServer: false,
            event: 'animation:Play',
            data: {
                dict: 'amb@world_human_push_ups@male@base',
                name: 'base',
                flag: 1,
                duration: -1
            }
        },
        {
            label: 'Yoga',
            isServer: false,
            event: 'animation:Play',
            data: {
                dict: 'amb@world_human_yoga@male@base',
                name: 'base_a',
                flag: 1,
                duration: -1
            }
        },
        {
            label: 'Squat',
            isServer: false,
            event: 'animation:Play',
            data: {
                dict: 'amb@lo_res_idles@',
                name: 'squat_lo_res_base',
                flag: 2,
                duration: -1
            }
        },
        {
            label: 'Lean on Wall',
            isServer: false,
            event: 'animation:Play',
            data: {
                dict: 'amb@lo_res_idles@',
                name: 'world_human_lean_male_legs_crossed_lo_res_base',
                flag: 2,
                duration: -1
            }
        }
    ]);
});

alt.on('submenu:Assault', ent => {
    new ContextMenu(ent, [
        {
            label: 'Select'
        },
        {
            label: 'Aim Weapon',
            isServer: false,
            event: 'animation:Play',
            data: {
                dict: 'move_weapon@pistol@copa',
                name: 'idle',
                flag: 49,
                duration: -1
            }
        },
        {
            label: 'Aim Weapon 2',
            isServer: false,
            event: 'animation:Play',
            data: {
                dict: 'move_weapon@pistol@cope',
                name: 'idle',
                flag: 49,
                duration: -1
            }
        },
        {
            label: 'Guard',
            isServer: false,
            event: 'animation:Play',
            data: {
                dict: 'rcmepsilonism8',
                name: 'base_carrier',
                flag: 49,
                duration: -1
            }
        }
    ]);
});
