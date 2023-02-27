PWD := ${CURDIR}
NAME=backstage
TAG?= dev
REGISTRY=localhost:5000

image:
	docker build -t $(NAME):$(TAG) .
push: image
	docker tag $(NAME):$(TAG) mmrxx/$(NAME):$(TAG)
	docker push mmrxx/$(NAME):$(TAG)
