## NGINX config

- CENTOS - unix:/run/php-fpm/php-fpm.sock
- UBUNTU - unix:/run/php/php7.0-fpm.sock

## MySQL

```bash
SET PASSWORD FOR 'magento'@'localhost' = PASSWORD('magento');
```

```bash
UPDATE core_config_data SET value='http://127.0.0.1:8080/magento2' WHERE path='web/unsecure/base_url';
```

## Magento install CLI

```bash
bin/magento setup:install --base-url=http://192.168.33.10/magento2 --db-host=localhost --db-name=magento --db-user=magento --backend-frontname=admin --db-password=magento --admin-firstname=admin --admin-lastname=admin --admin-email=admin@admin.com --admin-user=admin --admin-password=admin123 --language=en_US --currency=USD --timezone=America/Chicago --use-rewrites=1
```

Usually need to run bin/magento deploy:mode:set developer afterwards to get the storefront to render. Why?

## Composer file system permissions

https://stackoverflow.com/a/52936413

1. Change directories

   ```bash
   cd /var/www/
   ```

1. Change group ownership

   ```bash
   sudo chown -Rv root:$USER .
   ```

1. Add priviledges to our group

   ```bash
   sudo chmod -Rv g+rw .
   ```

1. For the grand finale, go ahead and create your new laravel project

   ```bash
   composer create-project laravel/laravelprojectName--prefer-dist
   ```

## Cannot allocate memory errors

Need to create a swap file:

- https://getcomposer.org/doc/articles/troubleshooting.md#proc-open-fork-failed-errors
- https://www.digitalocean.com/community/tutorials/how-to-add-swap-on-ubuntu-14-04

Try figure out how to automate this with your Vagrantfile.

Reopening this issue because if this turns out to be an access issue, then the error message is insufficient. The error message comes from Composer though, I think, so we'd have to add a note to this topic in devdocs.

## Devdocs git sync

Need to document how this works on the wiki.

This is how the `devdocs_sync.py` script works:

- Clones the private repo
- Adds the public repo as a remote to the local private repo
- Compares commit hashes btwn all three (remote public, remote private, local private), if all of the commit hashes match, no sync is necessary. If they don't match, then it syncs
- Git pull inside the private local repo to fetch and merge without commit; effectively syncing the repos\

`crontab -u magento -e`

```bash
* * * * * /usr/bin/php /var/www/html/magento2ee/bin/magento cron:run | grep -v "Ran jobs by schedule" >> /var/www/html/magento2ee/var/log/magento.cron.log
* * * * * /usr/bin/php /var/www/html/magento2ee/update/cron.php >> /var/www/html/magento2ee/var/log/update.cron.log
* * * * * /usr/bin/php /var/www/html/magento2ee/bin/magento setup:cron:run >> /var/www/html/magento2ee/var/log/setup.cron.log
```

## Converting HTML links

```bash
sed -i '' -e 's/<a href="\(.*\)">\(.*\)<\/a>/[\2](\1)/g' path/to/file.md
```

# Collaborating with contributors

1. `git checkout -b <new-branch>`
1. `git pull <their-forked-repo-url> <their-branch-name>`
1. Fix content
1. `git push -u origin <new-branch>`
1. Create new PR
1. Merge PR (this also closes the original PR automatically)

# CI/CD workaround for public repo

A workaround with CICD: you still can push your local branch to devdocs_internal to be able to generate internal preview.
You can setup two remotes and push to devdocs_internal when need CICD.

```bash
git remote add internal git@github.com:magento/devdocs_internal.git
git push internal <feature-branch>
```

Checking out a branch when multiple remotes are configured:

```bash
git fetch <remote>
git checkout -b foo <remote>/foo
```

https://stackoverflow.com/questions/30575041/cant-do-a-checkout-with-multiple-remotes
