const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const itemSchema = new Schema({
    id: {
        type: Number,
        required: false
    },
    title: {
        type: String,
    },
    category: {
        type: String,
    },
    description: {
        type: String,
    }
});

const Item = mongoose.model("Item", itemSchema);
module.exports = Item;