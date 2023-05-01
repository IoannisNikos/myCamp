const mongoose=require('mongoose');
const cities=require('./cities')
const { places, descriptors }=require('./seedHelpers');
const Campground=require('../models/campground');

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/yelpCamp');
    console.log("Established Connection with Mongo")
}

const sample=array => array[Math.floor(Math.random()*array.length)];

const seedDB=async () => {
    await Campground.deleteMany({});
    for (let i=0; i<500; i++) {
        const random1000=Math.floor(Math.random()*1000);
        const price=Math.floor(Math.random()*20)+10;
        const camp=new Campground({
            author: '644c058f44477a53d9fe72b4',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                    url: 'https://res.cloudinary.com/dzxv7wkgg/image/upload/v1682853756/myCamp/v7ct5mbqmvxrp6skmq40.jpg',
                    filename: 'myCamp/v7ct5mbqmvxrp6skmq40',
                },
                {
                    url: 'https://res.cloudinary.com/dzxv7wkgg/image/upload/v1682853757/myCamp/iiysiilsa8wcn4zxz0wm.jpg',
                    filename: 'myCamp/iiysiilsa8wcn4zxz0wm',
                },
                {
                    url: 'https://res.cloudinary.com/dzxv7wkgg/image/upload/v1682853757/myCamp/nmwerxw7aoxhhamrvapj.jpg',
                    filename: 'myCamp/nmwerxw7aoxhhamrvapj',
                }
            ],
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim officiis ad expedita, consectetur temporibus iure labore quidem necessitatibus at nesciunt ducimus molestiae, laudantium fugiat quos ea dolore officia animi sed?',
            price,
            geometry: {
                type: 'Point',
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            }
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})


