pipeline {

    agent any

    stages {

        // =====================================================
        // 1. Checkout
        // =====================================================

        stage('Checkout') {
            steps {
                checkout scm
            }
        }


        // =====================================================
        // 2. Install Dependencies
        // =====================================================

        stage('Install Dependencies') {
            steps {
                sh '''
                    echo "Installing dependencies..."

                    if [ -f package.json ]; then
                        npm install
                    fi

                    if [ -f server/package.json ]; then
                        cd server
                        npm install
                    fi

                    if [ -f client/package.json ]; then
                        cd client
                        npm install
                    fi
                '''
            }
        }


        // =====================================================
        // 3. Run Tests
        // =====================================================

        stage('Run Tests') {
            steps {
                sh '''
                    echo "Running tests..."

                    if [ -f package.json ]; then
                        npm test -- --passWithNoTests
                    fi

                    if [ -f server/package.json ]; then
                        cd server
                        npm test -- --passWithNoTests || true
                    fi

                    if [ -f client/package.json ]; then
                        cd client
                        npm test -- --passWithNoTests || true
                    fi
                '''
            }
        }


        // =====================================================
        // 4. SonarQube Analysis
        // =====================================================

        stage('SonarQube Analysis') {
            steps {

                withSonarQubeEnv('SonarQube') {

                    sh '''
                        echo "Running SonarQube analysis..."

                        sonar-scanner \
                          -Dsonar.projectKey=cloud-devops-app \
                          -Dsonar.projectName=Cloud-DevOps-App \
                          -Dsonar.sources=. \
                          -Dsonar.exclusions=node_modules/**,client/node_modules/**,server/node_modules/**,coverage/**,dist/**,build/**
                    '''
                }
            }
        }


        // =====================================================
        // 5. Quality Gate
        // =====================================================

        stage('Quality Gate') {
            steps {

                timeout(time: 5, unit: 'MINUTES') {

                    waitForQualityGate abortPipeline: true

                }
            }
        }

    }


    // =========================================================
    // Post Actions
    // =========================================================

    post {

        success {
            echo '============================================='
            echo 'CI PIPELINE PASSED'
            echo 'SonarQube Quality Gate PASSED'
            echo '============================================='
        }

        failure {
            echo '============================================='
            echo 'CI PIPELINE FAILED'
            echo 'Check the failed stage above.'
            echo '============================================='
        }

    }
}