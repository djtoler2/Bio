## Kubernetes Sports Analogy


### _Engineering Team = League Office (Sets & alters rules of the game)_

#### As the engineering team, we function like the NBA League Office. We essentially set the rules for our Kubernetes system to abide by. Using yaml files and shell scripts, we can define where our workloads will run and how users will interact with our Pods. 

#### The NBA League Office defines how   games are played (in-game rules, penalties, etc)and where teams will play (local broadcast, ESPN, TNT, geographic locations, etc…)  using rule book and having contracts with media outlets, franchises and player organizations. 

---

### _YAML files = Referee (Communicates the game/system rules to game participants/system components)_

---

### _Control Plane = Front Office (Makes decisions to align the [cluster/franchises] current [state/business objective] with the [engineering team/league offices] desired state/business objective)_

#### Every Kubernetes cluster runs with a control plane and the control plane acts as the brains of the entire cluster. Every control plane comes with 4 components. 
##### - _The api server (manages cluster updates)_, 
##### - _etcd(hold all information about the current state of the cluster)_, 
##### - _scheduler(decides which pods our nodes should run on)_, 
##### - _controller manager(adjusts resources to match the actual cluster state to the desired cluster state)_. 
##### - _cloud controller manager (additional controller manager if you're using a cloud provider)_

#### This cluster architecture is similar to how every nba team has a front office with analogous roles. 

##### - _The franchises analyst team is like the Etcd. All modern nba organizations have an analyst team that keeps data about the franchise and that data is used to make decisions throughout the franchise, just like etcd data is used to make decisions throughout the cluster._ 
##### - _GM roles are similar to api server in that they get their data from analyst team and communicate with the coaching staff, much like the api server gets its data from etcd and communicates with the kublet._ 
##### - _The Director of Player Personnel in a sports organization is responsible for overseeing player recruitment, scouting, and roster management They work directly with the general manager and make decisions to place players on rosters. This is similar to the role of the control planes scheduler in the way that it work’s directly with the api server to schedule pods to nodes._ 
##### - _The VP of Basketball Operations is functions very similar to the controller manager_

---

### _Cluster = Team Franchise (The entire organization of game/system components)_

#### Inside the Kubernetes cluster, we have all of the components necessary to service requests. 
#### We have our containers, pods and nodes, which run our apps while we have the KubeProxy that helps route user to our app. 
#### The Kublet keeps our Pods and containers running and the control place is the brains of it all. Information about the cluster components is stored here and decisions about where to run Pods are made here too. 

---

### _Containers = Players (Entertain the fans/application users)_

#### A Docker container running inside Kubernetes can be likened to an individual player. It’s packaged dependencies are deployed, possessing a core functionality defined by the image that was used to build it. The same way a player can be looked at as a package of skill sets, attributes and abilities that are used for a core functionality like. These individual players can also be grouped together to form a team that specializes in defense, similar to how individual containers could be grouped together to form a backend app uses data that’s processed in real time. 

---

### _Pods = Teams (Groups of players/containers)_

#### A kubernetes pod can be compared to a NBA team because pods are groups of containers and like the analogy above, containers can be likened to individual players. And just like an NBA team usually doesn’t have players with identical skill sets, a Pod typically doesn’t encapsulate identical containers. 

#### Instead the typical Pod architecture probably includes a main application container with other containers that support the main container. 

#### For example, let’s say we have a backend container running inside our Pod. 

#### We could also have 4 additional “side car” containers. 

#### - _A proxy container that routes request to backend container endpoints_ 
#### - _A container that logs data from the backend container_
#### - _A container receives logs to do real time data processing container_ 
#### - _A container stores the processed data in cache container_

#### This closely resembles a NBA team architecture where 1 star player that may be an exceptional shooter would have 4 additional teammates where 1 is a versatile defender that allows the shooter to conserve energy for shooting, 2 is a play maker that can create shooting opportunities for the shooter, 3 is a offensive rebounder and 4 is a 7ft inside scorer. Both NBA team and Kubernetes Pod apply the same architectural model of a main entity surrounded by supporting entities.

---

### _Kublet = Coaching & medical staff (Responsible for management of teams-players/pods-containers (kublet has over a dozen internal components that work together to match the current pod/container state to the desired pod/container state))_

#### Coaching Staff

#### _A teams coaching and medical staff play an indispensable role in their success._ 

#### _Coaching staffs are made up of a head coach and a group of specialty coaches, like assistant coach, shooting coach, conditioning coach, ect. Coaches give advice and directions to a team._ 

#### _Their job is to get the best performance out of the players/team they’re coaching. They do this by implementing game plans, plays, decide when to substitute players, work with the players to get better, make decisions from player/team analytics. where to go when they get in the game, etc.._

#### Medical Staff

#### _The medical staff keep players/teams healthy._

#### _They preemptively prepare players/team with compression sleeves, ankle braces, finger wrap, ect. And they also diagnose and treat player/team injuries. They communicate with coaching staff and front office about the health of players and help make decisions about rendering a play ready or inactive._ 

#### The Kubelet

#### The kubelet plays a role that is equally as indispensable in the kubernetes system. It’s job is to make sure containers are running and functioning properly. We can look at the kublet like the coaching and medical staff of our Kubernetes cluster. 

#### Like a good coaching staff, the kublet is comprised of a bunch of different components that work together get the most out of our pod deployments. 
#### - _The sync loop makes sure the state of our pod and containers always match what we (as part of the engineering team) specified in our deployment files, similar to a coach always making sure there’s 5 players on the court at all times due to what the league office specifies as the rule._ 

#### - _Or how the PLEG detects changes in the state of the containers and may trigger a restart event, a shooting coach may notice a drop in a players shooting percentage and trigger some time in the gym doing shooting drills with the players to readjust their shooting form and get them back performing as expected._ 

#### The kublet also has health check functionalities that can be compared to a NBA teams medical staff. 
#### Simply put, kubernetes polls the /healthz endpoint of a pod and can render them ready or not ready depending on the response. SImilar to how a teams medical staff can have a injured player do game related drills to determine in they’re cleared to play or listed as unavailable.

---

### _App Traffic = Fans (The people, interacting with out containerized app/coming to see players)_

#### Every NBA arena has fans in the stands and every app has users. An NBA fan comes to the arena to watch teams and players, the same way a user comes to the internet to interact with our containers and pods through using our app. 

#### Our applications are designed to engage our users much like NBA games are designed to entertain fans.

---

### _KubeProxy = Arena Ushers (Responsible for routing fans/traffic to their designated areas)_

#### Every NBA game is held in an arena staffed with ushers. You can find them in the stands waiting for a request from a fan to help find their seat… 
#### The KubeProxy functions like a usher in an NBA arena because you find it inside our Kubernetes system, waiting for a request from our ingress to find our frontend service. 

#### The same way an usher will check a fans ticket to know how to guide them to their seat, the KubeProxy checks the ClusterIp of a service to know where to send that users request. 
