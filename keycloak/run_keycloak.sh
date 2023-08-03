#!/bin/bash

docker run  -v `pwd`/data:/opt/keycloak/data/h2 -p 8080:8080 -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin quay.io/keycloak/keycloak:22.0.1 start-dev