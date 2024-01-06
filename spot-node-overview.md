# Table of Contents
1. [Objective](#objective)
2. [System Components](#system-components)
3. [Interactions](#interactions)
4. [Requirements](#requirements)


---


### OBJECTIVE
* _Reduce cost of Kubernetes clusters by running Pods on Spot VMs while ensuring minimum service disruption_

---

### SYSTEM COMPONENTS
##### _These are the main components that interact with each other to trigger the response to a noticed or warning of a pendomg Spot Node termination_

<table>
  <tr>
    <th style="width: 600px;">System Component</th>
    <th style="width: 50px;">Component Role</th>
  </tr>
  <tr>
    <td>Warm On-Demand Nodes</td>
    <td>Run Pods at a set cost and are kept on standby (preconfigured, pre-tainted) to replace terminated Nodes</td>
  </tr>
  <tr>
    <td>Dummy Pods</td>
    <td>Occupy space on Nodes and have low priority</td>
  </tr>
  <tr>
    <td>GRPC Client</td>
    <td>Monitors Spot Nodes for termination notices by polling and notifies the GRPC Server</td>
  </tr>
  <tr>
    <td>GRPC Server</td>
    <td>Get data from Redis, run termination response functions</td>
  </tr>
  <tr>
    <td>Redis DB</td>
    <td>Stores Cluster data in memory for GRPC server to use to make Spot Node termination response decisions</td>
  </tr>
  <tr>
    <td>Cost Optimization App</td>
    <td>Run the GRPC servers</td>
  </tr>
  <tr>
    <td>EBS Volumes</td>
    <td>Storage that can be detached, cloned or pre-configured from a Spot Node that's currently being terminated & re-attached or synced to a warm, standby OnDemand Node</td>
  </tr>
  <tr>
    <td>Auto Scaling Group</td>
    <td>Horizontally scale Nodes or Spot Fleets to match desired Spot Node or Spot Fleet availability with current availability</td>
  </tr>
  <tr>
    <td>Load Balancer</td>
    <td>Distribute requests amongst Nodes</td>
  </tr>
  <tr>
    <td>Pods</td>
    <td>Run the containers that process our requests, scale based on metrics and replica count</td>
  </tr>
  <tr>
    <td>Launch Templates</td>
    <td>Created programmatically from each Spot Node and used to launch warm, standby OnDemand Nodes</td>
  </tr>
  <tr>
    <td>Instance Type</td>
    <td>While a Node is stopped, its instance type can be dynamically changed to match a terminating Spot Node's instance type</td>
  </tr>
  <tr>
    <td>Spot Nodes</td>
    <td>Run Pods at lowest cost and get repossessed when cloud provider needs them back</td>
  </tr>
  <tr>
    <td>On-Demand Nodes</td>
    <td>Run Pods at set cost</td>
  </tr>
  <tr>
    <td>Burstable Nodes</td>
    <td>Run Pods at set cost with limited or unlimited dynamic resource provisioning</td>
  </tr>
  <tr>
    <td>Spot Fleet</td>
    <td>A collection of Spot instances we can strategically configure based on price, resource aggregation, availability, location, type...</td>
  </tr>
  <tr>
    <td>Scheduler</td>
    <td>Place newly created Pods onto qualifying Nodes</td>
  </tr>
  <tr>
    <td>API Server</td>
    <td>Supplies the GRPC Server with data about the Nodes & Pods</td>
  </tr>
  <tr>
    <td>Serverless Functions</td>
    <td>Instantly accepts rerouted requests from terminated Nodes</td>
  </tr>
</table>


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

