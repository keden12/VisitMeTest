let express = require('express');
let mongoose = require('mongoose');
var listings = require('../models/listings');
let router = express.Router();


mongoose.connect('mongodb://localhost:27017/visitme');

let db = mongoose.connection;

db.on('error', function (err) {
    console.log('Unable to Connect to [ ' + db.name + ' ]', err);
});

db.once('open', function () {
    console.log('Successfully Connected to [ ' + db.name + ' ]');
});


router.findListings = (req, res) => {
    // Return a JSON representation of our list
    res.setHeader('Content-Type', 'application/json');

    listings.find(function(err, listing) {
        if (err)
            res.send(err);

        res.send(JSON.stringify(listing,null,5));
    });
}


router.findByID = (req, res) => {

    res.setHeader('Content-Type', 'application/json');

    listings.find({ "_id" : req.params.id },function(err, listing) {
        if (err)
            res.send("Listing Not Found!");// return a suitable error message
        else
            res.send(JSON.stringify(listing,null,5)); // return the donation
    });
}


router.findByTitle = (req, res) => {

    res.setHeader('Content-Type', 'application/json');

    listings.find({ "title" : req.params.title },function(err, listing) {
        if (err)
            res.send(err);// return a suitable error message
        else
            res.send(JSON.stringify(listing,null,5)); // return the donation
    });
}

router.findByCategory = (req, res) => {

    res.setHeader('Content-Type', 'application/json');

    listings.find({ "category" : req.params.category },function(err, listing) {
        if (err)
            res.send(err);// return a suitable error message
        else
            res.send(JSON.stringify(listing,null,5)); // return the donation
    });
}


router.incrementHeart = (req, res) => {

    listings.findById(req.params.id, function(err,listing) {
        if (err)
            res.send('Listing NOT Found - Loving the Listing Not Successfull!');
        else {
            listing.hearts += 1;
            listing.save(function (err) {
                if (err)
                    res.json({message : 'Loving the Listing Not Successfull!'});
                else
                    res.send(JSON.stringify({status : 200, message : 'Loving the Listing was Successful' , listing : listing },null,5));
            });
        }
    });
}


// An IDEA to be able to increment hearts if you only know the title 
/*
router.incrementHeartByTitle = (req, res) => {

    listings.find({ "title" : req.params.title },function(err, listing) {
        if (err)
            res.send('Listing NOT Found - Loving the Listing Not Successfull!');
        else
            listing.hearts += 1;
            listing.save(function (err) {
                if (err)
                    res.json({message : 'Loving the Listing Not Successfull!'});
                else
                    res.send(JSON.stringify({status : 200, message : 'Loving the Listing was Successful' , listing : listing },null,5));
            });
    });

}*/


router.changeTitle = (req, res) => {

    listings.findById(req.params.id, function(err,listing) {
        if (err)
            res.send('Listing NOT Found - Changing title Not Successfull!');
        else {
            listing.title = req.body.title;
            listing.save(function (err) {
                if (err)
                    res.json({message : 'Changing title Not Successfull!'});
                else
                    res.send(JSON.stringify({status : 200, message : 'Changing title was Successful' , listing : listing },null,5));
            });
        }
    });
}


router.changeDescription = (req, res) => {

    listings.findById(req.params.id, function(err,listing) {
        if (err)
            res.send('Listing NOT Found - Changing description Not Successfull!');
        else {
            listing.description = req.body.description;
            listing.save(function (err) {
                if (err)
                    res.json({message : 'Changing description Not Successfull!'});
                else
                    res.send(JSON.stringify({status : 200, message : 'Changing description was Successful' , listing : listing },null,5));
            });
        }
    });
}


module.exports = router;