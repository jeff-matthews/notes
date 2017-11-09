* Welcome/intro/overview
    * Installation workflow diagrams that provide context and a good segue for the Configuration Guide (e.g., caching, deployment, Magento CLI tool) and other guides
    * Web setup vs CLI installation methods at a high level
    * Helpful resources
* Technologies and requirements
    * Tech stack requirements
        * LAMP/LEMP on Debian/RPM
        * Includes conceptual info about things unique to configuring a stack for Magenta
    * Hosting (e.g., shared, self hosting, cloud)
    * TLS/security/SELinux/iptables
    * Caching (high level; point to config guide)
    * Browser support
    * Optional software
* Set up your environment
    * Replaces current “Prerequisites” section
    * Do we need different environment types here? Are there enough differences between setups?
        * Local
        * Shared
        * On prom
    * Consider adding recommendations for virtual setups?
        * Vagrant
        * Docker
        * MAMP
        * WAMP
    * Security
        * File system permissions
        * Authentication keys
    * Instead of separate topics here for each part of the stack, should we talk about each piece at a high level in a single topic (Tech stack requirements) and then have a topic for each type of setup in this section?
        * Magento LAMP (Debian)
        * Magento LAMP (RPM)
        * Magento LEMP (Debian)
        * Magento LEMP (RPM)
    * Apache
        * Focus on rewrites
    * MySQL
        * Focus on setting up DB and user
    * PHP
        * Focus on required extensions and required settings
    * Security
        * Focus on SELinux and iptables
    * Optional software
        * NTP
        * Phpmyadmin
* Getting started  
    * Guides only cover method of fetching Magento software, setting file system permissions, and installing via UI and CLI. Each guide is a single page.
    * Beginner - Archive/ZIP
    * Intermediate - Composer (recommended in most cases even for hobbyist?)
    * Advanced - Clone Magento Github repo(s) (recommended for open source contributors only?)
* Manage your installation/environment
    * <see Installation Guide TOC Part II>
    * Manage sample data
    * Uninstall or reinstall Magento
    * Display or change the admin uri
    * Uninstall modules
    * ...
* Troubleshooting
* Tutorials
    * (single source content from “setup” and “getting started > advanced [for cli]”)
    * Install Magento on LAMP (Debian)
    * Install Magento on LAMP (RPM)
    * Install Magento on LEMP (Debian)
    * Install Magento on LEMP (RPM)
