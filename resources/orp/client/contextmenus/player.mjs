import * as alt from 'alt';
import * as native from 'natives';
import { appendContextItem, setContextTitle } from '/client/panels/hud.mjs';
import { showCursor } from '/client/utility/cursor.mjs';

alt.log('Loaded: client->contextmenus->player.mjs');

/**
 * This has to be setup in a way that every player gets
 * default actions. Then additional submenus can be
 * tacked on.
 */
alt.on('menu:Player', ent => {
    if (alt.Player.local.getMeta('arrest')) {
        appendContextItem('Try Breaking Cuffs', true, 'use:BreakCuffs', { entity: ent });
        setContextTitle('You');
    } else {
        appendContextItem('Animations', false, 'submenu:PlayerAnimations', {
            entity: ent
        });
        setContextTitle('You');
    }
});

//data.dict, data.name, data.duration, data.flag
//animation:Play
alt.on('submenu:PlayerAnimations', ent => {
    showCursor(true);
    appendContextItem('Clear', false, 'animation:Clear', { entity: ent });
    appendContextItem('Surrender', false, 'submenu:PlayerAnimSurrender', { entity: ent });
    appendContextItem('Emote', false, 'submenu:Emote', { entity: ent });
    appendContextItem('Emote 2', false, 'submenu:Emote2', { entity: ent });
    appendContextItem('Emote 3', false, 'submenu:Emote3', { entity: ent });
    appendContextItem('Assault', false, 'submenu:Assault', { entity: ent });
    setContextTitle('Anim Categories', true);
});

alt.on('submenu:PlayerAnimSurrender', ent => {
    showCursor(true);
    appendContextItem('Handsup', false, 'animation:Play', {
        dict: 'random@mugging3',
        name: 'handsup_standing_base',
        flag: 49,
        duration: -1
    });
    appendContextItem('Kneel', false, 'animation:Play', {
        dict: 'random@arrests',
        name: 'kneeling_arrest_idle',
        flag: 2,
        duration: -1
    });
    setContextTitle('Surrender Anims', true);
});

alt.on('submenu:Emote', ent => {
    showCursor(true);
    appendContextItem('Salute', false, 'animation:Play', {
        dict: 'anim@mp_player_intuppersalute',
        name: 'idle_a',
        flag: 49,
        duration: -1
    });
    appendContextItem('The Finger', false, 'animation:Play', {
        dict: 'anim@mp_player_intselfiethe_bird',
        name: 'idle_a',
        flag: 49,
        duration: -1
    });
    appendContextItem('The Upper Finger', false, 'animation:Play', {
        dict: 'anim@mp_player_intupperfinger',
        name: 'idle_a',
        flag: 49,
        duration: -1
    });
    appendContextItem('Upper Face Palm', false, 'animation:Play', {
        dict: 'anim@mp_player_intupperface_palm',
        name: 'idle_a',
        flag: 49,
        duration: -1
    });
    appendContextItem('Fold Arms A', false, 'animation:Play', {
        dict: 'missfbi_s4mop',
        name: 'guard_idle_a',
        flag: 49,
        duration: -1
    });
    appendContextItem('Fold Arms B', false, 'animation:Play', {
        dict: 'oddjobs@assassinate@construction@',
        name: 'unarmed_fold_arms',
        flag: 49,
        duration: -1
    });
    appendContextItem('Damn', false, 'animation:Play', {
        dict: 'gestures@m@standing@casual',
        name: 'gesture_damn',
        flag: 49,
        duration: -1
    });
    setContextTitle('Emote Anims', true);
});

alt.on('submenu:Emote2', ent => {
    showCursor(true);
    appendContextItem('No', false, 'animation:Play', {
        dict: 'mp_player_int_upper_nod',
        name: 'mp_player_int_nod_no',
        flag: 49,
        duration: -1
    });
    appendContextItem('Get Picky', false, 'animation:Play', {
        dict: 'mp_player_int_upperarse_pick',
        name: 'mp_player_int_arse_pick',
        flag: 49,
        duration: -1
    });
    appendContextItem('Grab Crotch', false, 'animation:Play', {
        dict: 'mp_player_int_uppergrab_crotch',
        name: 'mp_player_int_grab_crotch',
        flag: 49,
        duration: -1
    });
    appendContextItem('Peace', false, 'animation:Play', {
        dict: 'mp_player_int_upperpeace_sign',
        name: 'mp_player_int_peace_sign',
        flag: 49,
        duration: -1
    });
    appendContextItem('Play Dead', false, 'animation:Play', {
        dict: 'misslamar1dead_body',
        name: 'dead_idle',
        flag: 2,
        duration: -1
    });
    appendContextItem('Slow Clap', false, 'animation:Play', {
        dict: 'anim@mp_player_intcelebrationmale@slow_clap',
        name: 'slow_clap',
        flag: 49,
        duration: -1
    });
    appendContextItem('Lean On Wall', false, 'animation:Play', {
        dict: 'amb@lo_res_idles@',
        name: 'world_human_lean_male_foot_up_lo_res_base',
        flag: 49,
        duration: -1
    });
    setContextTitle('Emote Anims 2', true);
});

alt.on('submenu:Emote3', ent => {
    showCursor(true);
    appendContextItem('Sit Male', false, 'animation:Play', {
        dict: 'amb@world_human_picnic@male@base',
        name: 'base',
        flag: 1,
        duration: -1
    });
    appendContextItem('Sit Female', false, 'animation:Play', {
        dict: 'amb@world_human_picnic@female@base',
        name: 'base',
        flag: 1,
        duration: -1
    });
    appendContextItem('Bum', false, 'animation:Play', {
        dict: 'amb@world_human_bum_slumped@male@laying_on_left_side@base',
        name: 'base',
        flag: 2,
        duration: -1
    });
    appendContextItem('Sit Ups', false, 'animation:Play', {
        dict: 'amb@world_human_sit_ups@male@base',
        name: 'base',
        flag: 1,
        duration: -1
    });
    appendContextItem('Push Ups', false, 'animation:Play', {
        dict: 'amb@world_human_push_ups@male@base',
        name: 'base',
        flag: 1,
        duration: -1
    });
    appendContextItem('Yoga', false, 'animation:Play', {
        dict: 'amb@world_human_yoga@male@base',
        name: 'base_a',
        flag: 1,
        duration: -1
    });
    appendContextItem('Squat', false, 'animation:Play', {
        dict: 'amb@lo_res_idles@',
        name: 'squat_lo_res_base',
        flag: 2,
        duration: -1
    });
    appendContextItem('Lean on Wall', false, 'animation:Play', {
        dict: 'amb@lo_res_idles@',
        name: 'world_human_lean_male_legs_crossed_lo_res_base',
        flag: 2,
        duration: -1
    });
    setContextTitle('Emote Anims 3', true);
});

alt.on('submenu:Assault', ent => {
    showCursor(true);
    appendContextItem('Aim Weapon', false, 'animation:Play', {
        dict: 'move_weapon@pistol@copa',
        name: 'idle',
        flag: 49,
        duration: -1
    });
    appendContextItem('Aim Weapon 2', false, 'animation:Play', {
        dict: 'move_weapon@pistol@cope',
        name: 'idle',
        flag: 49,
        duration: -1
    });
    appendContextItem('Guard', false, 'animation:Play', {
        dict: 'rcmepsilonism8',
        name: 'base_carrier',
        flag: 49,
        duration: -1
    });
    setContextTitle('Assault Anims', true);
});
