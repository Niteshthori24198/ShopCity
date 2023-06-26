
require("dotenv").config()

const passport = require("passport");

const crypto = require('crypto')
const randomPassword = (byte = 32) => crypto.randomBytes(byte).toString('hex')

const UserModel = require("../model/user.model");

const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({

  clientID: process.env.googleclientid,
  clientSecret: process.env.googleclientsecret,
  callbackURL: "http://localhost:3000/user/auth/google/callback"

},

async function (accessToken, refreshToken, profile, cb) {

    try {

      let Email = profile._json.email

      const user = await UserModel.findOne({ Email })

      //console.log(user)

      if (!user) {

        console.log("adding new user")

        let newuser = new UserModel({

          Email,
          Name: profile._json.name,
          Password: randomPassword(),
          Gender: "Male",
          isAdmin: false,
          Contact: "-",
          Location: "-",
          isMailVerified: true
        })

        await newuser.save()

        return cb(null, newuser)

      }

      else {

        console.log("user is present db")
        if(user.isBlocked){

          return cb(null, 'Blocked User')
          
        }else{

          return cb(null, user)

        }


      }
    }
    catch (error) {

      console.log(error)

    }

    //console.log(profile)

  }

));




module.exports = { passport }
