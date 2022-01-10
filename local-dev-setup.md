Alex's Vagrant box is great, but contains a lot of complicated automation. I'm going to try setting up a less complicated local dev environment.

## Prerequisites

-   MacOS
-   Vagrant
-   Virtualbox
-   PhpStorm
-   LAMP/LEMP stack

### Vagrant

1.  Download ubuntu Vagrant box

    vagrant init ubuntu/xenial64

2.  Edit your Vagrantfile

    Create a private network ([required](https://www.vagrantup.com/docs/synced-folders/nfs.html){:target="\_blank"} to use NFS for shared folders)

    Share the Magento project directory on the host with the guest:

    config.vm.synced_folder "/Users/jmatthews/git/magento-test-extension/magento2ce", "/var/www/html/magento2ce"

3.  Download and install Magento via Composer

    ./magento setup:install --base-url=http://172.16.52.134 --db-host=localhost --db-name=magento --db-user=magento --db-password=magento --admin-firstname=admin --admin-lastname=admin --admin-email=admin@admin.com --admin-user=admin --admin-password=admin123 --language=en_US --currency=USD --timezone=America/Chicago --use-rewrites=1

4.  Set file permissions & create magento user

5.  
