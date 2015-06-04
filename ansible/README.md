#  Raspberry Pi Tor Enabled Wi-Fi Hotspot.

I have run this playbook using a couple of different Wi-Fi aerials, but for the best range and performance I've settled on the [Alfa AWUS036NH][aerial], it simply plugs into the USB port on your Raspberry Pi and away you go.

I have come across a problem with Wi-Fi dongles running the RTL8188CUS chipset so you need to quickly check which chipset your dongle is using. After installing ansible run the following command to find out which radio chipset you're using:

      ansible YOUR-PI -a "lsusb"

This command will return a list of the USB devices connected to your Raspberry Pi, somewhere in the list you will see your Wi-Fi adapter and it will probably look something like this:

    YOUR-PI | success | rc=0 >>
    Bus 001 Device 002: ID 0424:9512 Standard Microsystems Corp.
    Bus 001 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub
    Bus 001 Device 003: ID 0424:ec00 Standard Microsystems Corp.
    Bus 001 Device 004: ID 0951:1665 Kingston Technology
    Bus 001 Device 005: ID 0bda:8176 Realtek Semiconductor Corp. RTL8188CUS 802.11n WLAN Adapter

If you get the output above telling you that you have the `RTL8188CUS 802.11n` adapter there are a number of changes you need to make.

So, for those of you using the `RTL8188CUS` chipset you need to open the file `/roles/hotspot/default/main.yml` and change the line: `chipset: nl80211` to `chipset: rtl871xdrv`

You then need to open the file `/roles/hotspot/tasks/main.yml`and find this section of code and comment it in:

    # - name: Workaround for IP address not persisting across reboots.
    #   copy: src=hostapd dest=/usr/sbin/hostapd
    #   sudo: yes

## Setting the Hostname

If you want to change the hostname of your Raspberry Pi go to `roles/common/vars/main.yml` and change the variable after **hostname:** to your liking.

## Setting the SSID and  Passphrase of your Hotspot

If you want to change the SSID and Passphrase(you definitely do!) of your hotspot, navigate to the file `roles/hotspot/defaults/main.yml` and change the values accordingly.

## Running the Playbook

To run the playbook issue this in the terminal:

    ansible-playbook -i hosts site.yml

Then you should have a completely working Wi-Fi hotspot!

## Torifying your Hotspot ##

This is a completely optional step, but if you would like to turn your Wi-Fi hotspot into a Tor enabled hotspot simply open `site.yml`and comment in the line:

    # - tor

Then you can run the playbook again, the only changes that will be made will be the ones to Torify your Wi-Fi hotspot.

And that's it, you should have a fully Torified Wi-Fi hotspot!  Let me know if you get stuck and I will help if I can.

[aerial]:http://www.amazon.co.uk/Alfa-AWUS036NH-Wireless-Long-Range-Screw-On/dp/B0041L5TW8
