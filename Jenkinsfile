pipeline {
    agent any

    environment {
        // Define the Docker image name
        IMAGE_NAME = 'cook-county-dashboard'
    }

    stages {
        stage('Build') {
            steps {
                script {
                    // Build the Docker image locally
                    sh 'docker build -t $IMAGE_NAME .'

                    // Delete Dangling Images
                    sh '''
                        IMAGE_IDS=$(docker images -f "dangling=true" -q)
                        if [ ! -z "$IMAGE_IDS" ]; then
                            docker rmi $IMAGE_IDS
                        else
                            echo "No dangling images to remove."
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
                        CONTAINER_NAME=$(docker ps -aq -f "ancestor=$IMAGE_NAME")
                        if [ ! -z "$CONTAINER_NAME" ]; then
                            docker stop $CONTAINER_NAME
                            docker rm $CONTAINER_NAME
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
