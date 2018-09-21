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
            <li>Written in Python</li>
            <li>Runs on a Raspberry PI Zero W</li>
            <li>DHT11 Temperature & Humidity Sensor</li>
            <li>Publishes data to MQTT</li>
        </ul>
    </div>
    <div style='flex-grow:50;'>
        <img src="/images/raspberry_pi.png"  style="border: 0; box-shadow: none; width:450px;" />
    </div>
</div>

Note: 
- written in python
- on raspberry pi
- battery powered
- Logs to directly systemD
- gets humidity, temperature, timestamp
- and does an mqtt publish to our cluster

---

## Data Ingest

<img src="/images/ingest.png" style="border: 0; box-shadow: none; width: 450px;" />

Note:
- asd
- CloudFormation template for evaluation and testing, and Terraform for GCP or AWS

---

## Akka

---

## Data Egress

<img src="/images/egress.png" style="border: 0; box-shadow: none; width: 450px;" />

---

## MarathonLB

Note: Ingress + Egress LB and how it works with Amazon ELB

---

## Improvements

Note: 
- Data enrichment with Kafka Streams, and use Kafka as a buffer for the raw data
- EdgeLB over MarathonLB

--- 

## In conclusion...

Scalables

https://github.com/wjglerum/IoT-collector/tree/mesos-meetup-2018
