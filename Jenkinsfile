pipeline {
    agent any

    environment {
        // Define the Docker image name
        IMAGE_NAME ='cook-county-dashboard:latest'  // Change this to your Docker image name
        CONTAINER_NAME = 'cook-county-dashboard' // Change this to your Docker container name
        PORT = '3000'
    }

    stages {
        stage('Build') {
            steps {
                script {
                    // Build the Docker image locally
                    sh 'docker build -t $IMAGE_NAME .'
                }
            }
        }


        stage('Deploy') {
            steps {
                script {
                    // Stop and remove any running container with the same name as the image
                    sh '''
                        CONTAINER=$(docker ps -aq -f "ancestor=$IMAGE_NAME")
                        if [ ! -z "$CONTAINER" ]; then
                            docker stop $CONTAINER
                            docker rm $CONTAINER
                        fi
                        docker ps -a -q -f "name=$CONTAINER_NAME" | xargs -I {} docker rm -f {}
                    '''
                    // Run the new container
                    sh 'docker run -d -p $PORT:$PORT --name $CONTAINER_NAME $IMAGE_NAME'
                }
            }
        }
    }
    post {
        always {
            // Clean up workspace after build
            cleanWs()
        }
        // failure {
        //     script {
        //         def failedStage = env.FAILED_STAGE
        //         def failureReason = env.FAILED_MESSAGE

        //         emailext(
        //             to: 'markyasser2011@gmail.com',
        //             subject: "Pipeline Failure - Stage: ${failedStage}",
        //             body: """
        //                 <html>
        //                     <body>
        //                         <h2 style="color: #E74C3C;">Pipeline Failed!</h2>
        //                         <p>Dear Team,</p>
        //                         <p>The pipeline failed during the <strong>${failedStage}</strong> stage.</p>
        //                         <h3 style="color: #C0392B;">Failure Details:</h3>
        //                         <pre>${failureReason}</pre>
        //                         <p>Please investigate the issue at your earliest convenience.</p>
        //                         <p>Best regards,<br>Your CI/CD System</p>
        //                     </body>
        //                 </html>
        //             """
        //         )
        //     }
        //     echo 'Pipeline execution failed'
        // }
    }
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
