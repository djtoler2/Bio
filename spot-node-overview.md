# Table of Contents
1. [Purpose](#purpose)
2. [Issues](#issues)
3. [Creating CICD Pipeline and Infrastructure](#create-cicd-pipeline-and-infrastructure)
4. [Explaining CICD Pipeline and Infrastructure](#cicd-pipeline-and-infrastructure-explanation)
5. [Application Successfully Deployed](#successful-deployment)
6. [System Diagram](#system-diagram)
7. [System Optimization](#system-optimization)

---


### OBJECTIVE
* _Reduce cost of Kubernetes clusters by running Pods on Spot VMs while ensuring minimum service disruption_

---

### SYSTEM COMPONENTS

|<span style="width:600px">System Component</span>| <span style="width:300px">Component Role</span>  |
|-------|---|
| Warm On-Demand Nodes   | _Run Pods at a set cost and are kept on standby (preconfigured, pre-tainted) to replace terminated Nodes_    |
| Dummy Pods             | _Occupy space on Nodes and have low priority_                                                          |
| GRPC Client            | _Monitors Spot Nodes for termination notices by polling and notifies the GRPC Server_                  |
| GRPC Server            | _Get data from Redis, run termination response functions_                                              |
| Redis DB               | _Stores Cluster data in memory for GRPC server to use to make Spot Node termination response decisions_                           |
| Cost Optimization App  | _Run the GRPC servers_                                                                                 |
| EBS Volumes            | _Storange that can be detached, cloned or pre-configured from a Spot Node thats currently being terminated & re-attached or synced to a warm, standby OnDemand Node_ |
| Auto Scaling Group     | _Horizontally scale Nodes or Spot Fleets to match desired Spot Node or Spot Fleet availability with current availability_ |
| Load Balancer          | _Distribute requests amongst Nodes_                                                                    |
| Pods                   | _Run the containers that process our requests, scale based on metrics and replica count_               |
| Launch Templates       | _Created programmatically from each Spot Node and used to launch warm, standby OnDemand Nodes_         |
| Instance Type          | _While a Node is stopped, its instance type can be dynamically changed to match a terminating Spot Node's instance type_ |
| Spot Nodes             | _Run Pods at lowest cost and get repossessed when cloud provider needs them back_                      |
| On-Demand Nodes        | _Run Pods at set cost_                                                                                 |
| Burstable Nodes        | _Run Pods at set cost with limited or unlimited dynamic resource provisioning_                         |
| Spot Fleet             | _A collection of Spot instances we can strategically configure based on price, resource aggregation, availability, location, type..._ |
| Scheduler              | _Place newly created Pods onto qualifying Nodes_                                                       |
| API Server             | _Supplies the GRPC Server with data about the Nodes & Pods_                                            |
| Serverless Functions   | _Instantly accepts rerouted requests from terminated Nodes_                                            |

---

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

