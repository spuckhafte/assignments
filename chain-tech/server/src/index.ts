import express from "express";
import users from "./schema/users";
import { User } from "../../types"

const app = express();

app.get("/getuser", async (req, res) => {
    const query = req.query as {
        username?: string,
    } | null;

    if (!query || !query.username) {
        res.status(400);
        res.end("Bad Request :(");
        return;
    }

    res.status(200);

    const userRequestedRaw = await users.findOne({ username: query.username });
    
    if (!userRequestedRaw || !userRequestedRaw.id) {
        res.end("No such user");
        return;
    }

    const userRequestedParsed = {
        username: userRequestedRaw.username,
        filters: userRequestedRaw.filters,
        tasks: userRequestedRaw.tasks,
    } as User;

    res.json(userRequestedParsed);
    res.end();
});

app.listen(3000, () => console.log("Listening on port: 3000"));
