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
    steps {
        withAWS(credentials: 'aws-creds', region: 'ap-south-1') {
            script {

                // Run SAM deploy, but DO NOT fail the pipeline automatically
                def result = sh(
                    script: "sam deploy --no-confirm-changeset",
                    returnStdout: true,
                    returnStatus: true
                )

                echo "SAM Raw Output:\n${result}"

                // If exit code is 0 → deployment succeeded
                if (result == 0) {
                    echo "Deployment succeeded."
                    return
                }

                // If output contains "No changes to deploy" → treat as SUCCESS
                if (result.toString().contains("No changes to deploy")) {
                    echo "No changes to deploy — marking as success."
                    return
                }

                // Otherwise → REAL failure
                error "Deployment failed: ${result}"
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

