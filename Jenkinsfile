pipeline {
    agent any

    environment {
        // Define the Docker image name
        IMAGE_NAME = 'cook-county-dashboard:latest'
        CONTAINER_NAME = 'cook-county-dashboard'
    }

    stages {
        stage('Build') {
            steps {
                script {    
                    // Build the Docker image locally, replacing the old image
                    sh "docker build -t $IMAGE_NAME ."

                    // Optional: Remove untagged (dangling) images
                    sh '''
                        dangling_images=$(docker images -f "dangling=true" -q)
                        if [ -n "$dangling_images" ]; then
                            docker rmi $dangling_images
                        fi
                    '''
                }
            }
        }


        stage('Deploy') {
            steps {
                script {
                    // Stop and remove any running container with the same name as the image
                    sh '''
                        CONTAINER=$(docker ps -aq -f "ancestor=$CONTAINER_NAME")
                        if [ ! -z "$CONTAINER" ]; then
                            docker stop $CONTAINER
                            docker rm $CONTAINER
                        fi
                        docker ps -a -q -f "name=$IMAGE_NAME" | xargs -I {} docker rm -f {}
                    '''
                    // Run the new container
                    sh 'docker run -d -p 3000:3000 --name $IMAGE_NAME $IMAGE_NAME'
                }
            }
        }
    }

    post {
        always {
            // Clean up workspace after build
            cleanWs()
        }
    }
}
