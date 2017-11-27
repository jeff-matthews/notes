## Installation

1.  Add the BlueFoot module Github repository:

    `composer config repositories.bluefoot git git@github.com:magento/bluefoot-for-m2.git`

    Third-party developers don't need to do this.

2.  Add the BlueFoot module to your Magento `composer.json` file:

    `composer require gene/bluefoot:^1.0`

3.  Update project dependencies:

    `composer update`

4.  Enter your `repo.magento.com` access keys.

    _Do I need access to EE repos? YES_

    _ERROR

    Updating magento/module-tax-sample-data (100.1.1 => 100.1.2):     

    Update failed (Could not delete /var/www/html/magento2/vendor/magento/module-tax-sample-data/registration.php: )
    Would you like to try reinstalling the package instead [yes]? yes

    Removing magento/module-tax-sample-data (100.1.1)

    [RuntimeException]
    Could not delete /var/www/html/magento2/vendor/magento/module-tax-sample-data/registration.php:_

5.  Delete directory blocking update:

    `rm -rf /var/www/html/magento2/vendor/magento/module-tax-sample-data`

6.  Verify that BlueFoot was installed:

    `./magento module:status`

    List of disabled modules:
    Gene_BlueFoot

7.  Enable the BlueFoot module. Some modules might require static view files to be cleared. Use the `--clear-static-content` option to do that:

    `./magento module:enable Gene_BlueFoot --clear-static-content`

    Need to check this syntax. Does option need to precede module name? Why do I need that

8.  Make sure that the enabled module is properly registered:

    `./magento setup:upgrade`

9.  Generate classes:

    `./magento setup:di:compile`

10. Go to the **Admin** > **Content** > **Pages/Blocks**.

11. Edit a page/block and click **Activate BlueFoot**.

## Questions/observations

-   In **Other** > **Code**, the "HTML" label is misleading because it won't render HTML like in **General** > **HTML**. It displays code with syntax highlighting. Change label to "Code".

-   In **General** > **HTML**, can I use in-line CSS styles? I'm assuming there's no _Classes_ section b/c there could be a mix of elements and applying styles to the entire block wouldn't make sense. NO


# These are Robert's instructions for setting up Bluefoot

1. run 'composer create-project -s dev --repository-url=https://repo.magento.com/ magento/project-community-edition=2.2.0' in your htdocs (webroot) folder
2. go to the magento root folder and run 'composer require gene/bluefoot=^1.0'
3. install magento
