
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";


import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcryptjs from 'bcryptjs';
import {Provider, Role, Status } from '@prisma/client';
import config from "../config";
import prisma from "../shared/prisma";







passport.use(
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password"
        },
        async (email: string, password: string, done) => {
            try {
                const isUserExist = await prisma.user.findUnique(
                    {
                        where: { email },
                        include: {
                            auths: true
                        }
                    }
                )
                if (!isUserExist) {
                    return done("User Not Found")
                }

                if (!isUserExist.isVerified) {
                    return done(`User Is Not Verified`)
                }


                if (isUserExist.status === Status.BLOCKED) {
                    return done(`User Is ${isUserExist.status}`)
                }
                const isGoogleAuthenticated = isUserExist.auths.some(providerObjects => providerObjects.provider === Provider.GOOGLE)

                if (isGoogleAuthenticated && !isUserExist.password) {
                    return done(null, false, { message: "You have authenticated through Google. So if you want to login with credentials, then at first login with google and set a password for your Gmail and then you can login with email and password." })
                }

                const isPasswordMatch = await bcryptjs.compare(password as string, isUserExist.password as string)

                if (!isPasswordMatch) {
                    return done(null, false, { message: "Password Does Not Match" })
                }

                return done(null, isUserExist)

            } catch (error) {
                console.log(error)
                return done(error)
            }
        }
    )
)

passport.use(
    new GoogleStrategy(
        {
            clientID: config.GOOGLE_CLIENT_ID,
            clientSecret: config.GOOGLE_CLIENT_SECRET,
            callbackURL: config.GOOGLE_CALLBACK_URL
        }, async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {

            try {

                const email = profile.emails?.[0].value
                if (!email) {
                    return done(null, false, { message: "No Email Found !" })
                }

                let isUserExist = await prisma.user.findUnique({ where: { email } })
                if (isUserExist && !isUserExist.isVerified) {
                    return done(null, false, { message: "User is not verified" })
                }

                if (isUserExist && (isUserExist.status === Status.BLOCKED)) {
                    done(`User is ${isUserExist.status}`)
                }


                if (!isUserExist) {
                    isUserExist = await prisma.user.create({
                        data: {
                            email,
                            role: Role.USER,
                            isVerified: true,
                            auths: {
                                create: [
                                    {
                                        provider: Provider.GOOGLE,
                                        providerId: profile.id
                                    }
                                ]
                            },
                            client:{
                                create:{
                                    name: profile.displayName,
                                    profilePhoto: profile.photos?.[0].value ?? "",
                                    contactNumber:"",
                                }
                            }
                        }
                    })
                }

                return done(null, isUserExist)

            } catch (error) {
                console.log("Google Strategy Error", error)

                return done(error)
            }
        }
    ))



passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
    done(null, user.id)
})

passport.deserializeUser(async (id: string, done: any) => {
    try {
        const user = await prisma.user.findUnique({ where: { id } });
        done(null, user)
    } catch (error) {
        console.log(error);
        done(error)
    }
})