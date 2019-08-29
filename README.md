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
-   [ ] Tattoos
-   [x] Character Inventory System
-   [x] Item Configuration
-   [x] Item Drops
-   [x] Item Pickups
-   [x] Vehicle System
-   [x] Job System
-   [x] Example Job Configuration
-   [ ] Job System Types
-   [ ] Vehicle Customization
-   [ ] Vehicle Fuel System
-   [x] Nametags / Character Names
-   [ ] Door System
-   [ ] Door Sales System
-   [ ] Administrative Toolkit
-   [x] Currency System
-   [x] ATM / Bank System
-   [ ] Player Transfers / Give Money
-   [ ] Shop System
-   [ ] Faction System
-   [ ] Basic Anticheat
-   [x] Time Sync
-   [x] Weather Sync
-   [x] Interaction System
-   [ ] Interaction for Vehicles
-   [ ] Interaction for Players
-   [ ] Interaction for Objects
-   [x] Player Death Handling
-   [x] Taxation
-   [ ] Taxation goes to Government Fund
-   [ ] Government Fund Management
-   [x] Animation Manager
-   [x] Splash Screens
-   [x] Custom Sounds! Blat!
-   [x] Custom Chat
-   [x] Custom Chat Commands
-   [x] Custom Chat Colors
-   [ ] Custom Chat Notification Functions / Clickables
-   [ ] Custom Chat is Repositionable?
-   [x] Roleplay Commands (/me, /do, /b, /cc)
-   [x] Ranged Chat
-   [ ] Voice Chat

I will not be providing direct support for this gamemode; if you have an issue or come across actual functionality issues please raise an issue in the **issues** tab. Otherwise; additional help can be found by subscribing through [my twitch page and joining discord](https://twitch.tv/stuykgaming/).

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
