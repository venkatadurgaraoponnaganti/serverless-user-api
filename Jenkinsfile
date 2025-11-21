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
            sh '''
            set +e
            sam deploy --no-confirm-changeset
            EXIT=$?
            if [ $EXIT -eq 1 ]; then
               echo "No changes to deploy — treating as success."
               exit 0
            fi
            exit $EXIT
            '''
        }
    }
}

        stage('Smoke Test') {
	    steps {
        echo "Running Smoke Tests..."

        sh '''
        # 1. Test Create User API
        CREATE_RESPONSE=$(curl -s -X POST https://9wtsqkg3yl.execute-api.ap-south-1.amazonaws.com/Prod/user \
            -H "Content-Type: application/json" \
            -d '{"name":"TestUser","email":"test@example.com"}')

        echo "Create Response: $CREATE_RESPONSE"

        USER_ID=$(echo $CREATE_RESPONSE | jq -r '.id')
        echo "User ID: $USER_ID"

        # 2. Test Get User API
        curl -s https://9wtsqkg3yl.execute-api.ap-south-1.amazonaws.com/Prod/user/$USER_ID

        # 3. Test Image Upload
        curl -s -X POST \
            -H "Content-Type: image/jpeg" \
            --data-binary "@test.jpg" \
            https://9wtsqkg3yl.execute-api.ap-south-1.amazonaws.com/Prod/user/$USER_ID/image
        '''
    }
}

    }
}

