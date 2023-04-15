import express from 'express';
import Table from './dbManager.js';

const app = express();

const User = new Table('User');
const PE = new Table('PEm'); // Primary Emergency
const SE = new Table('SEm'); // Secondary Emergency

const tables = { User, PE, SE };

const defaultPage = 1;
const defaultSize = 10;


app.get('/', (req, res) => {
    let page = req.query.page ?? defaultPage;
    let size = req.query.size ?? defaultSize;
    let name = req.query.name;

    if (name) {
        Table.globalGet('*', 'User, PEm, SEm', (e, result) => {
            if (e) emit(res, 500);
            else {
                if (result.length == 0) emit(res, 400);
                else emit(res, 200, result);
            }
        }, `WHERE User.name = '${name}' AND User.id = PEm.id AND User.id = SEm.id`);

    } else {
        const from = (page - 1) * 10 + 1;
        const limit = size;

        Table.globalGet('*', 'User, PEm, SEm', (e, result) => {
            if (e) emit(res, 500);
            else {
                if (from >= result.length || size > 10) {
                    emit(res, 400);
                    return;
                }
                const reqData = result.slice(from - 1);
                emit(res, 200, reqData);
            }
        }, `WHERE User.id = PEm.id AND User.id = SEm.id ORDER BY User.id LIMIT ${limit}`);
    }
});


app.post('/', (req, res) => {
    let {
        name, job, country, phone, email, address, city, state,
        pname, pcountry, pphone, prelation,
        sname, scountry, sphone, srelation
    } = req.query;

    User.get('*', (_, result) => {
        const id = +result[result.length - 1].id + 1;
        try {
            User.put({ id, name, job, country, phone, email, address, city, state }, (e, _) => {
                if (e) emit(res, 400);
                else {
                    PE.put({ id, pname, pcountry, pphone, prelation }, (e, _) => {
                        if (e) {
                            emit(res, 400);
                            User.delete(`id = ${id}`);
                            return;
                        }
                        if (!sname && !scountry && !sphone && !srelation) {
                            emit(res, 200, 'CREATED successfully');
                            return;
                        }
                        SE.put({ id, sname, scountry, sphone, srelation }, (e, _) => {
                            if (e) emit(res, 400);
                            else emit(res, 200, 'CREATED successfully');
                        });

                    });
                }
            });
        } catch (e) { emit(res, 400); }
    });
});


app.post('/update', (req, res) => {
    const { id, table, ...postData } = req.query;
    if (!id || !table || !postData || !Object.keys(tables).includes(table) || postData.id) {
        emit(res, 400);
        return;
    }

    tables[table].update(postData, `id = ${id}`, (e, _) => {
        if (e) emit(res, 400);
        else emit(res, 200, 'UPDATE successful');
    });
});


app.post('/delete', (req, res) => {
    const id = req.query.id;
    if (!id) {
        emit(res, 400);
        return;
    }

    [SE, PE, User].forEach((tab, i) => {
        tab.delete(`id = ${id}`, e => {
            if (e) emit(res, 400);
            if (!e && i == 2) emit(res, 200, 'DELETE successfull');
        });
    });

})


function emit(res, status, data) {
    res.status(status);
    if (status == 500) data = 'an error occurred';
    if (status == 400) data = 'invalid request';
    if (status == 200) data = data;
    typeof data == 'object' ? res.json(data) : res.send(data);
    res.end();
}

app.listen(3000);

/**
 * Pagination
 * page 1 -> 1 {page-1 * 10 + 1}:10 {page + size-1}
 * page 2 -> 11:20
 */