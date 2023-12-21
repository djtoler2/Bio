## Higher Resilience, Lower Costs: Maintaining Cost-Efficient System Resilience using Kubernetes on AWS

##### From startups to established enterprises, the need for highly available, fault tolerant systems is universal. 

##### Leveraging AWS and Kubernetes allows us to achieve that while actually lowering the cost of the machines we run our workload on

##### We'll start by designing fault tolerance into our application infrastructure at every level using AWS and then dramatically slash the costs by strategically running cost optimized workloads in Kubernetes

________________________________________________

### _Fault Tolerance and High Availability_
_________________________________________________

#### _Application / Container level_

> ##### Establish a stable, containerized, master version of our application. This will allow us to fallback to a trusted fully functioning version of our app incase of any errors at the applicatioin code level. This is where stratagies like canary and rollback deployments come in handy.

#### _Pod level_

> ##### We establish a minimim number of pods in our deployment.yaml file. The Kubernetes scheduler component will always make sure we have at least that designated amount of pods on our nodes.

> ##### We identify resource utilization.

> ##### For fluctuating workloads, we implement HPA for horizontal Pod autoscaling to set a maximum number of Pods for us to scale to. Kubernetes can use the Metrics server to scale out based on resource utilization thresholds and scale back in towards our minimum amount. This gives us a balance of high availability by scalng out and cost-efficency by scaling in.

> ##### For our consistent, predictable workloads, we can implementy VPA, vertical Pod autoscaling. This will increase the amount of resources our Pods have access to and allow us to allocate those resources specifically for those workloads. Again, gving us high availability with scaling up and we monitor the resource consumption by tracking metrics from the Metrics server to stay on top of cost efficiency.

#### _Node level_

> ##### We can scale our resources at the node level by using Karpenter, Cluster Autoscaler or a customized scaling plan based on metrics reported by the Metrics server

> ##### _Karpenter_: Using Karpenter, we get a high level of cost efficiency by having our Nodes scaled dynamically based on the needs of unscheduled Pods. For example, at the Pod level, lets say we have a 10 Pod maximim set in our HPA yaml file. As requests to our application increases, our Pods will start to scale out but will be unscheduled since we're running our Node implementations very lean. Once Karpentar sees unscheduled Pods, it'll provision additional strategically configured Nodes for the Pods to run on.

> #### _Cluster Auto Scaler_: With Cluster Auto Scaler, we get similar functionality. Using the same example of incoming requests triggering HPA to scale out our Pods, CAS will pick up on this just like Karpentar but will instead select a Node from a pre-defined Node group, that the unscheduled Pods can run on.

> ##### _Custom Scaliing Plan_: We can also use a custom scaling plan that we implement ourselves. In this scenario, we can create Node groups that match our Pod specifications. We'll use Taints to repel all Pods except the ones we want to run on those specific Nodes and we'll use Tolerations on those Pods so they can be allowed onto the Tainted Nodes. After configuring and starting the Nodes, we'll turn them off, keeping them in a standby state until a threshold is reported by Metrics server and we'll use a script to start them automatically. This strategy optimizing costs while keeping that high availability by having "warm" Nodes ready to deploy.

#### _Availability Zone level_

> ##### Our infrastructure will built on AWS, utilizing at least 2 availability zones. This will provide us with high availability at the AZ level. If a AZ goes down, we have our EKS load balancer that will reroute requests to the AZ thats available, protecting us from Amazon data center outages that we dont have control over. We can have CloudWatch alarms set to detect this and have them trigger a Lambda function that will invoke a Terraform script to create infrastructure in another AZ, getting us back up to our 2 AZ requirement

#### _Region level_

> ##### In a rare case of a Region outage, where all AZs are unavailable, we have can fail over to our second region and send all of our requests there. Using AWS Global Accelerator gives us access to this functionality by applying a static IP address to both our regional load balancers and automatically rerouting requests from unhealthy enpoints. As requests to the resources in our 2nd region increases, our Node and Pod level scaling stratagies will kick in to facilitate those requests

> ##### This setup gives us fault tolerance and high availability from the Application/Container level, all the way our to the Regions our application runs in.

________________________________________________

### _Cost Optimization_
_________________________________________________

##### Now that we've built a resilliect application architecture, how do we do it as cost-effectivly as possible?

##### By far the biggest way to save money on our resilient archutecture is to strategically run our workloads on spot instances instead of on-demand instances. 

##### Spot instances can offer discounts up to 90% & beyond, compared to on-demand instances. With spot instances, we are allowed to buy AWSs unused ec2 capacity at deep discounts. 

##### For example, if we’re using on-demand t2.medium Nodes in our Kubernetes cluster, each node would cost us about $45 per month. With a total of 6 nodes for our frontend, backend and database application tiers, we’d spend about $270. 

##### Using spot instances, each Node would cost us about $10 per month and the same cluster configuration would cost us about $60 instead of $270.  

##### This is a cost savings of over 300%

##### But.....

##### That huge savings potentially comes at a cost of availability. 

##### At any moment, AWS can repossess these spot instances from us since we’re simply paying for discounted unused ec2 capacity that they may need to utilize at any moment.  This means that while a workload is in the middle of running on a spot instance, it can be disrupted if AWS needs it back.

##### However, with some preemptive strategic planning, we can benefit from all of the cost savings of spot instances while still keeping our application highly available.

##### When AWS needs to repossess a spot instance they send out a 2 minute warning. This gives us plenty of time to solve this repossession problem if we use automation and strategic Node scheduling. 

##### Heres how to do it...

##### _Monitor termination notices_: 
> ##### AWS recommends us to poll the termination endpoint at least every 5 seconds. We do this to get immediate notice of a pending termination.

##### _Use preStop Hook_: 
> ##### Once we’re aware of a termination notice, our preStop Hook script will run. This script will make sure to save a users session and save all critical data to our isolated db. 

##### _Taint the Node_: 
> ##### We’ll automatically taint the node, which will cause the current Pods to be evicted and avoid additional Pods from being scheduled on it. The state of the Node will change to NotReady, which will cause the load balancer to stop sending requests to it. When the users on that Node interact with our app, the load balancer will send their next request to a different Node in our cluster

##### _Reschedule Pods_: 
> ##### If there are other Nodes in our cluster available to take the Pods, the Kubernetes scheduler will place the Pods there.

##### _Deploy warm Node_: 
> ##### If no other Nodes in the cluster can accept the Pod, we’ll start our warm instance and allow the Pod to be scheduled onto it

##### Using this preemptive Node scheduling strategy, we keep our application highly available while still benefiting from the huge cost savings of spot instances running inside a multi-level fault tolerant infrastructure.
