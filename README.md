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

### Installation

#### If you don't have NodeJS v12+; please go install it.

-   Install version **v11.5** of [PostgresSQL](https://www.postgresql.org/download/) for either windows, linux, or whatever OS you're running.

-   Once installed you need to create a username and password for your database; and create a database called 'altv' or something else if you know what you're doing. **PAY ATTENTION HERE YOU'LL NEED THIS INFO**

**Creating on Windows with pgAdmin4**

Where to navigate:

[https://i.imgur.com/FBBeMTt.png](https://i.imgur.com/FBBeMTt.png)

Postgres is the username for this database; and altv is the name:

[https://i.imgur.com/FaEmnvg.png](https://i.imgur.com/FaEmnvg.png)

After; it should be running automatically in your services on windows. You can always restart your database through your Task Manager.

[https://i.imgur.com/6pA8PWB.png](https://i.imgur.com/6pA8PWB.png)

**Creating on Linux with Terminal ( UBUNTU 18.04 (Don't use 16.04 it's a pain in the ass.) )**

-   Follow these instructions up to Step 3: [Installing Postgres on Ubuntu](https://tecadmin.net/install-postgresql-server-on-ubuntu/)

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

-   After this you're going to visit [https://discordapp.com/developers/applications/](https://discordapp.com/developers/applications/).

-   Inside of page you need to create a Discord Application.

![](https://i.imgur.com/JpV3NSl.png)

-   Open a command prompt and run `npm run orp`. **FOLLOW THE INSTRUCTIONS CAREFULLY ON PROMPT**.

-   When you get to the Discord Setup; make sure you hit 'yes' if this is a new server.

-   Then you're going to copy your `client id` and paste it; as well as your `client secret`.

-   The `installation process` will ask for **both**.

![](https://i.imgur.com/QrJdfFV.png)

-   **After** finishing the rest of the setup, head over to the **oAuth2** page on the discordapp.

![](https://i.imgur.com/u7J8aSL.png)

-   Get your external IP address from a place such as [https://www.whatismyip.com/](https://www.whatismyip.com/).

-   You will need to add a new `redirect` for your `external ip`.

-   The format is `http://<your_external_ip_address>:17888/login`

![](https://i.imgur.com/kEZZSzm.png)

-   Make sure to save changes.

-   Run `altv-server.exe` or `./start.sh`. If you're on Linux you may need to set permission for `altv-server`.

-   **IF YOU DO NOT SEE A DISCORD AUTHENTICATION SERVICE YOU NEED TO FORWARD PORT 17888**

-   In your browser navigate to: `http://<your_external_ip_address>:17888`

-   **IF YOU DO NOT SEE A DISCORD AUTHENTICATION SERVICE YOU NEED TO FORWARD PORT 17888**

-   **PORT FORWARDING GUIDE PER ROUTER:** [https://portforward.com/router.htm](https://portforward.com/router.htm)

-   If you see this page; you are all set.

-   Join your server.
