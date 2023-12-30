// have nodes created with list of pods whos affinity is set to true. auto change to false when taint is applied to nodes
const listOfAvailableStratagies = await redisClient.get(nodeId);
const functionNames = JSON.parse(listOfAvailableStratagies);


async function availableBurstableNodes () {
    const listOfBurstableNodes = await redisClient.get(burstableNodes);
    const parsedListOfBurstableNodes = JSON.parse(listOfBurstableNodes);
    let availableBurstableNodes = [];
    let podsRemainingList = [];
    let podsConsideredForSchedulingOnBurstableNodes = [];

    // parsedListOfBurstableNodes.forEach(node => {
    //     const podsOnBurstableNode = node.pods;
    //     podsOnBurstableNode.forEach(pod => {
    //         if (affinity_match && node.available_cpu > pod.cpu_requirements && node.available_memory > pod.memory_requirements && node.available_storage > pod.storage_requirements) {
    //             availableBurstableNodes.push(node.id)
    //         }
    //     })
    // })

    return parsedListOfBurstableNodes;
}


const main_termination_function = async (nodeId) => {
    try {

        if (!listOfAvailableStratagies) {
            console.log('No data found for node:', nodeId);
            return;
        }

        for (const functionName of functionNames) {
            
            if (functions[functionName]) {
                await functions[functionName]();
            } else {
                console.log(`Function ${functionName} not defined`);
            }
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

const funcsStrategyOptions = () => {

    if (a_serverless) {
        console.log("serverless");
    }
    
    if (g_burstableScaling) {

        function estimateTimeUntilCreditDepletion(currentRequestRate, cpuUsagePerRequest, remainingBurstCredits) {
            const totalCpuUsage = currentRequestRate * cpuUsagePerRequest;
            const burstCreditConsumptionRate = totalCpuUsage; 
            const timeRemaining = remainingBurstCredits / burstCreditConsumptionRate;
            return timeRemaining;
        }
        
        function timeToPodReadiness(estimatedGracefulShutdownTime, availableForSchedulingTimestamp, readyForTrafficTimestamp) {
            const schedulingToReadyTime = readyForTrafficTimestamp - availableForSchedulingTimestamp;
            const estimatedPodRescheduleTime = estimatedGracefulShutdownTime + schedulingToReadyTime;
            return estimatedPodRescheduleTime;
        }

        timeToBurstCreditDepletion = estimateTimeUntilCreditDepletion(currentRequestRate, cpuUsagePerRequest, remainingBurstCredits)
        estimatedPodRescheduleTime = timeToPodReadiness(estimatedGracefulShutdownTime, availableForSchedulingTimestamp, readyForTrafficTimestamp)

        if (estimatedPodRescheduleTime <= (0.6 * timeToBurstCreditDepletion)) {
            console.log("consider scheduling pods on burstable nodes");

            if (some_conditions_to_determine_if_i_should_schedule_pods_to_these_nodes) {     
                const listOfNodes = availableBurstableNodes();
                listOfNodes.forEach(node => {
                    // run ranking function
                    // return ordered list
                    // schedule pod to list
                    // update node resources
                })
            }
        }
    }

    if (b_autoscale) {
        console.log("autoscale");
    }

    if (c_priorityPlacement) {
        console.log("priority-placement");
    }

    if (d_dummyPods) {
        console.log("dummy-pods");
    }

    if (e_warmNodes) {
        console.log("warm-nodes");
    }

    if (f_verticalScaling) {
        console.log("vertical-scaling");
    }
}

// // Example flags for strategies (set these based on your conditions)
// let a_serverless = false;
// let b_autoscale = true;
// let c_priorityPlacement = false;
// let d_dummyPods = false;
// let e_warmNodes = false;
// let f_verticalScaling = false;
// let g_burstableScaling = false;

// Call the function
// term_func();

const decision_data = {
    cluster: {
        node_count: 40,
        node_list: [
            {
                node_id: "8973723764",
                taints: [],
                labels: [],
                pod_count: 11,
                pods: [
                    {
                        pod_id : "38974944421",
                        pod_specs: {
                            avg_cpu: 3,
                            avg_memory: ".25gb",
            
                        }
                    },
                    {
                        pod_id : "38974944421",
                        pod_specs: {
                            avg_cpu: 3,
                            avg_memory: ".25gb",
            
                        }
                    },
                    {
                        pod_id : "38974944421",
                        pod_specs: {
                            avg_cpu: 3,
                            avg_memory: ".25gb",
            
                        }
                    },
                    {
                        pod_id : "38974944421",
                        pod_specs: {
                            avg_cpu: 3,
                            avg_memory: ".25gb",
            
                        }
                    }
                ]
            }
        ]
    },
    node_id : "89392329",
    node_specs: {
        total_cpu: 10,
        total_memory: "1gb",
        total_storage: "10bg",
        available_cpu: 5,
        available_memory: "0.5gb",
        available_storage: "5gb"
    },
    pods: [
        {
            pod_id : "74386273342",
            pod_specs: {
                avg_cpu: 2,
                avg_memory: ".50gb",

            }
        },
        {
            pod_id : "38974944421",
            pod_specs: {
                avg_cpu: 3,
                avg_memory: ".25gb",

            }
        }
 
    ]

}



Invoke serverless functions instantly to accept requests

Instantly scale the Pods to meet a desired minimum using HPA or budget disruption

Use priority placement with dummy Pods (overprovisioning)

Use priority placement

Use warm, pre-configured, pre-tainted, stopped On-Demand Nodes & start only when needed

Use traditional vertical scaling

Use burstable vertical scaling
