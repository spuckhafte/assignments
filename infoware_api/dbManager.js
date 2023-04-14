import mysql from 'mysql2'
import { config } from 'dotenv';
config();

const con = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: process.env.DB_PASS,
    database: "infoware"
});

con.connect(err => {
    if (err) throw err;
    else console.log('[connected to Db]');
});

class Table {
    #name
    constructor(name) {
        this.#name = name;
    }

    static globalGet(fields, from, result, condition) {
        const sql = `SELECT ${fields} FROM ${from} ${condition}`;
        con.query(sql, (e, dataReceived) => {
            result(e, dataReceived);
        });
    }

    get(fields, result, condition) { // condition -> 'where id = 3 or id in [1, 2, 3]'
        const sql = `SELECT ${fields} FROM ${this.#name} ${condition}`;
        con.query(sql, (e, dataReceived) => {
            result(e, dataReceived);
        });
    };

    put(put, callback) { // put -> { name: "jhon smith", age: "56" }
        const into = Object.keys(put).join(', ');
        const values = [Object.values(put)];
        const sql = `INSERT INTO ${this.#name} (${into}) VALUES ?`;
        con.query(sql, [values], (e, result) => {
            callback(e, result)
        });
    };

    update(set, condition, callback) { // set -> { age: '22' }
        let sql = `UPDATE ${this.#name} SET `;
        Object.keys(set).forEach(field => {
            sql += `${field} = '${set[field]}', `
        });
        sql = sql.replace(/, $/g, ' ');
        sql += `WHERE ${condition}`;

        con.query(sql, (e, result) => {
            callback(e, result);
        });
    }

    delete(condition, callback) { // condition -> 'id = 233'
        const sql = `DELETE FROM ${this.#name} WHERE ${condition}`
        con.query(sql, (e, result) => {
            callback(e, result);
        });
    };

    get name() {
        return this.#name // read-only
    }
};

export default Table;