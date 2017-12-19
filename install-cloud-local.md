1.  Install the Magento Cloud CLI tool:

    curl -sS https://accounts.magento.cloud/cli/installer | php

    See if this installs it globally, like Composer:
    sudo php -- --install-dir=/usr/bin --filename=magento-cloud

2.  Source it:

    source .bashrc magento-cloud

3.  Verify installation:

    magento-cloud list

4.  Enable SSH keys.

5.  Set global git variables:

    git config --global user.name "<your name>"
    git config --global user.email <your e-mail address>

6.  Set up the Magento file system owner.

7.  Clone your project:

    magento-cloud login

8.  List projects:

    magento-cloud project:list

9.  Clone a project:

    magento-cloud project:get <project ID>

10. Change to the new directory.

11. Set environment variables for admin.

12. Install Magento:

    bin/magento setup:install --base-url=http://192.168.33.10/ --db-host=localhost --db-name=magento --db-user=magento --backend-frontname=admin --db-password=magento --admin-firstname=admin --admin-lastname=admin --admin-email=admin@admin.com --admin-user=admin --admin-password=admin123 --language=en_US --currency=USD --timezone=America/Chicago --use-rewrites=1

13. Run the following commands:

    bin/magento setup:di:compile

14. Verify your storefront and admin interface.
