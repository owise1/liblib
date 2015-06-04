# liblib with pi

## Setting up Raspberry Pi using [Ansible](http://www.ansible.com/)
* [Flashing Raspian to an SD Card](http://computers.tutsplus.com/articles/how-to-flash-an-sd-card-for-raspberry-pi--mac-53600)
* Install ansible if you don't already have it
    * OSX: you may also need to install [sshpass](http://thornelabs.net/2014/02/09/ansible-os-x-mavericks-you-must-install-the-sshpass-program.html)

## Set up your raspberry pi manually
* [Flashing Raspian to an SD Card](http://computers.tutsplus.com/articles/how-to-flash-an-sd-card-for-raspberry-pi--mac-53600)
* [Install WAP software and configure](https://learn.adafruit.com/setting-up-a-raspberry-pi-as-a-wifi-access-point/install-software)
    * This tutorial creates a password protected network. If you want it to be open, leave off the final 5 lines that they suggest for hostapd.conf
    * You can skip the section called "Configure Network Address Translation"
* Install CouchDB `sudo apt-get install couchdb`
* Install dnsmasq `sudo apt-get install dsnmasq`
    1. Edit /etc/dnsmasq.conf
    2. Add `address=/#/192.168.42.1`
    3. Change `#interface=eth0` to `interface=wlan0`
    4. `sudo service dnsmasq restart`
* make sure ifplugd doesn't mess things up [link](http://sirlagz.net/2013/02/10/how-to-use-the-raspberry-pi-as-a-wireless-access-pointrouter-part-3b/)
* [Install NodeJs](http://weworkweplay.com/play/raspberry-pi-nodejs/)
```
wget http://node-arm.herokuapp.com/node_latest_armhf.deb 
sudo dpkg -i node_latest_armhf.deb
```
* [Route port 80 to port 3000](http://stackoverflow.com/questions/16573668/best-practices-when-running-node-js-with-port-80-ubuntu-linode)
    1. `sudo iptables -t nat -A PREROUTING -i wlan0 -p tcp --dport 80 -j REDIRECT --to-port 3000`
    2. `sudo bash -c 'iptables-save > /etc/network/iptables'`
    3. And add this to the end of /etc/network/interfaces `pre-up iptables-restore < /etc/network/iptables`
* Install liblib daemon
```
sudo npm install -g forever bower gulp
npm install liblib
forever start node_modules/liblib/liblibd/index.js
```
* Run deamon on boot by adding `su pi -c 'forever start --uid liblibd -a /home/pi/node_modules/liblib/liblibd/index.js < /dev/null &'` to /etc/rc.local
* You'll probably want couchapp
```
sudo apt-get install python python-pip python-dev
sudo pip install couchapp
```

### Thankful to

* [escapologyBB](https://github.com/escapologyBB/ansible-raspberry-pi) for the beginnings of the ansible playbook
