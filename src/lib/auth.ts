import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "./db";
import { config } from "./env";

export const auth = betterAuth({
  secret: config.auth.secret,
  url: config.auth.url,
  database: prismaAdapter(db, {
    provider: "mongodb",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    // async sendResetPassword(data, request) {
    //   // Send an email to the user with a link to reset their password
    // }
  },
  socialProviders: {
    google: {
      clientId: config.oauth.google.clientId,
      clientSecret: config.oauth.google.clientSecret,
    },
    github: {
      clientId: config.oauth.github.clientId,
      clientSecret: config.oauth.github.clientSecret,
    },
  },
});
