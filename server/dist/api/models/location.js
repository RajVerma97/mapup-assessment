const mongoose = require('mongoose');
const locationSchema = new mongoose.Schema({
    locationId: {
        type: Number,
        required: true,
    },
    borough: {
        type: String,
        required: true,
    },
    zone: {
        type: String,
        required: true,
    },
    serviceZone: {
        type: String,
        required: true,
    },
});
const locationModel = mongoose.model('Location', locationSchema);
export default locationModel;
