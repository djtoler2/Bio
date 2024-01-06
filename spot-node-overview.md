### OBJECTIVE
- Reduce cost of Kubernetes clusters by running Pods on Spot VMs while ensuring minimum service disruption

### SYSTEM COMPONENTS
* Load Balancer
  ##### _Distribute requests amongst Nodes_

- Pods
  #####  _Run the containers that process our requests, scale based on metrics and replica count_

- Dummy Pods
   ##### _Occupy space on Nodes and have low priority _

- EBS Volumes
  ##### _ Detached, cloned or pre-configured from a Spot Node currently being terminated & re-attached or synced to a warm, standby OnDemand Node_
  
- Launch Templates
   ##### _Created programatically from each Spot Node and used to launch warm, standby OnDemand Nodes_

- Instance Type
   ##### _While a Node is stopped, its instance type can be dynamically changed to match a terminating Spot Nodes instance type_

- Spot Nodes
   ##### _Run Pods at lowest cost and get reposseded when cloud provider needs them back_

- OnDemand Nodes
   ##### _Run Pods at set cost _

- Warm OnDemand Nodes
   ##### _Run Pods at set cost and stay on standby (preconfigured, pre-tainted) to replace terminated Nodes_

- Burstable Nodes
   ##### _Run Pods at set cost with limited or unlimited dynamic resource provisioning_

- Spot Fleets
   ##### _A collection of Spot instances we can  strategically configure based on price, resource aggregation, avaiability, location, type.._

- AutoScalingGroup
   ##### _Horizontally scale Nodes or Spot Fleets to match desired Spot Node or Spot Fleet availability with current availability_ 

- Client
   ##### _Monnitors Spot Nodes for termination notices by polling, update Redis and notifies Server_

- Server
    ##### _Get data from Redis, run termination response functions_

- Database
    ##### _Stores the Cluster, Pod & Node data_

- CostOp App
   ##### _Run the Client/Server APIs, update Redis_

- Scheduler
   ##### _Place newly created Pods on qualifying Nodes_

- API Server
   ##### _Allow Server to get Node & Pod data_

- Serverless Functions
   ##### _Instantly accepts rerouted requests from terminated Nodes_

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

