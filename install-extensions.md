---
layout: default
group: config-guide
subgroup: 22_Install extensions
title: Install extensions
menu_title: Install extensions
menu_order: 1
menu_node: parent
version: 2.2
github_link: comp-mgr/install-extensions.md
---



## Install the B2B extension ({{site.var.data.ee}} only)
Change to your installation directory and enter the following command to update your `composer.json` file and install the {{site.data.var.b2b}} extension:

    composer require magento/extension-b2b

When prompted, enter your <a href="{{page.baseurl}}install-gde/prereq/connect-auth.html">authentication keys</a>. Your *public key* is your username; your *private key* is your password.

<div class="bs-callout bs-callout-info" markdown="1">
If you installed EE prior to installing B2B, run the following commands after Composer finishes updating modules:

    bin/magento setup:upgrade

    bin/magento setup:di:compile

    bin/magento setup:static-content:deploy
</div>

After installing Magento, you'll need to [configure the B2B module]({{page.baseurl}}config-guide/b2b-module.html).
