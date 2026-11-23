# UpNorth Gaming

The studio homepage and development log are served by a Cloudflare Worker on Sites. Photos, gameplay videos, and published updates are stored in the Site's R2 bucket.

Visit /admin and sign in with an approved ChatGPT account. Create an update, select a platform if applicable, and attach up to 12 photos or clips. Add a description for each file and publish. To edit a published update, select it from the list and save your changes.

The hosted `ADMIN_EMAILS` secret accepts a comma-separated list of ChatGPT sign-in email addresses. Both approved accounts have the same editing access. For a private Site, each admin also needs visitor access through the Sites access policy. Changing the secret requires a deployment to apply. Photo and video files may be up to 50 MiB each.

Run `npm run build` followed by `npm run validate` to check the deployable Worker artifact. Brand images are embedded by the build. The hosted environment supplies R2 and ChatGPT identity.
