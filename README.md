### AWS will send a termination notice and give a 2-minute warning that the spot instance that's currently in use will be repossessed.
<p align="left"><img src="https://github.com/djtoler2/Bio/blob/main/1cs.PNG" width="500"></p>

### The termination notice that AWS sends will instantly trigger a script to run.
### The script will start the process of moving the Pods to another Node and attempt to keep them available for requests.
### Also, the script will immediately "taint" the Node by running the command _"kubectl nodes spot-node-1 terminating=true:NoSchedule"_.
---
> ### _A "taint" is basically a tag that can be applied to a Node that renders Pods ineligible to be scheduled to run on them unless they have a matching "toleration"._
> ### _A "toleration" is basically a tag that can be applied to a Pod that will render it eligible to run on a "tainted" Node if that Pod's "toleration tag" matches the Node's "taint tag."_
> ### [_Taints and Tolerations_](https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/)
---
<p align="left"><img src="https://github.com/djtoler2/Bio/blob/main/cs2.PNG" width="500"></p>

### That command will disallow any Pods without a matching "toleration" to be scheduled or run on this "tainted" Node.
### It will also cause a graceful eviction of any Pods currently running on the "tainted" Node that don't have a matching "toleration."
<p align="left"><img src="https://github.com/djtoler2/Bio/blob/main/cs3.PNG" width="500"></p>

### After the Pods are evicted from the Node, the Scheduler becomes aware of this and attempts to place the Pods on other eligible Nodes within the Cluster.
### If the Scheduler can't find a Node that's eligible for the Pods to run on, the Pods will go into a scheduling queue, waiting to be placed onto an eligible Node when one becomes available.<p align="left"><img src="https://github.com/djtoler2/Bio/blob/main/cs4.PNG" width="500"></p>

### We can preemptively have a "warm", On-Demand Node pre-configured and "pre-tainted", so it'll be able to run the Pods that just got evicted from the "tainted" Node.
### Once the Scheduler determines that there are no Nodes available for the Pods to run on, our script will asynchronously do 2 things:
> #### _1. It will start our "warm", pre-tainted Node and add it to our Cluster._
> #### _2. It will add a "toleration" to both of our evicted Pods that matches the "taint" on our "warm", On-Demand Node._

### Since the On-Demand Node will be "warm", the startup time will be drastically reduced, making it available to accept our evicted Pods within a matter of seconds.
### The "taints & tolerations" at this stage will make sure that the Scheduler is only allowed to pair our "warm", On-Demand Node with the recently evicted Pods.
<p align="left"><img src="https://github.com/djtoler2/Bio/blob/main/cs5.PNG" width="500"></p>

### Our other Nodes will be configured to run at a strategically determined CPU/Memory level so that it can handle a burst of traffic that may occur during the short period of our evicted Pods being placed onto eligible Nodes.
### Or we can statically or dynamically configure our Nodes with enough resources to always be able to temporarily accept and run evicted Pods in the event of a Spot Node termination notice.

---

## Using automation and asynchronous functionality will allow these things to happen as fast as possible and avoid any service disruption.
### The instant "tainting" of our terminated Spot Nodes will safely remove the Pods currently running on them and disallow any additional Pods or requests.
### Having a "warm", pre-configured On-Demand Node available avoids a cold start and makes it quickly available for scheduling our evicted Pods.
### "Tainting" the "warm" On-Demand Node will render it ineligible for all Pods except the ones our script applied a matching "toleration" to, avoiding the ability of the Scheduler to place any Pods on this Node other than the evicted ones.

### Now we should be able to safely run our Pods on Spot Instances.
