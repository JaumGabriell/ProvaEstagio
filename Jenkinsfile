pipeline {
    agent any

    stages {
        stage('Build Backend') {
            steps {
                echo 'Building backend...'
                sh '''
                    cd backend
                    python3 -m venv venv
                    . venv/bin/activate
                    pip install -r requirements.txt
                '''
            }
        }

        stage('Build Frontend') {
            steps {
                echo 'Building frontend...'
                sh '''
                    cd frontend
                    npm install
                '''
            }
        }

        stage('Test Backend') {
            steps {
                echo 'Running backend unit tests...'
                sh '''
                    cd backend
                    . venv/bin/activate
                    pytest tests/ -v
                '''
            }
        }

        stage('Test Frontend') {
            steps {
                echo 'Running frontend unit tests...'
                sh '''
                    cd frontend
                    npm test
                '''
            }
        }

        stage('Test API') {
            steps {
                echo 'Testing API endpoints...'
                sh '''
                    cd backend
                    . venv/bin/activate
                    uvicorn app.main:app --host 0.0.0.0 --port 8000 &
                    sleep 5
                '''
                
                sh 'chmod +x scripts/test_api.sh && ./scripts/test_api.sh'
                
                sh 'pkill -f uvicorn || true'
            }
        }

        stage('Notification') {
            steps {
                echo 'Sending notification email...'
                sh '''
                    cd scripts
                    chmod +x send_email.sh
                    ./send_email.sh
                '''
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}
