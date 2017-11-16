pipeline {
  agent any



  stages {

  /*
    stage('Build') {
      steps {
        sh './scripts/build_jenkins.sh'
      }
    }
  */

    stage('Deploy to Acceptance') {
      environment {
        GIT_URL = 'git+ssh://git@push-par-clevercloud-customers.services.clever-cloud.com/app_15549042-04ed-41bc-a0c9-5149bc1c4954.git'
      }


      steps {
        withCredentials([[$class: 'SSHUserPrivateKeyBinding', credentialsId: 'lunatech-jenkins', usernameVariable: 'GIT_USERNAME', keyFileVariable: 'GIT_PRIVATE_KEY']]) {
          sh 'printenv'
          // sh './scripts/deploy_jenkins.sh'
        }
      }
    }
  }
}
