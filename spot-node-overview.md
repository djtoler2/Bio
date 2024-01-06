### OBJECTIVE
- Reduce cost of Kubernetes clusters by running Pods on Spot VMs while ensuring minimum service disruption

### SYSTEM COMPONENTS
* ##### LOAD BALANCER: _Distribute requests amongst Nodes_
* ##### PODS: _Run the containers that process our requests, scale based on metrics and replica count_
* ##### DUMMY PODS: _Occupy space on Nodes and have low priority_
* ##### EBS VOLUMES: _Detached, cloned or pre-configured from a Spot Node currently being terminated & re-attached or synced to a warm, standby OnDemand Node_
* ##### LAUNCH TEMPLATES: _Created programatically from each Spot Node and used to launch warm, standby OnDemand Nodes_
* ##### INSTANCE TYPE: _While a Node is stopped, its instance type can be dynamically changed to match a terminating Spot Nodes instance type_
* ##### SPOT NODES: _Run Pods at lowest cost and get reposseded when cloud provider needs them back_
* ##### ON-DEMAND NODES: _Run Pods at set cost_
* ##### WARM ON_DEMAND NODES: _Run Pods at set cost and stay on standby (preconfigured, pre-tainted) to replace terminated Nodes_
* ##### BURSTABLE NODES: _Run Pods at set cost with limited or unlimited dynamic resource provisioning_
* ##### SPOT FLEET: _A collection of Spot instances we can  strategically configure based on price, resource aggregation, avaiability, location, type.._
* ##### AUTO SCALING GROUP: _Horizontally scale Nodes or Spot Fleets to match desired Spot Node or Spot Fleet availability with current availability_ 
* ##### GRPC CLIENT: _Monnitors Spot Nodes for termination notices by polling and notifies the GRPC Server_
* ##### GRPC SERVER: _Get data from Redis, run termination response functions_
* ##### REDIS DB: _Stores data for GRPC server to use to make termination response decisions_
* ##### COST OPTIMIZATION APP: _Run the GRPC servers_
* ##### SCHEDULER: _Place newly created Pods onto qualifying Nodes_
* ##### API SERVER: _Supplies the GRPC Server with data about the Nodes & Pods_
* ##### SERVERLESS FUNCTIONS: _Instantly accepts rerouted requests from terminated Nodes_

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

