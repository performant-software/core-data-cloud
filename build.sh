#!/bin/bash
set -e

echo "Building image"

docker build \
       --file Dockerfile-ecds \
       --build-arg AUTHENTICATION_EXPIRATION=$AUTHENTICATION_EXPIRATION \
       --build-arg DATABASE_HOST=$DATABASE_HOST \
       --build-arg DATABASE_NAME=$DATABASE_NAME \
       --build-arg DATABASE_PASSWORD=$DATABASE_PASSWORD \
       --build-arg DATABASE_PORT=5432 \
       --build-arg DATABASE_USERNAME=$DATABASE_USERNAME \
       --build-arg HOSTNAME=$HOSTNAME \
       --build-arg IIIF_CLOUD_API_KEY=$IIIF_CLOUD_API_KEY \
       --build-arg IIIF_CLOUD_PROJECT_ID=$IIIF_CLOUD_PROJECT_ID \
       --build-arg IIIF_CLOUD_URL=$IIIF_CLOUD_URL \
       --build-arg REACT_APP_IIIF_MANIFEST_ITEM_LIMIT=$REACT_APP_IIIF_MANIFEST_ITEM_LIMIT \
       --build-arg REACT_APP_MAP_TILER_KEY=$REACT_APP_MAP_TILER_KEY \
       --build-arg SECRET_KEY_BASE=$SECRET_KEY_BASE \
       --build-arg TYPESENSE_API_KEY=$TYPESENSE_API_KEY \
       --build-arg TYPESENSE_SEARCH_KEY=$TYPESENSE_SEARCH_KEY \
       -t core-data-cloud \
       .

echo "Logging in to AWS"
aws ecr get-login-password --region us-east-1 | \
docker login --username AWS --password-stdin "${AWS_ECR}"
echo "Logged in successfully"

echo "Tagging image with latest"
docker tag core-data-cloud "${AWS_ECR}/core-data-cloud:latest"

echo "Pushing image"
docker push "${AWS_ECR}/core-data-cloud:latest"

echo "Pushed succesfully"
