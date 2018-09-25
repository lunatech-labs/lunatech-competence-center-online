## Introductions

<div class='profile'>
    <div class='profile__imgboxbg'>
        <div class='profile__imgbox'>
            <img class='profile__img' src='images/willem.jpg' />
        </div>
    </div>
    <div class='profile__textbox'>
        <p class='profile__title'>Willem Jan Glerum</p>
        <p class='profile__subtitle'>Infastructure Engineer</p>
    </div>
</div>
<div class='profile'>
    <div class='profile__textbox profile__textbox--right'>
        <p class='profile__title'>Daniel Alarcao</p>
        <p class='profile__subtitle'>Infastructure Engineer</p>
    </div>
    <div class='profile__imgboxbg profile__imgboxbg--right'>
        <div class='profile__imgbox'>
            <img class='profile__img' src='images/daniel.jpg' />
        </div>
    </div>
</div>
<div class='profile'>
    <div class='profile__imgboxbg'>
        <div class='profile__imgbox'>
            <img class='profile__img' src='images/michael.jpg' />
        </div>
    </div>
    <div class='profile__textbox'>
        <p class='profile__title'>Michael Haddon</p>
        <p class='profile__subtitle'>Infastructure Engineer</p>
    </div>
</div>

---

## Sensor Nodes

<div style='display:flex; width:90%;'>
    <div style='flex-grow:50;'>
        <ul class='flexul'>
            <li>Runs on a Raspberry PI Zero W</li>
            <li>DHT11 Temperature & Humidity Sensor</li>
            <li>Publishes data over MQTT</li>
            <li>Written in Python</li>
        </ul>
    </div>
    <div style='flex-grow:50;'>
        <img src="/images/raspberry_pi.png"  style="border: 0; box-shadow: none; width:450px;" />
    </div>
</div>

Note:
- on raspberry pi
- battery powered
- Logs to directly systemD
- gets humidity, temperature, timestamp
- and does a mqtt publish to our cluster
- written in python
- show rpi cli

---

## DC/OS cluster on AWS
<img src="/images/aws.png" style="border: 0; box-shadow: none; width: 80%;" />

Note:
- CloudFormation template for evaluation and testing
- Terraform for GCP or AWS
- https://dcos.io/install/
- https://downloads.dcos.io/dcos/stable/aws.html
-

---

## Data Ingest

<img src="/images/ingest.png" style="border: 0; box-shadow: none; width: 450px;" />

Note:
- Talk about data flow

---

## Akka

- Stream data from MQTT broker
- Transform to useful format
- Send measurements to InfluxDB

---

## Data Egress

<img src="/images/egress.png" style="border: 0; box-shadow: none; width: 450px;" />

---

## MarathonLB

- DC/OS Universe package
- Automatically exposes applications based on:
  - Network configuration
  - Labels

Note:
- Ingress + Egress LB and how it works with Amazon ELB
- Show DC/OS web ui

---

## Improvements

- Use Kafka to buffer raw data
- Use Kafka streams to transform the data
- Use EdgeLB (Enterprise only)

Note:
- Data enrichment with Kafka Streams, and use Kafka as a buffer for the raw data
- EdgeLB over MarathonLB

---

## In conclusion

From a small hobby project to a large distributed cluster

https://github.com/wjglerum/IoT-collector/tree/mesos-meetup-2018
