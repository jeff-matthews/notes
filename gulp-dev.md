## Using gulp for local development
1.  Install the latest stable version of node.js. I recommend using using `nvm`.

1.  Navigate to your local devdocs directory.

1.  Install node dependencies.

    `npm i`

1.  Install `gulp` locally.

    `npm i gulp`

1.  Create a `_config.local.yml` file at the root of your devdocs directory. Don't worry, the devdocs `.gitignore` file is already set up to ignore this file.

1.  Copy/paste this into the file:

    ```yaml
    exclude:
     - community
     - swagger
     - vagrant
     - guides/m1x
     - guides/v2.0
     - guides/v2.1
     - guides/v2.2
     - guides/v2.3
    # Guides
     - guides/v2.0/architecture
     - guides/v2.0/cloud
     - guides/v2.0/coding-standards
     - guides/v2.0/comp-mgr
     - guides/v2.0/config-guide
     - guides/v2.0/contributor-guide
     - guides/v2.0/design-styleguide
     - guides/v2.0/ext-best-practices
     - guides/v2.0/extension-dev-guide
     - guides/v2.0/frontend-dev-guide
     - guides/v2.0/get-started
     - guides/v2.0/howdoi
     - guides/v2.0/install-gde
     - guides/v2.0/javascript-dev-guide
     - guides/v2.0/magento-functional-testing-framework
     - guides/v2.0/migration
     - guides/v2.0/modules
     - guides/v2.0/mrg
     - guides/v2.0/mtf
     - guides/v2.0/pattern-library
     - guides/v2.0/payments-integrations
     - guides/v2.0/release-notes
     - guides/v2.0/rest
     - guides/v2.0/soap
     - guides/v2.0/test
     - guides/v2.0/ui-components
     ```

    Use code comments to indicate which version _and_ guide(s) you want to build. I've never tried building multiple versions of multiple guides, so I'm not sure how that would work. I typically build one version and guide at a time.

1.  Run the gulp command.

    `gulp dev`

This command should automatically launch a browser for you.

Now, whenever you modify a file (e.g., add, edit, delete), gulp will rebuild the specified versions/guide in your `_config.local.yml` file. I typically build one version and one guide at a time. Build times are much shorter than running all-version builds.
