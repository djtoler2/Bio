### OBJECTIVE
- Reduce cost of Kubernetes clusters by running Pods on Spot VMs while ensuring minimum service disruption

### COMPONENTS 
- Load Balancer
- Pods
- Dummy Pods
- EBS Volumes
- Launch Templates
- Instance Type
- Spot Nodes
- OnDemand Nodes
- Warm OnDemand Nodes
- Burstable Nodes
- Spot Fleets
- AutoScalingGroup
- Client
- Server
- Database
- CostOp App
- Scheduler
- API Server
- Serverless Functions

### Component Models
- Load Balancer

  Distribute request amongst Nodes
- Pods
    Run the containers that process our requests, scale based on metrics and replica count
- Dummy Pods
    Occupy space on Nodes and have low priority 
- EBS Volumes
    Detached, cloned or pre-configured from a Spot Node currently being terminated & re-attached or synced to a warm, standby OnDemand Node
- Launch Templates
    Created programatically from each Spot Node and used to launch warm, standby OnDemand Nodes
- Instance Type
    While a Node is stopped, its instance type can be dynamically changed to match a terminating Spot Nodes instance type
- Spot Nodes
    Run Pods at lowest cost and get reposseded when cloud provider needs them back
- OnDemand Nodes
    Run Pods at set cost 
- Warm OnDemand Nodes
    Run Pods at set cost and stay on standby (preconfigured, pre-tainted) to replace terminated Nodes
- Burstable Nodes
    Run Pods at set cost with limited or unlimited dynamic resource provisioning
- Spot Fleets
    A collection of Spot instances we can  strategically configure based on price, resource aggregation, avaiability, location, type..
- AutoScalingGroup
    Horizontally scale Nodes or Spot Fleets to match desired Spot Node or Spot Fleet availability with current availability 
- Client
    Monnitors Spot Nodes for termination notices by polling, update Redis and notifies Server
- Server
    Get data from Redis, run termination response functions
- Database
    Stores the Cluster, Pod & Node data
- CostOp App
    Run the Client/Server APIs, update Redis
- Scheduler
    Place newly created Pods on qualifying Nodes
- API Server
    Allow Server to get Node & Pod data
- Serverless Functions
    Instantly accepts rerouted requests from terminated Nodes

### Interactions
-Internal
-- CostOp App/Client & Database
-- CostOp App & API Server
-- CostOp App/Server & Database
-- CostOp App/Server & Pods
-- CostOp App/Server & Dummy Pods
-- CostOp App/Server & Load Balancer
-Internal*
-- Scheduler & Controllers
-- Kublet & CAdvisor
-- Kublet & PLEG
-- Kublet & Sync
-- Kubet & CRI
-External
-- CostOp App/Client & Spot Nodes
-- CostOp App/Server & Serverless Functions
-- CostOp App/Server & OnDemand Nodes

### Requirements
-Functional
--Run Pods on Spot Nodes with no downtime
---Scheduling new Pods as fast as possible
---Making Nodes available for Pods to run on as fast as possible
---Getting termination notice updates as fast as possible
---Updating database
---Running termination response logic stabalize request handling within 2 minutes
-NonFunctional
--Termination response logic must have requests successfully re-routed within 2 minutes with no downtime 

