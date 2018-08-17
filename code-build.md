## Jekyll, CodeBuild, and S3

1. Create a production build project in CodeBuild.

    1. Environment paramters:

        - `aws/codebuild/ruby:2.3.1`

    1. Use a `buildspec.yml` file.

        ```yaml
        version: 0.2

        phases:
          install:
            commands:
              - echo "******** Installing bundler ********"
              - gem install bundler
          pre_build:
            commands:
              - echo "******** Installing dependencies ********"
              - bundle install
          build:
            commands:
              - echo "******** Building Jekyll site ********"
              - jekyll build
          post_build:
            commands:
              - echo "******** Uploading to S3 ********"
              # Use the --delete option to remove deleted local files from the S3 bucket
              - aws s3 sync _site/ s3://jekyll-site-demo --delete
        ```

    1. Artifacts:

        - Type: `Amazon S3`

        - Bucket name: `devdocs-production`

        - Artifacts packaging: none

    1. Enable a webhook to build when committing to the `master` branch.

1. Create a staging build project in CodeBuild.

    1. Environment paramters:

        - `aws/codebuild/ruby:2.3.1`

    1. Use a `staging/buildspec.yml` file.

        ```yaml
        version: 0.2

        phases:
          install:
            commands:
              - echo "******** Installing bundler ********"
              - gem install bundler
          pre_build:
            commands:
              - echo "******** Installing dependencies ********"
              - bundle install
          build:
            commands:
              - echo "******** Building Jekyll site ********"
              - jekyll build
          post_build:
            commands:
              - echo "******** Uploading to S3 ********"
              # Use the --delete option to remove deleted local files from the S3 bucket
              - aws s3 sync _site/ s3://jekyll-site-demo/$CODEBUILD_SOURCE_VERSION --delete
        ```

    1. Artifacts:

        - Type: `Amazon S3`

        - Bucket name: `devdocs-staging`

        - Artifacts packaging: none

    1. Do not enable a webhook for staging. This could cause an unreasonable amount of build activity and just isn't necessary.

1. Create an IAM user with admin access.

You MUST create an IAM [policy](https://burstspace.com/posts/aws-cli-sync-buckets-access-denied/) and attach it to the CodeBuild service role to avoid `AccessDenied` errors when attempting to sync with S3. I had to add one for ListBucket (just to upload files) and one for DeleteObject (to use the --delete option, which removes old html files from S3).

1. Create an S3 bucket; one per site.

    - Enable bucket hosting for static sites.

        1. Open **AWS S3** > **`<bucket-name>`** > **Properties** > **Static website hosting**.

        1. Select **Use this bucket to host a website**.

        1. Enter default index and 404 file info.

        1. Click **Save**.

    - Create a bucket policy.

        1. Open **AWS S3** > **<bucket>** > **Permissions** > **Bucket Policy**.

        1. Enable public read access to the bucket and private read/write access to upload files. The latter may require adding a list of doc users so they can run builds on demand?

            ```json
            {
                "Version": "2012-10-17",
                "Statement": [
                    {
                        "Effect": "Allow",
                        "Principal": {
                            "AWS": "arn:aws:iam::867665339042:root",
                            "AWS": "arn:aws:iam::867665339042:user/jeff-doc-admin"

                        },
                        "Action": [
                          "s3:GetObject",
                          "s3:PutObject",
                          "s3:DeleteObject"
                        ],
                        "Resource": [
                            "arn:aws:s3:::jekyll-site-demo",
                            "arn:aws:s3:::jekyll-site-demo/*"
                        ]
                    },
                    {
                        "Effect": "Allow",
                        "Principal": "*",
                        "Action": "s3:GetObject",
                        "Resource": "arn:aws:s3:::jekyll-site-demo/*"
                    }
                ]
            }
            ```

            1. Click **Save**.

1. [Create a build notification](https://docs.aws.amazon.com/codebuild/latest/userguide/sample-build-notifications.html):

  - Create an AWS SNS topic
  - Create an AWS SNS subscription
  - Create an AWS CloudWatch rule

## Caveats

- No commit info in the build details like Travis, but you can access the build via a link from GitHub if you have checks enabled

- Current build projects don't sync the public and private repos

  - In general, we don't think we'll need the private repo anymore, but we need to verify that release notes aren't a special case

- Will probably need a third build project that excludes the deploy step to implement PR checks (see [Production builds](#production-builds))

- Currently, staging builds don't render correctly because of issues with baseurl (see [TODO](#TODO)),

## Production builds

CodeBuild automatically builds and deploys the Jekyll site after a commit on the `master` branch.

- I disabled PR builds because I don't think we can build without deploying right now. Since a PR to master triggers both the production and staging jobs, we end up deploying production master and staging feature simultaneously.

- Ideally, a PR would auto build/deploy to staging. You can enable PR webhooks in GitHub webhooks settings.

## Staging builds

You must manually start a build to build and deploy a feature branch to the staging environment.

I wasn't able to automate feature branch builds. I couldn't figure out how to capture the branch name because CodeBuild (and Travis) checkout a SHA commit which results in a detached head state making it impossible to identify the current branch because in a detached head state, there is no branch.

To manually build a feature branch:

1. Log in to the AWS console.
1. Go to **CodeBuild** > **Build projects** > **devdocs-staging** > **Start build**.
1. Enter the name of your branch in the **Source version** field.
1. Click **Start build**.

The `devdocs-staging` build uses a CodeBuild environment variable called `CODEBUILD_SOURCE_VERSION` to upload your build output to a folder that matches your branch name in the S3 `devdocs-staging` bucket. For example, `https://devdocs-staging.magento.com/your-branch/`.

### TODO

- Find out how long feature branch builds can live on S3; from a practical standpoint

- Find out who's monitoring the billing for AWS services. We should talk to them.

- Test PWA and m1 repos on these AWS services


## Demo

1. Manually trigger a staging build using a non-root AWS account
    - Deploy Jekyll site to a staging S3 bucket

1. Automatically trigger a production build using a webhook
    - Deploy Jekyll site to a production S3 bucket

1. Notify team when build(s) fail
    - Currently only configured on prod builds, but can easily be added to staging builds
