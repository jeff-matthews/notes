{% for package in packages %}

  {% if package.name == "amzn/amazon-pay-and-login-magento-2-module" or package.name == "dotmailer/dotmailer-magento2-extension-package" or package.name == "klarna/m2-payments" or package.name == "vertex/product-magento-module" or package.name == "yotpo/magento2-module-yotpo-reviews-bundle" %}

-  {{ package.name }} {{ package.version }}
  
  {% endif %}

{% endfor %}

## Independent releases

Independent releases provide vendors with the ability to address support issues between Magento releases. Independent releases are planned, tested, and compatible with Magento, but they do not go through the full regression test cycle that is required for Magento releases. Vendors are allowed one independent release per quarter.

{:.bs-callout-info}
Magento does not support independent releases. If you need support, you must contact the vendor.

### Install an independent release

Independent releases are available as Composer "edge" packages on `repo.magento.com`. Composer automatically selects the most recent version compatible with your installed version of Magento. If you install an independent release and then upgrade to the latest version of Magento, you will receive the latest version bundled with that Magento release.

{:.procedure}
To install an independent release:

1. Backup your `composer.json` file.

   ```bash
   cp composer.json composer.json.bak
   ```

1. Add the VBE "edge" package to your `composer.json` file.

   ```bash
   composer require <vendor>/<package>-edge
   ```

   Substitute `<vendor>/<package>-edge` with one of the following VBE packages:

   ```text
   amzn/amazon-pay-and-login-magento-2-module-edge
   ```

   ```text
   dotmailer/dotmailer-magento2-extension-package-edge
   ```

   ```text
   klarna/m2-payments-edge
   ```

   ```text
   vertex/product-magento-module-edge
   ```

   ```text
   yotpo/magento2-module-yotpo-reviews-bundle-edge
   ```

1. Update the database schema and data:

   ```bash
   bin/magento setup:upgrade
   ```

### Revert to a supported version

To switch back to the supported version of a VBE:

{:.bs-callout-tip}
Extensions do not always provide downgrade scripts, so it is best to switch back to a supported package along with upgrading to a newer version of Magento.

1. Remove your `composer.lock` file and `vendor/` directory:

   ```bash
   rm -rf composer.lock vendor/*
   ```

1. Remove the VBE edge package:

   ```bash
   composer remove --no-update <vendor>/<package>-edge
   ```

1. Reinstall Magento release packages:

   ```bash
   composer install
   ```