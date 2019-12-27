import * as alt from 'alt';
import orm from 'typeorm';
import pg from 'pg';

const pool = new pg.Pool({});
pool.on('error', err => {
    console.log('Connection Refused Error');
    console.log(err);
});

var currentConnection;

// Singleton Connection Info
export default class ConnectionInfo {
    constructor(dbType, dbHost, dbPort, dbUsername, dbPassword, dbName, entityArray) {
        // If instance does not exist.
        if (currentConnection === undefined) {
            // Configuration Template
            const config = {
                type: `${dbType}`,
                host: `${dbHost}`,
                port: dbPort,
                username: `${dbUsername}`,
                password: `${dbPassword}`,
                database: `${dbName}`,
                entities: entityArray,
                cache: true,
                extra: { min: 2, max: 90 }
            };

            console.log(`---> Starting Database Connection`);
            orm.createConnection(config)
                .then(conn => {
                    this.connection = conn;
                    conn.synchronize().then(res => {
                        currentConnection = this;
                        console.log('---> Database Connected Successfully');
                        alt.emit('ConnectionComplete');
                        return currentConnection;
                    });
                })
                .catch(err => {
                    console.log(err);
                    throw err;
                });
        }

        return currentConnection;
    }

    /**
     * Look up a document by the fieldName and fieldValue in a repo by name.
     * @param fieldName String of the field name.
     * @param fieldValue String of the field value.
     * @param repoName ie. "Account"
     * @param callback undefined | document
     */
    async fetchData(fieldName, fieldValue, repoName) {
        return new Promise(resolve => {
            const repo = this.connection.getRepository(repoName);
            repo.findOne({ where: { [fieldName]: fieldValue } })
                .then(res => {
                    return callback(res);
                })
                .catch(err => {
                    console.error(err);
                    return callback(undefined);
                });
        });
    }

    /**
     * Async Version
     * Look up a document by the fieldName and fieldValue in a repo by name.
     * @param fieldName String of the field name.
     * @param fieldValue String of the field value.
     * @param repoName ie. "Account"
     */
    async fetchDataAsync(fieldName, fieldValue, repoName) {
        return new Promise((resolve, reject) => {
            const repo = this.connection.getRepository(repoName);

            repo.findOne({ where: { [fieldName]: fieldValue } })
                .then(res => {
                    return resolve(res);
                })
                .catch(err => {
                    console.error(err);
                    return reject(undefined);
                });
        });
    }

    /**
     * Fetch last item inserted.
     * @param {*} repoName
     */
    async fetchLastId(repoName) {
        return new Promise(resolve => {
            const repo = this.connection.getRepository(repoName);
            repo.findOne({ order: { id: 'DESC' } }).then(res => {
                resolve(res);
            });
        });
    }

    /**
     *
     * @param fieldName The name of the field.
     * @param fieldValue The value of that field.
     * @param repoName The reponame where to look.
     * @param callback Result is an array or undefined.
     */
    async fetchAllByField(fieldName, fieldValue, repoName) {
        return new Promise(resolve => {
            const repo = this.connection.getRepository(repoName);
            repo.find({ where: { [fieldName]: fieldValue } })
                .then(res => {
                    return resolve(res);
                })
                .catch(err => {
                    console.error(err);
                    return resolve(undefined);
                });
        });
    }

    /**
     * Update or Insert a new document.
     * @param document Document pulled down from table.
     * @param repoName The name of the table.
     * @param callback Returns Updated/Inserted document with id or UNDEFINED.
     */
    async upsertData(document, repoName) {
        return new Promise(resolve => {
            const repo = this.connection.getRepository(repoName);

            repo.save(document)
                .then(res => {
                    return resolve(res);
                })
                .catch(err => {
                    console.error(err);
                    return resolve(undefined);
                });
        });
    }

    /**
     * Update or Insert a new document.
     * @param document Document pulled down from table.
     * @param repoName The name of the table.
     * @param callback Returns Updated/Inserted document with id.
     */
    async insertData(document, repoName) {
        return new Promise(resolve => {
            const repo = this.connection.getRepository(repoName);

            repo.insert(document)
                .then(res => {
                    return resolve(res);
                })
                .catch(err => {
                    console.error(err);
                    return resolve(undefined);
                });
        });
    }

    /**
     * Update partial data for a document; based on object data based.
     * @param id ID of Document
     * @param partialObjectData Object
     * @param repoName The name of the table.
     * @param callback Result is undefined | object if updated
     */
    async updatePartialData(id, partialObjectData, repoName) {
        return new Promise(resolve => {
            const repo = this.connection.manager.getRepository(repoName);
            repo.findByIds([id])
                .then(res => {
                    if (res.length <= 0) {
                        return resolve(undefined);
                    }

                    repo.update(id, partialObjectData)
                        .then(res => {
                            return resolve(res);
                        })
                        .catch(err => {
                            console.log(err);
                            return resolve(undefined);
                        });
                })
                .catch(err => {
                    console.log(err);
                    return resolve(undefined);
                });
        });
    }

    /**
     * Fetch documents by ID or IDs.
     * @param ids
     * @param repoName The name of the table.
     * @param callback Returns undefined | Array<documents>
     */
    async fetchByIds(ids, repoName) {
        return new Promise(resolve => {
            const repo = this.connection.manager.getRepository(repoName);
            let idRef = ids;

            if (!Array.isArray(ids)) {
                idRef = [ids];
            }

            repo.findByIds(idRef)
                .then(res => {
                    if (res.length <= 0) return resolve(undefined);
                    return resolve(res);
                })
                .catch(err => {
                    console.error(err);
                    return resolve(undefined);
                });
        });
    }

    /**
     * Delete documents from the database by ID.
     * @param ids Can be array or single id.
     * @param repoName The name of the table.
     * @param callback
     */
    async deleteByIds(ids, repoName) {
        return new Promise(resolve => {
            const repo = this.connection.getRepository(repoName);

            let idRef = ids;

            if (!Array.isArray(ids)) {
                idRef = [ids];
            }

            repo.delete(idRef)
                .then(res => {
                    return resolve(res);
                })
                .catch(err => {
                    console.error(err);
                    return resolve(undefined);
                });
        });
    }

    /**
     * Fetch all documents by repo name.
     * @param repoName The name of the table.
     * @param callback returns undefined | array of results
     */
    async fetchAllData(repoName) {
        return new Promise(resolve => {
            const repo = this.connection.getRepository(repoName);

            repo.find()
                .then(res => {
                    if (res.length <= 0) {
                        return resolve(undefined);
                    }

                    return resolve(res);
                })
                .catch(err => {
                    console.error(err);
                    return resolve(undefined);
                });
        });
    }

    /**
     * Select a table by fieldNames that apply.
     * @param repoName
     * @param fieldNamesArray
     * @param callback Returns undefined | Array of documents
     */
    async selectData(repoName, fieldNamesArray) {
        return new Promise(resolve => {
            const repo = this.connection.getRepository(repoName);

            let selectionRef = fieldNamesArray;

            if (!Array.isArray(fieldNamesArray)) {
                selectionRef = [selectionRef];
            }

            repo.find({ select: selectionRef })
                .then(res => {
                    if (res.length <= 0) {
                        return resolve(undefined);
                    }

                    return resolve(res);
                })
                .catch(err => {
                    console.error(err);
                    return resolve(undefined);
                });
        });
    }
}
