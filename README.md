# alt:V - Open Roleplay

Remember to 🌟 this Github if you 💖 it.

---

### Sponsor this Project to keep it **FREE**

[Github Sponsorship Program](https://www.github.com/sponsors/stuyk)

Open Roleplay is a base gamemode for Roleplay servers.
Open Roleplay is the base framework for my server: [alt:V Life](https://discord.gg/fc7P9eH).
Open Roleplay has its own [Official Discord](https://discord.gg/WbzTJXW).

### Licensing

If you'd like to remove the splash screens at any point; we can negotiate at a price. However, you will be responsible for removing them and not me. Otherwise, just leave the splash screens alone. This is a free framework and the least you can do is give credit. You are also required to put **ORP** in your gamemode for your alt:V server configuration. You did not write this gamemode; and it is not your **custom gamemode**. **Put credit where credit is due.**

---

### Feature List and Roadmap

You can find a full list of features and the roadmap [here](https://docs.google.com/document/d/19f9xTn6m3qVfUZYV6cQ8dMstLLdfYC2BavTV7YpzfLc/).

**IMPORTANT** If you are not a developer; this may not be the project for you. There is some general configuration that needs to be done and understanding code is important.

I **will not** be providing direct support for this gamemode; if you have an issue or come across actual functionality issues please raise an issue in the **issues** tab. Otherwise; additional help can be found by subscribing through [my twitch page](https://www.twitch.tv/stuyksoft/) and then joining the [Discord Group](https://discord.gg/gVfJkcs)

---

### General Information and Hotkeys

```
// General
Tab --------> Press to Toggle Cursor
Tab + RMB  -> Show Context Menu on User
Tab + LMB  -> Select Context Option
T ----------> Open Chat
F1 ---------> Help Menu
```

---

## Installation

#### If you don't have NodeJS v12+; please go install it.

**Requirements:**

-   Basic Programming Fundamentals

-   Basic Problem Solving Fundementals

-   Linux (Ubuntu 18+ Preferred) or Windows 10+

-   [NodeJS](https://nodejs.org/en/)

-   [GIT](https://git-scm.com/downloads)

-   PostgresSQL **v10 to v11.5**

    -   PLEASE DO NOT DOWNLOAD v12. IT WILL NOT WORK.

    -   [v11.5 Direct Download Windows](https://get.enterprisedb.com/postgresql/postgresql-11.5-1-windows-x64.exe)

    -   [Installing Postgres on Ubuntu (Only Go to Step #3)](https://tecadmin.net/install-postgresql-server-on-ubuntu/)

### Postgres

#### Windows Postgres Setup

-   Run the .exe and follow the prompts.

-   Run pgAdmin

-   You will be prompted for a password. This is your database password.

-   After you need to create a database called `altv`.

-   Here's a very brief `streamable example` of that taking place.

[Here's how you do it!](https://streamable.com/oq73f)

-   **Note:** By default your username will be `postgres` and your password will be whatever you use to log in to pgAdmin4.

#### Linux Postgres Setup

-   [Follow these instructions up to step #3](https://tecadmin.net/install-postgresql-server-on-ubuntu/)

-   Type: `su - postgres`

-   Type: `psql`

-   Type: `CREATE DATABASE altv;`

-   If all is well you will see `CREATE DATABASE` or something similar replied.

-   Type: `CREATE USER stuyk WITH ENCRYPTED PASSWORD 'abc123';`

-   If all is well you will see `CREATE ROLE` replied.

-   We now have a user called `stuyk` with a password of `abc123`. We need to assign to db.

-   Type: `GRANT ALL PRIVILEGES ON DATABASE altv TO stuyk;`

-   If all is well you wil see `GRANT` replied.

-   Type: `\q` to exit.

-   Type: `sudo -u root`

-   This will bring you back to your root account.

-   Now follow the rest of the steps below.

---

-   Open a Power Shell or Command Prompt or Terminal

-   Download the latest version of this resource (100% Recommend CLONING the REPO with GIT).

-   After CLONING, CD into the repo through the same command prompt.

-   Open a command prompt and run `npm run orp`. **FOLLOW THE INSTRUCTIONS CAREFULLY ON PROMPT**.

-   When you get to the Discord Setup; make sure you hit 'yes' if this is a new server.

### Discord

#### Setting Up a Discord Bot for this Gamemode

**Please Create a Discord Application for your Login System.**

**Please Visit: https://discordapp.com/developers/applications/**

-   Inside of page you need to create a Discord Application and turn it into a bot and copy the bot secret.

-   You also **MUST** add this bot to your own server.

1. Hit New Application
2. Set the Name for Your Bot / Application
3. Click on the `Bot` tab.
4. Transform your Application into a bot.
5. Name your bot.
6. Tick `Administrator` or just `Send/Read Messages`
7. Copy the bots secret token.
8. Make sure the bot is not public.
9. Navigate to oAuth2 tab. Tick `bot` in scopes.
10. Copy the URL inside of scopes. Paste in browser.
11. Add the bot to your designated Discord.
12. Make sure you save your changes.
13. Keep this page open for the next section.

### Gamemode Setup & Installation

#### Installing the Rest of O:RP

-   Clone this repository from github.

-   Open a Command Prompt or Power Shell Prompt in cloned directory.

-   Type `npm run orp` to begin the installation process.

-   You will be asked to agree to some terms and conditions.

-   You will be prompted for various installation steps and must provide the information asked for.

-   After filling in all information you are prompted for the server files will download.

-   We target beta branch with this gamemode.

-   Start your server based on whichever platform you use.

    -   Run these from a terminal or command prompt.

    -   Windows -> `altv-server.exe`

    -   Linux -> `./start.sh`

-   Join your server with Discord Open.

-   **IF DISCORD DOES NOT PROMPT YOU** Copy the code on screen.

-   PM the Bot you setup earlier with `!login <code>`

### Docker (Optional)

#### Installation using Docker

If you **do not know what docker is.** Please do not proceed any further.

OpenRP includes support for building and running the alt:V and PostgreSQL server using Docker. Included is a docker-compose.yml which contains many variables that you will need to edit. Any changes you make will require you to rebuild the altv-openrp container.

To build new containers, first edit the docker-compose.yml file and fill in all the details for the altv server and discord information, and then build with docker-compose. Note: You must agree with OpenRP terms of service by passing TOS_AGREE=true as a build argument.

```
docker-compose build --build-arg TOS_AGREE=true
```

To run the containers:

```
docker-compose up
```

Please see Docker and Docker-Compose documentation for more options.
