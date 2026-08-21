pipeline {
    agent any

    // =========================================================
    // Environment Variables
    // =========================================================
    environment {
        // Jenkins Credentials ID: "dockerhub-credentials" (Username with password)
        // Exposes: DOCKERHUB_CREDENTIALS_USR and DOCKERHUB_CREDENTIALS_PSW
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
        IMAGE_TAG = "${BUILD_NUMBER}"
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 30, unit: 'MINUTES')
        timestamps()
    }

    // Automatically check GitHub every 2 minutes for new pushes on dev branch
    triggers {
        pollSCM('H/2 * * * *')
    }

    stages {

        // =====================================================
        // 1. Checkout Source Code
        // =====================================================
        stage('Checkout') {
            steps {
                echo '📥 Checking out source code...'
                checkout scm
            }
        }

        // =====================================================
        // 2. Install Dependencies
        // =====================================================
        stage('Install Dependencies') {
            steps {
                echo '📦 Installing application dependencies...'
                sh '''
                    if [ -f app/server/package.json ]; then
                        echo "Installing server dependencies..."
                        cd "$WORKSPACE/app/server"
                        npm install
                    fi

                    if [ -f app/client/package.json ]; then
                        echo "Installing client dependencies..."
                        cd "$WORKSPACE/app/client"
                        npm install
                    fi
                '''
            }
        }

        // =====================================================
        // 3. Run Unit Tests
        // =====================================================
        stage('Run Tests') {
            steps {
                echo '🧪 Running test suites...'
                sh '''
                    if [ -f "$WORKSPACE/app/server/package.json" ]; then
                        echo "Testing server..."
                        cd "$WORKSPACE/app/server"
                        npm test --if-present
                    fi

                    if [ -f "$WORKSPACE/app/client/package.json" ]; then
                        echo "Testing client..."
                        cd "$WORKSPACE/app/client"
                        npm test --if-present
                    fi
                '''
            }
        }

        // =====================================================
        // 4. SonarQube Analysis
        // =====================================================
        stage('SonarQube Analysis') {
            steps {
                echo '🔍 Running SonarQube static code analysis...'
                withSonarQubeEnv('SonarQube') {
                    withCredentials([
                        string(
                            credentialsId: 'Jenkins-Token',
                            variable: 'SONAR_TOKEN'
                        )
                    ]) {
                        sh '''
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
                echo '🚦 Checking SonarQube Quality Gate status...'
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        // =====================================================
        // 6. Build Docker Images
        // =====================================================
        stage('Build Docker Images') {
            steps {
                echo "🐳 Building Docker images (Tag: ${IMAGE_TAG})..."
                sh '''
                    # Build Client Image
                    docker build -t ${DOCKERHUB_CREDENTIALS_USR}/expenses-client:${IMAGE_TAG} ./app/client/
                    docker tag ${DOCKERHUB_CREDENTIALS_USR}/expenses-client:${IMAGE_TAG} ${DOCKERHUB_CREDENTIALS_USR}/expenses-client:latest

                    # Build Server Image
                    docker build -t ${DOCKERHUB_CREDENTIALS_USR}/expenses-server:${IMAGE_TAG} ./app/server/
                    docker tag ${DOCKERHUB_CREDENTIALS_USR}/expenses-server:${IMAGE_TAG} ${DOCKERHUB_CREDENTIALS_USR}/expenses-server:latest
                '''
            }
        }

        // =====================================================
        // 7. Push to DockerHub
        // =====================================================
        stage('Push to DockerHub') {
            steps {
                echo '📤 Pushing images to DockerHub registry...'
                sh '''
                    echo "${DOCKERHUB_CREDENTIALS_PSW}" | docker login -u "${DOCKERHUB_CREDENTIALS_USR}" --password-stdin

                    docker push ${DOCKERHUB_CREDENTIALS_USR}/expenses-client:${IMAGE_TAG}
                    docker push ${DOCKERHUB_CREDENTIALS_USR}/expenses-client:latest

                    docker push ${DOCKERHUB_CREDENTIALS_USR}/expenses-server:${IMAGE_TAG}
                    docker push ${DOCKERHUB_CREDENTIALS_USR}/expenses-server:latest
                '''
            }
        }

        // =====================================================
        // 8. Deploy to App EC2 via Ansible
        // =====================================================
        stage('Deploy to App EC2') {
            steps {
                echo '🚀 Deploying updated app containers to App EC2...'
                withCredentials([
                    file(credentialsId: 'ansible-vault-password', variable: 'VAULT_PASS_FILE'),
                    sshUserPrivateKey(
                        credentialsId: 'ssh-private-key',
                        keyFileVariable: 'SSH_KEY_FILE',
                        usernameVariable: 'SSH_USER'
                    )
                ]) {
                    sh '''
                        mkdir -p ~/.ssh
                        cp "${SSH_KEY_FILE}" ~/.ssh/cloud_devops_keypair_26.pem
                        chmod 600 ~/.ssh/cloud_devops_keypair_26.pem

                        export ANSIBLE_HOST_KEY_CHECKING=False

                        ansible-playbook \
                            -i ansible/inventory/hosts.ini \
                            ansible/playbooks/deploy-app.yml \
                            --vault-password-file "${VAULT_PASS_FILE}" \
                            -e "image_tag=${IMAGE_TAG}"
                    '''
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
            echo "✅ CI/CD PIPELINE PASSED (Build #${BUILD_NUMBER})"
            echo 'Application successfully built, scanned & deployed!'
            echo '============================================='
        }

        failure {
            echo '============================================='
            echo "❌ CI/CD PIPELINE FAILED (Build #${BUILD_NUMBER})"
            echo 'Check stage output logs above.'
            echo '============================================='
        }

        always {
            echo '🧹 Performing post-build cleanup...'
            sh 'docker logout || true'
            cleanWs()
        }
    }
}
