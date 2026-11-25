=== t-os-fundamentals | OS Fundamentals
summary: What an operating system does, kernel vs user mode, system calls, kernel types and OS categories.
---
An **operating system** manages hardware and gives programs a convenient, protected environment to run in.

## Main functions

Process management · memory management · file systems · device and I/O management · security and protection · networking.

## Kernel mode and user mode

- **User mode:** applications run with restricted privileges.
- **Kernel mode:** the OS has full hardware access.
- A program asks the OS for a service through a **system call** (for example `read`, `write`, `fork`), which switches the CPU from user mode to kernel mode.

## Kernel designs

| Type | Idea | Example |
|---|---|---|
| Monolithic | the whole OS runs in kernel space; fast | Linux |
| Microkernel | only the essentials run in the kernel; services run in user space; more robust | QNX, Minix |
| Hybrid | a mix of both | Windows NT, macOS (XNU) |

## Types of operating system

Batch · time-sharing (multitasking) · real-time (hard or soft deadlines) · distributed · embedded · mobile.

**Booting:** firmware (BIOS/UEFI) → bootloader → kernel loads → the init or system manager starts services.

:::mcq easy
Q: Which of these is NOT a core function of an operating system?
- Process management
- Memory management
- File management
- [x] Compiling source code
> Compilers are applications, not OS functions.
:::

:::mcq easy
Q: What is a system call?
- A phone call to the system administrator
- [x] A program's request to the OS kernel for a service
- A hardware interrupt from the keyboard only
- A function in a user library that never enters the kernel
> Examples are read(), write() and fork().
:::

:::mcq easy
Q: In which mode does the OS kernel run?
- User mode
- [x] Kernel (supervisor) mode
- Guest mode
- Safe mode
> It has full access to the hardware.
:::

:::mcq medium
Q: Which kernel design runs most OS services in user space?
- Monolithic
- [x] Microkernel
- Exokernel only
- Batch kernel
> This improves robustness and isolation.
:::

:::mcq easy
Q: What kind of kernel does Linux use?
- Microkernel
- [x] Monolithic (with loadable modules)
- Exokernel
- Nanokernel
> Drivers and services run in kernel space.
:::

:::mcq medium
Q: Which type of OS guarantees responses within strict deadlines?
- Batch OS
- [x] Real-time OS
- Time-sharing OS
- Distributed OS
> It is used in aviation, medical devices and industrial control.
:::

:::mcq easy
Q: Which software runs first when a computer powers on?
- The kernel
- [x] Firmware (BIOS/UEFI)
- The shell
- The desktop environment
> The firmware loads the bootloader, which loads the kernel.
:::

:::mcq medium
Q: What is the main benefit of a time-sharing OS?
- No CPU scheduling is needed
- [x] Many users or programs share the CPU and get fast responses
- It runs one job at a time
- It doesn't need memory management
> The CPU switches quickly between tasks.
:::

:::mcq medium
Q: Why does the CPU switch to kernel mode during a system call?
- To speed up the program
- [x] To perform privileged operations safely on the program's behalf
- To free the program's memory
- To restart the program
> User mode can't access hardware directly.
:::

:::mcq hard
Q: What is the main trade-off of a microkernel compared with a monolithic kernel?
- Less robust
- [x] More robust and modular, but with extra overhead from message passing between services
- Faster, but less secure
- No device drivers are possible
> Services talk through inter-process communication rather than direct function calls.
:::

=== t-processes-threads | Processes and Threads
summary: Process vs thread, the process control block, process states, context switching, fork() and IPC.
---
A **process** is a program in execution, with its own address space (code, data, heap, stack) and resources. A **thread** is a unit of execution **inside** a process. Threads share the process's code, data, heap and open files, but each has **its own stack and registers**.

| | Process | Thread |
|---|---|---|
| Memory | separate address space | shared within the process |
| Creation and switching cost | high | low |
| Communication | IPC (pipes, sockets, shared memory) | shared variables (need synchronisation) |
| A crash affects | only that process | the whole process |

## Process states

**New → Ready → Running → (Waiting/Blocked) → Ready … → Terminated**

## Process Control Block (PCB)

The OS's record for each process: PID, state, program counter, CPU registers, scheduling information, memory information, open files.

## Context switch

Saving one process's state into its PCB and loading another's. It is pure overhead, because no useful work happens during the switch.

## fork()

`fork()` creates a child process that is a copy of the parent. It returns **0 in the child** and the **child's PID in the parent**. A program that calls fork() n times in sequence ends up with **2ⁿ processes**.

**Zombie:** a process that has finished but hasn't yet been reaped by its parent. **Orphan:** a process whose parent exited (it is adopted by init or systemd).

:::mcq easy
Q: What is a process?
- A program stored on disk
- [x] A program in execution
- A thread
- A file
> A process is the active instance of a program.
:::

:::mcq easy
Q: What do threads of the same process share?
- Stack and registers
- [x] Code, data, heap and open files
- Nothing
- Program counter
> Each thread has its own stack and registers.
:::

:::mcq easy
Q: Which data structure stores a process's state and information?
- Page table
- [x] Process Control Block (PCB)
- File allocation table
- Inode
> It holds the PID, state, program counter, registers and more.
:::

:::mcq medium
Q: A running process requests I/O. Which state does it move to?
- Ready
- [x] Waiting (blocked)
- Terminated
- New
> It waits until the I/O completes.
:::

:::mcq medium
Q: What is a context switch?
- Changing the user
- [x] Saving the state of one process and loading the state of another
- Switching between kernel types
- Rebooting the system
> It is overhead with no useful work.
:::

:::mcq medium
Q: What does fork() return in the child process?
- The child's PID
- [x] 0
- −1
- The parent's PID
> The parent receives the child's PID; −1 means fork failed.
:::

:::mcq medium
Q: A program calls fork() three times in a row. How many processes exist at the end (including the original)?
- 3
- 6
- [x] 8
- 4
> Each fork doubles the count: 2³ = 8.
:::

:::mcq easy
Q: Why are threads lighter than processes?
- They don't use the CPU
- [x] They share an address space, so creating and switching them is cheaper
- They have no stack
- They run only in kernel mode
> No new address space has to be set up.
:::

:::mcq medium
Q: What is a zombie process?
- A process using 100% of the CPU
- [x] A process that has finished but whose exit status hasn't been collected by its parent
- A process whose parent has died
- A virus
> The parent must call wait() to reap it.
:::

:::mcq hard
Q: Which of these is NOT an inter-process communication mechanism?
- Pipes
- Shared memory
- Message queues
- [x] The program counter
> The program counter is a CPU register.
:::

=== t-process-scheduling | Process Scheduling
summary: Scheduling queues, long-, short- and medium-term schedulers, the dispatcher and scheduling criteria.
---
The OS decides **which process runs next**, which processes are admitted into memory, and which are swapped out.

## Queues

- **Job queue:** all processes in the system
- **Ready queue:** in memory and ready to run
- **Device (I/O) queues:** waiting for a device

## Schedulers

| Scheduler | Decides | Frequency |
|---|---|---|
| **Long-term** (job scheduler) | which jobs to admit into memory; controls the **degree of multiprogramming** | infrequent |
| **Short-term** (CPU scheduler) | which ready process gets the CPU next | very frequent (milliseconds) |
| **Medium-term** | swaps processes out of and back into memory | as needed |

The **dispatcher** gives the CPU to the selected process: it switches context and mode and jumps to the right instruction. The time this takes is the **dispatch latency**.

## Criteria

- **Maximise:** CPU utilisation, throughput
- **Minimise:** turnaround time (completion − arrival), waiting time (turnaround − burst), response time (first run − arrival)

A good mix of **I/O-bound** and **CPU-bound** processes keeps both the CPU and the devices busy.

:::mcq easy
Q: Which scheduler picks the next process from the ready queue to run on the CPU?
- Long-term scheduler
- [x] Short-term (CPU) scheduler
- Medium-term scheduler
- I/O scheduler
> It runs very frequently.
:::

:::mcq medium
Q: Which scheduler controls the degree of multiprogramming?
- Short-term
- [x] Long-term
- Medium-term
- Dispatcher
> It decides how many processes are admitted into memory.
:::

:::mcq medium
Q: Which scheduler is responsible for swapping?
- Long-term
- Short-term
- [x] Medium-term
- None
> It temporarily removes processes from memory.
:::

:::mcq easy
Q: What does the dispatcher do?
- Creates processes
- [x] Gives control of the CPU to the process the short-term scheduler selected
- Allocates disk space
- Kills zombie processes
> It performs the context switch and the switch to user mode.
:::

:::mcq medium
Q: How is turnaround time defined?
- Burst time − arrival time
- [x] Completion time − arrival time
- Waiting time − burst time
- Start time − arrival time
> It is the total time a process spends in the system.
:::

:::mcq medium
Q: How is waiting time defined?
- Turnaround time + burst time
- [x] Turnaround time − burst time
- Completion time − burst time + arrival time
- Response time − burst time
> Time spent in the ready queue.
:::

:::mcq easy
Q: Which scheduling criterion should be maximised?
- Waiting time
- [x] Throughput
- Turnaround time
- Response time
> Throughput is processes completed per unit of time.
:::

:::mcq easy
Q: Which queue holds processes that are in memory and waiting for the CPU?
- Job queue
- [x] Ready queue
- Device queue
- Swap queue
> The CPU scheduler picks from here.
:::

:::mcq medium
Q: Why is a balance of I/O-bound and CPU-bound processes desirable?
- To reduce memory use
- [x] To keep both the CPU and the I/O devices busy
- To avoid context switches
- To simplify scheduling
> With only one kind, either the CPU or the devices sit idle.
:::

:::mcq hard
Q: What is dispatch latency?
- The time a process waits in the ready queue
- [x] The time the dispatcher takes to stop one process and start another
- The time to load a program from disk
- The total I/O time
> It should be as small as possible.
:::

=== t-cpu-scheduling | CPU Scheduling Algorithms
summary: FCFS, SJF, SRTF, priority and round robin scheduling, with worked averages, starvation and aging.
---
| Algorithm | Preemptive? | Notes |
|---|---|---|
| **FCFS** | no | simple; suffers the **convoy effect** (short jobs wait behind a long one) |
| **SJF** | no | shortest burst first; **optimal average waiting time** among non-preemptive algorithms; needs burst times in advance |
| **SRTF** | yes | preemptive SJF: shortest *remaining* time first |
| **Priority** | either | can cause **starvation**; fixed by **aging** (gradually raising the priority of waiting processes) |
| **Round robin** | yes | each process gets a time **quantum**; fair, good response time. A huge quantum behaves like FCFS; a tiny one wastes time on context switches |
| **Multilevel (feedback) queue** | yes | separate queues for different classes of process; feedback lets processes move between queues |

## Worked example (all arriving at time 0)

Bursts: P1 = 6, P2 = 8, P3 = 3.

- **FCFS** (P1, P2, P3): waiting times 0, 6, 14, so the average is **6.67**.
- **SJF** (P3, P1, P2): waiting times 0, 3, 9, so the average is **4**.

Gantt chart for SJF:

```
| P3 | P1     | P2       |
0    3        9          17
```

:::mcq easy
Q: Which scheduling algorithm can suffer from the convoy effect?
- Round robin
- [x] FCFS
- SRTF
- Multilevel feedback queue
> Short jobs get stuck behind a long one.
:::

:::mcq medium
Q: Which non-preemptive algorithm gives the minimum average waiting time?
- FCFS
- [x] SJF
- Priority
- Round robin
> It is provably optimal when burst times are known.
:::

:::mcq easy
Q: What is SRTF?
- Non-preemptive FCFS
- [x] Preemptive SJF, choosing the shortest remaining time first
- Round robin with priorities
- A disk-scheduling algorithm
> A newly arrived shorter job can preempt the running one.
:::

:::mcq easy
Q: Which problem is associated with priority scheduling?
- The convoy effect
- [x] Starvation of low-priority processes
- Belady's anomaly
- Thrashing
> Aging fixes it.
:::

:::mcq easy
Q: What is aging in scheduling?
- Deleting old processes
- [x] Gradually increasing the priority of processes that have waited a long time
- Lowering the CPU's clock speed
- Sorting processes by creation time
> It prevents starvation.
:::

:::mcq medium
Q: What happens if the round robin time quantum is very large?
- It behaves like SJF
- [x] It behaves like FCFS
- It causes starvation
- It deadlocks
> Each process finishes within its first quantum.
:::

:::mcq medium
Q: What happens if the round robin time quantum is very small?
- Throughput rises sharply
- [x] Context-switch overhead dominates
- It becomes FCFS
- Processes starve
> Too many switches waste CPU time.
:::

:::mcq medium
Q: P1 = 6, P2 = 8 and P3 = 3 all arrive at time 0 and are scheduled FCFS in that order. What is the average waiting time?
- 4
- [x] 6.67
- 5.67
- 8
> Waiting times are 0, 6 and 14, which total 20; 20/3 ≈ 6.67.
:::

:::mcq medium
Q: The same three processes (6, 8, 3) are scheduled with SJF. What is the average waiting time?
- 6.67
- [x] 4
- 3
- 5
> Order P3, P1, P2 gives waiting times 0, 3 and 9; 12/3 = 4.
:::

:::mcq hard
Q: P1 (burst 5) and P2 (burst 3) arrive at time 0. Using round robin with a quantum of 2, when does P2 finish?
- 5
- [x] 7
- 8
- 6
> P1 runs 0–2, P2 2–4, P1 4–6, P2 6–7 (finished), P1 7–8.
:::

=== t-synchronization | Process Synchronization
summary: Race conditions, critical sections and their three requirements, mutual exclusion, Peterson's solution and classic problems.
---
When processes or threads share data, the outcome can depend on the exact interleaving of their instructions. That is a **race condition**.

**Example.** Two threads each run `count = count + 1` (read, add, write). If both read 5 before either writes, the final value is 6 instead of 7.

## The critical-section problem

A **critical section** is code that accesses shared data. A correct solution must provide:

1. **Mutual exclusion:** at most one process is in the critical section at a time.
2. **Progress:** if none is inside, the choice of who enters next can't be postponed indefinitely.
3. **Bounded waiting:** there is a limit on how many times others can enter before a waiting process gets its turn.

## Tools

- **Peterson's solution:** a software solution for 2 processes, using `flag[]` and `turn`.
- **Hardware instructions:** test-and-set, compare-and-swap (atomic).
- **Mutex locks:** acquire and release; a lock that busy-waits is a **spinlock**.
- **Semaphores and monitors:** higher-level tools.

## Classic problems

Producer–consumer (bounded buffer) · readers–writers · dining philosophers · sleeping barber.

:::mcq easy
Q: What is a race condition?
- Two processes competing for CPU priority
- [x] An outcome that depends on the unpredictable order in which concurrent operations on shared data run
- A fast process finishing first
- A deadlock
> For example, an unsynchronised count++.
:::

:::mcq easy
Q: What is a critical section?
- The kernel's code
- [x] Code that accesses shared resources and must not run concurrently
- The first line of a program
- A crash handler
> Access to it must be mutually exclusive.
:::

:::mcq medium
Q: Which of these is NOT a requirement of a critical-section solution?
- Mutual exclusion
- Progress
- Bounded waiting
- [x] Maximum throughput
> The three requirements are mutual exclusion, progress and bounded waiting.
:::

:::mcq medium
Q: Peterson's solution is designed for how many processes?
- Any number
- [x] Two
- One
- Three
> It uses flag[2] and turn.
:::

:::mcq medium
Q: What is a spinlock?
- A lock that puts the thread to sleep
- [x] A lock where the waiting thread busy-waits in a loop
- A disk lock
- A deadlock detector
> It is good for very short waits on multiprocessor systems.
:::

:::mcq easy
Q: Two threads each increment a shared counter (starting at 0) once, without synchronisation. What final values are possible?
- Always 2
- [x] 1 or 2
- Always 1
- 0, 1 or 2
> If both read 0 before either writes, the result is 1.
:::

:::mcq medium
Q: Which hardware instruction is commonly used to build locks?
- ADD
- [x] Test-and-set
- JUMP
- NOP
> It is atomic: it reads and sets a value in one step.
:::

:::mcq medium
Q: Which classic problem involves producers and consumers sharing a fixed-size buffer?
- Readers–writers
- [x] Bounded buffer
- Dining philosophers
- Sleeping barber
> Producers must wait when the buffer is full, and consumers when it is empty.
:::

:::mcq medium
Q: What does "bounded waiting" guarantee?
- No process ever waits
- [x] A limit on how many times others can enter the critical section before a waiting process enters
- Waiting time below 1 ms
- FIFO order of entry
> It prevents starvation.
:::

:::mcq hard
Q: Which synchronisation problem illustrates a circular wait for shared resources (forks)?
- Producer–consumer
- Readers–writers
- [x] Dining philosophers
- Bounded buffer
> Each philosopher needs both neighbouring forks.
:::

=== t-semaphores | Semaphores and Mutexes
summary: Counting and binary semaphores, wait/signal (P/V), mutex vs semaphore, solving bounded-buffer, and monitors.
---
A **semaphore** is an integer variable accessed only through two **atomic** operations:

- **wait(S)** (P, down): if S > 0, decrement it; otherwise block.
- **signal(S)** (V, up): increment S and wake a waiting process, if any.

## Types

- **Counting semaphore:** any non-negative value; controls access to n identical resources.
- **Binary semaphore:** 0 or 1; used for mutual exclusion.

## Mutex vs semaphore

| Mutex | Semaphore |
|---|---|
| a lock with **ownership**: only the thread that locked it can unlock it | no ownership: any thread can signal |
| for mutual exclusion | for mutual exclusion **and** signalling or counting |

## Bounded buffer with semaphores

`mutex = 1`, `empty = N`, `full = 0`

- Producer: wait(empty); wait(mutex); add item; signal(mutex); signal(full)
- Consumer: wait(full); wait(mutex); remove item; signal(mutex); signal(empty)

:::warning
The order of the waits matters. If the producer calls wait(mutex) **before** wait(empty) while the buffer is full, it holds the mutex and blocks, so the consumer can never get in: **deadlock**.
:::

**Monitors** are a higher-level construct (Java's `synchronized`, for example) in which mutual exclusion is automatic and condition variables provide `wait` and `notify`.

:::mcq easy
Q: What are the two atomic operations on a semaphore?
- Lock and unlock only
- [x] wait (P) and signal (V)
- Read and write
- Push and pop
> They are also called down and up.
:::

:::mcq easy
Q: What values can a binary semaphore take?
- Any integer
- [x] 0 or 1
- Only negative values
- 0 to 255
> It is used like a lock.
:::

:::mcq medium
Q: A counting semaphore is initialised to 3. What does it represent?
- 3 locks
- [x] 3 identical resources that can be used at the same time
- 3 deadlocks
- 3 threads
> Up to three processes can proceed past wait().
:::

:::mcq medium
Q: What is the key difference between a mutex and a binary semaphore?
- There is none
- [x] A mutex has ownership (only the locker unlocks it); a semaphore can be signalled by any thread
- A semaphore can't block
- A mutex can hold any count
> This matters for signalling between threads.
:::

:::mcq medium
Q: A semaphore S is 0 and a process calls wait(S). What happens?
- S becomes −1 and the process continues
- [x] The process blocks until another process calls signal(S)
- An error occurs
- S is reset to 1
> No resource is available.
:::

:::mcq medium
Q: In the bounded-buffer solution, what is "empty" initialised to?
- 0
- 1
- [x] N (the buffer size)
- −1
> All N slots start empty.
:::

:::mcq medium
Q: In the bounded-buffer solution, what is "full" initialised to?
- N
- [x] 0
- 1
- N − 1
> No items have been produced yet.
:::

:::mcq hard
Q: In the bounded buffer, a producer calls wait(mutex) before wait(empty), and the buffer is full. What can happen?
- Nothing unusual
- [x] Deadlock: the producer holds the mutex while blocked, so the consumer can't enter
- The buffer overflows
- The consumer runs faster
> Always wait on the counting semaphore before taking the mutex.
:::

:::mcq easy
Q: Which Java keyword provides monitor-style mutual exclusion?
- static
- [x] synchronized
- volatile
- final
> Every Java object has a monitor lock.
:::

:::mcq medium
Q: What does signal(S) do when processes are waiting on S?
- Nothing
- [x] Increments S and wakes one waiting process
- Blocks the caller
- Deletes S
> It releases a resource or sends a signal.
:::

=== t-deadlocks | Deadlocks
summary: The four Coffman conditions, resource-allocation graphs, and prevention, avoidance (Banker's algorithm), detection and recovery.
---
A **deadlock** happens when each process in a set is waiting for a resource held by another process in the set, so none of them can proceed.

## The four necessary (Coffman) conditions

All four must hold at the same time:

1. **Mutual exclusion:** a resource can be held by only one process.
2. **Hold and wait:** a process holds a resource while waiting for another.
3. **No preemption:** resources can't be forcibly taken away.
4. **Circular wait:** P1 waits for P2, …, which waits for P1.

## Handling strategies

| Strategy | How |
|---|---|
| **Prevention** | break one of the conditions, for example by ordering resources globally (no circular wait) or requesting everything at once (no hold and wait) |
| **Avoidance** | grant a request only if the system stays in a **safe state** (**Banker's algorithm**) |
| **Detection and recovery** | let deadlocks happen, detect cycles (wait-for graph), then kill processes or preempt resources |
| **Ignore** (the ostrich algorithm) | used by most general-purpose operating systems, because deadlocks are rare |

## Resource-allocation graphs

With a single instance of each resource, a **cycle means deadlock**. With multiple instances, a cycle means deadlock is **possible**.

**Safe state:** there is some order in which every process can finish. An unsafe state *may* lead to deadlock; a safe state can't.

:::mcq easy
Q: How many Coffman conditions must hold at the same time for a deadlock?
- 2
- 3
- [x] 4
- 1
> Mutual exclusion, hold and wait, no preemption and circular wait.
:::

:::mcq easy
Q: Which of these is NOT a Coffman condition?
- Mutual exclusion
- Hold and wait
- Circular wait
- [x] Starvation
> Starvation is a different problem.
:::

:::mcq medium
Q: Imposing a global order on resource requests prevents which condition?
- Mutual exclusion
- Hold and wait
- No preemption
- [x] Circular wait
> A cycle can't form if every process requests resources in increasing order.
:::

:::mcq medium
Q: Which algorithm avoids deadlock by checking for a safe state?
- Peterson's algorithm
- [x] Banker's algorithm
- Dijkstra's shortest path
- LRU
> It simulates granting the request first.
:::

:::mcq medium
Q: Every resource has a single instance, and the resource-allocation graph contains a cycle. What does this mean?
- Deadlock is impossible
- [x] Deadlock exists
- Deadlock may or may not exist
- The graph is wrong
> With multiple instances, a cycle means deadlock is only possible.
:::

:::mcq medium
Q: Requiring a process to request all its resources at once prevents which condition?
- Circular wait
- [x] Hold and wait
- Mutual exclusion
- No preemption
> It never holds some resources while waiting for others.
:::

:::mcq easy
Q: How do most general-purpose operating systems handle deadlocks?
- Banker's algorithm
- [x] They largely ignore them (the ostrich algorithm)
- They prevent all four conditions
- They detect deadlocks every millisecond
> Deadlocks are rare, and prevention is expensive.
:::

:::mcq medium
Q: Which statement about safe states is true?
- An unsafe state is always deadlocked
- [x] A safe state can't lead to deadlock; an unsafe state might
- Safe states have no processes
- Safe and deadlocked mean the same thing
> Unsafe doesn't necessarily mean deadlocked.
:::

:::mcq medium
Q: Which of these is a deadlock recovery method?
- Adding more RAM
- [x] Terminating processes or preempting resources
- Increasing the time quantum
- Defragmenting the disk
> It breaks the cycle.
:::

:::mcq hard
Q: Three processes each need 2 units of a resource and each currently holds 1. How many units in total guarantee that no deadlock can occur?
- 3
- [x] 4
- 5
- 6
> With n(k − 1) + 1 = 3 × 1 + 1 = 4 units, at least one process can always finish.
:::

=== t-memory-management | Memory Management
summary: Logical vs physical addresses, the MMU, contiguous allocation, fragmentation, compaction and swapping.
---
## Addresses

- **Logical (virtual) address:** generated by the CPU or program.
- **Physical address:** the actual location in RAM.
- The **MMU** (memory management unit) translates logical addresses to physical ones at run time.

## Contiguous allocation

Each process gets a single block of memory.

| Strategy | Chooses |
|---|---|
| **First fit** | the first hole that is big enough (fast) |
| **Best fit** | the smallest hole that is big enough (leaves tiny leftover holes) |
| **Worst fit** | the largest hole |

## Fragmentation

- **External:** there is enough total free memory, but it isn't contiguous. Fixed by **compaction** or by paging.
- **Internal:** the allocated block is larger than requested, and the leftover space inside it is wasted (common with fixed partitions and pages).

**Swapping:** moving a whole process between RAM and disk to free memory.

**Base and limit registers** give simple protection: every address must lie between base and base + limit.

:::mcq easy
Q: Which hardware translates logical addresses to physical addresses?
- ALU
- [x] MMU
- DMA controller
- Cache
> The memory management unit does this at run time.
:::

:::mcq easy
Q: What kind of address does the CPU generate?
- Physical
- [x] Logical (virtual)
- Disk
- Cache
> The MMU maps it to a physical address.
:::

:::mcq medium
Q: There is enough total free memory, but it isn't contiguous. What is this called?
- Internal fragmentation
- [x] External fragmentation
- Thrashing
- Paging
> The free space is split into scattered holes.
:::

:::mcq medium
Q: Memory allocated to a process is slightly larger than it requested. What is the unused space called?
- External fragmentation
- [x] Internal fragmentation
- Compaction
- Swapping
> The waste is inside the allocated block.
:::

:::mcq easy
Q: Which strategy allocates the first hole that is large enough?
- Best fit
- [x] First fit
- Worst fit
- Next fit
> It is fast and simple.
:::

:::mcq medium
Q: Which strategy allocates the smallest hole that fits?
- First fit
- [x] Best fit
- Worst fit
- Buddy
> It tends to leave tiny unusable holes.
:::

:::mcq medium
Q: How is external fragmentation fixed?
- Swapping
- [x] Compaction (moving processes together), or using paging
- Increasing the cache
- Context switching
> Compaction merges the free holes.
:::

:::mcq easy
Q: What is swapping?
- Exchanging CPU registers
- [x] Moving a whole process between main memory and disk
- Sorting memory
- Switching users
> It frees memory for other processes.
:::

:::mcq medium
Q: What do the base and limit registers provide?
- Faster arithmetic
- [x] Simple memory protection, by keeping each process inside its range
- Cache coherence
- Interrupt handling
> An address outside the range causes a trap.
:::

:::mcq hard
Q: Holes of 100 KB, 500 KB, 200 KB, 300 KB and 600 KB (in that order) are free. Using first fit, where does a 212 KB request go?
- 300 KB
- [x] 500 KB
- 600 KB
- 200 KB
> The first hole of at least 212 KB is the 500 KB hole. Best fit would choose 300 KB.
:::

=== t-paging-segmentation | Paging and Segmentation
summary: Pages and frames, page tables, address translation, the TLB, segmentation, and comparing the two.
---
## Paging

Logical memory is divided into fixed-size **pages**, and physical memory into frames of the **same size**. A **page table** maps each page number to a frame number.

**Address translation.** A logical address = (page number p, offset d).
With a page size of 2ⁿ bytes, the low n bits are the offset and the remaining bits are the page number.
Physical address = frame(p) × page size + d.

- Paging removes **external** fragmentation, but can cause **internal** fragmentation in the last page.
- Each memory access then needs **two** memory reads (the page table, then the data). The **TLB** (translation lookaside buffer) caches recent translations.

**Effective access time (EAT)** with TLB hit ratio h, TLB lookup time t and memory access time m:
EAT = h(t + m) + (1 − h)(t + 2m)

## Segmentation

Memory is divided into variable-size **logical units** (code, stack, heap, functions). A segment table stores a base and limit for each segment.
- It matches the programmer's view and makes protection and sharing easy.
- It suffers from **external** fragmentation.

| | Paging | Segmentation |
|---|---|---|
| Unit size | fixed | variable |
| Visible to the programmer | no | yes |
| Fragmentation | internal | external |

**Segmented paging** combines the two: each segment is itself paged.

:::mcq easy
Q: In paging, physical memory is divided into fixed-size blocks called:
- Pages
- [x] Frames
- Segments
- Sectors
> Logical memory is divided into pages.
:::

:::mcq easy
Q: Which type of fragmentation does paging eliminate?
- Internal
- [x] External
- Both
- Neither
> Any free frame can hold any page.
:::

:::mcq medium
Q: The page size is 4 KB. How many bits of the logical address are the offset?
- 4
- 10
- [x] 12
- 16
> 4 KB = 2¹² bytes.
:::

:::mcq easy
Q: What does the TLB cache?
- Disk blocks
- [x] Recent page-table translations
- Instructions
- File names
> It avoids an extra memory access for each translation.
:::

:::mcq medium
Q: Without a TLB, how many memory accesses does one data access need under simple paging?
- 1
- [x] 2
- 3
- 0
> One for the page-table entry and one for the data.
:::

:::mcq medium
Q: Segmentation divides memory into:
- Fixed-size pages
- [x] Variable-size logical units such as code, stack and heap
- Frames
- Cache lines
> It matches the programmer's view of a program.
:::

:::mcq medium
Q: Which type of fragmentation does segmentation suffer from?
- Internal
- [x] External
- None
- Both, equally
> Variable-size segments leave scattered holes.
:::

:::mcq medium
Q: The TLB hit ratio is 80%, a TLB lookup takes 20 ns and a memory access takes 100 ns. What is the effective access time?
- 120 ns
- [x] 140 ns
- 200 ns
- 160 ns
> 0.8 × 120 + 0.2 × 220 = 96 + 44 = 140 ns.
:::

:::mcq easy
Q: Which data structure maps page numbers to frame numbers?
- Segment table
- [x] Page table
- Inode table
- File allocation table
> There is one page table per process.
:::

:::mcq hard
Q: A 32-bit logical address uses 4 KB pages. How many entries does a single-level page table need?
- 2¹²
- [x] 2²⁰
- 2³²
- 2¹⁶
> 32 − 12 = 20 bits of page number gives 2²⁰ entries.
:::

=== t-virtual-memory | Virtual Memory
summary: Demand paging, page faults, page replacement (FIFO, LRU, Optimal), Belady's anomaly and thrashing.
---
**Virtual memory** lets a process use more memory than is physically present by keeping only the **needed pages** in RAM and the rest on disk.

## Demand paging

A page is loaded only when it is first accessed. Accessing a page that isn't in memory causes a **page fault**: the OS loads it from disk, updates the page table and restarts the instruction.

## Page replacement

When no frame is free, a victim page must be removed.

| Algorithm | Removes | Notes |
|---|---|---|
| **FIFO** | the oldest page loaded | simple; suffers from **Belady's anomaly** |
| **LRU** | the least recently *used* page | good in practice; needs tracking |
| **Optimal** | the page not needed for the longest time in the future | the theoretical minimum number of faults; impossible to implement (it needs the future) |

**Belady's anomaly:** with FIFO, *more* frames can cause *more* page faults. LRU and Optimal don't suffer from it (they are "stack algorithms").

## Worked example: FIFO with 3 frames

Reference string 7 0 1 2 0 3 0 4:
7 (F), 0 (F), 1 (F), 2 (F, removes 7), 0 (hit), 3 (F, removes 0), 0 (F, removes 1), 4 (F, removes 2), giving **7 faults**.

## Thrashing

When processes don't have enough frames for their working set, the system spends most of its time paging, and CPU utilisation collapses. Fixes: reduce the degree of multiprogramming, use the working-set model, or control the page-fault frequency.

:::mcq easy
Q: What happens on a page fault?
- The CPU crashes
- [x] The referenced page isn't in memory, so the OS loads it from disk
- A page is deleted
- The TLB is flushed
> The instruction is then restarted.
:::

:::mcq easy
Q: Which page replacement algorithm gives the fewest page faults, but can't be implemented?
- FIFO
- LRU
- [x] Optimal
- Random
> It needs knowledge of future references.
:::

:::mcq medium
Q: Which algorithm suffers from Belady's anomaly?
- LRU
- Optimal
- [x] FIFO
- LFU
> Adding frames can increase faults under FIFO.
:::

:::mcq easy
Q: Which page does LRU replace?
- The oldest page loaded
- [x] The page that hasn't been used for the longest time
- A random page
- The most frequently used page
> It uses the past as a predictor of the future.
:::

:::mcq medium
Q: Using FIFO with 3 frames, how many page faults does the reference string 7 0 1 2 0 3 0 4 cause?
- 6
- [x] 7
- 8
- 5
> Only the second access to 0 (the 5th reference) is a hit.
:::

:::mcq medium
Q: What is thrashing?
- Very fast paging
- [x] Excessive paging that leaves the CPU mostly idle
- Disk failure
- A cache miss
> Processes lack the frames they need for their working set.
:::

:::mcq medium
Q: How can thrashing be reduced?
- Increase the degree of multiprogramming
- [x] Reduce the degree of multiprogramming, or give processes enough frames for their working sets
- Disable virtual memory
- Use FIFO instead
> Fewer competing processes means fewer faults.
:::

:::mcq easy
Q: What does demand paging mean?
- All pages are loaded at start-up
- [x] Pages are loaded only when they are first accessed
- Pages are loaded in reverse order
- Pages are never swapped
> It is lazy loading.
:::

:::mcq medium
Q: Using LRU with 3 frames, how many page faults does the reference string 1 2 3 1 4 5 cause?
- 4
- [x] 5
- 6
- 3
> 1, 2, 3 fault; 1 is a hit; 4 faults (removes 2); 5 faults (removes 3). Total 5.
:::

:::mcq hard
Q: Why don't LRU and Optimal suffer from Belady's anomaly?
- They use fewer frames
- [x] They are stack algorithms: the pages in memory with n frames are always a subset of those with n + 1 frames
- They never fault
- They use random replacement
> More frames can then never mean more faults.
:::

=== t-disk-scheduling | Disk Scheduling
summary: Seek time and rotational latency; the FCFS, SSTF, SCAN, C-SCAN and LOOK algorithms with worked head movements.
---
Disk access time = **seek time** (moving the head to the track) + **rotational latency** + transfer time. Scheduling algorithms reduce the total **head movement** (seek distance).

| Algorithm | Behaviour | Notes |
|---|---|---|
| **FCFS** | serves requests in arrival order | fair, but can be slow |
| **SSTF** | serves the nearest request next | low seek time, but can **starve** far requests |
| **SCAN** (elevator) | sweeps to one end of the disk, then reverses | uniform service |
| **C-SCAN** | sweeps one way, jumps back to the start, sweeps again | more uniform waiting time |
| **LOOK / C-LOOK** | like SCAN / C-SCAN, but turns at the last request instead of the disk's end | less movement |

## Worked example

The head is at **53** and the request queue is **98, 183, 37, 122, 14, 124, 65, 67**.

- **FCFS:** 53→98→183→37→122→14→124→65→67 = 45 + 85 + 146 + 85 + 108 + 110 + 59 + 2 = **640 cylinders**
- **SSTF:** 53→65→67→37→14→98→122→124→183 = 12 + 2 + 30 + 23 + 84 + 24 + 2 + 59 = **236 cylinders**

:::mcq easy
Q: Which disk scheduling algorithm serves the nearest request first?
- FCFS
- [x] SSTF
- SCAN
- C-SCAN
> Shortest seek time first.
:::

:::mcq easy
Q: Which algorithm is known as the elevator algorithm?
- FCFS
- SSTF
- [x] SCAN
- C-LOOK
> The head sweeps back and forth like a lift.
:::

:::mcq medium
Q: What is the main drawback of SSTF?
- High total seek time
- [x] Requests far from the head can starve
- It is complicated to implement
- It needs two heads
> Nearby requests keep getting priority.
:::

:::mcq medium
Q: How does C-SCAN differ from SCAN?
- C-SCAN serves requests in both directions
- [x] C-SCAN serves requests in one direction only, then jumps back to the start
- C-SCAN uses FCFS
- There is no difference
> It gives more uniform waiting times.
:::

:::mcq medium
Q: How does LOOK improve on SCAN?
- It serves requests randomly
- [x] It reverses at the last request instead of going to the disk's end
- It never reverses
- It uses two heads
> It avoids pointless travel to the edge.
:::

:::mcq easy
Q: Which component of disk access time do scheduling algorithms mainly reduce?
- Transfer time
- [x] Seek time
- Controller overhead
- Rotational speed
> They minimise head movement.
:::

:::mcq hard
Q: The head is at 53 with requests 98, 183, 37, 122, 14, 124, 65, 67. What is the total head movement under FCFS?
- 236
- [x] 640
- 520
- 330
> 45 + 85 + 146 + 85 + 108 + 110 + 59 + 2 = 640.
:::

:::mcq hard
Q: Using the same requests with SSTF, what is the total head movement?
- 208
- [x] 236
- 299
- 640
> 53→65→67→37→14→98→122→124→183 = 236.
:::

:::mcq medium
Q: Which algorithm is the simplest and fairest, but often gives high seek times?
- SSTF
- [x] FCFS
- C-LOOK
- SCAN
> It serves requests strictly in arrival order.
:::

:::mcq medium
Q: What is rotational latency?
- The time to move the head across tracks
- [x] The time waiting for the required sector to rotate under the head
- The time to transfer data
- The controller's queueing delay
> On average it is half a rotation.
:::
