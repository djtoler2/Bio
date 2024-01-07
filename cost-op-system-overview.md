# _TABLE OF CONTENTS_
1. [Objective](#objective): _What problems are we solving?_
2. [System Components](#system-components): _What components make this system function?_
3. [System Requirements](#system-requirements): _Whats required to make this system function successfully?_
4. [System Component Interactions](#system-component-interactions): _How do the system components interact with each other to reach the objective_
5. [System Data](#system-data): _What data does our system need to reach the objective?_
6. [System Functions](#system-functions): _What main functions run to allow our system to reach the objective?_
7. [System Diagram](#system-diagram)

---

### _OBJECTIVE_
##### _Reduce cost of Kubernetes clusters by running Pods on Spot VMs while ensuring minimum service disruption_

---

### _SYSTEM COMPONENTS_
##### _These are the main components that interact with each other to trigger the response to a notice or warning of a pending AWS Spot Node termination_

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
    <td>Kubernetes Scheduler</td>
    <td>Place newly created Pods onto qualifying Nodes</td>
  </tr>
  <tr>
    <td>Kubernetes API Server</td>
    <td>Supplies the GRPC Server with data about the Nodes & Pods</td>
  </tr>
  <tr>
    <td>Serverless Functions</td>
    <td>Instantly accepts rerouted requests from terminated Nodes</td>
  </tr>
  <tr>
    <td>Kubernetes PLEG & Sync Loop</td>
    <td>Instantly accepts rerouted requests from terminated Nodes</td>
  </tr>
    <tr>
    <td>Kubernetes C-Advisor & CRI</td>
    <td>Instantly accepts rerouted requests from terminated Nodes</td>
  </tr>
</table>


---


### _SYSTEM REQUIREMENTS_
##### _These are th requirements for our system to successfully meet our objective_

| Requirements  | Purpose  | 
|---|---|
| Run Pods on Spot Nodes with no downtime                                                                   | _Cost Optimization _ |  
| Scheduling new Pods as fast as possible                                                                   | _Avoid service disruption _ |  
| Making Nodes available for Pods to run on as fast as possible                                             | _Avoid service disruption _ |  
| Getting termination notice updates as fast as possible                                                    | _Start the termination response process as fast as possible_  |  
| Updating database                                                                                         |  _Quickly supply functions with data to make termination response decisions_ |  
| Running termination response logic must efficiently stabalize request handling within 2 minutes           | __Avoid service disruption __  |  

---

### _SYSTEM COMPONENT INTERACTIONS_
##### _This is how the main components within our system interact with each other to meet our objective_

|  Requestor | Responder  | Data |  Purpose |
|---|---|---|---|
| GRPC Client  | AWS Spot Instance Endpoints        | _Spot Node Termination Notice_                            | Alert the GRPC Server of a Spot Node termination |
| GRPC Server  | Redis                              | _Cluster Data & Metrics_                                  | Get & set the specs of all Nodes & data about the current Pod-Node Placements to use during the termination response process|
| GRPC Server  | Kubernetes API Server              | _Cluster Data & Metrics_                                  | Get the specs of all Nodes & data about the current Pod-Node Placements to use during TRP*|
| GRPC Client  | GRPC Server                        | _ID Of The Node Being Terminated_                         | Inform the GRPC server which Spot Node to start the termination process on |
| GRPC Server  | AWS Lambda API                     | _Serverless Function URL_                                 | Invoke serverless functions to respond to re-reouted requests from terminated Spot Nodes  |
| GRPC Server  | AWS OnDemand Instances             | _Specs of the Spot Nodes_                                 | Dynamically assign an instance type to a stopped, warm On-Demand Node  |
| GRPC Server  | AWS AutoScaling API                | _State Data about Spot Node AutoScalingGroups_            | Update Redis with current data about Spot Node groups |
| GRPC Server  | AWS EC2 API                        | _Specs of the Spot Nodes_                                 | To create a warm, On-Demand Node for every running Spot Node  |
| GRPC Server  | AWS EKS API                        | _Cluster name and AMI ID_                                 | Add the warm, On-Demand Node to a Cluster    |
| GRPC Server  | AWS EBS API                        | _ID of EBS Volume of the Spot Node being terminated_      | Clone, detatch, attach or sync from one Node to another Node |
| GRPC Server  | AWS Fargate API                    | _ID of Pods that are being rescheduled_                   | Temporarily accept rerouted requests from terminated Spot Nodes  |
| GRPC Server  | Monitoring Source                  | _Cluster Metrics_                                         | Provide the system with data for makig decisions  |
| Kubernetes Kublet  | Kubernetes API Server        | _Pod state data_                                          | Match the current state of Pods with desired state of Pods  |

---

### _SYSTEM DATA_ 
##### _This is the data needed for the system to make decisions in response to termination notices_
| Resource                                  | Data                          |  Purpose    |    
|-------------------------------------------|-------------------------------|--------------------|
| Node                                      | Name/ID                       |  ID which Node to perform termination response process on |   
| Node                                      | List of Pods                  |  Determine what to do with the Pods that are running on the Node being terminated    |   
| Node                                      | Total CPU                     |  Custom Scheduling logic      |   
| Node                                      | Available CPU                 |  Custom Scheduling logic   |   
| Node                                      | Total Memory                  |  Custom Scheduling logic    |   
| Node                                      | Available Memory              |  Custom Scheduling logic |   
| Node                                      | Group                         |  Determine if the Node is a part of a AutoScaling group for scheduling logic|   
| Node                                      | Group ID                      |  ID the group the Node is a part of|   |
| Node                                      | Group Available Memory        |  Custom Scheduling logic |   
| Node                                      | Group Total Memory            |  Custom Scheduling logic |   
| Node                                      | Group Available CPU           |  Custom Scheduling logic |   
| Node                                      | Group Total CPU               |  Custom Scheduling logic |   
| Node                                      | Taints                        |  Response process logic |   
| Node                                      | Labels                        |  Response process logic |   
| Pods                                      | ID/Name                       |  ID which Pods need to be rescheduled or implemented in termination response |   
| Pods                                      | List of containers            |  Determine which worksloads the Pod is responsbile for running and the dependency structure|   |
| Pods                                      | Total Resources Required      |  Scheduling logic |   
| Pods                                      | Node                          |  ID which Node the Pod is currently running on |   
| Containers                                | ID/Name                       |  ID which workload is being ran |   
| Containers                                | Total Resources Required      |  Determine how much resources each workload needs |   
| Containers                                | List of functions             |  Determine what part of the workload is a Lambdas |   
| Functions                                 | ID/Name                       |  ID which functions are Lambdas |   
| Functions                                 | URL                           |  To invoke Lambdas to response to termination notices |   
| Functions                                 | Total Resources Required      |  To determine how many requests each Lambda can process |   

---

### _SYSTEM FUNCTIONS_
##### _These are the main functions that will allows up to quickly respond to termination notices_

<table>
  <tr>
    <th style="width: 600px;">Function</th>
    <th style="width: 50px;">Purpose</th>
  </tr>
  <tr>
    <td>Lambda Functions</td>
    <td>Temporarily run serverless functions in response to termination notices</td>
  </tr>
  <tr>
    <td>Fargate Pods</td>
    <td>Temporarily run serverless Pods in response to termination notices</td>
  </tr>
    <tr>
    <td>AutoScaling Pods</td>
    <td>Horizontally scale & keep a minimum amount of Pods running at all times</td>
  </tr>
  <tr>
    <td>Prioritized Pods</td>
    <td>Use Pod prioritization to schedule Pods onto Nodes</td>
  </tr>
  <tr>
    <td>Warm Nodes</td>
    <td>Tenporarily run Pods on pre-configured, pre-tainted, stopped, standby On-Demand Nodes</td>
  </tr>
  <tr>
    <td>Burstable Nodes</td>
    <td>Temporarily vertically scale  Nodes to meet workload requirements</td>
  </tr>
</table>

---

### _SYSTEM DIAGRAM_
<img src="https://github.com/djtoler2/Bio/blob/main/assets/cost-op/spot-node-process.png" width="1000">

<img src="https://github.com/djtoler2/Bio/blob/main/assets/cost-op/Screenshot%202024-01-06%20at%208.29.29%20PM.png" width="1000">

<img src="https://github.com/djtoler2/Bio/blob/main/assets/cost-op/Screenshot%202024-01-06%20at%208.40.34%20PM.png" width="1000">

<img src="https://github.com/djtoler2/Bio/blob/main/assets/cost-op/Screenshot%202024-01-06%20at%208.42.04%20PM.png" width="1000">


