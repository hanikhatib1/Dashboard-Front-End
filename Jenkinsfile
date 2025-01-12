pipeline {
    agent any
    environment {
        // Define the Docker image name
        IMAGE_NAME = 'cook-county-dashboard:latest'
        CONTAINER_NAME = 'cook-county-dashboard'
        PORT = 3000
    }
    stages {
        stage('Build Docker Image') {
            steps {
                script {
                    try {
                        // Build the Docker image locally
                        sh 'docker build -t $IMAGE_NAME .'
                    } catch (Exception e) {
                        setErrorTimestampAndMessage('Build Docker Image', '', e)
                        error("Stage failed: ${env.FAILED_STAGE}") // Mark the stage as failed
                    }
                }
            }
        }
        
        stage('Remove old Containers') {
            steps {
                script {
                    try {
                        // Stop and remove any running container with the same name as the image
                        sh '''
                            CONTAINER=$(docker ps -aq -f "ancestor=$IMAGE_NAME")
                            if [ ! -z "$CONTAINER" ]; then
                                docker stop $CONTAINER
                                docker rm $CONTAINER
                            fi
                            docker ps -a -q -f "name=$CONTAINER_NAME" | xargs -I {} docker rm -f {}
                        '''
                    } catch (Exception e) {
                        setErrorTimestampAndMessage('Remove old Containers',' Probably trying to remove running container', e)
                        error("Stage failed: ${env.FAILED_STAGE}") // Mark the stage as failed
                    }
                }
            }
        }
        stage('Run Docker Container') {
            steps {
                script {
                    try {
                        // Run the new container
                        sh 'docker run -d -p $PORT:$PORT --name $CONTAINER_NAME $IMAGE_NAME'
                    } catch (Exception e) {
                        setErrorTimestampAndMessage('Run Docker Container', 'Probably container with the same name is already running', e)
                        error("Stage failed: ${env.FAILED_STAGE}") // Mark the stage as failed
                    }
                }
            }
        }
       
    }
    post {
        always {
            // Clean up workspace after build
            cleanWs()
        }
        failure {
            script {
                def failedStage = env.FAILED_STAGE ?: "Unknown"
                def failureReason = env.FAILED_MESSAGE ?: "No estimation."
                def failureEstimation = env.FAILURE_ESTIMATION ?: "Unknown timestamp."
                def errorTimestamp = env.ERROR_TIMESTAMP ?: "Unknown timestamp."

                emailext(
                    to: '$DEFAULT_RECIPIENTS',
                    subject: '$DEFAULT_SUBJECT',
                    body: """
                        <html>
                            <body>
                                <h2 style="color: #E74C3C;">Pipeline Failed!</h2>
                                <p>Dear Team,</p>
                                <p>The pipeline failed during the <strong>${failedStage}</strong> stage.</p>
                                <h3 style="color: #C0392B;">Failure Details:</h3>
                                <p><strong>Timestamp :</strong> ${errorTimestamp}</p>
                                <p><strong>Failure Message :</strong></p>
                                <pre>${failureReason}</pre>
                                <p><strong>Estimated Failure Reason :</strong></p>
                                <pre>${failureEstimation}</pre>
                                <p>Please investigate the issue at your earliest convenience.</p>
                                <p>Best regards,<br>Your CI/CD System</p>
                            </body>
                        </html>
                    """
                )
            }
            echo 'Pipeline execution failed'
        }
    }
}

import java.text.SimpleDateFormat
import java.util.TimeZone

def setErrorTimestampAndMessage(String stageName, String msg, Exception e) {
    // Set the failed stage and message
    env.FAILED_STAGE = stageName
    env.FAILED_MESSAGE = e.getMessage()
    env.FAILURE_ESTIMATION = msg

    // Set the timestamp with GMT+2 timezone
    TimeZone tz = TimeZone.getTimeZone("GMT+02:00")
    SimpleDateFormat sdf = new SimpleDateFormat("d/MM/yyyy h:mm a")
    sdf.setTimeZone(tz)
    env.ERROR_TIMESTAMP = sdf.format(new Date())
}
// pipeline {
//     agent any

//     environment {
//         // Define the Docker image name
//         IMAGE_NAME = 'cook-county-dashboard:latest'
//         CONTAINER_NAME = 'cook-county-dashboard'
//         PORT = 3000
//     }

//     stages {
//         stage('Build') {
//             steps {
//                 script {    
//                     // Build the Docker image locally, replacing the old image
//                     sh "docker build -t $IMAGE_NAME ."
//                 }
//             }
//         }


//         stage('Deploy') {
//             steps {
//                 script {
//                     // Stop and remove any running container with the same name as the image
//                     sh '''
//                         CONTAINER=$(docker ps -aq -f "ancestor=$CONTAINER_NAME")
//                         if [ ! -z "$CONTAINER" ]; then
//                             docker stop $CONTAINER
//                             docker rm $CONTAINER
//                         fi
//                         docker ps -a -q -f "name=$IMAGE_NAME" | xargs -I {} docker rm -f {}
//                     '''
//                     // Run the new container
//                     sh 'docker run -d -p $PORT:$PORT --name $CONTAINER_NAME $IMAGE_NAME'
//                 }
//             }
//         }
//     }

//     post {
//         always {
//             // Clean up workspace after build
//             cleanWs()
//         }
//     }
// }
