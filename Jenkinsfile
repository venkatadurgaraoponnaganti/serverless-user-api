pipeline {
    agent any

    environment {
        AWS_DEFAULT_REGION = "ap-south-1"
        SAM_CLI_TELEMETRY = "0"
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'master', url: 'https://github.com/venkatadurgaraoponnaganti/serverless-user-api.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install --prefix functions/createUser'
                sh 'npm install --prefix functions/getUser'
                sh 'npm install --prefix functions/uploadImage'
            }
        }

        stage('SAM Build') {
            steps {
                sh 'sam build --use-container'
            }
        }

        stage('Deploy to AWS') {
            steps {
                withAWS(credentials: 'aws-creds', region: 'ap-south-1') {
                    sh 'sam deploy --no-confirm-changeset'
                }
            }
        }

        stage('Smoke Test') {
            steps {
                sh 'curl -s https://9wtsqkg3yl.execute-api.ap-south-1.amazonaws.com/Prod/user || true'
            }
        }
    }
}

