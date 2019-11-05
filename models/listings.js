let mongoose = require("mongoose")

let ListingSchema = new mongoose.Schema({
    title: String,
    description: String,
    category: String,
    website:  {type: String, default: null},
    mobile:  {type: String, default: null},
    location: String,
    featuredimage: String,
    gallery:[{
        type: String, default: null
    }],
    featured:{type: Boolean, default: false},
    facebook: {type: String, default: ""},
    instagram: {type: String, default: ""},
    twitter: {type: String, default: ""},
    hearts: {type: Number, default: 0},
    reviews:[{
        type: String, default: null
    }]
},
{
    collection: "listings"
})

module.exports = mongoose.model("Listing", ListingSchema)