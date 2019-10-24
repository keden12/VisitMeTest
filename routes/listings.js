let donations = require('../models/listings');
let express = require('express');
let mongoose = require('mongoose');
var Donation = require('../models/listings');
let router = express.Router();


mongoose.connect('mongodb://localhost:27017/visitme');

let db = mongoose.connection;

db.on('error', function (err) {
    console.log('Unable to Connect to [ ' + db.name + ' ]', err);
});

db.once('open', function () {
    console.log('Successfully Connected to [ ' + db.name + ' ]');
});


router.findAll = (req, res) => {
    // Return a JSON representation of our list
    res.setHeader('Content-Type', 'application/json');

    Donation.find(function(err, donations) {
        if (err)
            res.send(err);

        res.send(JSON.stringify(donations,null,5));
    });
}



module.exports = router;