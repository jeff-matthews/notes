# Install Commerce on LEMP stack

- Vagrant
- WMware Fusion
- Ubuntu 20.04
- nginx 1.18
- MySQL 8.0
- PHP 8.0
- Elasticsearch 7.10
- Mailhog
- Adobe Commerce/Magento Open Source 2.4.4

If anyone uses Vagrant + VirtualBox, you may start seeing this error after upgrading from macOS Big Sur to Monterrey:

https://forums.virtualbox.org/viewtopic.php?f=8&t=104249

```
There was an error while executing `VBoxManage`, a CLI used by Vagrant
for controlling VirtualBox. The command and stderr is shown below.

Command: ["startvm", "0b213844-1f91-4f01-8f0f-d08d10028ee9", "--type", "headless"]

Stderr: VBoxManage: error: The virtual machine 'ubuntu-2004_default_1635949587749_60253' has terminated unexpectedly during startup with exit code 1 (0x1)
VBoxManage: error: Details: code NS_ERROR_FAILURE (0x80004005), component MachineWrap, interface IMachine
```

If you don't want to wait until Oracle releases a compatible version of VB, you can try VMware: https://www.vagrantup.com/docs/providers/vmware

You can install VMWare Fusion from the Adobe app catalog.

## Vagrant

1. Create a local directory for your virtual machine (VM) and navigate to it.

   ```bash
   mkdir ~/vagrant/ubuntu-20.04/ && cd ~/vagrant/ubuntu-20.04/
   ```

1. Create a `Vagrantfile`.

   ```bash
   vim Vagrantfile
   ```

1. Add the following configuration to your `Vagrantfile`.

   ```text
   Vagrant.configure("2") do |config|
     config.vm.box = "generic/ubuntu2004"
     config.vm.network "private_network", ip: "172.16.52.134"
     config.vm.provider "vmware_fusion" do |v|
       v.gui = false
       v.memory = "2048"
       v.cpus = 2
    end
   end
   ```

1. Start the VM.

   ```bash
   vagrant up
   ```

1. Open an SSH connection to the VM.

   ```bash
   vagrant ssh
   ```

1. Update the package index.

   ```bash
   sudo apt update
   ```

1. Upgrade packages.

   ```bash
   sudo apt upgrade -y
   ```

1. Exit the VM by pressing Ctrl+C.

1. Take a snapshot of the VM using Vagrant.

   ```bash
   vagrant snapshot save base-image
   ```

1. Reopen an SSH connection to the VM before continuing.

   ```bash
   vagrant ssh
   ```

## File system owner

https://devdocs.magento.com/guides/v2.4/install-gde/prereq/file-system-perms.html

1. Create a new user that will act as the file system owner for your installation.

   ```bash
   sudo adduser commerce
   ```

1. Add the user to the web server group (www-data).

   ```bash
   sudo usermod -aG www-data commerce
   ```

1. Add the user to the sudoers group (sudo).

   ```bash
   sudo usermod -aG sudo commerce
   ```

1. Switch to the file system owner.

   ```bash
   sudo su commerce
   ```

1. Create the root web directory for the installation.

   ```bash
   sudo mkdir /var/www/commerce
   ```

   The root web directory must match the path that you define in your virtual host file when configuring nginx. 
   
   ```config
   ...
   set $MAGE_ROOT /var/www/commerce/commerce/2.4.4-beta;
   ...
   ```

1. Grant permission to the root web directory.

   ```bash
   sudo chown -R commerce:www-data /var/www/commerce
   ```

   This assigns ownership to the `commerce` user and web server group `www-data`.

## nginx

Install nginx:

1. Install nginx.

   ```bash
   sudo apt install nginx
   ```

1. Confirm successful installation by going to `http://172.16.52.134/` in a browser. You should see the default "Welcome to nginx!" page.

### Configuration

[Configure nginx](https://devdocs.magento.com/guides/v2.4/install-gde/prereq/nginx.html#configure-nginx-ubuntu) before installation Adobe Commerce or Magento Open Source.

On Ubuntu 20.04, nginx has one server block enabled by default and is configured to serve documents out of a directory at `/var/www/html`. While this works well for a single site, it can become difficult to manage if you are hosting multiple sites. Instead of modifying `/var/www/html`, we’ll create a directory structure within `/var/www` for the `commerce` website, leaving `/var/www/html` in place as the default directory to be served if a client request doesn’t match any other sites.

1. Create the root web directory for your Adobe Commerce or Magento Open Source installation.

   ```bash
   sudo mkdir /var/www/commerce
   ```

   Make sure the file system owner has write permissions on this directory.

1. Create a virtual host for your installation:

   ```bash
   sudo vim /etc/nginx/sites-available/commerce
   ```

1. Add the following configuration:

   ```config
   upstream fastcgi_backend {
     server  unix:/run/php/php8.0-fpm.sock;
   }

   server {

     listen 80;
     server_name 172.16.52.134;
     set $MAGE_ROOT /var/www/commerce/2.4.4-beta3;
     include /var/www/commerce/2.4.4-beta3/nginx.conf.sample;
   }
   ```

   - The `server_name` must match the static IP that you defined in your `Vagrantfile`. It must also match the base URL that you specify when installing Adobe Commerce or Magento Open Source.
   - The `upstresam fastcgi_backend` server path must match the system path defined in the `listen` directive in the `/etc/php/8.0/fpm/pool.d/www.conf` file.
   - The `set` and `include` directives must match the path to your installation directory, which is the root web directory + Composer install directory. 

1. Activate the newly created virtual host by creating a symlink to it in the `/etc/nginx/sites-enabled` directory:

   ```bash
   sudo ln -s /etc/nginx/sites-available/commerce /etc/nginx/sites-enabled
   ```

1. Verify that the syntax is correct.

   ```bash
   sudo nginx -t
   ```

   This will fail until you download the Adobe Commerce or Magento Open Source package, which contains the `/var/www/commerce/2.4.4-beta3/nginx.conf.sample` file referenced in your nginx virtual host file.

1. Restart the nginx service.

   ```bash
   sudo systemctl restart nginx
   ```

1. Proceed to installing Adobe Commerce or Magento Open Source.

## MySQL

Install MySQL:

1. Install MySQL.

   ```bash
   sudo apt install mysql-server
   ```

   When the installation is finished, it's a best practice to run a security script that comes pre-installed with MySQL. The script removes insecure default settings and locks down access to the database server.

1. Start the secure installation script.

   ```bash
   sudo mysql_secure_installation
   ```

1. When you’re finished, test if you’re able to log in to the MySQL console.

   ```bash
   sudo mysql
   ```

   This connects to the MySQL server as the administrative database user `root`, which is inferred by the use of `sudo` when running this command. You should see output like this:

   ```terminal
   Welcome to the MySQL monitor.  Commands end with ; or \g.
   Your MySQL connection id is 11
   Server version: 8.0.27-0ubuntu0.20.04.1 (Ubuntu)

   Copyright (c) 2000, 2021, Oracle and/or its affiliates.

   Oracle is a registered trademark of Oracle Corporation and/or its
   affiliates. Other names may be trademarks of their respective
   owners.

   Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

   mysql>
   ```

   To exit the MySQL console, type:

   ```terminal
   exit
   ```

### Configuration

1. Log in to the database server as the root user.

   ```bash
   sudo mysql
   ```

1. Create a database for your Adobe Commerce or Magento Open Source installation.

   ```sql
   create database magento;
   ```

   ```sql
   create user 'magento'@'localhost' IDENTIFIED BY 'magento';
   ```

   ```sql
   GRANT ALL ON magento.* TO 'magento'@'localhost';
   ```

   ```sql
   flush privileges;
   ```

1. Exit the MySQL console.

   ```terminal
   exit
   ```

1. Verify the database user.

   ```bash
   mysql -u magento -p
   ```

   If the MySQL console displays, you created the database properly. If an error displays, repeat the preceding commands.

1. Verify the database.

   ```sql
   SHOW databases;
   ```

   You should see `magento` (or whatever you chose to name your DB) in the list.

   ```terminal
   +--------------------+
   | Database           |
   +--------------------+
   | information_schema |
   | magento            |
   | mysql              |
   | performance_schema |
   | sys                |
   +--------------------+
   5 rows in set (0.01 sec)
   ```

## PHP

1. Enable the PHP repository so you can specify which PHP version to install.

   ```bash
   sudo apt install software-properties-common
   ```

   ```bash
   sudo add-apt-repository ppa:ondrej/php
   ```

1. Install PHP 8.0 for nginx.

   ```bash
   sudo apt install php8.0-fpm php8.0-mysql
   ```

1. Install required PHP [extensions](https://devdocs.magento.com/guides/v2.4/install-gde/prereq/php-settings.html#verify-installed-extensions).

   ```bash
   sudo apt install php8.0-bcmath php8.0-ctype php8.0-curl php8.0-dom php8.0-fileinfo php8.0-gd php8.0-hash php8.0-iconv php8.0-intl php8.0-json php8.0-libxml php8.0-mbstring php8.0-openssl php8.0-pcre php8.0-pdo_mysql php8.0-simplexml php8.0-soap php8.0-sockets php8.0-sodium php8.0-xmlwriter php8.0-xsl php8.0-zip php8.0-libxml php8.0-openssl
   ```

   Not all of these packages can be installed. I'm not sure why, but the ones that fail do not seem to prevent loading the storefront.

   It also appears that these extensions need to be installed one at a time otherwise you'll encounter dependecy errors when downloading the Composer metapackage for commerce.

### Configuration

1. Open the `/etc/php/8.0/fpm/php.ini` and `/etc/php/8.0/cli/php.ini` files in an editor and make the following changes:

   - `date.timezone=America/Chicago`
   - `memory_limit=2G`
   - `max_execution_time = 1800`
   - `opcache.save_comments=1`
   - `realpath_cache_size=10M`
   - `realpath_cache_ttl=7200`
   - `zlib.output_compression = On`

1. Restart the `php-fpm` service.

   ```bash
   sudo systemctl restart php8.0-fpm
   ```

## Elasticsearch

https://www.elastic.co/guide/en/elasticsearch/reference/current/deb.html

1. Download the  Debian package for the supported version of Elasticsearch. In this example, we're using 7.10.

   ```bash
   wget https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-7.10.0-amd64.deb
   ```

1. Download the SHA for the Debian package.

   ```bash
   wget https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-7.10.0-amd64.deb.sha512
   ```

1. Compare the SHA of the downloaded Debian package and the published checksum, which should output `elasticsearch-{version}-amd64.deb: OK`.

   ```bash
   shasum -a 512 -c elasticsearch-7.10.0-amd64.deb.sha512
   ```

1. Install the package.

   ```bash
   sudo dpkg -i elasticsearch-7.10.0-amd64.deb
   ```

### Configuration

1. Configure Elasticsearch to start automatically when the system boots.

   ```bash
   sudo /bin/systemctl daemon-reload
   ```

   ```bash
   sudo /bin/systemctl enable elasticsearch.service
   ```

1. Start and stop Elasticsearch service using the following commands.

   ```bash
   sudo systemctl start elasticsearch.service
   ```

   ```bash
   sudo systemctl stop elasticsearch.service
   ```

1. Verify that Elasticsearch is running.

   ```bash
   curl -X GET "localhost:9200/?pretty"
   ```

   You should see the following output (or similar):

   ```json
   {
     "name" : "ubuntu2004.localdomain",
     "cluster_name" : "elasticsearch",
     "cluster_uuid" : "SiiDUDlhR2e72Fw3Gx-2Zg",
     "version" : {
       "number" : "7.10.0",
       "build_flavor" : "default",
       "build_type" : "deb",
       "build_hash" : "51e9d6f22758d0374a0f3f5c6e8f3a7997850f96",
       "build_date" : "2020-11-09T21:30:33.964949Z",
       "build_snapshot" : false,
       "lucene_version" : "8.7.0",
       "minimum_wire_compatibility_version" : "6.8.0",
       "minimum_index_compatibility_version" : "6.0.0-beta1"
     },
     "tagline" : "You Know, for Search"
   }
   ```

## Mailhog

Install and configure [Mailhog](https://www.lullabot.com/articles/installing-mailhog-for-ubuntu-1604) (for first time Admin log in).

1. Install Go.

   ```bash
   sudo apt-get install golang-go
   ```

1. Create a directory for Go code.

   ```bash
   mkdir gocode
   ```

1. Set the `$GOPATH` variable.

   ```bash
   echo "export GOPATH=$HOME/gocode" >> ~/.profile
   ```

1. Update your terminal session/

   ```bash
   source ~/.profile
   ```

1. Install Mailhog binaries.

   ```bash
   go get github.com/mailhog/MailHog
   ```

   ```bash
   go get github.com/mailhog/mhsendmail
   ```

1. Copy the Mailhog binaries to a location where they are available everywhere in the system:

   ```bash
   sudo cp /home/vagrant/gocode/bin/MailHog /usr/local/bin/mailhog
   ```

   ```bash
   sudo cp /home/vagrant/gocode/bin/mhsendmail /usr/local/bin/mhsendmail
   ```

### Configuration

1. Open the `/etc/php/8.0/cli/php.ini` and `/etc/php/8.0/fpm/php.ini` files and connect PHP with MailHog.

   ```bash
   sudo vim /etc/php/8.0/cli/php.ini
   ```

   ```config
   sendmail_path = "/usr/local/bin/mhsendmail --smtp-addr=172.16.52.134:1025"
   ```

   The `--smtp-addr` value must match the static IP address that you defined in your `Vagrantfile`.

1. Restart the `php-fpm` service.

   ```bash
   sudo systemctl restart php8.0-fpm
   ```

1. Configure Mailhog to start automatically when the system boots.

   ```bash
   sudo vim /etc/systemd/system/mailhog.service
   ```

1. Add the following.

   ```config
   [Unit]
   Description=MailHog service

   [Service]
   ExecStart=/usr/local/bin/mailhog \
     -api-bind-addr 172.16.52.134:8025 \
     -ui-bind-addr 172.16.52.134:8025 \
     -smtp-bind-addr 172.16.52.134:1025

   [Install]
   WantedBy=multi-user.target
   ```

   The IP addresses must match the static IP address that you defined in your `Vagrantfile`.

1. Enable the Mailhog service so that is runs on boot.

   ```bash
   sudo systemctl enable mailhog
   ```

1. Start and stop Mailhog service using the following commands.

   ```bash
   sudo systemctl start mailhog
   ```

   ```bash
   sudo systemctl stop mailhog
   ```

1. Verify that the Mailhog service is running.

   ```bash
   systemctl | grep mailhog
   ```

   You should see the following output:

   ```terminal
   mailhog.service loaded active running MailHog service
   ```

1. Verify that the user interface is up and running by going to http://172.16.52.134:8025.

1. Send a test email.

   ```bash
   php -r "\$from = \$to = 'your.emailaddress@gmail.com'; \$x = mail(\$to, 'subject'.time(), 'Hello World', 'From: '. \$from); var_dump(\$x);"
   ```

   You should see the following output:

   ```terminal
   bool(true)
   ```

1. Check the user interface for the email.

## Composer

Install Composer globally. 

```bash
curl -sS https://getcomposer.org/installer | sudo php -- --install-dir=/usr/bin --filename=composer
```

I'm not sure if Commerce supports version 2 (default). I kept getting prompted about a new [allow-plugin](https://getcomposer.org/doc/06-config.md#allow-plugins) security feature that kept me from downloading the software. I downgraded to Composer 1 to avoid the issue.

```bash
sudo composer self-update --1
```

## Commerce

Consider taking another snapshot of the VM before installing Adobe Commerce or Magento Open Source. Doing so will make it easy to spin up a fresh LEMP stack when you need to install a different version.

```bash
vagrant snapshot save base-image/LEMP-PHP8.0
```

1. Switch to file system owner.

   ```bash
   sudo su commerce
   ```

1. Get the Commerce software.

   **Magento Open Source**

   ```bash
   composer create-project --repository=https://repo.magento.com/ magento/project-community-edition=2.4.4-beta3 2.4.4-beta3
   ```

   **Adobe Commerce**

   ```bash
   composer create-project --repository=https://repo.magento.com/ magento/project-enterprise-edition=2.4.4-beta3 2.4.4-beta3
   ```

1. Set read-write permissions for the web server group before you install the software. This is necessary so that the command line can write files to the file system.

   ```bash
   cd 2.4.4-beta3
   ```

   ```bash
   find var generated vendor pub/static pub/media app/etc -type f -exec chmod g+w {} +
   ```

   ```bash
   find var generated vendor pub/static pub/media app/etc -type d -exec chmod g+ws {} +
   ```
   
   ```bash
   sudo chown -R :www-data .
   ```
   
   ```bash
   chmod u+x bin/magento
   ```

1. Install the software.

   ```bash
   bin/magento setup:install --base-url=http://172.16.52.134/ --db-host=localhost --db-name=magento --db-user=magento --backend-frontname=admin --db-password=magento --admin-firstname=admin --admin-lastname=admin --admin-email=admin@admin.com --admin-user=admin --admin-password=admin123 --language=en_US --currency=USD --timezone=America/Chicago --use-rewrites=1
   ```

   The `---base-url` must match the static IP address that you defined in your `Vagrantfile` and nginx virtual host.

1. Open a web browser and navigate to your site’s base URL to verify the installationL: http://172.16.52.134.

1. Sign in to the Admin and configure two-factor authentication. The Admin URL is http://172.16.52.134/admin.

1. Take a snapshot of the VM.

   ```bash
   vagrant snapshot save commerce-2.4.4-beta3
   ```

### Two-factor authentication workaround

If you don't want to enable SMTP on your dev host, here's a workaround I used.

https://devdocs.magento.com/guides/v2.4/security/two-factor-authentication.html#magento-functional-testing-framework

https://github.com/magento/magento2/issues/29312

```bash
bin/magento config:set twofactorauth/general/force_providers google
bin/magento config:set twofactorauth/google/otp_window 60
bin/magento security:tfa:google:set-secret admin JRXXEZLNEBUXA43VNUQGI33MN5ZCA43JOQQGC3LFOQ======
```

1. Create a new account in the Google Authenticator app using the secret key. The secret key must be a minimum 26-character Base32-encoded string.
1. Log in to the Admin.
1. Enter the OTP from the Google Authenticator app.

## Troubleshooting

### Bad Gateway 502

- Uncaught Zend_Cache_Exception: cache_dir "/var/www/html/commerce-2.4.4-beta3/var/page_cache" is not writable

    Check /var/log/nginx/error.log for PHP and/or permission issues. Permission issues can usually be solved with sudo chown -R www-data:<user> /var/www/html.

- nginx: [emerg] no port in upstream "fastcgi_backend"

    https://phpcodez.com/no-port-in-upstream-fastcgi_backend-in-usr-share-nginx-html-magento2-nginx-conf-sample40/

- NGINX: connect() to unix:/var/run/php8.0-fpm.sock failed (2: No such file or directory)

    https://stackoverflow.com/questions/51158830/nginx-connect-to-unix-var-run-php7-2-fpm-sock-failed-2-no-such-file-or-dir

    https://stackoverflow.com/questions/40059745/nginx-connect-to-unix-var-run-php7-0-fpm-sock-failed-2-no-such-file-or-dir

### Forbidden 403

- 2021/12/21 18:44:45 [error] 51922#51922: *2 directory index of "/var/www/commerce/" is forbidden, client: 172.16.52.1, server: 172.16.52.134, request: "GET / HTTP/1.1", host: "172.16.52.134"

    Check /var/log/nginx/error.log. Fix permissions `chown`

## Notes on docs

- The web server prereqs contain full on Commerce install steps, which makes then much more than simple prereq topics. Need to streamline this so that they are prereqs only.
