# [DishCraft](https://dishcraft.vercel.app)
A recipe-sharing platform built for developers.

### Technologies Used
* [Next.js](https://nextjs.org/)
* [TypeScript](https://www.typescriptlang.org/)
* [Tailwind CSS](https://tailwindcss.com/)
* [Shadcn UI](https://ui.shadcn.com/)
* [Radix UI](https://www.radix-ui.com/)
* [Auth.js](https://authjs.dev/guides/upgrade-to-v5)
* [Zod](https://zod.dev/) (for validation)
* [Drizzle ORM](https://orm.drizzle.team/)
* [Neon Postgres](https://neon.tech/)
* [Vercel KV Database](https://vercel.com/docs/storage/vercel-kv) (for rate limiting)
* [Vercel Blob Store](https://vercel.com/docs/storage/vercel-blob) (for image storage)

[PageSpeed Insights](https://pagespeed.web.dev/analysis/https-dishcraft-vercel-app/5p9tqr4sca?form_factor=mobile)

Used Partial Pre-Rendering, App Router, Server Actions, and React Server Components in Next.js.

### Development
* Clone the repo using `git clone https://github.com/T1LT/DishCraft.git`
* Install the packages using `npm i`
* Add environment variables as specified in the `.env.example` file.
* Make sure `?sslmode=required` is at the end of the `POSTGRES_URL` env variable.
* For database migrations, use `npx drizzle-kit generate:pg` and `npx drizzle-kit push:pg`

### Deployment
* Make sure the Vercel project is connected to a Vercel Postgres (Neon) database.
* Connect the project to a Vercel Blob store.
* For rate limiting, add a Vercel KV (Upstash) database.
* Run `npx drizzle-kit push:pg` to push changes to your database.
* Update `metadataBase` in `app/layout.tsx` to match your target domain.

### Contributing
Feel free to open issues/create pull requests if you want to see any changes or if you want to add any enhancements!
There are a few issues open already if you want something to take up a task right away.
