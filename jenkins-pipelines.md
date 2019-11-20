# GH PR builder

- make sure Jenkins plugin uses same logic as omsdocs drone build to make sure PRs are tested with the latest version master
- always test on master to mitigate edge cases of introducing failures into master btwn PRs
- run test jobs concurrently
- test that only admin-list PR submitters trigger auto builds
- test that only admin-list peeps can use trigger phrase
- configure admin settings in repo to require a passing build on PRs to master
- implement then and create messaging for community in form of devblog

## Docker pipeline scripts

This works, but requires docker installation on the Jenkins host. I had to do that manually and then add the jenkins user to the docker group and reboot Jenkins.

1.  Log in to server:

    ```
    ssh -i id_rsa jnks4all@devdocs.ci.corp.adobe.com
    ```

1.  Install docker:

    ```
    sudo yum install docker
    ```

1. Start Docker at boot on RHEL:

    ```
    sudo systemctl enable docker
    ```

1. Make sure the Docker daemon is running or you may get an error:

    ```
    systemctl start docker
    ```

1.  Create a `docker` group:

    ```
    sudo groupadd docker
    ```

1.  Add the Jenkins user (`jnknsprd`) to the new `docker` group:

    ```
    sudo usermod -aG docker jknknsprd
    ```

1.  Reboot server.

### Declarative pipeline

Declarative limits what is available to the user with a more strict and pre-defined structure, making it an ideal choice for simpler continuous delivery pipelines. Scripted provides very few limits, insofar that the only limits on structure and syntax tend to be defined by Groovy itself, rather than any Pipeline-specific systems, making it an ideal choice for power-users and those with more complex requirements. As the name implies, Declarative Pipeline encourages a declarative programming model. Whereas Scripted Pipelines follow a more imperative programming model.


```
pipeline {
    agent {
        docker { image 'ruby:2.5.1' }
    }
    stages {
        stage('Clone') {
            steps {
                git branch: '$branch', url: 'https://github.com/magento/devdocs.git'   
            }
        }
        stage('Install') {
            steps {
                sh 'bundle config build.nokogiri --use-system-libraries'
                sh 'bundle install'
            }
        }
        stage('Build') {
            steps {
                sh 'jekyll build'
            }
        }
    }
    post {
        failure {
            mail to: 'Grp-Magento-Docs@adobe.com',
                 subject: "Failed Pipeline: ${currentBuild.fullDisplayName}",
                 body: "Something is wrong with ${env.BUILD_URL}"
        }
    }
}
```

### Scripted pipeline

Declarative limits what is available to the user with a more strict and pre-defined structure, making it an ideal choice for simpler continuous delivery pipelines. Scripted provides very few limits, insofar that the only limits on structure and syntax tend to be defined by Groovy itself, rather than any Pipeline-specific systems, making it an ideal choice for power-users and those with more complex requirements. As the name implies, Declarative Pipeline encourages a declarative programming model. Whereas Scripted Pipelines follow a more imperative programming model.


#### Inside a docker container

**Prerequisites**

- Copy Artifact Plugin
- Pipeline Utility Steps Plugin

```
node {
    stage('Build') {
        checkout scm
        docker.image('ruby:2.4.1').inside {
          stage("Install dependencies") {
            sh 'gem install bundler'
            sh 'bundle install'
          }
          stage("Run jekyll") {
            sh 'jekyll build'
          }
       }
    }
    stage('Archive') {
      zip zipFile: 'site.zip', archive: true, dir: '_site'
      archiveArtifacts artifacts: 'site.zip', onlyIfSuccessful: true
    }
}
```

#### Ruby installed on host

```
node {
    stage('Build') {

          stage("Checkout") {
            git branch: 'develop', url: 'https://github.com/magento/devdocs.git'  
          }

          stage("Install dependencies") {
            sh 'bundle install'
          }
          stage("Run jekyll") {
            sh 'jekyll build'
          }

    }
    stage('Archive') {
      zip zipFile: 'site.zip', archive: true, dir: '_site'
      archiveArtifacts artifacts: 'site.zip', onlyIfSuccessful: true
    }
}
```

#### Ruby installed on host

```
node {
   stage('Checkout'){
       git branch: 'develop', url: 'https://github.com/magento/devdocs.git'
   }
   stage('Setup'){
       sh('bundle install')
   }
   stage('Build Site'){
       sh('jekyll build')
   }
   stage('Build Artifact'){
       zip zipFile: 'site.zip', archive: true, dir: '_site'
       archiveArtifacts artifacts: 'site.zip', onlyIfSuccessful: true
   }
}
```

#### Deploy gh-pages

**Prerequisites**

- You must give "Copy Artifact" permission to this job from the Build Devdocs job
- You must set up the github credentialsID so this job can push to a repo

```
import java.text.SimpleDateFormat
node {
    stage('Checkout'){
        git branch: 'gh-pages', credentialsId: 'github', url: 'https://github.com/magento/devdocs.git'
        sh('git rm -fr .')
        sh('git clean -fxd')
    }
    stage('Deploy Artifact'){
        step([  $class: 'CopyArtifact',
                        filter: 'site.zip',
                        projectName: 'Build Devdocs']);
         
        unzip zipFile:'site.zip', dir: ''
        sh('rm site.zip')
    }
    stage('Deploy Site'){
        sh 'git config --global user.email "<email>"'
        sh 'git config --global user.name "<username>"'
         
        def dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm")
        def date = new Date()
         
        sh('git add .')
        sh('git commit -m "Site updated at '+dateFormat.format(date)+'"')
         
        withCredentials([usernamePassword(credentialsId: 'github', passwordVariable: 'GH_TOKEN', usernameVariable: 'GH_USER')]) {
            sh 'git push https://${GH_USER}:${GH_TOKEN}@github.com/magento/devdocs.git gh-pages'
        }
    }
}
```

Don't forget to replace the values for `<email>` and `<username>`.

## OpenSSL issue

There's some sort of OpenSSL issue preventing the job I created from installing gems from the RubyGems website: https://guides.rubygems.org/ssl-certificate-update/

I think we need to update our version of openssl from 1.0.2k to something more current that supports TLS 1.2.

### Example error

```
Fetching source index from https://rubygems.org/

Retrying fetcher due to error (2/4): Bundler::Fetcher::CertificateFailureError Could not verify the SSL certificate for https://rubygems.org/.
There is a chance you are experiencing a man-in-the-middle attack, but most likely your system doesn't have the CA certificates needed for verification. For information about OpenSSL certificates, see http://bit.ly/ruby-ssl. To connect without using SSL, edit your Gemfile sources and change 'https' to 'http'.
```

### Workaround

After editing the `Gemfile` to use `http` instead of `https`, this seems to have resolved itself. Running a successful build with `http` first, then switching to `https` works.

### Still having issues

The workaround sufficed for a while, but the errors returned so I just emailed the DL-jenkins-admins@adobe team and asked them to update the SSL certificates on the Jenkins host, which fixed the issue.

## GitHub webhooks

To enable GitHub to post data to the Jenkins webhook URL, I had to request a firewall rule change from the Adobe security team. that got kicked back because apparently a security review is required first. The security review produces a PSR Jira artifact that is a pre-requisite to creating a request for firewall changes.

In my initial attempt, I was told that our current Jenkins instance is on a server behind a "backend firewall" and Adobe doesn't allow assets behind these firewalls to be accessible to the internet.

So as a temporary work around, I'm using SCM polling instead of webhooks to build on demand.

## Troubleshooting

### Cleaning the workspace

There's no option to manually clean the workspace in the UI, so when we need to clean it, we need to do it as part of the pipeline script. 

For example, we commonly have symlink errors like this that'll cause builds to fail:

```
jekyll 3.7.3 | Error:  No such file or directory @ rb_sysopen - /apps/jenkins/latest/workspace/devdocs-production-build/_site/guides/v2.3/magento-functional-testing-framework/2.3/img/catalogCategoryRepository-operations.png
```

Add a new sdtage to clean the workspace:

```
stage('Clean workspace') {
        cleanWs()
    }
```

Cleaning the workspace increases job runtimes though, because Jenkins has to clone the entire repo every time.

## Backup samples

### devdocs-build-prod

```groovy
node {
    try {
        // This adds to the build time, but if we don't do it, old build artififacts can cause failures.
        // For example, subsequent builds fail because the artifact (ZIP file) already exists.
        stage('Clean workspace') {
            cleanWs()
        }
        stage('Clone') {
            git branch: 'master', url: 'https://github.com/magento/devdocs.git'
            docker.image('ruby:2.5.1').inside {
              stage("Install") {
                sh 'bundle config build.nokogiri --use-system-libraries'
                sh 'bundle install'
              }
              stage("Build") {
                  sh 'jekyll build'
              }
              stage("Archive") {
                  zip archive: true, dir: '_site', zipFile: 'site.zip'
                  archiveArtifacts artifacts: 'site.zip', onlyIfSuccessful: true
              }
           }
        }   
    }
    catch (e) {
        // If there was an exception thrown, the build failed
        currentBuild.result = "FAILED"
        throw e
    }
    finally {
        // Notify the team when a build fails
        notifyFailed()
    }
}

def notifyFailed() {
    emailext (
      subject: "FAILED: '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
      body: "Something is wrong with '${env.BUILD_URL}'",
      to: '$DEFAULT_RECIPIENTS'
    )
}
```

### devdocs-deploy-prod

Via GH pages branch

```groovy
import java.text.SimpleDateFormat
node {
    stage('Checkout'){
        git branch: 'jenkins-test-deploy', credentialsId: '2cd0080b-700f-4978-8090-1111d95d323f', url: 'https://github.com/magento/devdocs.git'
        sh('git rm -fr .')
        sh('git clean -fxd')
    }
    stage('Deploy Artifact'){
        step([  $class: 'CopyArtifact',
                        filter: 'site.zip',
                        projectName: 'devdocs-build-prod']);
         
        unzip zipFile:'site.zip', dir: ''
        sh('rm site.zip')
    }
    stage('Deploy Site'){
        sh 'git config --global user.email "Grp-Magento-Docs@adobe.com"'
        sh 'git config --global user.name "magento-cicd"'
         
        def dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm")
        def date = new Date()
         
        sh('git add .')
        sh('git commit -m "Site updated at '+dateFormat.format(date)+'"')
         
        withCredentials([string(credentialsId: '2cd0080b-700f-4978-8090-1111d95d323f', variable: 'var')]) {
            sh 'git push https://${var}@github.com/magento/devdocs.git gh-pages'
        }
    }
}
```

## Windows VM

1. Got to https://itcloud-portal.paas.corp.adobe.com/#/compute/virtual-compute.

1. Click **New server**.

1. Complete form.

To access the server remotely:

1. Download and install the Microsoft RDP client.

1. Complete the Adobe WebAuth request process: https://inside.corp.adobe.com/itech/kc/IT00736.html. I'm not sure how to determine the role you'll need. When I did this, I had to contact support and they asked me to use the following link: http://or1-webauth.corp.adobe.com/. 

1. Connect to the Windows host with RDP. No password is necessary for your user account. 

### Network access

open a service desk ticket to allow RDP traffic for my VPN group

spoke to network sec guy (Mark Davis). he didn't see my RDP (3389) traffic to or1010051012130.corp.adobe.com - 10.51.12.130, but he could see ping traffic to that server. he could also see https (443) traffic to a different server (or1010051012068.corp.adobe.com - 10.51.12.68) in the same zone

### Using PCD to provision Windows VMs

Hi Jeff
contacting you for https://jira.corp.adobe.com/browse/PCDEP-1067
we don't support (yet ) jenkins slaves on windows
traditional flow will fail and requesting slaves from PCD will not help as those can be requested from Developoer Portal only (where they will come as Ubuntu only)
however
to create empty Windows servers (not jenkins slaves) is possible
that is the fix that i have added
if this helps, created a application where you can add windows servers only: https://pcd-ui.paas.corp.adobe.com/#/application/2731/configuration/10915
you're admin there
these machines are not having user/pwd (as no ssh support on windows)
but can add users to them following: https://wiki.corp.adobe.com/display/pcd/How+to+add+users+for+my+windows+server
you can add further servers there
if issues...let me know