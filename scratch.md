## HTML escape characters:
-   underscore = &#95;
-   asterisk = &#42;

## NGINX config
-   CENTOS - unix:/run/php-fpm/php-fpm.sock

-   UBUNTU - unix:/run/php/php7.0-fpm.sock

## MySQL
SET PASSWORD FOR 'magento'@'localhost' = PASSWORD('magento');

UPDATE core_config_data SET value='http://127.0.0.1:8080/magento2' WHERE path='web/unsecure/base_url';

## Magento install CLI
bin/magento setup:install --base-url=http://192.168.33.10/magento2 --db-host=localhost --db-name=magento --db-user=magento --backend-frontname=admin --db-password=magento --admin-firstname=admin --admin-lastname=admin --admin-email=admin@admin.com --admin-user=admin --admin-password=admin123 --language=en_US --currency=USD --timezone=America/Chicago --use-rewrites=1

Usually need to run bin/magento deploy:mode:set developer afterwards to get the storefront to render. Why?

## Local builds
apply it by putting it next to the config.yml file and execute

``` shell
bundle exec jekyll serve --config config.yml,_config.local.yml
```

## Cannot allocate memory errors
Need to create a swap file:

-   https://getcomposer.org/doc/articles/troubleshooting.md#proc-open-fork-failed-errors
-    https://www.digitalocean.com/community/tutorials/how-to-add-swap-on-ubuntu-14-04

Try figure out how to automate this with your Vagrantfile.

Reopening this issue because if this turns out to be an access issue, then the error message is insufficient. The error message comes from Composer though, I think, so we'd have to add a note to this topic in devdocs.

## Devdocs git sync
Need to document how this works on the wiki.

This is how the `devdocs_sync.py` script works:
-   Clones the private repo
-   Adds the public repo as a remote to the local private repo
-   Compares commit hashes btwn all three (remote public, remote private, local private), if all of the commit hashes match, no sync is necessary. If they don't match, then it syncs
-   Git pull inside the private local repo to fetch and merge without commit; effectively syncing the repos\

### Conflict states
-   If a community member updates a file in the public repo and it gets merged
AND
-   If a devdocs team member changes the _same file_ in the private repo and merges, it can lead to a merge conflict that causes the sync to fail

## Crontab

`crontab -u magento -e`

```shell
* * * * * /usr/bin/php /var/www/html/magento2ee/bin/magento cron:run | grep -v "Ran jobs by schedule" >> /var/www/html/magento2ee/var/log/magento.cron.log
* * * * * /usr/bin/php /var/www/html/magento2ee/update/cron.php >> /var/www/html/magento2ee/var/log/update.cron.log
* * * * * /usr/bin/php /var/www/html/magento2ee/bin/magento setup:cron:run >> /var/www/html/magento2ee/var/log/setup.cron.log
```

## Converting HTML links

```bash
sed -i '' -e 's/<a href="\(.*\)">\(.*\)<\/a>/[\2](\1)/g' path/to/file.md
```

## HTML to markdown

- Delete "Related topics" sections

- Write regex that finds all obsolete tags and delete:

  ```yaml
  subgroup: 04_CLI
  menu_title: Set the Magento mode
  menu_node:
  menu_order: 200
  ```

- Convert href links to markdown links

- Convert img links to markdown links

- Search and delete:

  ```terminal
   target="\_blank"
  ```

  ```terminal
  {:target="\_blank"}
  ```

  ```terminal
   target="&#95;blank"
  ```
