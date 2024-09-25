pipeline {
    agent any
    stages {
        stage('Clone') {
            steps {
                git branch: 'protect/deploy', url: 'https://github.com/vutrieuIT/fe_admin.git'
            }
        }
       stage('Check Branch') {
            steps {
                script {
                    if (env.GIT_BRANCH != 'origin/protect/deploy') {
                        error("Not on protect/deploy branch, exiting pipeline.")
                    }
                }
            }
        }
        stage('Build') {
            when {
                branch 'protect/deploy'
            }
            steps {
                withDockerRegistry(credentialsId: 'docker-hub', url: 'https://index.docker.io/v1/') {
                    sh 'docker build -t trieuvu/admin:new .'
                    sh 'docker push trieuvu/admin:new'
                }
            }
        }
    }
}
