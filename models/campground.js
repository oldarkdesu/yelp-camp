const mongoose = require('mongoose');
const Review = require('./review')

const imageSchema = new mongoose.Schema({
    url: String, 
    filename: String,
    originalFilename: String,
})

imageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload', '/upload/w_400')
})

const campgroundSchema = new mongoose.Schema({
    title: String,
    price: Number,
    description: String,
    location: String,
    images: [imageSchema],
    poster: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    reviews: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Review" 
    }],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
})

campgroundSchema.post('findOneAndDelete', async (doc) => {
    if (!doc) { return }
    await Review.deleteMany({ _id: {$in: doc.reviews} })
})

module.exports = mongoose.model('Campground', campgroundSchema)