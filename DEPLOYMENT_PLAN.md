# Marketday DevOps and Deployment Plan

Use this plan to take the current Marketday frontend from the GitHub repository
to a public Google Cloud Run deployment. The app is a Vite-built React frontend:
the [Dockerfile](./Dockerfile) builds it with Node and serves the static output
with Nginx on port `80`. There is currently no backend, authentication service,
or payment processing.

## Target deployment flow

```text
GitHub push
  -> Cloud Build trigger
  -> Docker image build
  -> Artifact Registry
  -> Cloud Run deployment
  -> HTTPS service URL
```

## Before starting

Have the following ready:

- Access to the Google Cloud project where the app should run.
- Billing enabled for that project.
- Access to the GitHub repository and permission to connect it to Cloud Build.
- Docker Desktop running, if you want to test the image locally.
- A decision about which branch should deploy. The repository was on `develop`
  when this plan was written; use that branch only if it is intended to be the
  deployment branch. Otherwise choose the correct branch and push the code there.
- A Google Cloud region. Use the same region for Artifact Registry and Cloud Run.

Do not paste passwords, access tokens, private keys, or payment card details
into Claude or commit them to the repository.

## Phase 1: Verify the image locally

From the repository root, build and run the image:

```bash
docker build -t marketday:local .
docker run --rm --name marketday -p 8080:80 marketday:local
```

Open <http://localhost:8080>. The build command only creates an image; the
`docker run` command starts the website. Stop the container with Ctrl+C.

If port 8080 is already occupied, use `-p 8081:80` and open
<http://localhost:8081>. If it does not load, inspect `docker ps` and
`docker logs marketday` before moving on.

## Phase 2: Prepare Google Cloud

1. Select or create the Google Cloud project and confirm billing is enabled.
2. Enable Cloud Build, Artifact Registry, and Cloud Run APIs.
3. Create a Docker-format Artifact Registry repository in the selected region,
   for example a repository named `marketday`.
4. Record the project ID, region, and repository name. These are configuration
   values, not secrets.
5. Connect the GitHub repository to Cloud Build under **Cloud Build →
   Triggers**.
6. Configure IAM for the service account actually used by the build trigger.
   Grant only the permissions needed to:
   - Write images to the target Artifact Registry repository.
   - Deploy and update the Cloud Run service.
   - Act as the Cloud Run runtime service account, if required by the deploy
     configuration.

   Have Claude help identify the correct service account and least-privilege
   roles from the Google Cloud Console. Do not grant broad project Owner access
   just to make a build succeed.

## Phase 3: Add continuous deployment

Add a `cloudbuild.yaml` in the repository root. Set the region, Artifact
Registry repository, image name, and Cloud Run service name to the values chosen
above. The build should:

1. Build the image using the repository Dockerfile.
2. Tag it with the commit SHA, not only a mutable `latest` tag.
3. Push that tag to Artifact Registry.
4. Deploy that exact image to Cloud Run, using `--port 80`.

Create a Cloud Build trigger for pushes to the chosen deployment branch and
select this file as the build configuration. Run the trigger once, then inspect
the Cloud Build logs if any step fails. Do not configure production deployment
from every branch unless that is intentional.

## Phase 4: Validate the live service

After Cloud Build succeeds:

1. Open the service URL shown under **Cloud Run → marketday**.
2. Check the home page, product listing, classifieds, cart, checkout UI, and
   sign-in UI.
3. Confirm static assets load and navigation works after refreshing a page.
4. Check Cloud Run logs and the latest Cloud Build result.
5. Confirm the Cloud Run container port is `80`.
6. Decide whether the app should be public. `--allow-unauthenticated` makes the
   website accessible to anyone; do not enable it for private/internal use.

## Phase 5: Production readiness

Before using this site with real customers:

- Implement real server-side authentication and account handling.
- Integrate a payment provider; do not collect or store card details in this
  frontend-only app.
- Add backend/API and persistent data storage for listings, inventory, and
  orders, if those features are required.
- Decide how to handle product images and fonts. The current UI loads these
  from external services.
- Add a custom domain and verify HTTPS if desired; Cloud Run provides an HTTPS
  service URL by default.
- Set up monitoring/alerts, review access permissions, and document rollback.
- Test a rollback by redeploying a previously built image tag if a release
  causes problems.

## Done criteria

- The Docker image builds and runs locally on port 8080.
- A push to the selected GitHub branch starts a Cloud Build successfully.
- The image is visible in the correct Artifact Registry repository.
- Cloud Run deploys that image and the live HTTPS URL loads the app.
- The service's public/private access policy is intentional.
- The frontend-only authentication and checkout limitations are understood.

## Copy/paste prompt for Claude

> Guide me through the Marketday DevOps and deployment plan in
> `DEPLOYMENT_PLAN.md`. The app is a Vite/React static frontend packaged by the
> repository's Dockerfile and served by Nginx on port 80. I want to deploy from
> GitHub using Cloud Build, Artifact Registry, and Cloud Run.
>
> Work interactively: give me one phase at a time, explain where to click or
> which exact command to run, then wait for me to share the result before
> continuing. First confirm my Google Cloud project, chosen region, intended
> deployment branch, and whether the service should be public. The repository
> branch was `develop` when this plan was written, but do not assume that is the
> correct production branch. Inspect existing project files before suggesting
> changes. If a configuration file needs to be added, show me the proposed
> contents and explain it. Never ask me to paste secrets, tokens, private keys,
> or payment details. Do not claim a deployment succeeded until I provide
> evidence from the build and live service.
