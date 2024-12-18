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
                    // Stop and remove any existing container
                    sh '''
                    docker stop admin-web || true
                    docker rm admin-web || true
                    '''

                    // Run the new container
                    sh '''
                    docker run -d --name admin-web \
                        -p 81:80 \
                        -e API_URL=http://host.docker.internal:8001 \
                        --restart always \
                        trieuvu/kltn_admin:new
                    '''
                }
            }
        }
    }
    post {
        success {
            mail bcc: '', body: 'Build and deploy admin service successfully completed.', 
                cc: '', from: '', replyTo: '', subject: 'Jenkins Build Success', to: 'vutrieu2002@gmail.com'
        }
        failure {
            mail bcc: '', body: 'Build or deploy admin service failed.', 
                cc: '', from: '', replyTo: '', subject: 'Jenkins Build Failure', to: 'vutrieu2002@gmail.com'
        }
    }
}
