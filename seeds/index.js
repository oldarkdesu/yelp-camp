const mongoose = require("mongoose")
const cities = require("./cities")
const { places, descriptors } = require("./seedHelpers")
const Campground = require("../models/campground")

mongoose.set("strictQuery", false)
mongoose
   .connect("mongodb://127.0.0.1:27017/yelp-camp")
   .then(() => {
      console.log("Connected to MongoDB.")
   })
   .catch((err) => {
      console.log("Error connecting to MongoDB\n", err)
   })

const randInt = (x) => Math.floor(Math.random() * x)

const sample = (arr) => arr[randInt(arr.length)]

const seedDB = async () => {
   await Campground.deleteMany({})
   console.log("Campgrounds collection deleted. Reseeding...")
   for (let i = 0; i < 300; i++) {
      const index = randInt(1000)
      const camp = new Campground({
         location: `${cities[index].city}, ${cities[index].state}`,
         title: `${sample(descriptors)} ${sample(places)}`,
         image: "https://source.unsplash.com/random/?campground",
         description:
            "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptas, dolores?",
         price: randInt(200) + 300,
         poster: "63b62bb6374e0546adbc51f8",
         images: [
            {
               url: "https://res.cloudinary.com/dtjeolotg/image/upload/v1673947578/YelpCamp/swog311dsylvrigrvahh.gif",
               filename: "YelpCamp/swog311dsylvrigrvahh",
               originalFilename: "jii.gif",
            },
         ],
         geometry: {
            type: "Point",
            coordinates: [cities[index].longitude, cities[index].latitude],
         },
      })
      await camp.save()
   }
   const camp = new Campground({
      title: "Neko Camp!",
      price: 69420,
      description:
         "Hey schizo! Are you ready to give in and leave all of your sanity behind? Come join these cute non-existent cat girls in Neko Camp!\r\n" +
         "Remember that you are here for ever.",
      location: "Your head",
      images: [
         {
            url: "https://res.cloudinary.com/dtjeolotg/image/upload/v1673943169/YelpCamp/nalaiowvbytvolsh0efb.png",
            filename: "YelpCamp/nalaiowvbytvolsh0efb",
            originalFilename: "1577874106368.png",
         },
      ],
      geometry: {
         type: "Point",
         coordinates: [],
      },
      poster: "63c0e358fb55bc0ef1187a54",
   })
   const camp1 = new Campground({
      title: "Mercy camp",
      price: 6699,
      description:
         "MERCY HORSE SEX HORSE SEX HORSE COCK MERCY SEX COCK MERCY FUTA SEX SEX SEX SEX SEEEEEEEEEEEEEEEEEEEEX",
      location: "Numbani",
      reviews: [],
      images: [
         {
            url: "https://res.cloudinary.com/dtjeolotg/image/upload/v1673972033/YelpCamp/zwiexw8rnwjcrlqjtemy.png",
            filename: "YelpCamp/zwiexw8rnwjcrlqjtemy",
            originalFilename: "pape.png",
         },
         {
            url: "https://res.cloudinary.com/dtjeolotg/image/upload/v1673972034/YelpCamp/wayuz9scbvc3jhwrt8ie.jpg",
            filename: "YelpCamp/wayuz9scbvc3jhwrt8ie",
            originalFilename: "Background_Mercy01.jpg",
         },
      ],
      geometry: {
         type: "Point",
         coordinates: [],
      },
      poster: "63c0e358fb55bc0ef1187a54",
   })
   await camp1.save()
   await camp.save()
}

seedDB().then(() => {
   console.log("Finished. Closing Mongoose connection.")
   mongoose.connection.close()
})
