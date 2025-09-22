## Requirements:
- Deployment of [Pocketbase](https://pocketbase.io/) and [next-image-transformation](https://github.com/coollabsio/next-image-transformation) publicly available (then fill .env appropriately).
- Coolify (Or any other hosting or self-hosted alternative that supports Docker).



## Deploying on Coolify
Select repository and branch, then as Build pack choose `Dockerfile`.
- Base Directory: `/`
- Dockerfile location: `/Dockerfile`

**Add your Environment Variables in Coolify settings (Look at .env.example).**


### Environment Variables
- Rename the .env.example file to .env and set the environment variables as needed.

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
By default this project uses [Node adapter](https://svelte.dev/docs/kit/adapter-node).

## Running on VPS notes:
Change environment variables for POST upload size limit of nodejs when running with PM2 (example with 2GB size limit):
```bash
BODY_SIZE_LIMIT=2147483648 pm2 start index.js --name sveltekit
```
