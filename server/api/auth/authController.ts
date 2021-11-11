import {Response, Request} from 'express';
const User = require('../../models/user.model');
const catchAsync = require('../../utillities/catchAsync');
const fetch = require('node-fetch');
const {OAuth2Client} = require('google-auth-library');
const jwt = require('jsonwebtoken');

const client = new OAuth2Client(process.env.GOOGLE_AUTH_CLIENT_ID);

/**
 * Login with google:
 * Any user from level 1-4
 * can login with google
 * */
 module.exports.googleLogin = catchAsync(async (req: Request, res: Response) => {
    // Recive token from client (google provide this token) 
    const {tokenID} = req.body;
    
    // Check google token validity 
    let response = await client.verifyIdToken({idToken: tokenID, audience: process.env.GOOGLE_AUTH_CLIENT_ID});
    
    const {email} = response.payload;
    
    // Find user
    const user = await User.findOne({email: email});
    
    if(!user){
        // If not user exist 
        res.status(404).send('User not exist');
    }else {
        // If user exist generate token
        // and return user with the token
        const token  = jwt.sign({_id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});
        res.send({
            token: token,
            user: user
        })
    }    
});

/**
 * Register with google:
 * Any user from level 1-4
 * can register with google
 * */
module.exports.googleRegister = catchAsync(async (req: Request, res: Response) => {
    // Recive token from client (google provide this token) 
    const {tokenID, linkedin_url, username, phone_number, expertise, interests} = req.body;
    
    // Check token validity
    let response = await client.verifyIdToken({idToken: tokenID, audience: process.env.GOOGLE_AUTH_CLIENT_ID});
    const { given_name, family_name, email } = response.payload;
    
    // Find user
    const user = await User.findOne({email: email});
    
    if(user){
        // If user exist return error with status code 400
        res.status(400).send('User already exist');
    }else {
        
        // Else create user with given data from client and google
        const user = await new User({
            username: username,
            first_name: given_name,
            last_name: family_name,
            phone_number: phone_number,
            linkedin_url: linkedin_url,
            expertise: expertise,
            interests: interests,
            email: email
        }) 

        // Save user
        const savedUser = await user.save();
        // Generate token
        // and send token and user to client
        const token  = jwt.sign({_id: savedUser._id}, process.env.JWT_SECRET, {expiresIn: '7d'});
        res.send({
            token: token,
            user: savedUser
        });
    }
   
});

/**
 * Login with facebook:
 * Any user from level 1-4
 * can login with facebook
 * */
module.exports.facebookLogin = catchAsync(async (req: Request, res: Response) => {
    // Recive token and userID from client (facebook provide this)
    const { tokenID, userID } = req.body;

    // Get some data of the user by facebook api (first_name, last_name, id, email)
    let urlGraphFacebook = `https://graph.facebook.com/v12.0/${userID}/?fields=id,first_name,last_name,email&access_token=${tokenID}`;
    let response = await fetch(urlGraphFacebook, {method: 'GET'});
    response = await response.json();
    const { email } = response;
    
    // Find user
    const user = await User.findOne({email: email});

    if(!user){
        // If user does not exist return error with status code 404.
        res.status(404).send('User not exist');
    }else {
        // Generate token and send user and token to client
        const token  = jwt.sign({_id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});
        res.send({
            token: token,
            user: user
        })
    }
    
})

/**
 * Register with facebook:
 * Any user from level 1-4
 * can register with facebook
 * */
 module.exports.facebookRegister = catchAsync(async (req: Request, res: Response) => {
    // Recive token and userID from client (facebook provide this)
    const {tokenID, userID,  linkedin_url, username, phone_number, expertise, interests} = req.body;

    // Get some data of the user by facebook api (first_name, last_name, id, email)
    let urlGraphFacebook = `https://graph.facebook.com/v12.0/${userID}/?fields=id,first_name,last_name,email&access_token=${tokenID}`;
    let response = await fetch(urlGraphFacebook, {method: 'GET'});
    response = await response.json();

    if(response.error) {
        res.status(500).send(response.error);
    }
    
    const { email, first_name, last_name } = response;
    
    
    // Find user
    const user = await User.findOne({email: email});

    if(user){
        // If user exist return error with status code 400.
        res.status(400).send('User already exist');
    }else {
        // Else create user with given data from client and google
        const user = await new User({
            username: username,
            first_name: first_name,
            last_name: last_name,
            phone_number: phone_number,
            linkedin_url: linkedin_url,
            expertise: expertise,
            interests: interests,
            email: email
        }) 
        // Save user
        const savedUser = await user.save();
        // Generate token
        // and send token and user to client
        const token  = jwt.sign({_id: savedUser._id}, process.env.JWT_SECRET, {expiresIn: '7d'});
        res.send({
            token: token,
            user: savedUser
        });
    }
    
});

/**
 * Check token validation:
 * Any user from level 1-4
 * can check token validation
 * */
module.exports.tokenValidation = catchAsync(async (req: Request, res: Response) => {
    const token = req.header("x-auth-token");
    
    if(!token || token == 'undefined') return res.send(false);
    
    const verified = jwt.verify(token, process.env.JWT_SECRET)
    
    if(!verified) return res.send(false);

    const user = await User.findOne({_id: verified._id})
    if(!user) return res.send(false);

    res.send({user: user, token: token});
});
