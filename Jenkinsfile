pipeline {
    agent any

    // =========================================================
    // Environment Variables
    // =========================================================
    environment {
        // DockerHub credentials (creates DOCKERHUB_CREDENTIALS_USR & _PSW)
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
        IMAGE_TAG = "${BUILD_NUMBER}"
    }

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


        // =====================================================
        // 6. Build Docker Images
        // =====================================================

        stage('Build Docker Images') {
            steps {
                sh '''
                    echo "Building Docker images with tag: ${IMAGE_TAG}"

                    # Build client
                    docker build -t ${DOCKERHUB_CREDENTIALS_USR}/expenses-client:${IMAGE_TAG} ./app/client/

                    # Build server
                    docker build -t ${DOCKERHUB_CREDENTIALS_USR}/expenses-server:${IMAGE_TAG} ./app/server/

                    # Tag as latest
                    docker tag ${DOCKERHUB_CREDENTIALS_USR}/expenses-client:${IMAGE_TAG} ${DOCKERHUB_CREDENTIALS_USR}/expenses-client:latest
                    docker tag ${DOCKERHUB_CREDENTIALS_USR}/expenses-server:${IMAGE_TAG} ${DOCKERHUB_CREDENTIALS_USR}/expenses-server:latest
                '''
            }
        }


        // =====================================================
        // 7. Push to DockerHub
        // =====================================================

        stage('Push to DockerHub') {
            steps {
                sh '''
                    echo "Pushing images to DockerHub..."
                    
                    echo "${DOCKERHUB_CREDENTIALS_PSW}" | docker login -u "${DOCKERHUB_CREDENTIALS_USR}" --password-stdin

                    docker push ${DOCKERHUB_CREDENTIALS_USR}/expenses-client:${IMAGE_TAG}
                    docker push ${DOCKERHUB_CREDENTIALS_USR}/expenses-server:${IMAGE_TAG}
                    docker push ${DOCKERHUB_CREDENTIALS_USR}/expenses-client:latest
                    docker push ${DOCKERHUB_CREDENTIALS_USR}/expenses-server:latest
                '''
            }
        }


        // =====================================================
        // 8. Deploy to App EC2 via Ansible
        // =====================================================

        stage('Deploy to App EC2') {
            steps {
                withCredentials([
                    file(credentialsId: 'ansible-vault-password', variable: 'VAULT_PASS_FILE'),
                    sshUserPrivateKey(
                        credentialsId: 'ssh-private-key',
                        keyFileVariable: 'SSH_KEY_FILE',
                        usernameVariable: 'SSH_USER'
                    )
                ]) {
                    sh '''
                        echo "Deploying to App EC2..."

                        mkdir -p ~/.ssh
                        cp "${SSH_KEY_FILE}" ~/.ssh/cloud_devops_keypair_26.pem
                        chmod 600 ~/.ssh/cloud_devops_keypair_26.pem

                        export ANSIBLE_HOST_KEY_CHECKING=False

                        ansible-playbook \\
                            -i ansible/inventory/hosts.ini \\
                            ansible/playbooks/deploy-app.yml \\
                            --vault-password-file "${VAULT_PASS_FILE}" \\
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

        always {
            // Always logout from DockerHub to prevent credential leaks
            sh 'docker logout || true'
            // Clean up workspace
            cleanWs()
        }

    }
}