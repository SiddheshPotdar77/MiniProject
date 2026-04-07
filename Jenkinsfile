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

        stage('Build') {
            steps {
                bat 'npm run build'
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
}
