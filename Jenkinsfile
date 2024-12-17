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
            steps {
                withDockerRegistry(credentialsId: 'docker-hub', url: 'https://index.docker.io/v1/') {
                    sh 'docker build -t trieuvu/kltn_admin:new .'
                    sh 'docker push trieuvu/kltn_admin:new'
                }
            }
        }
        stage('Deploy') {
            steps {
                script {
                    // Áp dụng file YAML cho Deployment và Service
                    sh 'kubectl apply -f admin-deployment.yml'

                    // Lấy URL của service
                    def appUrl = sh(script: "minikube service admin-service --url", returnStdout: true).trim()
                    echo "Application is running at: ${appUrl}"
                }
            }
        }
    }
    post {
        success {
            mail bcc: '', body: 'build admin done', cc: '', from: '', replyTo: '', subject: 'jenkins build', to: 'vutrieu2002@gmail.com'
        }
        failure {
            mail bcc: '', body: 'build admin fail', cc: '', from: '', replyTo: '', subject: 'jenkins build', to: 'vutrieu2002@gmail.com'
        }
    }
}
