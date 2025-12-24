# LAN Multiplayer Setup Guide

This guide explains how to play Tron Overworld with friends on your local network.

## Quick Start (Same Computer)

1. **Start the WebSocket server:**
   ```bash
   cd server
   npm run ws
   ```

2. **Start the game client:**
   ```bash
   npm run dev
   ```

3. **Open multiple browser windows** at `http://localhost:5173`

Players will automatically see each other!

## Phone/Tablet Setup (Easy!)

No installation needed on your phone! Just connect to the host computer:

1. **On the host computer:**
   - Start WebSocket server: `cd server && npm run ws`
   - Start Vite: `npm run dev`
   - Note your IP address (displayed by both servers)

2. **On your phone:**
   - Make sure phone is on the same WiFi network
   - Open your phone's browser (Chrome, Safari, etc.)
   - Navigate to: `http://HOST_IP:5173` (e.g., `http://192.168.1.100:5173`)
   - The game will automatically connect to the WebSocket server!

**That's it!** The game automatically detects the server address from the URL, so your phone will connect to the right server without any configuration.

## LAN Setup (Multiple Computers)

### On the Host Computer (Server)

1. **Find your local IP address:**
   - **Windows:** Open Command Prompt and run `ipconfig`, look for "IPv4 Address"
   - **Mac/Linux:** Open Terminal and run `ifconfig` or `ip addr`, look for your local IP (usually starts with 192.168.x.x or 10.0.x.x)

2. **Start the WebSocket relay server:**
   ```bash
   cd server
   npm run ws
   ```
   
   The server will display:
   ```
   WebSocket relay server running on:
     - Local:   ws://localhost:8080
     - Network: ws://192.168.1.XXX:8080
   
   For LAN connections, use: ws://192.168.1.XXX:8080
   ```
   
   Note the Network address - you'll need this for client connections!

3. **Start the Vite dev server:**
   ```bash
   npm run dev
   ```
   
   Vite will show:
   ```
   ➜  Local:   http://localhost:5173/
   ➜  Network: http://192.168.1.XXX:5173/
   ```

### On Client Computers

**Simple Method (Recommended):**

Just open your browser to the host's game URL:
```
http://HOST_IP:5173
```

The game automatically detects the WebSocket server from the URL! No configuration needed.

**Advanced: Environment Variable Override**

If you need to connect to a different WebSocket server, create a `.env.local` file:
```
VITE_WS_SERVER=ws://192.168.1.XXX:8080
```
Then run `npm run dev` and access the game normally.

## Firewall Configuration

You may need to allow incoming connections on these ports:
- **Port 8080** - WebSocket relay server
- **Port 5173** - Vite dev server

### Windows Firewall
1. Open Windows Defender Firewall
2. Click "Advanced settings"
3. Create new Inbound Rules for ports 8080 and 5173

### Mac Firewall
1. System Preferences → Security & Privacy → Firewall
2. Firewall Options → Add Node.js if prompted

### Linux (UFW)
```bash
sudo ufw allow 8080
sudo ufw allow 5173
```

## Troubleshooting

### Can't see other players
- Check that all players are connected to the same network
- Verify the WebSocket server is running (`npm run ws` in server folder)
- Check firewall settings on the host computer
- Make sure all clients are using the correct server IP address

### Connection timeout
- Ensure the WebSocket server is running before starting clients
- Check that port 8080 is not blocked by firewall
- Verify the IP address is correct

### Players can connect but can't see each other
- Check browser console for errors (F12)
- Verify that player state is being broadcast (check server logs)
- Make sure you're not using localhost for LAN connections

## Network Requirements

- All computers must be on the same local network
- Host computer must have:
  - WebSocket server running (port 8080)
  - Vite dev server running (port 5173)
- Client computers need:
  - Network access to host's ports 8080 and 5173
  - Modern web browser with WebGL support

## Controls

### Desktop/Laptop:
- **WASD**: Move (with momentum physics)
- **Mouse**: Look around (click to enable pointer lock)
- **Arrow Keys**: Turn left/right
- **Movement**: Follows camera direction (like Doom/sneakywoods)

### Mobile/Touch Devices:
- **Touch controls**: Click to enable pointer lock, then drag to look around
- **On-screen controls**: May require touch control implementation for movement
- **Note**: For best mobile experience, consider adding touch joystick controls

**Tip for phones**: Use landscape orientation for a better view!

## Features

- **Real-time multiplayer** via WebSocket relay
- **Deterministic colors** - each player gets a unique color based on their peer ID
- **Momentum-based physics** - smooth, arcade-style movement
- **Automatic synchronization** - position and rotation updates 10 times per second

## Production Deployment

For internet play (not just LAN), you would need to:
1. Deploy the WebSocket server to a public server
2. Use WSS (WebSocket Secure) instead of WS
3. Deploy the client to a static hosting service
4. Update `VITE_WS_SERVER` to point to your public server

Example:
```
VITE_WS_SERVER=wss://your-domain.com:8080
