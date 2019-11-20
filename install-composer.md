1. Install Composer:

    curl -sS https://getcomposer.org/installer | sudo php -- --install-dir=/usr/bin --filename=composer

2. Get the Magento Commerce Composer package (don't forget to specify version unless you want the latest):

    **Commerce**

    composer create-project --repository-url=https://repo.magento.com/ magento/project-enterprise-edition=2.1.0 magento2ee

    **Open Source**

    composer create-project --repository-url=https://repo.magento.com/ magento/project-community-edition=2.2.0 magento2ce

    When prompted, enter your <a href="{{page.baseurl}}install-gde/prereq/connect-auth.html">authentication keys</a>. Your *public key* is your username; your *private key* is your password.

3. Set file permissions:

    cd /var/www/html/magento2
    find var generated vendor pub/static pub/media app/etc -type f -exec chmod g+w {} \;
    find var generated vendor pub/static pub/media app/etc -type d -exec chmod g+ws {} \;
    chown -R :www-data .
    chmod u+x bin/magento

4. Install Magento via CLI or Web Setup Wizard.

    bin/magento setup:install --base-url=http://192.168.33.10/magento2 --db-host=localhost --db-name=magento --db-user=magento --backend-frontname=admin --db-password=magento --admin-firstname=admin --admin-lastname=admin --admin-email=admin@admin.com --admin-user=admin --admin-password=admin123 --language=en_US --currency=USD --timezone=America/Chicago --use-rewrites=1

    Usually need to run bin/magento deploy:mode:set developer afterwards to get the storefront to render. Why?
