# Kubernetes Sports Analogy

## _The complexity of Kubernetes_
#### _In the world of cloud computing, Kubernetes has a reputation for its complexity and its learning curve._

#### _Its a powerful, automated system full of unique, dynamically interconnected components with distint roles that all work together to orchestrate multiple layers of abstracted resources... and most of those resources can all unpredictably die, multiply, malfunction or change at any given moment._  

#### _Theres is a lot going on in the Kubernetes system, to say the least... but in this article, we'll think about it from a differently, from basketball angle and make it a lot simpler._

---

## _Thinking differently about Kubernetes_
#### _To simplify our understanding of Kubernetes, we'll use "analogous thinking"._ 

#### _Analogous thinking is a thinking process. It allows us to draw commonalities between things that appear unrelated and _see_ how seemingly unrelated things can actually have the same underlying structure._

#### _Using an analogous thinking framework, we can map the concepts of Kubernetes to something we are already familiar with, gain a solid understanding of how Kubernetes works and how to use it._

---

## _Kubernetes as an NBA organization_
#### _As a life-long fan of basketball, seeing Kubernetes through the lens of an NBA organization made grasping this technology much easier._

#### _First, we start by defining the purpose of the Kubernetes system and identifying the components that work together to carry out this purpose._

#### _Then, we figure out what part of an NBA organization aligns with the role that each component is playing inside the Kubernetes system._

---

## _The purpose of Kubernetes_
#### Kubernetes is a system that orchestrates containerized applications. We'll give a basic, high-level overview of how Kubernetes works

#### We start with an engineering team and some application code.

#### Our application code gets packaged (with its dependencies & our choice of OS implementation) into an image thats used to build a container.

#### Kubernetes comes into the picture and encapsulates our containers into a Pod (a logical grouping of 1 or more containers)

#### A Pod runs on a Node (simply an EC2 instance) and with that, we're now running our app in Kubernetes.

#### Kubernetes is self-healing, meaning that if we tell it we want 4 pods (4 instances of our application), the Control Plane and the Kublet will communincate with each other through the Kubernetes API server to always make sure we have 4 Pods running.

#### Now, here's how the Kubernetes system correaltes to an NBA organization?

---

## _The Kubernetes system & NBA analogy_

### <ins>Engineering Team = NBA League Office</ins>
##### _Sets & alters rules of the game_

> #### As an engineer or an engineering team working with Kubernetes, we function similar to the NBA League Office. We essentially set the rules for our Kubernetes system to abide by. Using yaml files and shell scripts, we can define where our workloads, where they'll run and how users will interact with our Pods.

> #### In a similar way, the NBA League Office defines how games are played (in-game rules, penalties, etc)and where teams will play (local broadcast, ESPN, TNT, geographic locations, etc…) using a rule book and having contracts with media outlets, franchises, and player organizations.


### <ins>Control Plane = NBA Team Front Office</ins>
##### _Makes decisions to align the current state / business objective with the desired state / business objective (which is set by the Engineering Team / NBA League Office)_

> #### Every Kubernetes cluster comes with a `control plane` and the control plane acts as the brains of the entire cluster. Every control plane comes with 4 components.

- ##### API server: _Manages cluster updates_

- ##### etcd: _Holds all information about the current state of the cluster_

- ##### Scheduler: _Decides which pods our nodes should run on_

- ##### Controller Manager: _Adjusts resources to match the actual cluster state to the desired cluster state_

- ##### Cloud Controller Manager: _Additional controller manager if you're using a cloud provider_

> #### The architecture of a Kubernetes cluster is similar to how every NBA team has a front office with analogous roles.

> ##### - The franchise's analyst team is like the Etcd. All modern NBA organizations have an analyst team that keeps data about the franchise and that data is used to make decisions throughout the franchise, just like etcd data is used to make decisions throughout the cluster.

> ##### - GM roles are similar to API servers in that they get their data from the analyst team and communicate with the coaching staff, much like the API server gets its data from etcd and communicates with the kublet.

> ##### - The Director of Player Personnel in a sports organization is responsible for overseeing player recruitment, scouting, and roster management They work directly with the general manager and make decisions to place players on rosters. This is similar to the role of the control plane scheduler in the way that it works directly with the API server to schedule pods to nodes.

> ##### - The VP of Basketball Operations is functions very similar to the controller manager


### <ins>Cluster = Team Franchise</ins>
##### _The entire organization of the games/systems components_

> #### Inside the Kubernetes cluster, we have all of the components necessary to service requests.

> #### We have our containers, pods, and nodes, which run our apps while we have the KubeProxy that helps route users to our app.

> #### The Kublet keeps our Pods and containers running and the control place is the brains of it all. Information about the cluster components is stored here and decisions about where to run Pods are made here too.

### <ins>Containers = Players</ins> 
##### _Entertain the fans/application users_

> #### A Docker container running inside Kubernetes can be likened to an individual player. 
> #### The comtainers packaged dependencies are deployed, possessing a core functionality defined by the `image` that was used to build it. 

> #### In the same way, a player can be looked at as a package of skill sets, attributes, and abilities that are used for a core functionality. These individual players can also be grouped to form a team that specializes in defense, similar to how individual containers could be grouped to form a backend app that uses data that’s processed in real-time.


### <ins>Pods = Teams</ins> 
##### _Groups of players/containers_

> #### A Kubernetes pod can be compared to an NBA team because pods are groups of containers and like the analogy above, containers can be likened to individual players. 
> #### And just like an NBA team usually doesn’t have players with identical skill sets, a Pod typically doesn’t encapsulate identical containers.

> #### Instead, the typical Pod architecture probably includes a main application container with other containers that support the main container.

> #### For example, let’s say we have a backend container running inside our Pod.

> ##### We could also have 4 additional _“sidecar”_ containers that support that main backend container including....

##### - _A proxy container that routes requests to backend container endpoints_

##### - _A container that logs data from the backend container_

##### - _A container receives those logs to do real-time data processing_

##### - _Another container that stores the processed data in memory for quick access_

#### This closely resembles an NBA teams _starting 5_ architecture, where a single star player, that may be an exceptional shooter, would have 4 additional teammates where...

##### _1 is a versatile defender that allows the shooter to conserve energy for shooting_
##### _2 is a playmaker that can create shooting opportunities for the shooter_
##### _3 is an offensive rebounder_ 
##### _4 is a 7ft inside scorer that draws the defense in, creating space for the shooter to get uncontested oppertunities and shooting and scoring points_

> ##### Both the NBA team and Kubernetes Pod apply the same architectural model of a main entity surrounded by supporting entities.


### <ins>Kublet = Coaching & Medical staff</ins>
##### _Responsible for management of teams-players/pods-containers_

> ##### _Kublet has over a dozen internal components that work together to match the current pod/container state to the desired pod/container state`_

#### Coaching Staff

#### _A team's coaching and medical staff play an indispensable role in their success._

#### _Coaching staffs are made up of a head coach and a group of specialty coaches, like an assistant coach, shooting coach, conditioning coach, etc. Coaches give advice and directions to a team._

#### _Their job is to get the best performance out of the players/team they’re coaching. They do this by implementing game plans and plays, decide when to substitute players, working with the players to get better, and making decisions from player/team analytics. where to go when they get in the game, etc..._

#### Medical Staff

#### _The medical staff keeps players/teams healthy._

#### _They preemptively prepare players/teams with compression sleeves, ankle braces, finger wraps, etc. They also diagnose and treat player/team injuries. They communicate with the coaching staff and front office about the health of players and help make decisions about rendering a player ready or inactive._

#### The Kubelet

#### _The kubelet plays a role that is equally as indispensable in the Kubernetes system. Its job is to make sure containers are running and functioning properly. We can look at the kublet like the coaching and medical staff of our Kubernetes cluster._

#### _Like a good coaching staff, the kublet is comprised of a bunch of different components that work together to get the most out of our pod deployments._

##### - _The sync loop makes sure the state of our pod and containers always match what we (as part of the engineering team) specified in our deployment files, similar to a coach always making sure there are 5 players on the court at all times due to what the league office specifies as the rule._

##### - _Or how the PLEG detects changes in the state of the containers and may trigger a restart event, a shooting coach may notice a drop in a player's shooting percentage and trigger sometime in the gym doing shooting drills with the players to readjust their shooting form and get them back performing as expected._

#### _The kublet also has health check functionalities that can be compared to an NBA team's medical staff._

#### _Simply put, Kubernetes polls the /healthz endpoint of a pod and can render them ready or not ready depending on the response. Similar to how a team medical staff can have an injured player do game-related drills to determine if they’re cleared to play or listed as unavailable._


### <ins>App Traffic = Fans</ins>
#####  _The people, interacting without containerized app/coming to see players_

> #### Every NBA arena has fans in the stands and every app has users. An NBA fan comes to the arena to watch teams and players, the same way a user comes to the internet to interact with our containers and pods by using our app.

> #### Our applications are designed to engage our users much like NBA games are designed to entertain fans.


### <ins>KubeProxy = Arena Ushers</ins>
##### _Responsible for routing fans/traffic to their designated areas_

> #### Every NBA game is held in an arena staffed with ushers. You can find them in the stands waiting for a request from a fan to help find their seat… The KubeProxy functions like an usher in an NBA arena because you find it inside our Kubernetes system, waiting for a request from our ingress to find our frontend service.

> #### In the same way, an usher will check a fan's ticket to know how to guide them to their seat, the KubeProxy checks the ClusterIp of a service to know where to send that user's request.

## _Kubernetes Simplified_
#### We now have a more simplified understanding of what Kubernetes is and how it works.

#### By mapping the components of Kubernetes to the different roles within an NBA organization, we've created an analogous framework that we can reference anytime we’re working with Kubernetes 

#### This analogy helps to clarify the complexity of Kubernetes, making it easier to grasp for those familiar with basketball and the dynamics of an NBA organization. 

#### With this clearer perspective on how each element of Kubernetes functions similarly to parts of an NBA organization, you have a more intuitive understanding of what Kubernetes does and how it operates.
