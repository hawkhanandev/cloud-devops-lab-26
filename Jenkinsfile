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
                        cd "$WORKSPACE/server"
                        npm install
                    fi

                    if [ -f client/package.json ]; then
                        cd "$WORKSPACE/client"
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

                    if [ -f "$WORKSPACE/server/package.json" ]; then
                        cd "$WORKSPACE/server"
                        npm test -- --passWithNoTests
                    fi

                    if [ -f "$WORKSPACE/client/package.json" ]; then
                        cd "$WORKSPACE/client"
                        npm test -- --passWithNoTests
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

                    withCredentials([
                        string(
                            credentialsId: 'Jenkins-Token',
                            variable: 'SONAR_TOKEN'
                        )
                    ]) {

                        sh '''
                            echo "Running SonarQube analysis..."

                            sonar-scanner \
                              -Dsonar.token="$SONAR_TOKEN"
                        '''
                    }
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