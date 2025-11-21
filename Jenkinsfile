pipeline {
    agent any

    environment {
        AWS_DEFAULT_REGION = "ap-south-1"
        SAM_CLI_TELEMETRY = "0"
	NPM_CONFIG_STRICT_SSL = "false"
        NPM_CONFIG_REGISTRY = "http://registry.npmjs.org/"
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
                sh '''
			export NPM_CONFIG_STRICT_SSL=false
			export NPM_CONFIG_REGISTRY=http://registry.npmjs.org/
			sam build '''
            }
        }

        stage('Deploy to AWS') {
    	withAWS(credentials: 'aws-creds', region: 'ap-south-1') {
        script {
            try {
                sh "sam deploy --no-confirm-changeset"
            } catch (err) {
                if (err.toString().contains("No changes to deploy")) {
                    echo "No changes detected. Deployment is already up to date."
                } else {
                    error("Deployment failed: ${err}")
                }
            }
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

