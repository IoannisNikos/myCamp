const mongoose=require('mongoose');
const passportLocalMongoose=require('passport-local-mongoose');
const Schema=mongoose.Schema;

const UserSchema=new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        match: /^[a-zA-Z0-9]+$/
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: /\S+@\S+\.\S+/
    }
});

UserSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model('User', UserSchema);