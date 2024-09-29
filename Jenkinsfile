pipeline {
    agent any
    stages {
        stage('Clone') {
            steps {
                git branch: 'protect/deploy', url: 'https://github.com/vutrieuIT/fe_admin.git'
            }
        }
    }
}
