pipeline {
    agent any

    options {
        timestamps()
        timeout(time: 30, unit: 'MINUTES')
    }

    environment {
        // Building the frontend pulls in @playwright/test; don't download browsers during CI install.
        PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD = '1'
    }

    stages {
        stage('Backend: build') {
            steps {
                dir('backend') {
                    sh 'chmod +x mvnw'
                    sh './mvnw -B -q -DskipTests package'
                }
            }
            post {
                success {
                    archiveArtifacts artifacts: 'backend/target/*.jar', fingerprint: true
                }
            }
        }

        stage('Frontend: build') {
            steps {
                dir('frontend') {
                    sh 'node --version && npm --version'
                    sh 'npm ci'
                    sh 'npm run lint'
                    sh 'npm run build'
                }
            }
        }
    }

    post {
        success { echo 'CI pipeline succeeded.' }
        failure { echo 'CI pipeline failed.' }
    }
}
