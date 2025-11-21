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
                	def status = sh(
                    	script: "sam deploy --no-confirm-changeset",
                    	returnStatus: true
               		 )

                	if (status != 0) {
                    // SAM returns 1 when stack is unchanged → treat as success
                    	echo "SAM returned status ${status}"

                    	def log = readFile("${env.WORKSPACE}/.aws-sam/build/template.yaml")

                    	if (log.contains("No changes to deploy")) {
                        echo "No changes detected. Proceeding without failure."
                    } else {
                        error "Deployment failed with status ${status}"
                    }
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

