=== t-network-fundamentals | Networking Fundamentals
summary: LAN/MAN/WAN, transmission modes, bandwidth vs latency, switching types and the core networking devices.
---
## Network types by scale

| Type | Scope | Example |
|---|---|---|
| PAN | a few metres | Bluetooth |
| LAN | a building or campus | office Ethernet or Wi-Fi |
| MAN | a city | a cable network |
| WAN | countries and continents | the internet |

## Transmission modes

- **Simplex:** one direction only (keyboard to computer, broadcast TV)
- **Half-duplex:** both directions, one at a time (walkie-talkie)
- **Full-duplex:** both directions at once (telephone)

## Performance

- **Bandwidth:** capacity in bits per second.
- **Throughput:** the rate actually achieved.
- **Latency:** delay = propagation + transmission + queuing + processing.
- **Transmission delay** = packet size ÷ bandwidth. **Propagation delay** = distance ÷ signal speed.

## Switching

- **Circuit switching:** a dedicated path is reserved for the whole call (traditional telephones).
- **Packet switching:** data is split into packets that travel independently (the internet).

## Devices

| Device | Layer | Role |
|---|---|---|
| Hub | 1 | repeats the signal to every port |
| Switch | 2 | forwards frames by **MAC address** |
| Router | 3 | forwards packets between networks by **IP address** |
| Gateway | up to 7 | connects networks that use different protocols |

:::mcq easy
Q: What type of network covers a single building or campus?
- WAN
- MAN
- [x] LAN
- PAN
> Local area network.
:::

:::mcq easy
Q: A walkie-talkie is an example of which transmission mode?
- Simplex
- [x] Half-duplex
- Full-duplex
- Multiplex
> Both directions, but one at a time.
:::

:::mcq easy
Q: Which transmission mode does a telephone call use?
- Simplex
- Half-duplex
- [x] Full-duplex
- Broadcast
> Both people can talk at the same time.
:::

:::mcq easy
Q: Which device forwards frames using MAC addresses?
- Hub
- [x] Switch
- Router
- Repeater
> It works at layer 2.
:::

:::mcq easy
Q: Which device connects different networks and forwards packets by IP address?
- Hub
- Switch
- [x] Router
- Modem
> It works at layer 3.
:::

:::mcq medium
Q: How does a hub differ from a switch?
- A hub is smarter
- [x] A hub repeats data to every port; a switch sends frames only to the destination port
- A switch works at layer 1
- There is no difference
> Switches reduce collisions and wasted bandwidth.
:::

:::mcq medium
Q: Which kind of switching reserves a dedicated path for the whole communication?
- Packet switching
- [x] Circuit switching
- Message switching
- Cell switching
> This is how traditional telephone networks work.
:::

:::mcq medium
Q: A 1 Mb packet is sent over a 10 Mbps link. What is the transmission delay?
- 10 s
- [x] 0.1 s
- 1 s
- 0.01 s
> Packet size ÷ bandwidth = 1/10 s.
:::

:::mcq easy
Q: What is latency?
- The maximum data rate
- [x] The delay for data to travel from source to destination
- Packet loss
- The cable length
> It includes propagation, transmission, queuing and processing delays.
:::

:::mcq hard
Q: What is the difference between bandwidth and throughput?
- They are identical
- [x] Bandwidth is the capacity of the link; throughput is the rate actually achieved
- Throughput is always higher
- Bandwidth measures delay
> Congestion and overhead reduce throughput below bandwidth.
:::

=== t-osi-model | OSI Model
summary: The seven layers, their responsibilities, data units, protocols and devices, plus encapsulation.
---
The **OSI model** has 7 layers. A mnemonic, from bottom to top: **"Please Do Not Throw Sausage Pizza Away."**

| # | Layer | Responsibility | Data unit | Examples |
|---|---|---|---|---|
| 7 | Application | services for users and applications | data | HTTP, FTP, SMTP, DNS |
| 6 | Presentation | translation, encryption, compression | data | TLS (often placed here), JPEG |
| 5 | Session | setting up and managing sessions, synchronisation | data | RPC, NetBIOS |
| 4 | Transport | end-to-end delivery, reliability, ports | **segment** (TCP) / datagram (UDP) | TCP, UDP |
| 3 | Network | logical addressing and routing | **packet** | IP, ICMP; routers |
| 2 | Data link | framing, MAC addresses, error detection | **frame** | Ethernet, PPP; switches |
| 1 | Physical | sending bits over the medium | **bit** | cables, hubs, repeaters |

## Encapsulation

Going down the stack, each layer adds its own header (and the data link layer adds a trailer). The receiver removes them going up.

## Error and flow control

- **Data link layer:** per hop (between neighbouring devices).
- **Transport layer:** end to end.

:::mcq easy
Q: How many layers does the OSI model have?
- 4
- 5
- [x] 7
- 6
> Physical, data link, network, transport, session, presentation and application.
:::

:::mcq easy
Q: Which OSI layer handles routing?
- Data link
- [x] Network
- Transport
- Session
> It uses logical (IP) addressing.
:::

:::mcq easy
Q: What is the data unit at the data link layer called?
- Packet
- Segment
- [x] Frame
- Bit
> Packet is layer 3 and segment is layer 4.
:::

:::mcq easy
Q: At which layer do TCP and UDP work?
- Network
- [x] Transport
- Application
- Session
> They provide end-to-end delivery.
:::

:::mcq medium
Q: Which layer handles encryption, compression and data format translation?
- Application
- [x] Presentation
- Session
- Transport
> Layer 6.
:::

:::mcq medium
Q: Which layer manages setting up, maintaining and closing sessions?
- Transport
- [x] Session
- Presentation
- Network
> Layer 5.
:::

:::mcq easy
Q: At which layer does a router operate?
- Physical
- Data link
- [x] Network
- Transport
> It forwards packets between networks.
:::

:::mcq medium
Q: What is encapsulation?
- Encrypting data
- [x] Each layer adding its own header to the data as it moves down the stack
- Compressing packets
- Removing headers
> Decapsulation removes them at the receiver.
:::

:::mcq easy
Q: Which layer deals with cables, voltages and bit transmission?
- Data link
- [x] Physical
- Network
- Application
> Layer 1.
:::

:::mcq hard
Q: At which two layers do error control and flow control appear?
- Physical and network
- [x] Data link (per hop) and transport (end to end)
- Session and presentation
- Application only
> The same functions operate at different scopes.
:::

=== t-tcp-ip-model | TCP/IP Model
summary: The four (or five) TCP/IP layers, how they map to OSI, and the protocols at each layer.
---
The **TCP/IP model** is the practical model the internet is built on.

| TCP/IP layer | OSI layers covered | Protocols |
|---|---|---|
| Application | application, presentation, session | HTTP, HTTPS, FTP, SMTP, DNS, DHCP, SSH |
| Transport | transport | TCP, UDP |
| Internet | network | IP, ICMP, ARP (often placed here) |
| Network access (link) | data link, physical | Ethernet, Wi-Fi |

Some textbooks use a **5-layer hybrid** model that splits the link layer into data link and physical.

## OSI vs TCP/IP

| OSI | TCP/IP |
|---|---|
| 7 layers; a theoretical reference | 4 layers; the implemented standard |
| the model came first, then the protocols | the protocols came first, then the model |
| separate session and presentation layers | these are merged into the application layer |

**ARP** maps an IP address to a MAC address on the local network. **ICMP** carries error and diagnostic messages (`ping`, `traceroute`).

:::mcq easy
Q: How many layers does the classic TCP/IP model have?
- 7
- [x] 4
- 5
- 3
> Application, transport, internet and network access.
:::

:::mcq easy
Q: Which TCP/IP layer does IP belong to?
- Application
- Transport
- [x] Internet
- Network access
> It handles logical addressing and routing.
:::

:::mcq medium
Q: Which OSI layers does the TCP/IP application layer cover?
- Application only
- [x] Application, presentation and session
- Transport and network
- Data link and physical
> The top three OSI layers are merged.
:::

:::mcq medium
Q: What does ARP do?
- Maps domain names to IP addresses
- [x] Maps IP addresses to MAC addresses on a local network
- Assigns IP addresses automatically
- Encrypts traffic
> Address Resolution Protocol.
:::

:::mcq easy
Q: Which protocol does the ping command use?
- TCP
- UDP
- [x] ICMP
- ARP
> ICMP echo request and reply.
:::

:::mcq medium
Q: How does the history of the TCP/IP model differ from that of OSI?
- TCP/IP came after the OSI protocols
- [x] TCP/IP's protocols were developed first, and the model was described afterwards
- OSI is the one used on the internet
- They were designed by the same committee at the same time
> OSI is a reference model; TCP/IP is what the internet actually uses.
:::

:::mcq easy
Q: Which of these is a TCP/IP application-layer protocol?
- IP
- TCP
- [x] HTTP
- Ethernet
> HTTP, DNS, SMTP and FTP all sit at the application layer.
:::

:::mcq easy
Q: Ethernet and Wi-Fi belong to which TCP/IP layer?
- Internet
- [x] Network access (link)
- Transport
- Application
> They are the lowest layer.
:::

:::mcq medium
Q: Which tool uses ICMP to show the path packets take to a host?
- nslookup
- [x] traceroute
- ftp
- telnet
> It relies on the TTL expiring at each hop.
:::

:::mcq hard
Q: In a 5-layer hybrid model, which layers come below the network layer?
- Transport and session
- [x] Data link and physical
- Physical only
- Presentation and session
> It splits TCP/IP's link layer into two.
:::

=== t-network-topologies | Network Topologies
summary: Bus, star, ring, mesh, tree and hybrid topologies, their link counts, advantages and failure behaviour.
---
A **topology** is the arrangement of the nodes and links in a network.

| Topology | Layout | Advantages | Disadvantages |
|---|---|---|---|
| **Bus** | every node on one backbone cable | cheap, simple | a backbone failure brings everything down; collisions |
| **Star** | every node connects to a central hub or switch | easy to manage; one link failing affects one node | the central device is a **single point of failure** |
| **Ring** | each node connects to two neighbours in a loop | orderly access (token passing) | one break can disrupt the ring (unless it is a dual ring) |
| **Mesh** | nodes have multiple point-to-point links | highly reliable and redundant | expensive: a full mesh of n nodes needs **n(n − 1)/2** links |
| **Tree** | hierarchical: stars connected by a backbone | scalable | depends on the root and backbone |
| **Hybrid** | a combination of the above | flexible | complex |

In a full mesh, **each node has n − 1 ports**.

:::mcq easy
Q: In which topology do all nodes connect to a central device?
- Bus
- [x] Star
- Ring
- Mesh
> The central device is usually a switch.
:::

:::mcq easy
Q: Which topology uses one main backbone cable?
- Star
- [x] Bus
- Mesh
- Tree
> If the backbone fails, the whole network fails.
:::

:::mcq medium
Q: How many links does a full mesh of 6 nodes need?
- 12
- [x] 15
- 30
- 36
> 6 × 5 / 2 = 15.
:::

:::mcq medium
Q: What is the single point of failure in a star topology?
- Any cable
- [x] The central hub or switch
- The last node
- There is none
> If it fails, every node is cut off.
:::

:::mcq easy
Q: Which topology offers the most redundancy and fault tolerance?
- Bus
- Star
- [x] Mesh
- Ring
> There are multiple paths between nodes.
:::

:::mcq easy
Q: Which topology connects each node to exactly two neighbours in a closed loop?
- Star
- [x] Ring
- Tree
- Bus
> Data circulates around the loop.
:::

:::mcq medium
Q: What is a tree topology?
- A single ring
- [x] A hierarchy of star networks connected to a backbone
- A full mesh
- A single bus
> It scales well in large organisations.
:::

:::mcq medium
Q: In a full mesh of n nodes, how many ports does each node need?
- n
- [x] n − 1
- n(n − 1)/2
- 2
> One link to every other node.
:::

:::mcq easy
Q: Which topology is the cheapest to cable for a small network?
- Mesh
- [x] Bus
- Hybrid
- Tree
> It needs one shared cable.
:::

:::mcq hard
Q: One cable fails in a star topology. What is the effect?
- The whole network goes down
- [x] Only the node on that cable is disconnected
- Every node loses half its bandwidth
- The hub resets
> Star isolates failures of individual links.
:::

=== t-ip-addressing | IP Addressing and Subnetting
summary: IPv4 classes, private ranges, subnet masks, CIDR, and counting hosts and subnets.
---
An **IPv4 address** is 32 bits, written as four octets (192.168.1.10).

## Classes (historical)

| Class | First octet | Default mask |
|---|---|---|
| A | 1–126 | /8 (255.0.0.0) |
| B | 128–191 | /16 (255.255.0.0) |
| C | 192–223 | /24 (255.255.255.0) |
| D | 224–239 | multicast |
| E | 240–255 | experimental |

127.x.x.x is reserved for **loopback** (127.0.0.1 = localhost).

## Private ranges (RFC 1918)

10.0.0.0/8 · 172.16.0.0/12 · 192.168.0.0/16. These are not routable on the internet and are reached through **NAT**.

## CIDR and subnetting

`/n` means the first n bits are the network part.
- **Usable hosts = 2^(32 − n) − 2** (minus the network address and the broadcast address)
- /24 → 254 hosts · /26 → 62 · /30 → 2 (used for point-to-point links)

**Example.** 192.168.1.0/26 splits a /24 into 4 subnets of 64 addresses: .0, .64, .128 and .192. For the first subnet, the network address is .0, the broadcast address is .63 and the usable hosts are .1 to .62.

:::mcq easy
Q: How many bits are in an IPv4 address?
- 16
- [x] 32
- 64
- 128
> Four octets of 8 bits each.
:::

:::mcq easy
Q: Which class does 172.20.5.4 belong to?
- A
- [x] B
- C
- D
> Its first octet (172) is in 128–191.
:::

:::mcq easy
Q: What is 127.0.0.1 used for?
- Broadcast
- [x] Loopback (localhost)
- Default gateway
- Multicast
> Traffic to it stays on the local machine.
:::

:::mcq easy
Q: Which of these is a private IPv4 address?
- 8.8.8.8
- [x] 192.168.1.5
- 172.32.0.1
- 11.0.0.1
> 192.168.0.0/16 is private. 172.32 falls just outside 172.16–172.31.
:::

:::mcq medium
Q: How many usable host addresses does a /24 network have?
- 256
- [x] 254
- 255
- 252
> 2⁸ − 2.
:::

:::mcq medium
Q: How many usable hosts does a /26 subnet have?
- 64
- [x] 62
- 30
- 126
> 2⁶ − 2.
:::

:::mcq medium
Q: What is the subnet mask for /26?
- 255.255.255.0
- [x] 255.255.255.192
- 255.255.255.128
- 255.255.255.224
> The last octet is 11000000 = 192.
:::

:::mcq medium
Q: What is the broadcast address of 192.168.1.0/26?
- 192.168.1.255
- [x] 192.168.1.63
- 192.168.1.64
- 192.168.1.62
> The subnet covers .0 to .63.
:::

:::mcq medium
Q: Which prefix is typically used for a point-to-point link with 2 usable hosts?
- /24
- /29
- [x] /30
- /32
> 2² − 2 = 2.
:::

:::mcq hard
Q: Into how many /27 subnets can a /24 network be divided, and how many usable hosts does each have?
- 4 subnets of 62
- [x] 8 subnets of 30
- 16 subnets of 14
- 2 subnets of 126
> 3 bits are borrowed (2³ = 8), leaving 5 host bits: 2⁵ − 2 = 30.
:::

=== t-ipv4-ipv6 | IPv4 vs IPv6
summary: Address sizes, notation, header differences, address types and how the transition works.
---
IPv6 was created because the 4.3 billion IPv4 addresses ran out.

| Feature | IPv4 | IPv6 |
|---|---|---|
| Address size | 32 bits | **128 bits** |
| Notation | dotted decimal (192.168.1.1) | hexadecimal, colon-separated (2001:db8::1) |
| Address space | about 4.3 × 10⁹ | about 3.4 × 10³⁸ |
| Header | variable length, with a checksum | fixed **40-byte** header, no checksum |
| Configuration | manual or DHCP | **SLAAC** (stateless autoconfiguration) or DHCPv6 |
| Broadcast | yes | **no**; uses multicast and anycast instead |
| Fragmentation | by routers and the sender | by the **sender only** |
| IPsec | optional | built in (support was originally mandatory) |

## Shortening IPv6 addresses

- Leading zeros in each group can be dropped: 0db8 → db8.
- **One** run of consecutive all-zero groups can be replaced with `::`.
- `::1` is the IPv6 loopback address.

## Transition

**Dual stack** (running both), **tunnelling** (IPv6 inside IPv4) and **translation** (NAT64).

:::mcq easy
Q: How many bits long is an IPv6 address?
- 32
- 64
- [x] 128
- 256
> That is four times as long as IPv4.
:::

:::mcq easy
Q: Which notation does IPv6 use?
- Dotted decimal
- [x] Hexadecimal groups separated by colons
- Binary only
- Octal
> For example, 2001:db8::1.
:::

:::mcq easy
Q: What is the IPv6 loopback address?
- 127.0.0.1
- [x] ::1
- ::
- fe80::1
> It is IPv6's equivalent of 127.0.0.1.
:::

:::mcq medium
Q: Which of these does IPv6 NOT have?
- Multicast
- Anycast
- [x] Broadcast
- Unicast
> Multicast replaces broadcast.
:::

:::mcq medium
Q: How large is the fixed IPv6 base header?
- 20 bytes
- [x] 40 bytes
- 60 bytes
- 128 bytes
> The IPv4 header ranges from 20 to 60 bytes.
:::

:::mcq medium
Q: How many times can "::" appear in a single IPv6 address?
- Any number of times
- [x] Once
- Twice
- Never
> More than once would make the address ambiguous.
:::

:::mcq medium
Q: Which mechanism lets an IPv6 host configure its own address without a server?
- DHCP only
- [x] SLAAC
- ARP
- NAT
> Stateless address autoconfiguration.
:::

:::mcq medium
Q: In IPv6, who may fragment packets?
- Every router
- [x] Only the sending host
- Only the destination
- Nobody
> Routers send an ICMPv6 "Packet Too Big" message instead.
:::

:::mcq easy
Q: Why was IPv6 introduced?
- To make addresses shorter
- [x] Because IPv4 addresses were running out
- To remove routing
- To replace TCP
> A 32-bit space is too small for today's internet.
:::

:::mcq hard
Q: What is the shortened form of 2001:0db8:0000:0000:0000:0000:0000:0001?
- 2001:db8:0:1
- [x] 2001:db8::1
- 2001::db8::1
- 2001:db8:1
> Drop the leading zeros and compress the single run of zero groups.
:::

=== t-routing-switching | Routing and Switching
summary: How switches learn MAC addresses, VLANs, static vs dynamic routing, distance-vector vs link-state, and routing protocols.
---
## Switching (layer 2)

A switch **learns MAC addresses** by recording which port each frame's source MAC arrived on, and stores them in its **MAC address table**. It forwards frames only to the right port. For an unknown destination, it **floods** the frame to every port except the one it arrived on.

**VLANs** divide one physical switch into separate logical broadcast domains. **STP** (Spanning Tree Protocol) blocks redundant links to prevent layer-2 loops.

## Routing (layer 3)

A router chooses the next hop for a packet using its **routing table** and the **longest prefix match**.

- **Static routing:** routes are configured manually. Simple and secure, but it doesn't adapt.
- **Dynamic routing:** routers exchange information automatically.

| Type | Idea | Protocol |
|---|---|---|
| **Distance vector** | share your table with neighbours; uses Bellman–Ford; can suffer **count-to-infinity** | RIP (hop count, maximum 15) |
| **Link state** | every router learns the whole topology and runs **Dijkstra** | OSPF, IS-IS |
| **Path vector** | the routing protocol of the internet, between autonomous systems | **BGP** |

**Interior** protocols (RIP, OSPF) run inside one organisation; the **exterior** protocol (BGP) runs between organisations.

:::mcq easy
Q: How does a switch learn MAC addresses?
- From DNS
- [x] By recording the source MAC address of each incoming frame against its port
- From the router
- It doesn't learn them
> It builds its MAC address table automatically.
:::

:::mcq medium
Q: What does a switch do with a frame whose destination MAC address is unknown?
- Drops it
- [x] Floods it to every port except the one it arrived on
- Sends it to the router
- Sends it back to the sender
> Once the device replies, the switch learns where it is.
:::

:::mcq easy
Q: What does a VLAN do?
- Speeds up the CPU
- [x] Splits a switch into separate logical broadcast domains
- Encrypts traffic
- Assigns IP addresses
> Virtual LAN.
:::

:::mcq medium
Q: Which routing protocol is distance-vector and uses hop count?
- OSPF
- [x] RIP
- BGP
- IS-IS
> RIP's maximum is 15 hops; 16 means unreachable.
:::

:::mcq medium
Q: Which algorithm does OSPF use?
- Bellman–Ford
- [x] Dijkstra's shortest path
- Kruskal's
- Prim's
> It is a link-state protocol.
:::

:::mcq easy
Q: Which protocol routes traffic between autonomous systems on the internet?
- RIP
- OSPF
- [x] BGP
- ARP
> Border Gateway Protocol.
:::

:::mcq medium
Q: What is the count-to-infinity problem associated with?
- Link-state routing
- [x] Distance-vector routing
- Static routing
- Switching
> Bad news about a failed route spreads slowly.
:::

:::mcq easy
Q: What is a disadvantage of static routing?
- It is complex to configure
- [x] It doesn't adapt automatically to network changes
- It uses a lot of bandwidth
- It is insecure by default
> Routes must be updated by hand.
:::

:::mcq medium
Q: What does the Spanning Tree Protocol prevent?
- IP conflicts
- [x] Layer-2 loops in networks with redundant switch links
- DNS failures
- Packet encryption
> It blocks the redundant paths.
:::

:::mcq hard
Q: A routing table has entries for 10.0.0.0/8 and 10.1.0.0/16. Which route does a packet for 10.1.2.3 use?
- 10.0.0.0/8
- [x] 10.1.0.0/16
- Both, alternately
- The default route
> The longest (most specific) matching prefix wins.
:::

=== t-tcp-udp | TCP vs UDP
summary: Connection-oriented vs connectionless transport, the three-way handshake, reliability, flow and congestion control, and use cases.
---
| | TCP | UDP |
|---|---|---|
| Connection | **connection-oriented** (handshake) | **connectionless** |
| Reliability | guaranteed delivery, in order, with retransmission | best effort; no guarantee |
| Overhead | higher (20+ byte header) | low (8-byte header) |
| Flow and congestion control | yes (sliding window, slow start) | no |
| Speed | slower | faster |
| Uses | web (HTTP/1.1, HTTP/2), email, file transfer, SSH | DNS queries, streaming, VoIP, gaming, DHCP |

## The three-way handshake

1. Client → **SYN**
2. Server → **SYN-ACK**
3. Client → **ACK**

Connection teardown uses FIN and ACK (a four-way exchange).

## Reliability mechanisms

Sequence numbers, acknowledgements, retransmission on timeout, and checksums.

- **Flow control** stops the sender from overwhelming the **receiver** (the receive window).
- **Congestion control** stops the sender from overwhelming the **network** (slow start, congestion avoidance).

**Ports** identify applications: HTTP 80, HTTPS 443, SSH 22, FTP 21, SMTP 25, DNS 53.

:::mcq easy
Q: Which transport protocol is connection-oriented?
- UDP
- [x] TCP
- IP
- ICMP
> It sets up a connection with a handshake.
:::

:::mcq easy
Q: What is the correct order of the TCP three-way handshake?
- ACK, SYN, SYN-ACK
- [x] SYN, SYN-ACK, ACK
- SYN, ACK, FIN
- FIN, ACK, SYN
> The client sends SYN, the server replies SYN-ACK and the client sends ACK.
:::

:::mcq easy
Q: Which protocol is better suited to live video calls?
- TCP
- [x] UDP
- FTP
- SMTP
> Low latency matters more than retransmitting lost packets.
:::

:::mcq medium
Q: What does TCP flow control prevent?
- Network congestion
- [x] The sender overwhelming the receiver
- Packet routing errors
- DNS failures
> It uses the receive window.
:::

:::mcq medium
Q: What does congestion control prevent?
- The receiver's buffer overflowing
- [x] The sender overloading the network
- Packet duplication
- Port conflicts
> Slow start and congestion avoidance.
:::

:::mcq easy
Q: How large is the UDP header?
- 20 bytes
- [x] 8 bytes
- 40 bytes
- 4 bytes
> It contains only the ports, length and checksum.
:::

:::mcq easy
Q: Which port does HTTPS use by default?
- 80
- [x] 443
- 22
- 53
> HTTP uses 80.
:::

:::mcq medium
Q: Which of these does UDP provide?
- Guaranteed delivery
- In-order delivery
- [x] A checksum for error detection
- Congestion control
> It has a checksum but no retransmission.
:::

:::mcq medium
Q: Which transport protocol do DNS queries usually use?
- TCP
- [x] UDP (TCP for large responses and zone transfers)
- ICMP
- ARP
> Fast, small request and response.
:::

:::mcq hard
Q: How does TCP ensure data arrives in order?
- It sends a single packet only
- [x] Using sequence numbers to reorder segments at the receiver
- Using UDP underneath
- With a timestamp on each byte
> Missing segments are retransmitted.
:::

=== t-http-https | HTTP and HTTPS
summary: Request and response structure, methods, status codes, statelessness, cookies, and how TLS secures HTTPS.
---
**HTTP** is the stateless application protocol of the web. A client sends a **request** and the server returns a **response**.

## Methods

| Method | Purpose | Idempotent? |
|---|---|---|
| GET | retrieve | yes |
| POST | create or submit | **no** |
| PUT | replace | yes |
| PATCH | partially update | not necessarily |
| DELETE | remove | yes |

## Status codes

| Range | Meaning | Examples |
|---|---|---|
| 1xx | informational | 101 Switching Protocols |
| 2xx | success | 200 OK, 201 Created, 204 No Content |
| 3xx | redirection | 301 Moved Permanently, 302 Found, 304 Not Modified |
| 4xx | client error | 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found |
| 5xx | server error | 500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable |

## Statelessness

Each request is independent. **Cookies**, sessions and tokens add state on top of it.

## HTTPS

HTTPS is HTTP over **TLS**, on port 443. It gives:
- **Encryption:** confidentiality
- **Integrity:** tampering is detected
- **Authentication:** the server's **certificate** is signed by a trusted CA

The TLS handshake uses **asymmetric** cryptography to authenticate the server and agree on keys, then **symmetric** encryption for the data, because it is fast.

:::mcq easy
Q: Which HTTP method is normally used to retrieve data?
- POST
- [x] GET
- DELETE
- PATCH
> GET should have no side effects.
:::

:::mcq easy
Q: What does status code 404 mean?
- Server error
- [x] Not Found
- Unauthorized
- OK
> The requested resource doesn't exist.
:::

:::mcq easy
Q: Which status code class indicates a server error?
- 2xx
- 3xx
- 4xx
- [x] 5xx
> For example, 500 Internal Server Error.
:::

:::mcq medium
Q: What does 401 mean, and how does it differ from 403?
- They mean the same thing
- [x] 401 means you aren't authenticated; 403 means you're authenticated but not allowed
- 401 is a server error
- 403 means not found
> 401: log in. 403: you are known, but forbidden.
:::

:::mcq easy
Q: What does "HTTP is stateless" mean?
- It never stores data
- [x] Each request is independent; the server doesn't remember previous requests by default
- It can't use cookies
- It has no headers
> Cookies and sessions add state on top.
:::

:::mcq medium
Q: Which method is NOT idempotent?
- GET
- PUT
- DELETE
- [x] POST
> Repeating a POST can create duplicates.
:::

:::mcq easy
Q: Which protocol secures HTTPS?
- SSH
- [x] TLS
- FTP
- IPsec
> TLS replaced SSL.
:::

:::mcq medium
Q: Why does TLS use symmetric encryption for the bulk of the data?
- It is more secure than asymmetric encryption
- [x] It is much faster; asymmetric cryptography is used only to set up the keys
- Browsers don't support asymmetric encryption
- It needs no keys
> This hybrid approach gives both speed and security.
:::

:::mcq easy
Q: What does status code 201 mean?
- OK
- [x] Created
- Accepted
- No Content
> It is typically returned after a successful POST that creates a resource.
:::

:::mcq hard
Q: What does an HTTPS server certificate mainly prove?
- That the website is free of bugs
- [x] That the server's public key belongs to the named domain, as vouched for by a trusted certificate authority
- That the connection is fast
- That the user is logged in
> It authenticates the server and prevents impersonation.
:::

=== t-dns | DNS
summary: How domain names resolve to IP addresses: the hierarchy, recursive vs iterative queries, record types and caching.
---
The **Domain Name System** translates human-readable names (www.example.com) into IP addresses. It is a distributed, hierarchical database.

## Hierarchy

**Root (.)** → **TLD** (.com, .in, .org) → **authoritative** servers for the domain (example.com).

## Resolution

1. The browser and OS caches are checked first.
2. The **recursive resolver** (usually your ISP's, or a public one such as 8.8.8.8) does the work for you.
3. It asks a **root** server, which refers it to the **TLD** server.
4. The TLD server refers it to the domain's **authoritative** server, which returns the answer.
5. The answer is cached for its **TTL**.

- **Recursive query:** "Give me the final answer" (client to resolver).
- **Iterative query:** "Tell me who to ask next" (resolver to root, TLD and so on).

## Record types

| Record | Purpose |
|---|---|
| A | name → IPv4 address |
| AAAA | name → IPv6 address |
| CNAME | an alias to another name |
| MX | the domain's mail servers |
| NS | the domain's authoritative name servers |
| TXT | arbitrary text (SPF, verification) |
| PTR | reverse lookup (IP → name) |

DNS uses **port 53**, mostly over UDP.

:::mcq easy
Q: What does DNS do?
- Assigns IP addresses
- [x] Translates domain names into IP addresses
- Encrypts web traffic
- Routes packets
> It works like the internet's phone book.
:::

:::mcq easy
Q: Which record maps a name to an IPv4 address?
- AAAA
- [x] A
- MX
- CNAME
> AAAA is for IPv6.
:::

:::mcq easy
Q: Which record specifies a domain's mail servers?
- A
- NS
- [x] MX
- TXT
> Mail exchanger.
:::

:::mcq easy
Q: What is a CNAME record?
- An IPv6 address
- [x] An alias that points one name at another
- A mail server
- A reverse lookup
> For example, www → example.com.
:::

:::mcq medium
Q: Which DNS servers sit at the very top of the hierarchy?
- TLD servers
- [x] Root servers
- Authoritative servers
- Recursive resolvers
> Root servers refer queries to the TLD servers.
:::

:::mcq medium
Q: What is the difference between a recursive and an iterative query?
- There is none
- [x] A recursive query asks for the final answer; an iterative query returns a referral to the next server
- An iterative query is always faster
- A recursive query only works for IPv6
> Clients send recursive queries to resolvers, and resolvers query iteratively.
:::

:::mcq easy
Q: Which port does DNS use?
- 80
- [x] 53
- 25
- 443
> It runs mostly over UDP.
:::

:::mcq medium
Q: What does a DNS record's TTL control?
- Its security level
- [x] How long resolvers may cache it
- The packet size
- The number of hops
> TTL stands for time to live.
:::

:::mcq medium
Q: Which record type is used for reverse DNS (finding the name for an IP address)?
- A
- MX
- [x] PTR
- NS
> Pointer record.
:::

:::mcq hard
Q: You change a domain's A record, but some users still reach the old server for hours. Why?
- DNS is broken
- [x] Resolvers cached the old record until its TTL expired
- The browser is offline
- Routers store DNS records permanently
> Lowering the TTL before a migration speeds up the switch.
:::

=== t-dhcp | DHCP
summary: Automatic IP configuration: the DORA process, leases, the options DHCP provides, relay agents and common issues.
---
**DHCP** (Dynamic Host Configuration Protocol) automatically gives devices an IP address and other network settings.

## DORA

1. **Discover:** the client broadcasts "Is there a DHCP server?"
2. **Offer:** a server offers an IP address.
3. **Request:** the client requests the offered address.
4. **Acknowledge:** the server confirms, and the lease begins.

## What DHCP provides

IP address · subnet mask · **default gateway** · **DNS servers** · lease duration (and more options).

## Leases

Addresses are **leased** for a time. The client tries to **renew at 50%** of the lease (T1). Static mappings (**reservations**) always give a particular device the same address.

## Details

- It uses **UDP**: the server listens on port **67** and the client on port **68**.
- Clients start with no IP address, so Discover is a **broadcast**. A **DHCP relay agent** (ip helper) forwards the broadcasts across routers to a central server.
- If no server answers, Windows and many other systems fall back to an **APIPA** address (169.254.x.x).

:::mcq easy
Q: What is the main job of DHCP?
- Resolving domain names
- [x] Automatically assigning IP addresses and network settings to devices
- Encrypting traffic
- Routing packets
> It provides automatic configuration.
:::

:::mcq easy
Q: What is the correct order of the DHCP process?
- Request, Offer, Discover, Acknowledge
- [x] Discover, Offer, Request, Acknowledge
- Offer, Discover, Acknowledge, Request
- Discover, Request, Offer, Acknowledge
> DORA.
:::

:::mcq medium
Q: Why is a DHCP Discover message sent as a broadcast?
- It is faster
- [x] The client has no IP address yet and doesn't know the server's address
- For security
- Servers block unicast messages
> It goes to everyone on the local network.
:::

:::mcq easy
Q: Which of these does DHCP NOT normally provide?
- IP address
- Subnet mask
- Default gateway
- [x] The user's password
> It provides network settings only.
:::

:::mcq medium
Q: Which ports does DHCP use?
- TCP 80 and 443
- [x] UDP 67 (server) and 68 (client)
- UDP 53
- TCP 22
> It runs over UDP.
:::

:::mcq medium
Q: What is a DHCP relay agent for?
- Encrypting DHCP
- [x] Forwarding DHCP broadcasts across routers to a server on another subnet
- Assigning MAC addresses
- Caching DNS
> It lets one central server cover many subnets.
:::

:::mcq medium
Q: A Windows PC shows the address 169.254.10.20. What does this suggest?
- It is working normally
- [x] It couldn't reach a DHCP server and assigned itself an APIPA address
- It is an IPv6 address
- It has a public static IP
> It is a link-local fallback address.
:::

:::mcq easy
Q: What is a DHCP lease?
- A permanent address
- [x] The time-limited assignment of an IP address to a client
- A billing contract
- A routing table
> It must be renewed.
:::

:::mcq medium
Q: When does a client usually first try to renew its lease?
- At the very end of the lease
- [x] At 50% of the lease time (T1)
- Every minute
- Never
> If that fails, it tries again at 87.5% (T2).
:::

:::mcq hard
Q: How do you make a network printer always get the same IP address from DHCP?
- Shorten the lease time
- [x] Create a DHCP reservation for the printer's MAC address
- Disable DHCP everywhere
- Use a broadcast IP address
> The server always gives that MAC address the same IP.
:::

=== t-firewalls | Firewalls and Network Security
summary: Packet filtering, stateful and application-layer firewalls, rule ordering, DMZs, NAT, VPNs, IDS vs IPS and common attacks.
---
A **firewall** controls traffic between networks using a set of rules (allow or deny).

## Types

| Type | Inspects | Notes |
|---|---|---|
| **Packet filter** (stateless) | source and destination IP, port, protocol | fast and simple, but has no context |
| **Stateful** | tracks connection state | allows return traffic for established connections automatically |
| **Application-layer** (proxy / WAF) | application content (HTTP and so on) | can block SQL injection and similar attacks |
| **Next-generation (NGFW)** | stateful + deep packet inspection + IPS + application awareness | |

## Rules

- Rules are checked **top-down**, and the **first match wins**.
- Best practice is to **deny by default** and allow only what is needed (least privilege).

## Related concepts

- **DMZ:** a separate zone for public servers (web, mail), isolated from the internal network.
- **NAT:** lets private addresses share a public IP address. It hides the internal structure, but it isn't a security control on its own.
- **VPN:** an encrypted tunnel across an untrusted network.
- **IDS** detects and alerts; **IPS** detects **and blocks**.

## Common attacks

DoS/DDoS · man-in-the-middle · phishing · port scanning · spoofing · SQL injection (at the application layer).

:::mcq easy
Q: What is a firewall's main job?
- Speeding up internet traffic
- [x] Controlling network traffic according to security rules
- Assigning IP addresses
- Storing backups
> It allows or blocks traffic.
:::

:::mcq medium
Q: What does a stateful firewall track that a stateless packet filter doesn't?
- MAC addresses
- [x] The state of connections, so return traffic is matched to established sessions
- File contents
- User passwords
> It understands which connections are open.
:::

:::mcq medium
Q: Which kind of firewall can inspect HTTP content and block SQL injection?
- Stateless packet filter
- [x] Application-layer firewall or WAF
- Hub
- DHCP server
> It understands the application protocol.
:::

:::mcq medium
Q: In what order are firewall rules usually evaluated?
- Randomly
- [x] From the top down; the first matching rule applies
- From the bottom up
- All rules are combined
> Rule order matters.
:::

:::mcq easy
Q: What is the recommended default firewall policy?
- Allow all
- [x] Deny all, then allow only what is needed
- Allow all outbound and inbound
- No default
> Least privilege.
:::

:::mcq medium
Q: What is a DMZ?
- A wireless network
- [x] A separate zone for public-facing servers, isolated from the internal network
- A type of VPN
- An antivirus program
> A compromise in the DMZ doesn't directly expose the internal network.
:::

:::mcq medium
Q: What is the difference between an IDS and an IPS?
- They are identical
- [x] An IDS detects and alerts; an IPS detects and blocks
- An IPS only logs
- An IDS encrypts traffic
> Intrusion detection vs intrusion prevention.
:::

:::mcq easy
Q: What does a VPN provide?
- Faster downloads
- [x] An encrypted tunnel across an untrusted network
- Free internet
- IP address assignment
> Virtual private network.
:::

:::mcq medium
Q: Which attack overwhelms a service with traffic from many sources?
- Phishing
- [x] DDoS
- SQL injection
- Spoofing
> Distributed denial of service.
:::

:::mcq hard
Q: Is NAT a substitute for a firewall?
- Yes, it blocks all attacks
- [x] No; it hides internal addresses, but it isn't designed as a security control
- Yes, for IPv6
- Only on routers
> Use a proper firewall policy as well.
:::
