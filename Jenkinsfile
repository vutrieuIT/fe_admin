pipeline {
    agent any
    stages {
        stage('Clone') {
            steps {
                git branch: 'main', url: 'https://github.com/vutrieuIT/fe_admin.git'
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
                    // Deploy the service using Docker Compose
                    sh '''
                    docker-compose down || true
                    docker-compose up -d
                    '''
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
