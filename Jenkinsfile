pipeline {
    agent any

    parameters {
        string(name: 'BRANCH_NAME', defaultValue: 'main', description: 'Branch to build')
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: "${params.BRANCH_NAME}", url: 'https://github.com/SiddheshPotdar77/MiniProject.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('Install Playwright Browsers') {
            steps {
                bat 'npx playwright install --with-deps'
            }
        }

        stage('Build (Optional)') {
            steps {
                script {
                    // Check if "build" script exists in package.json
                    def hasBuild = bat(script: 'npm run | findstr "build"', returnStatus: true) == 0
                    if (hasBuild) {
                        bat 'npm run build'
                    } else {
                        echo 'No build script found, skipping build stage.'
                    }
                }
            }
        }

        stage('Run Smoke Tests') {
            steps {
                bat 'npx playwright test --project=smoke'
            }
        }

        stage('Run Sanity Tests') {
            steps {
                bat 'npx playwright test --project=sanity'
            }
        }

        stage('Publish Test Results') {
            steps {
                junit 'test-results/results.xml'
                archiveArtifacts artifacts: 'playwright-report/**', fingerprint: true
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
