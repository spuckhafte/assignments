import express from "express";
import users from "./schema/users.js";
import { Task, User } from "../../types"
import mongoose from "mongoose";
import dotenv from "dotenv";

const app = express();
dotenv.config();

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
    
    if (!userRequestedRaw || !userRequestedRaw._id) {
        res.end("No such user");
        return;
    }

    const userRequestedParsed = {
        username: userRequestedRaw.username,
        filters: userRequestedRaw.filters,
        tasks: userRequestedRaw.tasks,
    } as User;

    res.json(userRequestedParsed);
});

app.post("/register", async (req, res) => {
    const query = req.query as {
        username?: string,
    } | null;

    if (!query || !query.username) {
        res.status(400);
        res.end("Bad Request :(");
        return;
    }

    res.status(200);

    const userRequested = await users.findOne({ username: query.username });
    
    if (userRequested && userRequested._id) {
        res.end("Username already exists");
        return;
    }
    
    const newUserCreate = {
        username: query.username,
        tasks: [],
        filters: [],
    } as User;
    
    users.create(newUserCreate);

    res.json(newUserCreate);
    res.end();
});

app.post("/newTask", async (req, res) => {
    const query = req.query as {
        username?: string,
        task?: string,
    } | null;

    if (!query || !query.username || !query.task) {
        res.status(400);
        res.end("Bad Request :(");
        return;
    }

    res.status(200);

    const parsedTask = JSON.parse(query.task) as Task;

    const userRequested = await users.findOne({ username: query.username });
    if (!userRequested || !userRequested._id) {
        res.end("Username does not exists");
        return;
    }
    
    userRequested.tasks.push(parsedTask);
    userRequested.save();

    res.end("Task saved");
});

app.post("/editTask", async (req, res) => {
    const query = req.query as {
        username?: string,
        task?: string,
    } | null;

    if (!query || !query.username || !query.task) {
        res.status(400);
        res.end("Bad Request :(");
        return;
    }

    res.status(200);

    const parsedTask = JSON.parse(query.task) as Task;

    const userRequested = await users.findOne({ username: query.username });
    if (!userRequested || !userRequested._id) {
        res.end("Username does not exists");
        return;
    }

    userRequested.tasks.forEach(task => {
        if (task.uid == parsedTask.uid) {
            task.body = parsedTask.body;
            task.important = parsedTask.important;
            task.dueDate = parsedTask.dueDate;
            task.filter = parsedTask.filter;
            task.complete = parsedTask.complete;
        }
    });

    userRequested.save();

    res.end("Tasks synced");
});

app.post("/deleteTask", async (req, res) => {
    const query = req.query as {
        username?: string,
        taskUid?: string,
    } | null;

    if (!query || !query.username || !query.taskUid) {
        res.status(400);
        res.end("Bad Request :(");
        return;
    }

    res.status(200);

    const userRequested = await users.findOne({ username: query.username });
    if (!userRequested || !userRequested._id) {
        res.end("Username does not exists");
        return;
    }

    userRequested.tasks.pull({ uid: query.taskUid });
    userRequested.save();

    res.end("Task removed");
});


// connections:
mongoose.connect(process.env.DB as string)
    .then(() => console.log("📦 [connected to db]"))
    .catch(e => console.log("[error connecting to db]\n" + e));
app.listen(
    +(process.env.PORT ?? 3000), 
    () => console.log(`[listening on port: ${process.env.PORT}]`)
);
