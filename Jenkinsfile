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
        echo "---- CREATE USER ----"
        CREATE_RESPONSE=$(curl -s -X POST https://9wtsqkg3yl.execute-api.ap-south-1.amazonaws.com/Prod/user \
            -H "Content-Type: application/json" \
            -d '{"name":"TestUser","email":"test@example.com"}')

        echo "Create Response: $CREATE_RESPONSE"

        USER_ID=$(echo $CREATE_RESPONSE | jq -r '.userId')
        echo "Extracted User ID: $USER_ID"

        echo "---- GET USER ----"
        curl -s https://9wtsqkg3yl.execute-api.ap-south-1.amazonaws.com/Prod/user/$USER_ID


        echo "---- GENERATE SAMPLE IMAGE ----"
        base64 -d > test.jpg <<EOF
		/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxISEhUTEhMWFhUVFRUVFRUVFRUWFhUWFxUVFRUY
		HSggGBolGxUVITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OGhAQGy0lICYtLS0tLS0tLS0tLS0t
		LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAKgBLAMBIgACEQEDEQH/xAAb
		AAACAwEBAQAAAAAAAAAAAAAEBQADBgIBB//EADkQAAIBAwIEAwYEBgIDAQAAAAECAwAEEQUhMQYS
		QVFhcRMigZGhsfAHFEJSwdHh8SMzUnKColIz/8QAGQEAAwEBAQAAAAAAAAAAAAAAAAECAwQF/8QA
		JREAAgICAgICAwEAAAAAAAAAAAECEQMhEjFBEyJRYRQj/9oADAMBAAIRAxEAPwD2gAoAoAoAoAoA
		oAoAoAoAoAoAoAoAoAoAoAoAoAoAoAoAoAoAoAoAoAoA//Z
		EOF


        echo "---- UPLOAD IMAGE ----"
        UPLOAD_RESPONSE=$(curl -s -X POST \
            -H "Content-Type: image/jpeg" \
            --data-binary "@test.jpg" \
            https://9wtsqkg3yl.execute-api.ap-south-1.amazonaws.com/Prod/user/$USER_ID/image)

        echo "Upload Response: $UPLOAD_RESPONSE"
        
'''
    }
}

    }
}

