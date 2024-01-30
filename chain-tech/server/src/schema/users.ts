import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: String,
    
    tasks: [{
        body: String,
        uid: String,

        createdAt: {
            type: Number,
            default: () => Date.now(),
        },

        dueDate: {
            type: Number,
            default: () => 0,
        },

        filter: {
            type: String,
            default: "",
        },

        important: {
            type: Boolean,
            default: false,
        },

        complete: {
            type: Boolean,
            default: false,
        }
    }],

    filters: {
        type: [String],
        default: [],
    },
});

export default mongoose.model('Users', userSchema);
