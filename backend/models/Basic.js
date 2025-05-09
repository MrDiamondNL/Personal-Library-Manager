const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const basicSchema = new Schema ({
    text: {
        type: String
    }
})

const Basic = mongoose.model("Basic", basicSchema);
module.exports = Basic;