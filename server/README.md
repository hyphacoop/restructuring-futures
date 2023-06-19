Docker images are separated in two categories. Raspberry Pi and other operating systems. 

To run the Dockerfile provided, you first need to ensure you have Docker installed on your machine. Once you've done that, you can follow the steps below to build and run your Docker image.

Open Terminal: Open your terminal or command prompt and navigate to the directory where you've saved your Dockerfile.

Build the Docker Image: Now that your terminal's working directory is where your Dockerfile is located, you can use the following command to build your Docker image:

 `docker build -t deno-server . `

In this command, -t deno-server gives your image a tag or a name ("deno-server") for easier reference, and the . indicates that Docker should look for the Dockerfile in the current directory.

Check your Image: To ensure your image was created successfully, you can list out your Docker images with the command:

 `docker images `

You should see your deno-server image in the list.

Run your Docker Container: Now you can run your Docker container from your newly created image:

 `docker run -p 8000:8000 -p 443:443 deno-server `

This command tells Docker to run a new container from the deno-server image. The -p flags bind the ports inside the Docker container to ports on your machine, so you can access your Deno server.

To test the server, you will need the IP address of the machine that is running the server.

Here is how you can obtain this IP address based on your machine's OS:

macOS:

Open Terminal application (you can find it in Utilities inside the Applications folder or search for it in Spotlight).
Type the following command and press Enter:

`ifconfig | grep "inet " | grep -v 127.0.0.1`

You'll see something like inet 192.168.1.100 netmask 0xffffff00 broadcast 192.168.1.255. The 192.168.1.100 part is your local IP address.

Windows:

Open Command Prompt or PowerShell (you can search for it in the Start menu).
Type the following command and press Enter:

`ipconfig`

Look for "IPv4 Address" under the network interface you're currently using (e.g., Wireless LAN adapter Wi-Fi). That's your local IP address.

Linux:

Open a terminal window.
Type the following command and press Enter:

`hostname -I`

Or

`ip addr show`

In the ip addr show command output, under your network interface (like eth0 or wlan0), look for inet and the accompanying address, e.g., 192.168.1.100/24. Here, 192.168.1.100 is your local IP address.

Remember, these instructions provide the private IP address that your machine has been assigned in your local network. These addresses are usually not accessible from the Internet, but they can be used by other devices on the same local network to reach your machine.

With this IP address, you can now test syncing.

If you don't want to download deno, you can use the web app to connect to the server.
You have two options available

1. Edit the .env file to include the server's IP address
2. Use the web app's [*add a server*](https://github.com/hyphacoop/restructuring-futures#pointing-the-web-app-to-the-server) option

To test the server with the sync script, you will need to have deno installed on your machine. You can find installation instructions [here](https://deno.com/manual@v1.11.3/getting_started/installation)

In the terminal, navigate to the directory where is located the `sync_test.ts` file and input the following command:

`deno run -A sync_test.ts http://the-server's-ip-address:8000`

Replace the `the-server's-ip-address` with the IP of the machine running the server.



