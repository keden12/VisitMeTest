const chai = require("chai")
const expect = chai.expect
const chaiHttp = require("chai-http")
const request = require("supertest")
const MongoMemoryServer = require("mongodb-memory-server").MongoMemoryServer
const Listing = require("../../../models/listings")
const mongoose = require("mongoose")
chai.use(chaiHttp)

const _ = require("lodash")
let server
let mongod
let db
let projectID

describe("Listings", () => {
    before(async () => {
        try {
            mongod = new MongoMemoryServer({
                instance: {
                    port: 27017,
                    dbPath: "./test/database",
                    dbName: "listingsdb" // by default generate random dbName
                }
            })

            await mongod.getConnectionString()

            mongoose.connect("mongodb://localhost:27017/listingsdb", {
                useNewUrlParser: true,
                useUnifiedTopology: true
            })
            server = require("../../../bin/www")
            db = mongoose.connection
        } catch (error) {
            console.log(error)
        }
    })

    after(async () => {
        try {
            await db.dropDatabase()
        } catch (error) {
            console.log(error)
        }
    })

    beforeEach(async () => {
        try {
            await Listing.deleteMany({})
            let listing = new Listing()
            listing.title = "The Dome"
            listing.description = "The Dome Bar is located in the WIT Main Campus. It is mainly used by students since it is a great place to socialise! Why not check it out yourself!"
            listing.category = "Pubs"
            listing.website = "http://witsu.ie/locations/the-dome-bar/"
            listing.mobile = "0858558793"
            listing.location = "WIT Main Campus, Waterford"
            listing.featuredimage = "./images/dome01.jpg"
            listing.gallery = ["./images/dome02.jpg", "./images/dome03.jpg"]
            listing.featured = false
            listing.facebook = "https://www.facebook.com/WITdomebar/"
            listing.twitter = ""
            listing.instagram = ""
            await listing.save()
            listing = new Listing()
            listing.title = "Momo Restaurant"
            listing.description = "Momo Restaurant offers international flavours using the best local ingredients. All our dishes are made from scrach with love and care. Enjoy a meal at Momo in a casual and relaxed atmosphere. We cater for all dietry needs- coeliac, dairy intolerant, vegetarians, etc."
            listing.category = "Restaurants"
            listing.website = "https://momorestaurant.ie/"
            listing.mobile = "051581509"
            listing.location = "47 Patrick Street, Waterford, Ireland"
            listing.featuredimage = "./images/momo01.png"
            listing.gallery = ["./images/momo02.png", "./images/momo03.jpg", "./images/momo04.png"]
            listing.featured = true
            listing.facebook = "https://www.facebook.com/momowaterford/"
            listing.twitter = "https://www.instagram.com/momowaterford/"
            listing.instagram = "https://twitter.com/momorestaurant"
            await listing.save()
            listing = new Listing()
            listing.title = "Factory"
            listing.description = "Factory is a Premium Nightclub venue!"
            listing.category = "Nightclubs"
            listing.website = "https://www.facebook.com/FactoryWaterford/"
            listing.mobile = "051854878"
            listing.location = "30 John street, Waterford, Ireland"
            listing.featuredimage = "./images/factory01.png"
            listing.gallery = ["./images/factory02.jpg"]
            listing.featured = true
            listing.facebook = "https://www.facebook.com/FactoryWaterford/"
            listing.twitter = ""
            listing.instagram = "https://www.instagram.com/factorywaterford/"
            await listing.save()
            listing = new Listing()
            listing.title = "Project"
            listing.description = "Waterford’s premier live music venue for music acts from all genres; from pop, rock, jazz and RnB to deep house and much more."
            listing.category = "Nightclubs"
            listing.website = "https://project.ticketabc.com/venues/project/"
            listing.mobile = "051582642"
            listing.location = "11-12 John Street, Waterford, Ireland"
            listing.featuredimage = "./images/project01.png"
            listing.gallery = ["./images/project02.png"]
            listing.featured = false
            listing.facebook = "https://www.facebook.com/pg/ProjectVenueWaterford/"
            listing.twitter = ""
            listing.instagram = ""
            await listing.save()
            listing = await Listing.findOne({
                title: "Project"
            })
            projectID = listing._id

        } catch (error) {
            console.log(error)
        }
    })



    describe("GET /listings/category/:category", () => {
        it("should return all listings from that category", done => {
            request(server)
                .get("/listings/category/Nightclubs")
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .expect(200)
                .end((err, res) => {
                    try {
                        //expect(res.body.length).to.equal(2);  
                        expect(res.body).to.be.a("array")
                        let result = _.map(res.body, listing => {
                            return {
                                title: listing.title
                            }
                        })
                        expect(result).to.deep.include({
                            title: "Project"
                        })
                        expect(result).to.deep.include({
                            title: "Factory"
                        })
                        done()
                    } catch (e) {
                        done(e)
                    }
                })
        })
    })








    describe("GET /listings/:category/total", () => {
        it("should return the total number of listings in the category", done => {
            request(server)
                .get("/listings/Nightclubs/total")
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .expect(200)
                .end((err, res) => {
                    expect(res.body.total).to.equal(2)
                    done(err)
                })
        })
    })


    describe("GET /listings/:id", () => {

        it("should return the matching listing", done => {
            request(server)
                .get(`/listings/${projectID}`)
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .expect(200)
                .end((err, res) => {
                    expect(res.body[0]).to.have.property("title", "Project")
                    expect(res.body[0]).to.have.property("category", "Nightclubs")
                    expect(res.body[0]).to.have.property("description", "Waterford’s premier live music venue for music acts from all genres; from pop, rock, jazz and RnB to deep house and much more.")
                    expect(res.body[0]).to.have.property("category", "Nightclubs")
                    expect(res.body[0]).to.have.property("website", "https://project.ticketabc.com/venues/project/")
                    expect(res.body[0]).to.have.property("mobile", "051582642")
                    expect(res.body[0]).to.have.property("location", "11-12 John Street, Waterford, Ireland")
                    expect(res.body[0]).to.have.property("featuredimage", "./images/project01.png")
                    expect(res.body[0]).to.have.property("featured", false)
                    expect(res.body[0]).to.have.property("facebook", "https://www.facebook.com/pg/ProjectVenueWaterford/")
                    done(err)
                })
        })

    })


    describe("GET /listings/title/:title", () => {
        it("should return the matching listing", done => {
            request(server)
                .get("/listings/title/Project")
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .expect(200)
                .end((err, res) => {
                    expect(res.body[0]).to.have.property("title", "Project")
                    expect(res.body[0]).to.have.property("category", "Nightclubs")
                    expect(res.body[0]).to.have.property("description", "Waterford’s premier live music venue for music acts from all genres; from pop, rock, jazz and RnB to deep house and much more.")
                    expect(res.body[0]).to.have.property("category", "Nightclubs")
                    expect(res.body[0]).to.have.property("website", "https://project.ticketabc.com/venues/project/")
                    expect(res.body[0]).to.have.property("mobile", "051582642")
                    expect(res.body[0]).to.have.property("location", "11-12 John Street, Waterford, Ireland")
                    expect(res.body[0]).to.have.property("featuredimage", "./images/project01.png")
                    expect(res.body[0]).to.have.property("featured", false)
                    expect(res.body[0]).to.have.property("facebook", "https://www.facebook.com/pg/ProjectVenueWaterford/")
                    done(err)
                })
        })
    })




    describe("GET /listings/total", () => {
        it("should return the total number of listings", done => {
            request(server)
                .get("/listings/total")
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .expect(200)
                .end((err, res) => {
                    expect(res.body.total).to.equal(4)
                    done(err)
                })
        })
    })



    describe("GET /listings", () => {
        it("should GET all the listings", done => {
            request(server)
                .get("/listings")
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .expect(200)
                .end((err, res) => {
                    try {
                        expect(res.body.length).to.equal(4)
                        expect(res.body).to.be.a("array")
                        let result = _.map(res.body, listing => {
                            return {
                                title: listing.title
                            }
                        })
                        expect(result).to.deep.include({
                            title: "Project"
                        })
                        expect(result).to.deep.include({
                            title: "Factory"
                        })
                        expect(result).to.deep.include({
                            title: "Momo Restaurant"
                        })
                        expect(result).to.deep.include({
                            title: "The Dome"
                        })
                        done()
                    } catch (e) {
                        done(e)
                    }
                })
        })
    })





    describe("PUT /listings/:id/changetitle", () => {
        it("should return a 200 and change the listing title", () => {

            const title = {
                title: "Project Test"
            }
            return request(server)
                .put(`/listings/${projectID}/changetitle`)
                .send(title)
                .expect(200)
        })
        after(() => {
            return request(server)
                .get(`/listings/${projectID}`)
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .expect(200)
                .then(resp => {
                    expect(resp.body[0]).to.have.property("title", "Project Test")
                })
        })
    })


    describe("PUT /listings/:id/love", () => {
        it("should return a 200 and hearts increment by 1", () => {
            return request(server)
                .put(`/listings/${projectID}/love`)
                .expect(200)
        })
        after(() => {
            return request(server)
                .get(`/listings/${projectID}`)
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .expect(200)
                .then(resp => {
                    expect(resp.body[0]).to.have.property("hearts", 1)
                })
        })
    })


    describe("PUT /listings/:id/changedesc", () => {
        it("should return a 200 and change the description", () => {

            const description = {
                description: "description test"
            }
            return request(server)
                .put(`/listings/${projectID}/changedesc`)
                .send(description)
                .expect(200)
        })
        after(() => {
            return request(server)
                .get(`/listings/${projectID}`)
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .expect(200)
                .then(resp => {
                    expect(resp.body[0]).to.have.property("description", "description test")
                })
        })
    })

    describe("PUT /listings/:id/changefeatured", () => {
        it("should return a 200 and change the featured status to true", () => {

            return request(server)
                .put(`/listings/${projectID}/changefeatured`)
                .expect(200)
        })
        after(() => {
            return request(server)
                .get(`/listings/${projectID}`)
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .expect(200)
                .then(resp => {
                    expect(resp.body[0]).to.have.property("featured", true)
                })
        })
    })


    describe("POST /listings", () => {
        it("should return confirmation message and update datastore", () => {
            const listing = {
                title: "Test",
                description: "Test is a test listing!",
                category: "Pubs",
                website: "https://www.facebook.com/testsite/",
                mobile: "051854898",
                location: "35 John street, Waterford, Ireland",
                featuredimage: "./images/test01.png",
                gallery: ["./images/test02.jpg"],
                featured: false,
                facebook: "https://www.facebook.com/test/",
                twitter: "",
                instagram: "https://www.instagram.com/test",
            }
            return request(server)
                .post("/listings")
                .send(listing)
                .expect(200)
                .then(res => {
                    expect(res.body.message).equals("Listing has been added successfully!")
                })
        })
        after(() => {
            return request(server)
                .get("/listings/title/Test")
                .expect(200)
                .then(res => {
                    expect(res.body[0]).to.have.property("title", "Test")
                    expect(res.body[0]).to.have.property("category", "Pubs")
                })
        })
    })



    describe("POST /listings/search", () => {
        it("should work like a fuzzy search so should return listings without full title", () => {
            const search = {
                searchCriteria: "Fac"
            }
            return request(server)
                .post("/listings/search")
                .send(search)
                .expect(200)
                .then(res => {
                    expect(res.body.result[0]).to.have.property("title", "Factory")
                    expect(res.body.result.length).to.equal(1)
                })
        })
    })




    describe("DELETE /listings/:id", function () {
        describe("when id is valid", function () {
            it("should return a confirmation message and delete the listing", function (done) {
                chai.request(server)
                    .delete("/listings/${projectID}")
                    .end((err, res) => {
                        expect(res).to.have.status(200)
                        expect(res.body).to.have.property("message", "Listing Deleted Successfully!")
                        done()
                    })
            })
            after(function (done) {
                chai.request(server)
                    .get("/listings")
                    .end(function (err, res) {
                        expect(res).to.have.status(200)
                        expect(res.body).be.be.a("array")
                        let result = _.map(res.body, function (listing) {
                            return {
                                title: listing.title,
                                category: listing.category
                            }
                        })
                        expect(result).to.not.include({
                            title: "Project",
                            category: "Nightclubs"
                        })
                        done()
                    })
            })
        })
        describe("when id is invalid", function () {
            it("should return an error message", function (done) {
                chai.request(server)
                    .delete("/listings/142013")
                    .end((err, res) => {
                        expect(res).to.have.status(200)
                        expect(res.body).to.have.property("message", "Listing Not Deleted!")
                        done()
                    })
            })
        })
    })





    describe("DELETE /listings/title/:title", function () {
        describe("when title is valid", function () {
            it("should return a confirmation message and delete the listing", function (done) {
                chai.request(server)
                    .delete("/listings/title/Project")
                    .end((err, res) => {
                        expect(res).to.have.status(200)
                        expect(res.body).to.have.property("message", "Listing Deleted Successfully!")
                        done()
                    })
            })
            after(function (done) {
                chai.request(server)
                    .get("/listings")
                    .end(function (err, res) {
                        expect(res).to.have.status(200)
                        expect(res.body).be.be.a("array")
                        let result = _.map(res.body, function (listing) {
                            return {
                                title: listing.title,
                                category: listing.category
                            }
                        })
                        expect(result).to.not.include({
                            title: "Project",
                            category: "Nightclubs"
                        })
                        done()
                    })
            })
        })
    })











})



