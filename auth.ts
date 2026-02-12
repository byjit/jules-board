import { Polar } from "@polar-sh/sdk";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin, multiSession } from "better-auth/plugins";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { env } from "@/env";
import { APP_NAME, SYSTEM_ADMIN_USER_IDS, SYSTEM_NOTIFICATION_EMAIL } from "@/lib/constant";
import WelcomeEmail from "@/lib/services/email-templates/WelcomeEmail";
import { sendAdminSlackNotification } from "@/lib/services/notification";
import { resend } from "@/lib/services/resend";
import { db } from "@/server/db";

export const polarClient = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN,
  server: env.NODE_ENV === "production" ? "production" : "sandbox",
});

export const auth = betterAuth({
  baseURL: env.NEXT_PUBLIC_APP_URL,
  database: drizzleAdapter(db, {
    provider: "sqlite",
  }),
  user: {
    additionalFields: {
      metadata: {
        type: "string",
        required: false,
        input: false,
        fieldName: "metadata",
        unique: false,
      },
      onboard: {
        type: "number",
        required: false,
        input: false,
        fieldName: "onboard",
        unique: false,
      },
    },
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
  plugins: [
    nextCookies(),
    multiSession({
      maximumSessions: 2,
    }),
    // polar({
    //     client: polarClient,
    //     createCustomerOnSignUp: true,
    //     enableCustomerPortal: true,
    //     use: [
    //         checkout({
    //             products: [
    //                 {
    //                     productId: env.POLAR_PRO_PRODUCT_ID,
    //                     slug: env.POLAR_PRO_SLUG,
    //                 },
    //             ],
    //             successUrl: env.POLAR_SUCCESS_URL,
    //             authenticatedUsersOnly: true,
    //         }),
    //         portal(),
    //     ],
    // }),
    admin({
      adminUserIds: SYSTEM_ADMIN_USER_IDS,
      bannedUserMessage:
        "You have been banned from using this application due to unauthorized activity. Please contact Support if you believe there has been a misunderstanding.",
    }),
  ],
  databaseHooks: {
    user: {
      create: {
        after: async (user, _context) => {
          if (env.NODE_ENV === "production") {
            await sendAdminSlackNotification(
              `${APP_NAME} | New user signed up: ${user.email} at ${user.createdAt}`
            );

            await resend.emails.send({
              from: SYSTEM_NOTIFICATION_EMAIL,
              to: user.email,
              subject: `Welcome to ${APP_NAME}!`,
              react: WelcomeEmail({ name: user.name! || "there" }),
            });
          }
        },
      },
    },
  },
});

export const getSession = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session as Session;
});

export const validateSession = cache(async () => {
  const session = await getSession();
  if (!session) redirect("/login");
  return session as Session;
});

export type Session = typeof auth.$Infer.Session;
