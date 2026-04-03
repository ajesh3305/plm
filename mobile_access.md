# Mobile Access Instructions

To view the Plant Production Tracker on your mobile phone or tablet, follow these steps:

## Prerequisites
1. Ensure your computer and your mobile device are connected to the same Wi-Fi network.
2. The development server must be running on your computer (`npm run dev`).

## Steps to Connect

### 1. Find your Computer's Local IP Address
On your Windows computer:
- Open the Command Prompt (`cmd`).
- Type `ipconfig` and press Enter.
- Look for the line that says **IPv4 Address**. It will look something like `192.168.1.XX`.

### 2. Enter the Address on your Mobile Device
- Open the browser on your phone (Chrome or Safari).
- Type the IPv4 address followed by the port listed in your terminal (usually `5173`).
- **Example**: `http://192.168.1.25:5173`

### 3. Log In and Test
- You should see the Plant Production Tracker login screen.
- You can now test the mobile responsiveness and enter records directly from the factory floor!

---
> [!TIP]
> If it's not connecting, check your computer's firewall settings to ensure it allows incoming connections on the port being used by the dev server.
