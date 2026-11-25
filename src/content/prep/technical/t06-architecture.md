=== t-cpu-architecture | CPU Architecture
summary: Von Neumann vs Harvard, RISC vs CISC, buses, clock speed, pipelining and multicore basics.
---
The **CPU** fetches, decodes and executes instructions. Its main parts are the **ALU**, the **control unit** and the **registers**, connected to memory by **buses**.

## Von Neumann vs Harvard

| Von Neumann | Harvard |
|---|---|
| **one** memory and bus for both instructions and data | **separate** memories and buses for instructions and data |
| simpler, but suffers the **Von Neumann bottleneck** | fetches an instruction and data at the same time; used in DSPs and microcontrollers |

Modern CPUs are effectively **modified Harvard**: split L1 instruction and data caches over a unified main memory.

## Buses

- **Address bus:** carries addresses, CPU → memory (one-way). An **n-bit** address bus can address **2ⁿ locations**.
- **Data bus:** carries data in both directions.
- **Control bus:** read/write signals, interrupts, the clock.

## RISC vs CISC

| RISC | CISC |
|---|---|
| few, simple, fixed-length instructions | many complex, variable-length instructions |
| about one instruction per clock cycle; easy to pipeline | multi-cycle instructions |
| load/store architecture; many registers | instructions can operate on memory directly |
| ARM, RISC-V | x86 |

## Performance

- **Clock speed** in GHz (cycles per second). CPU time = instructions × CPI × clock period.
- **Pipelining** overlaps the stages of several instructions (fetch, decode, execute, memory, write-back). It improves **throughput**, not the latency of a single instruction. **Hazards** are structural, data or control.
- **Multicore:** several processing cores on one chip.

:::mcq easy
Q: What are the main components of a CPU?
- RAM, ROM, disk
- [x] ALU, control unit and registers
- Keyboard, mouse, monitor
- GPU, PSU, fan
> Together they fetch, decode and execute instructions.
:::

:::mcq easy
Q: Which architecture uses a single memory for both instructions and data?
- Harvard
- [x] Von Neumann
- Dataflow
- Systolic
> This creates the Von Neumann bottleneck.
:::

:::mcq medium
Q: How many memory locations can a 16-bit address bus address?
- 16
- 256
- [x] 65,536
- 1,024
> 2¹⁶ = 65,536.
:::

:::mcq easy
Q: Which bus carries data in both directions?
- Address bus
- [x] Data bus
- Control bus only
- None
> The address bus carries addresses one way, from the CPU.
:::

:::mcq medium
Q: Which is a characteristic of RISC?
- Many complex, variable-length instructions
- [x] Simple, fixed-length instructions designed for pipelining
- Few registers
- Instructions that mainly operate on memory
> ARM and RISC-V are RISC designs.
:::

:::mcq easy
Q: x86 processors are traditionally classified as:
- RISC
- [x] CISC
- VLIW
- Harvard-only
> Internally they translate instructions into RISC-like micro-operations.
:::

:::mcq medium
Q: What does pipelining improve?
- The latency of each individual instruction
- [x] Instruction throughput
- Memory capacity
- Clock voltage
> Several instructions are in progress at once.
:::

:::mcq medium
Q: Which pipeline hazard occurs when an instruction needs the result of a previous instruction that isn't ready yet?
- Structural hazard
- [x] Data hazard
- Control hazard
- Cache hazard
> It is fixed by forwarding or stalls.
:::

:::mcq medium
Q: A program executes 2 × 10⁹ instructions at a CPI of 1.5 on a 3 GHz CPU. What is the CPU time?
- 0.5 s
- [x] 1 s
- 2 s
- 1.5 s
> Time = instructions × CPI ÷ clock rate = 3 × 10⁹ ÷ 3 × 10⁹ = 1 s.
:::

:::mcq hard
Q: What is the Von Neumann bottleneck?
- Overheating of the CPU
- [x] The limited throughput of a shared bus between the CPU and memory for both instructions and data
- A shortage of registers
- Slow disk access
> Caches and separate instruction and data paths ease it.
:::

=== t-alu-control-unit | ALU and Control Unit
summary: What the ALU computes, status flags, hardwired vs microprogrammed control units and the control signals they generate.
---
## Arithmetic Logic Unit (ALU)

The ALU performs:
- **Arithmetic:** add, subtract, increment, decrement (and multiply or divide in many designs)
- **Logic:** AND, OR, NOT, XOR
- **Shifts and comparisons**

It sets **status flags** in the flag (status) register after operations:

| Flag | Set when |
|---|---|
| Zero (Z) | the result is 0 |
| Carry (C) | there is an unsigned carry or borrow out of the top bit |
| Sign/Negative (N) | the result's top bit is 1 |
| Overflow (V) | a **signed** result doesn't fit |

**Example (8-bit):** 127 + 1 = 128 overflows the signed range (−128 to 127), so V = 1.

## Control unit (CU)

The CU **directs** the operation of the processor. It decodes instructions and generates **control signals** that tell the ALU, registers, memory and I/O what to do and when.

| Hardwired CU | Microprogrammed CU |
|---|---|
| fixed logic circuits | control signals stored as **microinstructions** in a control memory |
| **faster** | slower, but **flexible** and easier to modify |
| hard to change | easy to change or extend the instruction set |
| typical of RISC | typical of CISC |

:::mcq easy
Q: What does the ALU do?
- Stores programs
- [x] Arithmetic and logical operations
- Controls the hard disk
- Displays output
> Add, subtract, AND, OR and so on.
:::

:::mcq easy
Q: What is the control unit's main job?
- Doing arithmetic
- [x] Decoding instructions and generating control signals for the other components
- Storing data permanently
- Cooling the CPU
> It coordinates the whole processor.
:::

:::mcq easy
Q: Which flag is set when a result is zero?
- Carry
- [x] Zero
- Overflow
- Sign
> Z = 1.
:::

:::mcq medium
Q: On an 8-bit signed processor, what happens when you compute 127 + 1?
- Nothing special
- [x] Signed overflow: the overflow flag is set
- Only the zero flag is set
- The carry flag is always cleared and the result is 128
> 128 is outside −128 to 127.
:::

:::mcq medium
Q: Which kind of control unit is faster?
- Microprogrammed
- [x] Hardwired
- They are equal
- Neither generates signals
> Fixed logic is fast but inflexible.
:::

:::mcq medium
Q: Which kind of control unit stores control signals as microinstructions?
- Hardwired
- [x] Microprogrammed
- ALU-based
- Cache-based
> It uses a control memory.
:::

:::mcq easy
Q: Which of these is a logical operation in the ALU?
- ADD
- SUB
- [x] XOR
- INC
> AND, OR, NOT and XOR are logical operations.
:::

:::mcq medium
Q: Which type of control unit is more common in CISC processors?
- Hardwired
- [x] Microprogrammed
- Neither
- Optical
> Complex instructions are easier to implement with microcode.
:::

:::mcq medium
Q: What does the carry flag indicate?
- A negative result
- [x] An unsigned carry out of (or borrow into) the most significant bit
- A zero result
- An interrupt
> Overflow is the flag for signed results.
:::

:::mcq hard
Q: Why is a microprogrammed control unit easier to modify?
- It uses no memory
- [x] Behaviour is changed by updating the microcode instead of redesigning circuits
- It has fewer instructions
- It runs at a higher clock speed
> That flexibility is its main advantage.
:::

=== t-registers | Registers
summary: General-purpose and special registers (PC, IR, MAR, MDR, accumulator, stack pointer, flags) and their roles.
---
**Registers** are the **fastest** storage in the computer: small, inside the CPU, and holding the values being worked on right now.

## Special-purpose registers

| Register | Holds |
|---|---|
| **Program Counter (PC)** | the address of the **next** instruction to fetch |
| **Instruction Register (IR)** | the instruction **currently** being decoded or executed |
| **Memory Address Register (MAR)** | the address of the memory location to read or write |
| **Memory Data/Buffer Register (MDR/MBR)** | the data read from or written to memory |
| **Accumulator (AC)** | intermediate ALU results (in accumulator-based designs) |
| **Stack Pointer (SP)** | the top of the stack (used by calls and returns) |
| **Status/Flag register (PSW)** | the condition flags (Z, C, N, V) and interrupt bits |

**General-purpose registers** (such as x86's EAX and EBX, or ARM's R0–R15) hold operands and addresses.

## Memory hierarchy (fastest and smallest first)

Registers → L1 cache → L2 cache → L3 cache → main memory (RAM) → SSD/HDD

The **word size** (32 or 64 bits) is usually the width of the general-purpose registers.

:::mcq easy
Q: Which register holds the address of the next instruction?
- IR
- [x] Program Counter (PC)
- MAR
- MDR
> It is updated after each fetch, or by jumps.
:::

:::mcq easy
Q: Which register holds the instruction currently being executed?
- PC
- [x] Instruction Register (IR)
- SP
- AC
> It is fetched from memory into the IR.
:::

:::mcq easy
Q: Which register holds the memory address to be accessed?
- MDR
- [x] MAR
- PC
- IR
> Memory Address Register.
:::

:::mcq easy
Q: Which register holds the data being transferred to or from memory?
- MAR
- [x] MDR (MBR)
- PC
- SP
> Memory Data Register, also called the Memory Buffer Register.
:::

:::mcq easy
Q: Which is the fastest storage in a computer?
- L1 cache
- [x] Registers
- RAM
- SSD
> They are inside the CPU core itself.
:::

:::mcq medium
Q: What does the stack pointer track?
- The next instruction
- [x] The top of the stack in memory
- The cache size
- The disk head position
> It is used for function calls, returns and local variables.
:::

:::mcq medium
Q: Which register stores the condition flags (zero, carry, overflow)?
- Accumulator
- [x] The status/flag register (PSW)
- MAR
- IR
> Branch instructions test these flags.
:::

:::mcq easy
Q: In accumulator-based designs, where are intermediate ALU results kept?
- PC
- [x] Accumulator
- MAR
- Disk
> For example: ADD X means AC ← AC + M[X].
:::

:::mcq medium
Q: In a 64-bit processor, how wide are the general-purpose registers usually?
- 32 bits
- [x] 64 bits
- 16 bits
- 128 bits
> The word size usually matches the register width.
:::

:::mcq hard
Q: A program executes a jump (branch) instruction. Which register is directly updated with the target address?
- MAR
- IR
- [x] Program Counter
- Stack Pointer
> The next fetch then comes from the target address.
:::

=== t-instruction-cycle | Instruction Cycle
summary: Fetch, decode, execute and store; the register transfers in each step; interrupts; and addressing modes.
---
The CPU repeats the **instruction cycle** (fetch–decode–execute) continuously.

## Steps (register-transfer view)

1. **Fetch**
   - MAR ← PC
   - MDR ← Memory[MAR]
   - IR ← MDR
   - PC ← PC + 1 (the next instruction)
2. **Decode:** the control unit interprets the opcode and works out where the operands are.
3. **Execute:** the ALU operates, memory is read or written, or a branch updates the PC.
4. **Store / write-back:** the result is written to a register or to memory.
5. **Interrupt check:** if an interrupt is pending, save the PC and state and jump to the **interrupt service routine (ISR)**.

## Addressing modes

| Mode | Operand is… | Example |
|---|---|---|
| Immediate | in the instruction itself | ADD R1, #5 |
| Register | in a register | ADD R1, R2 |
| Direct | at the memory address given | LOAD R1, 1000 |
| Indirect | at the address stored at the given address | LOAD R1, (1000) |
| Register indirect | at the address held in a register | LOAD R1, (R2) |
| Indexed / displacement | at base + offset | LOAD R1, 8(R2) |
| Relative | at PC + offset (used for branches) | BEQ +12 |

**Immediate** is the fastest (no memory access for the operand); **indirect** needs an extra memory access.

:::mcq easy
Q: What is the correct order of the basic instruction cycle?
- Decode → fetch → execute
- [x] Fetch → decode → execute
- Execute → fetch → decode
- Fetch → execute → decode
> Followed by a write-back and an interrupt check.
:::

:::mcq medium
Q: What is the first register transfer in the fetch step?
- IR ← PC
- [x] MAR ← PC
- PC ← IR
- MDR ← PC
> The address of the next instruction goes to the MAR.
:::

:::mcq easy
Q: What happens during the decode step?
- Data is written to disk
- [x] The control unit interprets the instruction's opcode and operands
- The PC is reset
- Memory is cleared
> It decides what to do next.
:::

:::mcq medium
Q: When is the PC normally incremented?
- After execution only
- [x] During the fetch step, after the instruction is read
- Never
- Only on interrupts
> It then points to the next instruction.
:::

:::mcq medium
Q: What does the CPU do when an interrupt is pending at the end of a cycle?
- Ignores it permanently
- [x] Saves the current state and PC, then runs the interrupt service routine
- Restarts the computer
- Deletes the current program
> It resumes the program after the ISR.
:::

:::mcq easy
Q: In ADD R1, #5, what is the addressing mode of #5?
- Direct
- [x] Immediate
- Indirect
- Register
> The value is inside the instruction.
:::

:::mcq medium
Q: In indirect addressing, how many memory accesses does fetching the operand take?
- 0
- 1
- [x] 2 (the address, then the operand)
- 3
> The address field points to another address.
:::

:::mcq medium
Q: Which addressing mode is commonly used for branches within a program?
- Immediate
- [x] PC-relative
- Indirect only
- Absolute only
> Target = PC + offset, which makes code position-independent.
:::

:::mcq easy
Q: Which addressing mode is the fastest for getting the operand?
- Indirect
- [x] Immediate
- Direct
- Indexed
> No memory access is needed for the operand.
:::

:::mcq hard
Q: R2 contains 2000. Which address does LOAD R1, 8(R2) read from?
- 8
- 2000
- [x] 2008
- 1992
> Base + displacement = 2000 + 8.
:::

=== t-cache-memory | Cache Memory
summary: Locality, hits and misses, effective access time, mapping techniques, replacement and write policies.
---
**Cache** is a small, fast SRAM memory between the CPU and main memory that keeps recently used data close to the processor.

## Why it works: locality of reference

- **Temporal locality:** recently used data is likely to be used again (loop variables).
- **Spatial locality:** data near recently used data is likely to be used next (array elements).

## Performance

- **Hit ratio h** = hits ÷ total accesses.
- **Average access time** = h × t_cache + (1 − h) × t_miss, where t_miss = t_cache + t_memory under hierarchical access.
  - With h = 0.9, t_cache = 10 ns and t_memory = 100 ns: 0.9 × 10 + 0.1 × 110 = **20 ns**.

## Mapping techniques

| Mapping | A memory block can go… | Trade-off |
|---|---|---|
| **Direct** | in exactly one line (block mod number of lines) | simple and fast, but suffers **conflict misses** |
| **Fully associative** | in any line | flexible, but searching every line is costly |
| **Set-associative** (k-way) | in any line of one set | the common compromise |

## Replacement and write policies

- Replacement: **LRU**, FIFO, random.
- **Write-through:** write to the cache and memory together (simple, more traffic).
- **Write-back:** write to memory only when the line is evicted (a **dirty bit** tracks changes).

## Kinds of miss (the 3 Cs)

Compulsory (first access) · capacity (the cache is too small) · conflict (blocks compete for the same line).

Levels: **L1** (per core, split into instruction and data, fastest) → **L2** → **L3** (shared, largest).

:::mcq easy
Q: Why is cache memory used?
- To store files permanently
- [x] To reduce the average memory access time by keeping frequently used data close to the CPU
- To increase disk size
- To replace RAM entirely
> It bridges the speed gap between the CPU and RAM.
:::

:::mcq easy
Q: Accessing array elements one after another benefits from:
- Temporal locality
- [x] Spatial locality
- No locality
- Cache coherence
> Neighbouring addresses are loaded together in one block.
:::

:::mcq medium
Q: Hit ratio 0.9, cache time 10 ns, memory time 100 ns, with a miss costing cache + memory time. What is the average access time?
- 19 ns
- [x] 20 ns
- 100 ns
- 10 ns
> 0.9 × 10 + 0.1 × 110 = 9 + 11 = 20 ns.
:::

:::mcq medium
Q: In which mapping can each memory block go into exactly one cache line?
- Fully associative
- [x] Direct mapping
- Set-associative
- Random mapping
> line = block number mod number of lines.
:::

:::mcq medium
Q: Which mapping lets a block go into any cache line?
- Direct
- [x] Fully associative
- 2-way set-associative
- Indexed
> It has no conflict misses, but needs a costly search.
:::

:::mcq medium
Q: What is a write-back cache?
- It writes to memory on every write
- [x] It writes modified lines to memory only when they are evicted (tracked by a dirty bit)
- It never writes to memory
- It is a read-only cache
> Write-through writes to memory every time.
:::

:::mcq easy
Q: Which cache level is closest to the core and fastest?
- L3
- L2
- [x] L1
- Main memory
> It is usually split into instruction and data caches.
:::

:::mcq medium
Q: A miss that happens the first time a block is ever accessed is a:
- Conflict miss
- Capacity miss
- [x] Compulsory (cold) miss
- Coherence miss
> One of the 3 Cs.
:::

:::mcq medium
Q: A direct-mapped cache has 8 lines. Which line does memory block 21 map to?
- 2
- [x] 5
- 21
- 3
> 21 mod 8 = 5.
:::

:::mcq hard
Q: Which mapping is the usual compromise between direct-mapped and fully associative caches?
- Random mapping
- [x] k-way set-associative mapping
- Paged mapping
- Segmented mapping
> A block can go into any of the k lines of one set.
:::

=== t-primary-secondary-memory | Primary and Secondary Memory
summary: Volatile main memory vs non-volatile storage; HDD vs SSD; the memory hierarchy and its speed, cost and capacity trade-offs.
---
## Primary memory

Directly accessible by the CPU: **registers, cache and main memory (RAM)**, plus ROM.
- Fast, expensive per GB, smaller.
- RAM is **volatile**: its contents are lost when the power goes off.

## Secondary memory

Not directly accessible by the CPU; data is loaded into RAM first. **HDD, SSD, USB flash drives, optical discs, magnetic tape.**
- **Non-volatile**, cheaper per GB, much larger, slower.

## HDD vs SSD

| HDD | SSD |
|---|---|
| spinning magnetic platters and a moving head | NAND flash; no moving parts |
| slower (seek time + rotational latency) | much faster, especially for random access |
| cheaper per GB, high capacity | more expensive per GB |
| sensitive to shock | durable; limited write cycles (wear levelling) |

## The memory hierarchy

```
Registers   ← fastest, smallest, most expensive per byte
L1/L2/L3 cache
Main memory (RAM)
SSD / HDD
Tape / archival   ← slowest, largest, cheapest per byte
```

Moving **down** the hierarchy: capacity ↑, cost per bit ↓, access time ↑.

**Tertiary storage** (tape libraries, optical jukeboxes) is used for archives and backups.

:::mcq easy
Q: Which of these is primary memory?
- Hard disk
- [x] RAM
- USB drive
- DVD
> The CPU accesses it directly.
:::

:::mcq easy
Q: What does it mean that RAM is volatile?
- It is very fast
- [x] Its contents are lost when the power is switched off
- It can't be written to
- It is stored on disk
> Secondary storage is non-volatile.
:::

:::mcq easy
Q: Which storage has no moving parts?
- HDD
- [x] SSD
- Magnetic tape
- Floppy disk
> It uses NAND flash memory.
:::

:::mcq medium
Q: Moving down the memory hierarchy (registers → disk), what happens?
- Speed increases
- [x] Capacity increases and cost per bit decreases, but access time increases
- Everything gets more expensive
- Capacity decreases
> That is the fundamental trade-off.
:::

:::mcq easy
Q: Why is an SSD faster than an HDD for random reads?
- It spins faster
- [x] It has no mechanical seek or rotational delay
- It has more platters
- It uses magnetic tape
> Flash cells are accessed electronically.
:::

:::mcq medium
Q: Which statement about secondary memory is true?
- The CPU executes instructions directly from it
- [x] Its data must be loaded into main memory before the CPU can process it
- It is volatile
- It is faster than cache
> Programs are loaded from disk into RAM.
:::

:::mcq easy
Q: Which storage is the cheapest per GB for long-term archives?
- RAM
- SSD
- [x] Magnetic tape
- Cache
> Tape is used for backups and archives.
:::

:::mcq medium
Q: What is a known limitation of SSDs?
- Very slow reads
- [x] A limited number of write/erase cycles (managed by wear levelling)
- Sensitivity to magnets
- Moving heads
> Modern SSDs last for many years of normal use.
:::

:::mcq easy
Q: Which of these is at the top of the memory hierarchy (fastest)?
- RAM
- SSD
- [x] Registers
- L3 cache
> They are inside the CPU.
:::

:::mcq hard
Q: Why do computers need both primary and secondary memory?
- They don't; one is enough
- [x] Primary memory is fast but small and volatile; secondary is large and permanent but slow, so combining them balances speed, capacity and cost
- Secondary memory is faster
- Primary memory is permanent
> The hierarchy gives near-cache speed at near-disk cost.
:::

=== t-ram-rom | RAM and ROM
summary: SRAM vs DRAM, the ROM family (PROM, EPROM, EEPROM, flash), firmware, and where each is used.
---
## RAM (random access memory)

Volatile, read–write main memory.

| SRAM (static) | DRAM (dynamic) |
|---|---|
| stores bits in **flip-flops** (about 6 transistors per bit) | stores bits as charge in a **capacitor** (1 transistor + 1 capacitor) |
| **no refresh** needed | must be **refreshed** periodically, because the charge leaks |
| faster, more expensive, lower density | slower, cheaper, higher density |
| used for **cache** | used for **main memory** |

**DDR SDRAM** (DDR4, DDR5) transfers data on both edges of the clock.

## ROM (read-only memory)

Non-volatile memory that holds **firmware** (BIOS/UEFI, embedded programs).

| Type | Programming | Erasing |
|---|---|---|
| Mask ROM | at the factory | never |
| **PROM** | once, by the user | never (one-time programmable) |
| **EPROM** | electrically | with **UV light** (the whole chip) |
| **EEPROM** | electrically | **electrically**, byte by byte |
| **Flash** | electrically | electrically, in **blocks** (fast; used in SSDs, USB drives and phones) |

:::mcq easy
Q: Which memory is non-volatile?
- RAM
- [x] ROM
- Cache
- Registers
> It keeps its contents without power.
:::

:::mcq easy
Q: What is cache memory usually built from?
- DRAM
- [x] SRAM
- EPROM
- Flash
> SRAM is fast and needs no refresh.
:::

:::mcq medium
Q: Why must DRAM be refreshed?
- To erase data
- [x] Its data is stored as charge in capacitors that leaks over time
- It uses flip-flops
- To increase speed
> SRAM doesn't need refreshing.
:::

:::mcq easy
Q: What is main memory (system RAM) usually built from?
- SRAM
- [x] DRAM
- Mask ROM
- PROM
> It is cheaper and denser.
:::

:::mcq medium
Q: How is an EPROM erased?
- Electrically, byte by byte
- [x] With ultraviolet light
- It can't be erased
- With a magnet
> It has a quartz window on the chip.
:::

:::mcq medium
Q: Which ROM type can be erased and rewritten electrically, byte by byte?
- PROM
- EPROM
- [x] EEPROM
- Mask ROM
> Electrically erasable PROM.
:::

:::mcq easy
Q: Which memory type can be programmed only once by the user?
- EEPROM
- [x] PROM
- Flash
- DRAM
> It is one-time programmable.
:::

:::mcq easy
Q: Where is firmware such as the BIOS or UEFI stored?
- RAM
- [x] ROM or flash memory
- The CPU cache
- The hard disk only
> It must survive power-off.
:::

:::mcq medium
Q: How does SRAM store each bit?
- In a capacitor
- [x] In a flip-flop of several transistors
- Magnetically
- Optically
> Typically 6 transistors per bit.
:::

:::mcq hard
Q: Which memory technology is used in SSDs and USB drives and erases in blocks?
- EPROM
- DRAM
- [x] Flash memory
- SRAM
> Flash is a type of EEPROM optimised for block erasure.
:::

=== t-number-systems | Number Systems
summary: Binary, octal, decimal and hexadecimal conversions, two's complement, signed ranges and binary arithmetic.
---
## Bases

| System | Base | Digits |
|---|---|---|
| Binary | 2 | 0 1 |
| Octal | 8 | 0–7 |
| Decimal | 10 | 0–9 |
| Hexadecimal | 16 | 0–9, A–F (A = 10 … F = 15) |

## Conversions

- **Decimal → base b:** divide by b repeatedly and read the remainders from bottom to top. 25 → 11001₂.
- **Base b → decimal:** add up digit × bᵖᵒˢⁱᵗⁱᵒⁿ. 1011₂ = 8 + 0 + 2 + 1 = **11**.
- **Binary ↔ hex:** group bits in fours. 1111 0101₂ = **F5**₁₆.
- **Binary ↔ octal:** group bits in threes. 101 110₂ = **56**₈.

## Signed numbers

**Two's complement** (used by virtually all CPUs): to negate a number, invert every bit and add 1.
- +5 = 0000 0101 → −5 = 1111 1011.
- The range of n bits is **−2ⁿ⁻¹ to 2ⁿ⁻¹ − 1**. For 8 bits: **−128 to 127**.
- There is one representation of zero, and subtraction is just addition.

Unsigned n bits range from 0 to 2ⁿ − 1 (8 bits: 0 to 255).

## Binary addition

0 + 0 = 0, 0 + 1 = 1, 1 + 1 = 10 (write 0, carry 1), 1 + 1 + 1 = 11.

## Units

1 byte = 8 bits; 1 nibble = 4 bits; 1 KiB = 1024 bytes (in SI, 1 kB = 1000 bytes).

:::mcq easy
Q: What is 1011₂ in decimal?
- 9
- [x] 11
- 13
- 10
> 8 + 0 + 2 + 1 = 11.
:::

:::mcq easy
Q: What is 25 in binary?
- 10101
- [x] 11001
- 11010
- 10011
> 16 + 8 + 1 = 25.
:::

:::mcq easy
Q: What is 11110101₂ in hexadecimal?
- E5
- [x] F5
- F6
- D5
> 1111 = F and 0101 = 5.
:::

:::mcq medium
Q: What is 3F₁₆ in decimal?
- 61
- [x] 63
- 48
- 315
> 3 × 16 + 15 = 63.
:::

:::mcq medium
Q: What is 101110₂ in octal?
- 46
- [x] 56
- 65
- 54
> Grouped in threes: 101 = 5, 110 = 6.
:::

:::mcq medium
Q: What is the 8-bit two's complement representation of −5?
- 1000 0101
- [x] 1111 1011
- 1111 1010
- 0000 0101
> Invert 0000 0101 to get 1111 1010, then add 1.
:::

:::mcq easy
Q: What range can an 8-bit two's complement number represent?
- 0 to 255
- [x] −128 to 127
- −127 to 127
- −256 to 255
> −2⁷ to 2⁷ − 1.
:::

:::mcq easy
Q: What is the largest unsigned number that fits in 8 bits?
- 127
- 256
- [x] 255
- 128
> 2⁸ − 1.
:::

:::mcq medium
Q: What is 0110₂ + 0111₂?
- 1100
- [x] 1101
- 1011
- 1110
> 6 + 7 = 13 = 1101.
:::

:::mcq hard
Q: Interpreted as 8-bit two's complement, what decimal value is 1111 0000?
- 240
- [x] −16
- −15
- −112
> Invert to 0000 1111, add 1 to get 0001 0000 = 16, so the value is −16.
:::
