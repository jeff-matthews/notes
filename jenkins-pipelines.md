## Docker pipeline scripts
This works, but requires docker installation on the Jenkins host. I had to do that manually and then add the jenkins user to the docker group and reboot Jenkins.

### Declarative pipeline

```
pipeline {
    agent {
        docker { image 'ruby:2.4.1' }
    }

    checkout scm

    stages {

        stage('Install dependencies') {
            steps {
                sh 'gem install bundler'
                sh 'bundle install'
            }
        }

        stage('Build the devdocs site') {
            steps {
                sh 'jekyll build'
            }
        }
    }
}
```

### Scripted pipeline

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
