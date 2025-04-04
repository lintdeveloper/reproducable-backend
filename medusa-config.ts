import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;

if (!paystackSecretKey) {
  throw new Error('PAYSTACK_SECRET_KEY is required');
}

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    workerMode: process.env.MEDUSA_WORKER_MODE as "shared" | "worker" | "server",
    redisUrl: process.env.REDIS_URL,

    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    }
  },
  
  admin: {
    backendUrl: process.env.MEDUSA_BACKEND_URL
  },

  modules: [
    {
      resolve: "@medusajs/medusa/payment",
      options: {
        providers: [
          // other payment providers like stripe, paypal etc
          {
            resolve: "medusa-payment-paystack",
            options: {
              secret_key: paystackSecretKey,
              debug: true,
            } satisfies import("medusa-payment-paystack").PluginOptions,
          },
          {
            resolve: "@medusajs/medusa/notification",
            options: {
              providers: [
                {
                  resolve: "./src/modules/resend",
                  id: "resend",
                  options: {
                    channels: ["email"],
                    api_key: process.env.RESEND_API_KEY,
                    from: process.env.RESEND_FROM,
                  }
                }
              ]
            }
          }
        ],
      },
    },
  ],
})
