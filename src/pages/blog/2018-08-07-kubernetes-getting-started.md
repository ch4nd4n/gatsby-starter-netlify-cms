---
templateKey: blog-post
title:  "Kubernetes: Getting started"
date:   2018-08-07 02:36:22
tags: 
  - programming
---

# Kubernetes

Kubernetes is an open-source system for automating deployment, scaling, and management of containerized applications.

This article covers use of KOPS to setup a Kubernetes cluster and is a follow up of [kops/aws.md](https://github.com/kubernetes/kops/blob/master/docs/aws.md). 

Follow the instruction at [kops/install.md](https://github.com/kubernetes/kops/blob/master/docs/install.md) to install KOPS cli.

> All references to example.com or example.in or DOMAINNAME.TLD or whatever, needs to be replaced with relevant domain, subdomain or tld. Like example.com or nginx.example.com
> 

In addition, one needs access to the following.

* AWS Access
  * Install AWS cli
  * Configure AWS access key and secret.
  * Optional: create a kops user.
* kops installed. Refer to KOPS installation guide relevant to OS.
* kubectl installed
* Optional: configure DNS
  * Mucking around with root domain does not require any work.
* configure s3 for state store
* build cluster
* deploy docker container

### Steps for creating Kubernetes cluster

You need aws cli installed and set up key secret of a user which has admin access. This makes things easy, or at least have the following access.

> AmazonEC2FullAccess
> AmazonRoute53FullAccess
> AmazonS3FullAccess
> IAMFullAccess
> AmazonVPCFullAccess

```sh
export AWS_ACCESS_KEY_ID=$(aws configure get aws_access_key_id)
export AWS_SECRET_ACCESS_KEY=$(aws configure get aws_secret_access_key)
```

Configuring DNS is optional. These steps in reference to user having access to Route53 and meddling around with root domain.

If you have have a valid Domain following command should give relevant response.

```sh
dig ns subdomain.example.com
```

#### Cluster state storage

```sh
aws s3api create-bucket \
    --bucket prefix-example-com-state-store \
    --region us-west-2a
```

change `us-east-1` to whatever region you want to associate it to. I believe it is irrelevant in case of S3.

#### Create cluster

```sh
export NAME=kluster.example.com
export KOPS_STATE_STORE=s3://prefix-example-com-state-store

kops create cluster \
    --zones us-west-2a \
    ${NAME}
kops update cluster ${NAME} --yes
```

At this point if everything went through without any errors. You should have a working kubernetes cluster.

To verify 

```sh
kubectl get nodes
kops validate cluster
kubectl -n kube-system get po
```

Above should return some valid stuff. To undo whatever has been done so far.

```sh
kops delete cluster --name ${NAME} --yes
```

> Sometimes delete cluster may not work, especially if you have muddled around with some settings 
> on AWS. For eg. launched an EC2 instance or made some change to Route53 or made some change to security group. 
> You can knock of the relevant entry that kops complain about and try the command again.
> 

Moving on to deploy something useful. Lets deploy nginx and expose it as nginx.example.com

To do this, we need to install external DNS. Make a copy of yaml file to your local and put it in subfolder deployment.

> Refer to yaml files addressed here on [this gist](https://gist.github.com/ch4nd4n/aa502e455ae1fa561d83a998852e72f4).

```sh
kubectl apply -f deployments/external-dns.yaml
```

Verify that there are no error in the logs. If you get any error, you may have to manually grant Route53 full access to security group, something like `nodes.example.com` or `master.example.com` check `iam` section, it would have created a couple of new iam group/user/policies.

```sh
kubectl logs -f $(kubectl get po -l app=external-dns -o name)
```

### Deploy nginx

To deploy nginx on kubernetes

```sh
kubectl create -f deployments/nginx.yaml
```

After sometime, (may be a up to 5 minutes) you should be able to open nginx.example.com in browser.

```
kubectl get nodes --show-labels
kubectl config view
kubectl get deployments 
kubectl get svc
kubectl get ing 
```

### Kubernetes Dashboard

> Get admin passsword from `kubectl config view`

```
kubectl create -f deployments/kubernetes-dashboard.yaml
kubectl apply -f deployments/kube-dashboard-access.yaml
```

Access UI at something like https://api.kluster.example.com

### External DNS

> Need to grant Route53 permissions to IAM role `nodes.kluster.example.com` something like that. 
> Do this from AWS console. Something like [](https://console.aws.amazon.com/iam/home?region=us-west-2#/roles) note that region depends on what region cluster is deployed.
> 

```
kubectl apply -f deployments/external-dns.yaml
kubectl logs -f $(kubectl get po -l app=external-dns -o name)
```

### Private repo

```sh
kubectl create secret docker-registry regcred --docker-server=https://index.docker.io/v1/ --docker-username=DOCKER_USERNAME --docker-password=DOCKER_PASSWORD --docker-email=EMAIL@EXAMPLE.COM
kubectl get secret regcred --output="jsonpath={.data.\.dockerconfigjson}" | base64 -D
```
### Papertrail

```sh
kubectl create secret generic papertrail-destination --from-literal=papertrail-destination=syslog://logs2.papertrailapp.com:YOUR_PORT
kubectl create -f https://help.papertrailapp.com/assets/files/papertrail-logspout-daemonset.yml
```

## Few other things just for reference.

Below are some of the notes I made while getting my hands dirty with Kubernetes.

```sh
# Optional
ID=$(uuidgen) && aws route53 create-hosted-zone --name k10s.example.in --caller-reference $ID | \
    jq .DelegationSet.NameServers

# Optional
aws route53 list-hosted-zones | jq '.HostedZones[] | select(.Name=="example.in.") | .Id'

# Optional
aws route53 change-resource-record-sets \
 --hosted-zone-id YOUR_HOSTED_ZONE_ID \
 --change-batch file://subdomain.json

# Optional
dig ns k10s.example.in

# Mandatory
aws s3api create-bucket \
    --bucket k10s-example-in-state-store \
    --region us-east-1

# Mandatory
export NAME=kluster.example.in
export KOPS_STATE_STORE=s3://k10s-example-in-state-store

kops create cluster \
    --zones us-west-2a \
    ${NAME}

# Optional
kops edit cluster ${NAME} # For editing configs

kops update cluster ${NAME} --yes
```

> Below is output
> Suggestions:
> * validate cluster: kops validate cluster
> * list nodes: kubectl get nodes --show-labels
> * ssh to the master: ssh -i ~/.ssh/id_rsa admin@api.kluster.example.in
> * the admin user is specific to Debian. If not using Debian please use the appropriate user based on your OS.
 > * read about installing addons at: https://github.com/kubernetes/kops/blob/master/docs/addons.md.
 > 

### Deploy Kubernetes UI

[Web UI (Dashboard) - Kubernetes](https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/#deploying-the-dashboard-ui)

```sh
kubectl create -f https://raw.githubusercontent.com/kubernetes/dashboard/master/src/deploy/recommended/kubernetes-dashboard.yaml
kubectl proxy
kubectl delete -f deployments/kube-dashboard-access.yaml
```

kube-dashboard-access.yaml

```yml
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: ClusterRoleBinding
metadata:
  name: kubernetes-dashboard
  labels:
    k8s-app: kubernetes-dashboard
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cluster-admin
subjects:
- kind: ServiceAccount
  name: kubernetes-dashboard
  namespace: kube-system
```

### Important commands

```sh
kops validate cluster
kubectl get nodes
kubectl -n kube-system get po
kubectl cluster-info

kubectl run --image=nginx nginx-app --port=80

kubectl expose deployment nginx-app --port=80 --name=nginx-http
```

------------

```
kubectl version
kubectl get nodes
kubectl run kubernetes-bootcamp --image=gcr.io/google-samples/kubernetes-bootcamp:v1 --port=8080
kubectl get deployments
kubectl proxy # Another terminal
curl http://localhost:8001/version
echo $POD_NAME 
curl http://localhost:8001/api/v1/namespaces/default/pods/$POD_NAME/proxy/
kubectl logs $POD_NAME
kubectl exec $POD_NAME env
kubectl exec -ti $POD_NAME bash
cat server.js
```
------------

```
kubectl run --image=nginx nginx-app --port=80 --env="DOMAIN=k10s.example.in"
kubectl cluster-info
kubectl get nodes
kubectl get deployment
kubectl get pods
kubectl expose deployment nginx-app --type=LoadBalancer
kubectl get services
kubectl run docker-node-express --replicas=2 --labels="run=load-balancer-example" --image=ch4nd4n/docker-node-express --port=3000
kubectl get deployments
kubectl get deployments docker-node-express 
kubectl describe deployments docker-node-express
kubectl expose deployment docker-node-express --type=LoadBalancer --name=docker-node-express-service
kubectl get services docker-node-express-service
kubectl describe services docker-node-express-service
kubectl delete services docker-node-express-service
kubectl delete deployment docker-node-express
```


`LoadBalancer Ingress:` will contain the address to look for

> Updating a build using yaml file
> 

```sh
kubectl cluster-info
# kubectl set image deployments/docker-node-express docker-node-express=ch4nd4n/docker-node-express:1.0.0
kubectl create -f deployments/docker-node-app.yaml
kubectl scale deployment/docker-node-express-deployment --replicas=3
kubectl replace -f deployments/docker-node-app.yaml --force
kubectl expose deployment docker-node-express-deployment --type=LoadBalancer --name=docker-node-express-service
kubectl delete -f deployments/docker-node-app.yaml
kubectl delete service docker-node-express-service

kubectl logs -f $(kubectl get po -l app=external-dns -o name)
```


