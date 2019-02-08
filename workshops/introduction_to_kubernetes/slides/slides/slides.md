what is docker
why docker

what is kubernetes
https://queue.acm.org/detail.cfm?id=2898444

<style>

sup {
   vertical-align: super; 
   font-size: 0.75em !important; 
   display: block;
}

section[data-markdown].present {
    width: calc(100% - 80px) !important;
}

.reveal.lunatech h2:first-child {
    position: fixed !important;
    top: 0 !important;
}

.reveal.slide .slides > section, .reveal.slide .slides > section > section {
  min-height: 100% !important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: center !important;
  position: absolute !important;
  top: 0 !important;
  align-items: center !important;
}
section > h1, section > h2 {
  position: absolute !important;
  top: 0 !important;
  margin-left: auto !important;
  margin-right: auto !important;
  left: 0 !important;
  right: 0 !important;
  text-align: center !important;
}
.print-pdf .reveal.slide .slides > section, .print-pdf .reveal.slide .slides > section > section {
  min-height: 770px !important;
  position: relative !important;
}

</style>

---

## Containers - Growth

The Rise of Containers

---

## Containers - Growth

"The rise of containers has reshaped the way people think about developing, deploying, and maintaining software."

<sup>- infoworld</sup>

---

## Containers - Growth

"At the beginning of April 2018, 23.4 percent of Datadog customers had adopted Docker, up from 20.3 percent one year earlier. Since 2015, the share of customers running Docker has grown at a rate of about 3 to 5 points per year."

<sup>- datadog</sup>

---

## Containers - Growth

<img src="/images/dockerstats2018.png" style='width:80%; max-width:1501px;'/>

---

## Containers - Growth

"among the organizations with at least 1,000 hosts, 47 percent have adopted Docker, as compared to only 19 percent of organizations with fewer than 100 hosts."

<sup>- datadog</sup>

---

## Containers - Growth

<img src="/images/dockerincreasestats.png" style='width:80%; max-width:1501px;'/>

---

## Containers - Growth

"Half of Docker Environments Are Orchestrated"

<sup>- datadog</sup>

---

## Containers - Growth

"Roughly 70 percent of companies running both Docker and AWS infrastructure are also using orchestration."

"Across our customer base, Kubernetes is now the fastest-growing orchestration technology"

<sup>- datadog</sup>

---

## Containers - Growth

<img src="/images/orchestatorusage.png" style='width:80%; max-width:1501px;'/>

---

## Containers - Growth

And it is not slowing down

---

## Containers - Growth

<img src="/images/dockercon1.png" style='width:80%; max-width:1501px;'/>

---

## Containers - Growth

"the application container market will explode over the next five years. Annual revenue is expected to increase by 4x, growing from $749 million in 2016 to more than $3.4 billion by 2021, representing a compound annual growth rate (CAGR) of 35 percent."

<sup>- 451 research</sup>

---

## Containers - What are they?

So what is a container?

---

## Containers - What are they?

A container is an isolated environment that uses shared system resources of the host operating system.

"leave behind the useless 99.9 percent VM junk, leaving you with a small, neat capsule containing your application"
<sup>- James Bottomley, former CTO of Parrallels</sup>

--- 

## Containers - What are they?

"This reduces the risk of "worked in dev, now an ops problem.""

<sup>- James Turnbull, The Docker Book: Containerization is the new virtualization</sup>

---

## Containers - What are they?

<img src="/images/dilbert-overtime1.gif" style="width:80%; max-width:1501px;"/>
<img src="/images/dilbert-overtime2.png" style="width:80%; max-width:1501px;"/>
<sup>- Scott Adams, Dilbert</sup>

"I'm starting to associate the smell of pizza with the futility of a death march."

<sup>- Gene Kim, The Phoenix Project</sup>

Note:
- The problem with unloading your work to another team or person with a sketchy plan is the unknown amount of time the work will take.
- Something which can cripple a large amount of projects is "unplanned work". 
- Unplanned work causes delays, rushing, bugs, overtime, a reduction in morale... and an endless cycle of technical debt, which causes more unplanned work in the future
- Improper or non-existant DevOps solutions cause more unplanned work on the project. If the situation gets so bad, then an entire infastructure may be deemed "untouchable", with the fear of small changes breaking everything.

---

## Containers - History

A lesson can be learnt from shipping containers

---

## Containers - History

<img src="/images/shipping-without-containers.jpg" style="width:80%; max-width:1501px;"/>

<sup>Break-bulk cargo shipping from the Korean War</sup>

Note:
- This is comparable to a VPS or physical server

---

## Containers - History

<img src="/images/CSCL-Globe.jpg" style="width:50%; max-width:1001px" />

<sup>CSCL Globe, worlds largest shipping container, arriving into the UK from China</sup>

Note:
- In this picture this ship is holding 19,100 containers
- Size of four football fields
- a standard train, single stacking its containers, would have to be 115km long
- This ship routinely goes to the UK, and when writing this it is in the UK
- 500 million tonnes of feight enter the UK per year
- 6 million containers enter per year
- 16,438 Twenty Foot containers enter per day
- Rotterdam receives 6 milion loaded containers per year
- Rotterdam processes 21 million containers per year
- That is 57,534 per day
- This is a HUGE logistical problem
- Containers reduced shipping costs by roughly 90%

---

## Logistics

DevOps is a solution to technical logistical problems

---

## Logistics

"The line between disorder and order lies in logistics..."

<sup>- Sun Tzu, The Art of War</sup>

Note:
- Logistics is often the decider of who is the "winner" in most situations
- Who is able to be most efficient, who is able to be most effective and who is the most reactive
- Although we remember the great battles, in war the actual fighting is the least important part
- Wars are usually a struggle of the attrition of morale and resources. Logistics is the organisation and flow of the resources.
- Battles themselves are very rare, sieges are so common that most sieges in history were not even cared to be recorded. A siege is a inheriently a battle of logistics.
- Logistics plays a huge overwhelming role in business too. 
- Being able to confidently coordinate the correct amount of resources for a job is a huge part of meeting deadlines and confidently estimating project costs.
- Failing to control the logistics of a project will lead to a blackhole of money and time.

---

## Logistics

"The most dangerous kind of waste is the waste we do not recognize."

<sup>- Shigeo Shingo, developer of Toyota Production System and Lean Manufacturing</sup>

---

## Logistics

""Just-in-Time" means making "only what is needed, when it is needed, and in the amount needed." For example, to efficiently produce a large number of automobiles, which can consist of around 30,000 parts, it is necessary to create a detailed production plan that includes parts procurement. Supplying according to this production plan can eliminate waste, inconsistencies, and unreasonable requirements, resulting in improved productivity."

<sup>- Toyota</sup>

Note:
- Having a surplus of one part is completely irrelevent if we have a deficit of another part, in this situation the surplus is waste and reduces the efficiency of the project. 
- Managing unwanted surplus on its own can cause huge logistical problems, that make it harder to store, procure and estimate the amount of resources required to match our deficit.
- In the computing world you can see these resource deficits similar to hardware requirements.
- Going back to the shipping container comparison. There is absolutely NO way that the UK can store that many containers at its habours. It does not have the storage capacity required for this logistical problem. 
- The shipping industry in Europe relies on "Just In Time" delivery. Goods are shipped to the harbour, to be picked up by lorrys that deliver to the factory, just in time as the current supplies at the factory are dwindelling.
- An error or delay in shipping can cause an entire factory to close down. 
- The benefits of being ultra-efficent allow for more throughput of product in the factory. The cost of a logistical failures is so much that a lot of dependency is put on their logistical solutions.

---

## Logistics

Kubernetes is, one of many, solutions to the logistical problem of resource management

Note:
- Your DevOps solutions are not your product. Just like in warefare your supply lines and factories is not your army.
- However, the implementation of succesful DevOps and logistical solutions allows you to pivot and react to the everchanging nature of the market and war.

---

## Lean Software Development

"The biggest cause of failure in software-intensive systems is not technical failure; it's building the wrong thing."

<sup>- Mary Poppendieck, Leading Lean Software Development</sup>

Note:
- Being able to react to market demands and requirements is a necessity for any business or project, regardless of if IT is involved.
- Since DevOps solves the logistical problems arisen from development, then your product can only be as flexible as your DevOps solutions.
- A brittle logistical solution is comparable to an army that cannot move. An army that cannot move cannot react to the changing of warefare. 
- LEAN software development heavily promotes strong logistical solutions for your product so you can pivot and change your products features quickly to react to the demands and feedback from the market.

---

## Agile

<img src="/images/agilesoftwaredevelopment.jpg" style='width:80%; max-width:1501px;'/>
<sup>LEAN, Scrum and Kanban are all subsets of Agile</sup>

Note:
- You may find some of these comments about LEAN Software Development familiar. That is because we use SCRUM which is an implementation of Agile, which is in the same family as Kanban and LEAN.
- Kanban is the system which Toyota introduced to the world, which just means "visual board".
- The fundamental principles of Agile project development are all being able to manage planned vs unplanned work and organising the priority of work to be done, in short intervals.
- DevOps is at the very heart of Agile Development. Without DevOps your unplanned work increases, frequent testing and deployment becomes hazy, reviewing becomes a thing of the past, and launching is almost impossible. 

---

## Logistics

How important is it really?

---

## Logistics

"It's not the upfront capital that kills you, it's the operations and maintenance on the back end."
<sup>- Gene Kim, The Phoenix Project</sup>

"Maintenance typically consumes about 40 to 80 percent (60 percent average) of software costs. Therefore, it is probably the most important life cycle phase."
<sup>- Robert L. Glass, Frequently Forgotten Fundamental Facts about Software Engineering</sup>

Note:
- Quote from google says 80% of a projects costs happen after release

---

## Logistics

Companys using DevOps practices outperform their non-DevOps competition in these areas:
- Throughput metrics
- Code and change deployments (33x more frequent)
- Code and change deployment lead time (200x faster)
- Reliability metrics
- Production deployments (60x higher success rate)
- Mean time to restore service (168x faster)
- Organisational performance metrics
- Productivity, Market share and profitability goals (2x more likely to exceed)
- Market capitalisation growth (50% higher over 3 years)

"By integrating security objectives into all stages of the development and operations processes, they spent 50% less time remediating security issues."

<sup>- Gene Kim, The DevOps Handbook</sup>

Note:
- Projects using DevOps also have lower rates of employee burnout and they are 2x more likely to recommend their organisation as a great place to work.

--- 

## Kubernetes

And now for something completely different

---

## Kubernetes

"You've probably heard about the pets vs cattle analogy in system administration. It says that you should treat your servers as cattle instead of like pets. You should not have servers that have cute names and need to be cared for and nurtured. Instead, if a server misbehaves just replace it with a new one. This makes scaling and managing servers much easier."
<sup>- nimbleci</sup>

---

## Kubernetes

"There should be absolutely no way that the Dev and QA environments don't match the production environment."

<sup>- Gene Kim, The Phoenix Project</sup>

---

## Kubernetes

<img src="/images/project.png" style='width:80%; max-width:1501px;'/>

---

### Kubernetes

<iframe width="560" height="315" src="https://www.youtube.com/embed/4ht22ReBjno" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

---

## Kubernetes

1. connect to cluster with ./run.sh
2. show gke
3. show dashboard
4. introduce pods
5. deploy a pod
6. introduce deployments
7. deploy a deployment
8. introduce HorizontalPodAutoscaler
an example of kubernetes being WIP
https://cloud.google.com/kubernetes-engine/docs/concepts/cluster-autoscaler

9. node usages
kubectl top nodes
kubectl describe nodes

10. services
show how both the pod and the deployments are all picked up by the service
both have "component: hello-world"
round robin
connect to Internal endpoints & hello-world.${NAMESPACE}.svc.cluster.local
firewall blocks nodeport

watch wget -q -O - hello-world.${NAMESPACE}.svc.cluster.local | grep hostname

11. network policies
show how you can no longer connect
ask them to re-create a new pod that can connect
explain that calico is handling the network policies

12. volumes
find / -name "*" &> /data/files
ps aux
kill 1

13. secrets
kubectl create secret --help

14. healthchecks
watch wget -q -O - hello-world-health.${NAMESPACE}.svc.cluster.local | grep hostname

15. RBAC

16. DaemonSet
Run one pod per node
https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/#taints-and-tolerations

17. Stateful sets

18. Jobs

A job creates one or more pods and ensures that a specified number of them successfully terminate. As pods successfully complete, the job tracks the successful completions. When a specified number of successful completions is reached, the job itself is complete. Deleting a Job will cleanup the pods it created.

19. CronJobs

20. Node Affinity

kubectl label nodes <your-node-name> nodetype=special
kubectl get nodes --show-labels

21. Taints & Tolerations
NODE="$(kubectl get nodes | tail -n 1 | awk '{ print $1 }')"
kubectl taint nodes ${NODE} nodetype=special:NoSchedule

kubectl taint nodes ${NODE} nodetype:NoSchedule-

kubectl label nodes ${NODE} nodetype=special

22. init containers

kubectl logs countries-seed -c countries-seed-waiting-for-data

23. sidecars

