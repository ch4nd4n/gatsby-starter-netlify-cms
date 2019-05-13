---
templateKey: blog-post
title: "Install Android 4.2 on Galaxy Nexus"
date: 2012-11-14 12:03
comments: true
tags: 
	- android
---
Android 4.2 is out for couple of days now. Yesterday morning I got OTA notification to upgrade it on my Galaxy Nexus GSM.
As excited I could be, I went for it, mobile rebooted to recovery mode. After a bit of cranking and all, boom! it failed
to update the system with some error  message. I was like WTF! I rebooted the phone and I was anticipating that it
would have some how installed 4.2 Alas, no that was not the case. I tried OTA couple of times  again but in vain.
So resorted to Google and found that OTA packages are available to download. Followed the article on slashgear and XDA forum.
All that failed I kept on getting error message `assert failed : apply_patch_check ("/system/build.prop"` something
like that.
I tried something new this time, I decided to install factory image. List of factory images for nexus device is found
at [Google Nexus site](https://developers.google.com/android/nexus/images) I went for [4.2 (JOP40C)](https://developers.google.com/android/nexus/images#takjujop40c). Yes this is a 261+ MB in size.

In short, if you follow the steps given below you should be able to update your GNex to 4.2 without rooting it or OEM unlock. You don't even need to install CWM (clockworkmod) etc.

![Screen Shot](https://lh4.googleusercontent.com/-Hat4ZS53se4/UKNEqWVv3BI/AAAAAAAAFFA/JfZwOrN1PLM/s512/Screenshot_2012-11-14-11-01-15.png)
<!-- more -->
### Prerequisite
I am using ubuntu 12.04 with android SDK installed. Which implies you would have `adb` and `fastboot` available.
You can check for that in platform-tools folder in your android sdk path. On Ubuntu I suppose you don't need to install
any sort of device drivers.

These steps may work on Windows as well, although with minor modification, you should have device drivers, `adb` and `fastboot` installed. Note that `tz` file has `.bat` file. So I assume if you have adb and fastboot in System `Path`. All you need to do is run `flash-all.bat` from `cmd` prompt.

### Steps Involved

__Please note that these steps would wipe out all the data from your phone. Consider taking a backup of data. This may even brick your phone.__

* Unzip content of `takju-jop40c-factory-1a47c890.tgz`
* boot your phone to bootloader
* install bootloader
* reboot to bootloader
* flash takju image to phone

Essentially above steps are in `flash-all.sh` file. `flash-all.sh` did not work for me because for some reason `fastboot` fires
up for me only when I sudo.

In short you would fire following commands in the sequence below

    fastboot flash bootloader bootloader-maguro-primelc03.img
    fastboot reboot-bootloader
    fastboot flash radio radio-maguro-i9250xxlh1.img
    fastboot reboot-bootloader
    fastboot -w update image-takju-jop40c.zip

I copied the content of `takju-jop40c-factory-1a47c890.tgz` to `platform-tools` folder before starting up with the above commands for ease of referencing the files.

log of my system below for reference.

    $ adb reboot-bootloader

    $ sudo ./fastboot flash bootloader bootloader-maguro-primelc03.img
    sending 'bootloader' (2308 KB)...
	OKAY [  0.581s]
	writing 'bootloader'...
	OKAY [  0.653s]
	finished. total time: 1.234s

    $ sudo ./fastboot reboot-bootloader
    rebooting into bootloader...
	OKAY [  0.006s]
	finished. total time: 0.006s

    $ sudo ./fastboot flash radio radio-maguro-i9250xxlh1.img
    sending 'radio' (12288 KB)...
	OKAY [  3.092s]
	writing 'radio'...
	OKAY [  1.638s]
	finished. total time: 4.730s

    $ sudo ./fastboot reboot-bootloader
    rebooting into bootloader...
	OKAY [  0.006s]
	finished. total time: 0.006s


    $ sudo ./fastboot -w update image-takju-jop40c.zip
    archive does not contain 'boot.sig'
	archive does not contain 'recovery.sig'
	archive does not contain 'system.sig'
	--------------------------------------------
	Bootloader Version...: PRIMELC03
	Baseband Version.....: I9250XXLH1
	Serial Number........: 0149C7A508017004
	--------------------------------------------
	checking product...
	OKAY [  0.007s]
	checking version-bootloader...
	OKAY [  0.008s]
	checking version-baseband...
	OKAY [  0.008s]
	sending 'boot' (4400 KB)...
	OKAY [  1.108s]
	writing 'boot'...
	OKAY [  0.398s]
	sending 'recovery' (4900 KB)...
	OKAY [  1.248s]
	writing 'recovery'...
	OKAY [  0.707s]
	sending 'system' (436723 KB)...

	OKAY [110.300s]
	writing 'system'...
	OKAY [ 42.772s]
	erasing 'userdata'...
	OKAY [  1.122s]
	formatting 'userdata' partition...
	Creating filesystem with parameters:
	    Size: 14539534336
	    Block size: 4096
	    Blocks per group: 32768
	    Inodes per group: 8144
	    Inode size: 256
	    Journal blocks: 32768
	    Label:
	    Blocks: 3549691
	    Block groups: 109
	    Reserved block group size: 871
	Created filesystem with 11/887696 inodes and 97200/3549691 blocks
	sending 'userdata' (137559 KB)...
	writing 'userdata'...
	OKAY [ 46.028s]
	erasing 'cache'...
	OKAY [  0.044s]
	formatting 'cache' partition...
	Creating filesystem with parameters:
	    Size: 452984832
	    Block size: 4096
	    Blocks per group: 32768
	    Inodes per group: 6912
	    Inode size: 256
	    Journal blocks: 1728
	    Label:
	    Blocks: 110592
	    Block groups: 4
	    Reserved block group size: 31
	Created filesystem with 11/27648 inodes and 3566/110592 blocks
	sending 'cache' (8832 KB)...
	writing 'cache'...
	OKAY [  4.060s]
	rebooting...

	finished. total time: 207.843s

After completion phone would reboot automatically. Please leave a comment if you this works for you or not.