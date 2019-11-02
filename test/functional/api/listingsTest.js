const chai = require("chai");
const expect = chai.expect;
const request = require("supertest");
const MongoMemoryServer = require("mongodb-memory-server").MongoMemoryServer;
const Listing = require("../../../models/listings");
const mongoose = require("mongoose");

const _ = require("lodash");
let server;
let mongod;
let db, validID;

let datastore = require("../../../models/listings");

describe('Listings',  () => {
before(async () => {
		try {
		  mongod = new MongoMemoryServer({
			instance: {
			  port: 27017,
			  dbPath: "./test/database",
			  dbName: "listingsdb" // by default generate random dbName
			}
		  });

		  await mongod.getConnectionString();
	 
		  mongoose.connect("mongodb://localhost:27017/listingsdb", {
			useNewUrlParser: true,
			useUnifiedTopology: true
		  });
		  server = require("../../../bin/www");
		  db = mongoose.connection;
		} catch (error) {
		  console.log(error);
		}
});
	  
  after(async () => {
    try {
      await db.dropDatabase();
    } catch (error) {
      console.log(error);
    }
  });
  
   beforeEach(async () => {
    try {
      await Listing.deleteMany({});
      let listing = new Listing();
      listing.title = "The Dome";
      listing.description = "The Dome Bar is located in the WIT Main Campus. It is mainly used by students since it is a great place to socialise! Why not check it out yourself!";
      listing.category = "Pubs";
	  listing.website = "http://witsu.ie/locations/the-dome-bar/";
	  listing.mobile = "0858558793";
	  listing.location = "WIT Main Campus, Waterford";
	  listing.featuredimage = "./images/dome01.jpg";
	  listing.gallery = ["./images/dome02.jpg","./images/dome03.jpg"];
	  listing.featured = false;
	  listing.facebook = "https://www.facebook.com/WITdomebar/";
	  listing.twitter = "";
	  listing.instagram = "";
      await listing.save();
      listing = new Listing();
      listing.title = "Momo Restaurant";
      listing.description = "Momo Restaurant offers international flavours using the best local ingredients. All our dishes are made from scrach with love and care. Enjoy a meal at Momo in a casual and relaxed atmosphere. We cater for all dietry needs- coeliac, dairy intolerant, vegetarians, etc.";
      listing.category = "Restaurants";
	  listing.website = "https://momorestaurant.ie/";
	  listing.mobile = "051581509";
	  listing.location = "47 Patrick Street, Waterford, Ireland";
	  listing.featuredimage = "./images/momo01.png";
	  listing.gallery = ["./images/momo02.png","./images/momo03.jpg","./images/momo04.png"];
	  listing.featured = true;
	  listing.facebook = "https://www.facebook.com/momowaterford/";
	  listing.twitter = "https://www.instagram.com/momowaterford/";
	  listing.instagram = "https://twitter.com/momorestaurant";
      await listing.save();
	  listing = new Listing();
      listing.title = "Factory";
      listing.description = "Factory is a Premium Nightclub venue!";
      listing.category = "Nightclubs";
	  listing.website = "https://www.facebook.com/FactoryWaterford/";
	  listing.mobile = "051854878";
	  listing.location = "30 John street, Waterford, Ireland";
	  listing.featuredimage = "./images/factory01.png";
	  listing.gallery = ["./images/factory02.jpg"];
	  listing.featured = true;
	  listing.facebook = "https://www.facebook.com/FactoryWaterford/";
	  listing.twitter = "";
	  listing.instagram = "https://www.instagram.com/factorywaterford/";
      await listing.save();
	  listing = new Listing();
      listing.title = "Project";
      listing.description = "Waterford’s premier live music venue for music acts from all genres; from pop, rock, jazz and RnB to deep house and much more.";
      listing.category = "Nightclubs";
	  listing.website = "https://project.ticketabc.com/venues/project/";
	  listing.mobile = "051582642";
	  listing.location = "11-12 John Street, Waterford, Ireland";
	  listing.featuredimage = "./images/project01.png";
	  listing.gallery = ["./images/project02.png"];
	  listing.featured = false;
	  listing.facebook = "https://www.facebook.com/pg/ProjectVenueWaterford/";
	  listing.twitter = "";
	  listing.instagram = "";
      await listing.save();
      listing = await Listing.findOne({ title: "Project" });
      projectID = listing._id;
	  
    } catch (error) {
      console.log(error);
    }
  }); 
	
	
	
  describe("GET /listings", () => {
   //TODO
  });
});