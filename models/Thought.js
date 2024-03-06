const { Schema, model } =  require('mongoose');
const formatDate = require('../utils/formatDate');

const thoughtSchema = new Schema({
    thoughtText: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 280,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: createdAtVal => formatDate(createdAtVal),
    },
    username: {
        type: String,
        required: true,
    },
    reactions: [reactionSchema],
}, {
    toJSON: {
        virtuals: true,
        getters: true,
    },
    id: false,
});

thoughtSchema
.virtual('reactionCount')
.get(function() {
    return this.reactions.length;
});

const reactionSchema = new Schema ({
    reactionId: {
        type: Schema.Types.ObjectId,
        default: () => new Schema.Types.ObjectId(),
    },
    reactionBody: {
        type: String,
        required: true,
        maxlenght: 290
    },
    username: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: createdAtVal =>  formatDate(createdAtVal)
    }
}, {
    toJSON: {
        getters: true
    },
    id: false
});

const Thought = model(Thought, thoughtSchema);

module.exports = Thought;