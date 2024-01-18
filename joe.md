## Problem
#### Spending unecessary money on EC2 instances because most users just use On-Demand instances and pay as they go instead of Spot instances

## Objective
#### Save money on cloud expenses by reducing the cost of EC2 instances (which are the main expenses in cloud infrastructure)

## How:
#### Use first principals thinking to breakdown all of the things involved into its features/components the build a solution for the objective from the ground up with the features and components available to us through the things were using.
#### For us, its EC2  instances / Kubernetes Nodes, Kubernetes Pods, EC2 spot instances
#### We break down EC2 instances into their features and components and figure out how we can use them to build a solution to save money on cloud expenses by reducing the cost of EC2 instances

---

### EC2 Features / Components

_AutoScalingGroup_: a service that lets you define certain rules that trigger horizontal scaling

_Fleet_: a group of ec2 instances that automatically does horizontal scaling based on cost and pricing model

_Lowest Bid_: a strategy where can bid on spot instances at the exact price aws sets them at which is as low as it can go

- Used together the fleet can scale to make sure we only use spot instances while the asg can scale to make sure we always have enough cpu to handle requests

- Exp: our fleet will only use spot instances in order to get the biggest discount on ec2 usage. Our autoscaling group will make sure that we always have at least 10 cpu available between our instances

- Our spot instance will be bought at the minimum price aws sets for those instances when they become available

- This way fleet will always make sure we’re only using spot instances, lowest bid will make sure we always pay the lowest possible price for a instances and we use asg to make sure we always have enough at least 10 cpu available to handle our traffic

_Volumes_: like a flash drive for our ec2 instances, it hold all our installations, softwares and folders from the ec2 instance connected to

EC2 pricing models
- On demand - Most popular, standard use case where you pay as you go

- Reserved - you pay for full access, up front for 1-3 yrs in advance and get a discount

- Savings - you pay for a certain amount of hrs at a certain rate, up front for 1-3 yrs in advance and get a discount

- Dedicated - you pay for exclusive access to a physical server in their data center either up front in full, partial or per hour.

- Spot - you pay to use the extra capacity that isn’t being used by aws


EC2 Families

- EC2s come in different families and those families serve different purposes.
- T: general purpose (t2) (burstable)
- M: memory optimized (m5)
- X: super memory optimized
- S: storage optimized
- C: compute/cpu optimized
- Z: super compute/cpu optimized 
- P: gpu optimized (ai/ml, graphics)


### Kubernetes
We have our app
We containerize our app
We form pods from our containers
Our pods run on Nodes
Our Nodes are just on-demand EC2 instances with stuff that Kubernetes automatically installs on it to help orchestrate the containers inside the pods. 

Kubernetes Diagram: https://drive.google.com/file/d/10QKymeVupq8Enh-yAWR6qQwfj1LFL2pE/view?usp=sharing

### SOLUTION: So instead of paying the On-Demand price for the EC2 instances in Kubernetes cluster, we can use spot instances and run our Kubernetes cluster for a lot cheaper, most times at least half of what the current cost is

### NEW PROBLEM: Spot instances can be repossessed at any given time that AWS decides they need them back. This means that as our pods are running on Spot Instances, AWS can stop our instances and disrupt the users using our app. 


GO BACK TO FIRST PRINCIPALS THINKING

Spot Instance Features:
Termination risk warning: A warning that AWS SOMETIMES sends to an EC2 instance endpoint that warns us that the Spot Instance we’re using will possibly be terminated, usually 5-8 minutes before they actually start the termination process. 

Termination notice: A notice that AWS ALWAYS sends to an EC2 instance endpoint that warns us that the Spot Instance we’re using WILL be terminated in exactly 2 minutes


### NEW SOLUTION: Create a system that automates the process of responding to Spot Instance termination notices by providing a replacement for the terminated Spot Instance within the 2 minutes AWS give us


OUR SOLUTION SYSTEM: 
<table>
  <tr>
    <th style="width: 600px;">Function</th>
    <th style="width: 50px;">Purpose</th>
    <th style="width: 50px;">Why/How</th>
  </tr>
  <tr>
    <td>Lambda Functions</td>
    <td>Temporarily run serverless functions in response to termination notices until the ASG finds us another Spot Instance to use</td>
   <td>Fastest option, can scale infinitely to temporarily cover the requests coming into our app, will automatically scale back down once the ASG finds us another Spot Instance to use </td>
  </tr>
  <tr>
    <td>Fargate Pods</td>
    <td>Temporarily run serverless Pods in response to termination notices until the ASG finds us another Spot Instance to use</td>
   <td>Since we already have the app containerized, if the container initialization time is within 2 minutes, we can use Fargate Pods. We just submit our Pods to Fargate and AWS handles the scaling and infrastructure for us until the ASG finds us another Spot Instance to use</td>
  </tr>
    <tr>
    <td>AutoScaling Pods</td>
    <td>Horizontally scale & keep a minimum amount of Pods running at all times</td>
  </tr>
  <tr>
    <td>Prioritized Pods</td>
    <td>Use Pod prioritization or "Dummy Pod strategy" to schedule Pods onto Nodes</td>
  </tr>
  <tr>
    <td>Warm Nodes</td>
    <td>Temporarily run Pods on pre-configured, pre-tainted, stopped, standby On-Demand Nodes</td>
  </tr>
  <tr>
    <td>Burstable Nodes</td>
    <td>Temporarily vertically scale  the T-family instances if we already have them in our cluster to meet workload requirements</td>
   <td>This can be a fast way for the instances to accept the AutoScaled Pods and handle the requests until the ASG finds us another Spot Instance to use </td>
  </tr>
</table>

Warm Nodes: https://github.com/djtoler2/Bio/tree/main

Pod prioritization: Tagging a Pod with a high priority. When a priority tagged Pod needs to be scheduled to run on an Instance, it’ll kick a low priority Pod off the Instance and take its place.

Dummy Pods: Placing empty Pods on a Instance and allocating resources to them, then running the Linux “pause” process to make those allocated resources available to everything else on the server
