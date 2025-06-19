const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const AppleStrategy = require('passport-apple').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const GithubStrategy = require('passport-github').Strategy
require('dotenv').config()
const session = require('express-session')
const express = require('express');
// const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy; // Uncomment if you add LinkedIn

// Replace with your User model
// const User = require('../models/User'); 

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  // Replace with your User model findById
  // User.findById(id, (err, user) => done(err, user));
  done(null, { id }); // Placeholder
});

// Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    // Find or create user
    // Example:
    // const existingUser = await User.findOne({ googleId: profile.id });
    // if (existingUser) {
    //   return done(null, existingUser);
    // }
    // const newUser = new User({ googleId: profile.id, displayName: profile.displayName });
    // await newUser.save();
    // done(null, newUser);
    console.log('Google profile:', profile);
    done(null, profile); // Placeholder
  }
));

// Facebook Strategy
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'emails', 'photos'] // Adjust as needed
  },
  async (accessToken, refreshToken, profile, done) => {
    // Find or create user
    console.log('Facebook profile:', profile);
    done(null, profile); // Placeholder
  }
));

// Apple Strategy
passport.use(new AppleStrategy({
    clientID: process.env.APPLE_CLIENT_ID,
    teamID: process.env.APPLE_TEAM_ID,
    keyID: process.env.APPLE_KEY_ID,
    privateKeyLocation: process.env.APPLE_PRIVATE_KEY_PATH, // or privateKeyString
    callbackURL: "/auth/apple/callback"
  },
  async (accessToken, refreshToken, idToken, profile, done) => {
    // The profile object from Apple is usually minimal. 
    // You'll likely use the idToken (which is a JWT) to get more user information.
    // You might need a library like 'jsonwebtoken' to decode it.
    console.log('Apple profile (idToken):', idToken);
    console.log('Apple profile (profile):', profile); // profile might be empty or undefined
    // Find or create user based on idToken's subject (sub)
    done(null, { id: idToken.sub, ...profile }); // Placeholder, adjust based on decoded idToken
  }
));

// GitHub Strategy
passport.use(new GithubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "/auth/github/callback",
    scope: ['user:email'] // Request email permission
  },
  async (accessToken, refreshToken, profile, done) => {
    // Find or create user
    console.log('GitHub profile:', profile);
    done(null, profile); // Placeholder
  }
));

// LinkedIn Strategy - (Add if you install the package and have credentials)
/*
passport.use(new LinkedInStrategy({
    clientID: process.env.LINKEDIN_KEY,
    clientSecret: process.env.LINKEDIN_SECRET,
    callbackURL: "/auth/linkedin/callback",
    scope: ['r_emailaddress', 'r_liteprofile'], // Adjust scopes as needed
    state: true // Recommended for security
  },
  async (accessToken, refreshToken, profile, done) => {
    // Find or create user
    console.log('LinkedIn profile:', profile);
    done(null, profile); // Placeholder
  }
));
*/

module.exports = passport;


