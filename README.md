# alt:V - Open Roleplay

Remember to 🌟 this Github if you 💖 it.

---

Open Roleplay is a base gamemode for Roleplay servers. It will include the ideal functionality to get the base ground work for a roleplay gamemode started. **THIS IS A WORK IN PROGRESS AND IS NOT COMPLETE IN ANY WAY.**

I will not be providing direct support for this gamemode; if you have an issue or come across actual functionality issues please raise an issue in the **issues** tab.

**Installation:**

The file structure below is the **IDEAL** and **required** structure you must use for this game mode.
You must follow it exactly.

You're going to need these additional repositories:

-   [Chat-Extended for 'chat'](https://github.com/team-stuyk-alt-v/altV-Chat-Extended)
-   [Postgres-Wrapper](https://github.com/team-stuyk-alt-v/altV-Postgres-Wrapper)

You're going to need to install a base version of [PostgresSQL](https://www.postgresql.org/download/).

```yaml
altVServerFolder/
└── resources/
├── chat/
|   ├── index.mjs
|   ├── client.mjs
|   ├── resource.cfg
|   └── html/
├── orp/
|   ├── server/
|   ├── client/
|   └── resource.cfg
├── postgres-wrapper/
|   ├── client.mjs
|   ├── database.mjs
|	└── resource.cfg
```

**Important** You can configure your database connection inside of:

```
Change the 'text' inside of SQL(<here>)

resources/orp/server/server.mjs

Example connection string:
postgresql://postgres:abc123@localhost:5432/altv
```

After installing the above; if you don't have a package.json in your main server directory where your .exe is you're going to need to do the following:

```
npm init
```

Then press enter a bunch of times until its done stepping you through.
After you need to install the following packages:

```
npm install --save typeorm
npm install --save mysql
npm install --save pg
npm install --save sjcl
```
