pipeline {
    agent any

    // ── Environment ───────────────────────────────────────────────────────────
    environment {
        // DockerHub — Jenkins Credentials ID: "dockerhub-credentials" (Username+Password)
        // Automatically creates: DOCKERHUB_CREDENTIALS_USR + DOCKERHUB_CREDENTIALS_PSW
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')

        // Build-specific tag so every build has a unique image, 'latest' also updated
        IMAGE_TAG = "${BUILD_NUMBER}"
    }

    // ── Options ───────────────────────────────────────────────────────────────
    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 30, unit: 'MINUTES')
        timestamps()
    }

    // ── Stages ────────────────────────────────────────────────────────────────
    stages {

        // ── 1. Checkout ───────────────────────────────────────────────────────
        stage('Checkout') {
            steps {
                echo '📥 Checking out source code...'
                checkout scm
            }
        }

        // ── 2. SonarQube Code Quality Analysis ───────────────────────────────
        stage('SonarQube Analysis') {
            steps {
                echo '🔍 Running SonarQube static code analysis...'
                // 'SonarQube' must match the server name in:
                // Jenkins → Manage Jenkins → Configure System → SonarQube servers
                withSonarQubeEnv('SonarQube') {
                    sh '/opt/sonar-scanner/bin/sonar-scanner'
                }
            }
        }

        // ── 3. Quality Gate ───────────────────────────────────────────────────
        stage('Quality Gate') {
            steps {
                echo '🚦 Waiting for SonarQube Quality Gate result...'
                // Fails the build if code quality falls below the configured threshold
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        // ── 4. Build Docker Images ────────────────────────────────────────────
        stage('Build Docker Images') {
            steps {
                echo "🐳 Building Docker images with tag: ${IMAGE_TAG}"
                sh """
                    # Build client (React → Nginx, multi-stage)
                    docker build -t ${DOCKERHUB_CREDENTIALS_USR}/expenses-client:${IMAGE_TAG} \\
                                 ./app/client/

                    # Build server (Node.js Express API)
                    docker build -t ${DOCKERHUB_CREDENTIALS_USR}/expenses-server:${IMAGE_TAG} \\
                                 ./app/server/

                    # Also tag as 'latest' so docker-compose default works
                    docker tag ${DOCKERHUB_CREDENTIALS_USR}/expenses-client:${IMAGE_TAG} \\
                                ${DOCKERHUB_CREDENTIALS_USR}/expenses-client:latest
                    docker tag ${DOCKERHUB_CREDENTIALS_USR}/expenses-server:${IMAGE_TAG} \\
                                ${DOCKERHUB_CREDENTIALS_USR}/expenses-server:latest
                """
            }
        }

        // ── 5. Push to DockerHub ───────────────────────────────────────────────
        stage('Push to DockerHub') {
            steps {
                echo '📤 Pushing images to DockerHub...'
                sh """
                    echo "${DOCKERHUB_CREDENTIALS_PSW}" | docker login -u "${DOCKERHUB_CREDENTIALS_USR}" --password-stdin

                    docker push ${DOCKERHUB_CREDENTIALS_USR}/expenses-client:${IMAGE_TAG}
                    docker push ${DOCKERHUB_CREDENTIALS_USR}/expenses-server:${IMAGE_TAG}
                    docker push ${DOCKERHUB_CREDENTIALS_USR}/expenses-client:latest
                    docker push ${DOCKERHUB_CREDENTIALS_USR}/expenses-server:latest
                """
            }
        }

        // ── 6. Deploy to App EC2 via Ansible ──────────────────────────────────
        stage('Deploy to App EC2') {
            steps {
                echo '🚀 Deploying app to App EC2 via Ansible...'
                // 'ansible-vault-password' — Jenkins Credentials ID: Secret file
                //   → the plain text vault password saved as a file credential
                // 'ssh-private-key'        — Jenkins Credentials ID: SSH Username with private key
                //   → the cloud_devops_keypair_26.pem key
                withCredentials([
                    file(credentialsId: 'ansible-vault-password', variable: 'VAULT_PASS_FILE'),
                    sshUserPrivateKey(
                        credentialsId: 'ssh-private-key',
                        keyFileVariable: 'SSH_KEY_FILE',
                        usernameVariable: 'SSH_USER'
                    )
                ]) {
                    sh """
                        # Place the SSH key where ansible.cfg expects it
                        mkdir -p ~/.ssh
                        cp "${SSH_KEY_FILE}" ~/.ssh/cloud_devops_keypair_26.pem
                        chmod 600 ~/.ssh/cloud_devops_keypair_26.pem

                        # Run the deploy playbook
                        ansible-playbook \\
                            -i ansible/inventory/hosts.ini \\
                            ansible/playbooks/deploy-app.yml \\
                            --vault-password-file "${VAULT_PASS_FILE}" \\
                            -e "image_tag=${IMAGE_TAG}"
                    """
                }
            }
        }
    }

    // ── Post-build ─────────────────────────────────────────────────────────
    post {
        success {
            echo "✅ Build #${BUILD_NUMBER} succeeded — image tag: ${IMAGE_TAG}"
        }
        failure {
            echo "❌ Build #${BUILD_NUMBER} failed. Check the logs above."
        }
        always {
            // Always logout from DockerHub and clean workspace
            sh 'docker logout || true'
            cleanWs()
        }
    }
}
