import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: String,
    
    tasks: [{
        body: String,

        createdAt: {
            type: Number,
            default: () => Date.now(),
        },

        dueDate: {
            type: Number,
            default: () => 0,
        },

        filter: String,
        important: Boolean,

        complete: Boolean, 
    }],

    filters: [String],
});

export default mongoose.model('Users', userSchema);
