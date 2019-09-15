# alt:V - Open Roleplay

Remember to 🌟 this Github if you 💖 it.

---

### THIS IS A WORK IN PROGRESS AND IS NOT COMPLETE IN ANY WAY

Open Roleplay is a base gamemode for Roleplay servers. It will include the ideal functionality to get the base ground work for a roleplay gamemode started.

[Official O:RP Discord](https://discord.gg/gVfJkcs)

---

**IMPORTANT** If you are not a developer; this may not be the project for you. There is some general configuration that needs to be done and understanding code is important.

**Roadmap**

-   [x] PostgreSQL Integration
-   [x] Login and Registration
-   [x] Character Facial Customization
-   [x] Roleplay Name Formatting
-   [x] Character Clothing Customization
-   [x] Glasses, Bracelets, etc.
-   [x] Barbershop
-   [ ] Tattoos
-   [x] Character Inventory System
-   [x] Item Configuration
-   [x] Item Drops
-   [x] Item Pickups
-   [x] Vehicle System
-   [x] Job System
-   [x] Example Job Configuration
-   [x] Job System Types
-   [x] Driving Test
-   [x] Taxi Job
-   [x] Mechanic Job
-   [x] Vehicle Customization
-   [ ] Vehicle Fuel System
-   [x] Nametags / Character Names
-   [ ] Door System
    -   [ ] House Type
    -   [ ] Shop System
        -   [ ] Gun Store
        -   [ ] Food Store
        -   [ ] Medical Clinic
-   [ ] Door Sales System
-   [ ] Administrative Toolkit
-   [x] Currency System
-   [x] ATM / Bank System
    -   [ ] Transfer Money
-   [ ] Faction System
-   [ ] Basic Anticheat
-   [x] Time Sync
-   [x] Weather Sync
-   [x] Interaction System
    -   [x] Interaction for Vehicles
    -   [ ] Interaction for Players
        -   [ ] Give Money
    -   [x] Interaction for Objects
    -   [x] Interaction for Self
        -   [x] Animations for Sitting
-   [x] Player Death Handling
-   [x] Taxation
    -   [ ] Taxation goes to Government Fund
-   [x] Animation Manager
-   [x] Context Menu of Animations
-   [x] Custom Sounds! Blat!
-   [x] Custom Chat
    -   [x] Custom Chat Commands
    -   [x] Custom Chat Colors
    -   [ ] Custom Chat Notification Functions / Clickables
    -   [ ] Custom Chat is Repositionable?
    -   [x] Ranged Chat
    -   [x] Roleplay Commands (/me, /do, /b, /cc)
-   [x] Experience Curve for Skill System
-   [ ] Skill System
    -   [ ] Defense (Damage Taken = Pain Tolerance)
        -   More Damage Taken = Less Damage Taken
    -   [ ] Agility (Sprint Modifier)
        -   Increase Stamina
    -   [ ] Cooking (Craft Better Food)
        -   Create Better Healing Food
        -   Create Better Healing Drinks
    -   [ ] Medicine (Health Healed on Player Revivals)
        -   Heal users quicker.
        -   Revive users quicker.
        -   Only accessible through the Nobility skill.
    -   [ ] Notoriety (Gained Through Criminal Jobs, access to better jobs. Create a gang)
        -   Lose nobility xp by doing notoriety activities.
        -   Gain access to create a gang past a certain level.
        -   Lose XP three times as fast when doing good things.
        -   Drug Creation Jobs
        -   Gun Creation Jobs
        -   Illegal Shipment Jobs
        -   Hitman Jobs (95+)
    -   [ ] Nobility (Opposite of Notoriety, access to better jobs / factions.)
        -   Lose notoriety xp by doing nobility activities.
        -   Gain access to factions past a certain level. ie. Police Trainee
        -   Lose XP three times as fast when doing bad things.
        -   Medicinal Jobs
        -   Police Jobs
        -   Firefighter Jobs
    -   [ ] Gunsmith (Craft Better Guns with Metal, use better guns, sell better guns.)
        -   Basically use better guns.
        -   Users craft really bad pistols to begin with.
    -   [ ] Mining (Gather more items from Mining, use better equipment)
        -   Basically better pickaxes that mine more.
    -   [ ] Gathering (Gather more items for Drug Crafting)
        -   Basically use better gathering items.
    -   [ ] Mechanic (Repair vehicles quicker; access to repair anywhere at 75+)
        -   Repair Quicker on Mechanic Job
        -   Use Repair Kits After Level 75+
    -   [ ] Crafting (Better Quality Items)
        -   Craft Better Pickaxes
        -   Craft Better Guns
        -   Craft Better Gathering Items
        -   Craft Repair Kits
        -   All Crafting Items Take Metal
-   [ ] Drug System
    -   [ ] Drugs for Health
    -   [ ] Drugs for Armor
        -   [ ] Drugs for Fast Running
    -   [ ] Drug Jobs 3 jobs for each type.
-   [x] Playing Hours Stats
-   [ ] Loyalty Program
    -   [ ] Extra Housing Slots for Hours Played
    -   [ ] Extra Backpack Slots for Hours Played
    -   [ ] Extra Shop Slots for Hours Played
    -   [ ] Extra Vehicle Slots for Hours Played

I will not be providing direct support for this gamemode; if you have an issue or come across actual functionality issues please raise an issue in the **issues** tab. Otherwise; additional help can be found by subscribing through [my twitch page and joining discord](https://www.twitch.tv/stuyksoft/).

---

### Licensing

If you'd like to remove the splash screens at any point; we can negotiate at a price. However, you will be responsible for removing them and not me. Otherwise, just leave the splash screens alone. This is a free framework and the least you can do is give credit.

---

### General Information and Hotkeys

```

z -------> Press and hold to reveal cursor.
z + rmb -> Show Context Menu on User
z + lmb -> Select Context Option
e -------> Most clothing shops, jobs, etc. to interact.
i -------> inventory

```

---

### Installation

If you don't have NodeJS; please go install it.

The file structure below is the **required** structure you must use for this game mode. You must follow it exactly for this resource to work.

-   Grab the latest version of the alt:V server files. They must be clean. No resources.

-   Download [Postgres-Wrapper](https://github.com/team-stuyk-alt-v/altV-Postgres-Wrapper) this is the Postgres SQL helper that was written to make database usage easy. Extract it and put this into a folder called `postgres-wrapper`. Directly inside you should have `resource.cfg` if done correctly.

-   Install the latest version of [PostgresSQL](https://www.postgresql.org/download/) for either windows, linux, or whatever OS you're running.

-   Once installed you need to create a username and password for your database; and create a database called 'altv' or something else if you know what you're doing. **PAY ATTENTION HERE YOU'LL NEED THIS INFO**

**Creating on Windows with pgAdmin4**
Where to navigate:
![](https://i.imgur.com/FBBeMTt.png)

Postgres is the username for this database; and altv is the name:
![](https://i.imgur.com/FaEmnvg.png)

After; it should be running automatically in your services on windows. You can always restart your database through your Task Manager.

![](https://i.imgur.com/6pA8PWB.png)

-   Download the latest version of this resource. You can either clone the repository or simply download it. The `resource.cfg` and the rest of the files should be directly inside of a folder called `orp`.

-   To configure your database navigate to `resources/orp/server/configuration/` and open `database.mjs`. Fill out the required parameters; and change them to what you setup PostgreSQL with.

**Example Database Configuration**

```js
export const DatabaseInfo = {
    username: 'postgres',
    password: 'abc123',
    address: 'localhost',
    port: 5432,
    dbname: 'altv'
};
```

**Example Folder Structure**

```yaml
altVServerFolder/
└── resources/
|   ├── orp/
|   |   ├── server/
|   |   ├── client/
|   |   └── resource.cfg
|   ├── postgres-wrapper/
|   |   ├── client.mjs
|   |   ├── database.mjs
|   |	└── resource.cfg
└── package.json
└── altv-server.exe
└── node_modules/
```

**Installing Packages for NodeJS**
After installing the above; if you don't have a package.json in your main server directory where your .exe is you're going to need to do the following:

Open a command prompt or powershell next to your .exe file

```
npm init
```

Then press enter a bunch of times until its done stepping you through.

After you need to install the following packages from command prompt or power shell.

```
npm install typeorm
npm install sjcl
npm install pg
```

Great; now you have all the prerequisites.

Open your `server.cfg` next to your `altv-server.exe`.

You need to add `orp` to resources.

```
name: 'Open RP'
host: 0.0.0.0
port: 7766
players: 1000
announce: false
gamemode: OpenRP
website: twitch.tv/stuykgaming
language: lang-here
description: 'Using Open Roleplay'
modules: [ node-module ]
resources: [ orp ]
token: ''
debug: 'true'
```

That's about it; once you run it you'll be greeted with terms and conditions and you can follow the additional instructions from there.
