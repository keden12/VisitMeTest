let express = require("express")
let mongoose = require("mongoose")
var Fuse = require("fuse.js")
var listings = require("../models/listings")
let router = express.Router()

var mongoUri = "mongodb+srv://keden12:ro13pedal@visitme-cluster-nt7jq.mongodb.net/visitme?retryWrites=true&w=majority"

mongoose.connect(mongoUri)

let db = mongoose.connection

db.on("error", function (err) {
    console.log("Unable to Connect to [ " + db.name + " ]", err)
})

db.once("open", function () {
    console.log("Successfully Connected to [ " + db.name + " ]")
})

// Setting up fuse.js
var options = {
    shouldSort: true,
    threshold: 0.6,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: [
        "title",
        "description"
    ]
}


router.findListings = (req, res) => {
    // Return a JSON representation of our list
    res.setHeader("Content-Type", "application/json")

    listings.find(function(err, listing) {
        if (err)
            res.send("Error searching for listings!")

        res.send(JSON.stringify(listing,null,5))
    })
}


router.findTotalListings = (req, res) => {
    // Return a JSON representation of our list
    res.setHeader("Content-Type", "application/json")

    listings.find(function(err, listing) {
        if (err)
            res.send("Error searching for listings!")

        var total = listing.length
        res.json({ total: total})
    })
}

router.findTotalListingsByCategory = (req, res) => {

    res.setHeader("Content-Type", "application/json")

    listings.find({ "category" : req.params.category },function(err, listing) {
        if (err)
            res.send("Error searching for category!")
        else
            var total = listing.length
        res.json({ total: total})
    })
}


router.findByID = (req, res) => {

    res.setHeader("Content-Type", "application/json")

    listings.find({ "_id" : req.params.id },function(err, listing) {
        if (err)
            res.send("Error searching by ID!")// return a suitable error message
        else
            res.send(JSON.stringify(listing,null,5))
    })
}


router.findByTitle = (req, res) => {

    res.setHeader("Content-Type", "application/json")

    listings.find({ "title" : req.params.title },function(err, listing) {
        if (err)
            res.send("Error searching by title!")// return a suitable error message
        else
            res.send(JSON.stringify(listing,null,5))
    })
}

router.findByCategory = (req, res) => {

    res.setHeader("Content-Type", "application/json")

    listings.find({ "category" : req.params.category },function(err, listing) {
        if (err)
            res.send("Error searching for category!")// return a suitable error message
        else
            res.send(JSON.stringify(listing,null,5))
    })
}


router.incrementHeart = (req, res) => {

    listings.findById(req.params.id, function(err,listing) {
        if (err)
            res.send("Listing NOT Found - Loving the Listing Not Successfull!")
        else {
            listing.hearts += 1
            listing.save(function (err) {
                if (err)
                    res.json({message : "Loving the Listing Not Successfull!"})
                else
                    res.send(JSON.stringify({status : 200, message : "Loving the Listing was Successful" , listing : listing },null,5))
            })
        }
    })
}


router.addListing = (req, res) => {

    res.setHeader("Content-Type", "application/json")

    var listing = new listings()

    listing.title = req.body.title
    listing.description = req.body.description
    listing.category = req.body.category
    listing.website = req.body.website
    listing.mobile = req.body.mobile
    listing.location = req.body.location
    listing.featuredimage = req.body.featuredimage
    listing.gallery = req.body.gallery
    listing.featured = req.body.featured
    listing.facebook = req.body.facebook
    listing.instagram = req.body.instagram
    listing.twitter = req.body.twitter

    listing.save(function(err) {
        if (err)
            res.json({ message: "Listing has not been added!"})
        else
            res.send(JSON.stringify({ message: "Listing has been added successfully!", data: {listing}},null,5))
    })
}



router.deleteListingByID = (req, res) => {

    listings.findByIdAndRemove(req.params.id, function(err) {
        if (err)
            res.json({ message: "Listing Not Deleted!"})
        else
            res.json({ message: "Listing Deleted Successfully!"})
    })

}


router.searchListings = (req, res) => {

    listings.find(function(err, listing) {
        if (err)
            res.json({ message: "Error searching for Listings!"})

        else
            var fuse = new Fuse(listing,options)
        var result = fuse.search(req.body.searchCriteria)

        res.json({result})
    })

}


router.deleteListingByTitle = (req, res) => {

    res.setHeader("Content-Type", "application/json")

    listings.remove({ "title" : req.params.title },function(err) {
        if (err)
            res.json({ message: "Listing Not Deleted!"})
        else
            res.json({ message: "Listing Deleted Successfully!"})
    })

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
            res.send("Listing NOT Found - Changing title Not Successfull!")
        else {
            listing.title = req.body.title
            listing.save(function (err) {
                if (err)
                    res.json({message : "Changing title Not Successfull!"})
                else
                    res.send(JSON.stringify({status : 200, message : "Changing title was Successful" , listing : listing },null,5))
            })
        }
    })
}


router.changeDescription = (req, res) => {

    listings.findById(req.params.id, function(err,listing) {
        if (err)
            res.send("Listing NOT Found - Changing description Not Successfull!")
        else {
            listing.description = req.body.description
            listing.save(function (err) {
                if (err)
                    res.json({message : "Changing description Not Successfull!"})
                else
                    res.send(JSON.stringify({status : 200, message : "Changing description was Successful" , listing : listing },null,5))
            })
        }
    })
}



router.changeFeatured = (req, res) => {

    listings.findById(req.params.id, function(err,listing) {
        if (err)
            res.send("Listing NOT Found - Featured switch Not Successfull!")
        else {
            if(listing.featured === false)
            {
                listing.featured = true
            }
            else
            {
                listing.featured = false
            }
            listing.save(function (err) {
                if (err)
                    res.json({message : "Featured switch Not Successfull!"})
                else
                    res.send(JSON.stringify({status : 200, message : "Featured switch was Successful" , listing : listing },null,5))
            })
        }
    })
}


module.exports = router