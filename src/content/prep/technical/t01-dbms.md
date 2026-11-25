=== t-db-fundamentals | DBMS Fundamentals
summary: DBMS vs file systems, the three-schema architecture, data independence and SQL command categories.
---
A **Database Management System (DBMS)** stores data and controls access to it, giving consistency, security, concurrency and recovery that plain files can't.

## DBMS vs file system

| File system | DBMS |
|---|---|
| Redundant, inconsistent copies | Controlled redundancy and integrity constraints |
| No concurrent-access control | Locking and transactions |
| Each program defines its own data format | A shared schema and a query language |
| Manual backup and recovery | Built-in recovery (logs) |

## Three-schema architecture

- **External level:** the views seen by different users or applications.
- **Conceptual level:** the logical structure of the whole database (tables, relationships).
- **Internal level:** physical storage (files, indexes, blocks).

**Data independence** means you can change one level without changing the one above it:
- **Physical:** change the storage or indexes without changing the conceptual schema (easier).
- **Logical:** change the conceptual schema without changing the external views or applications (harder, because applications depend on the logical structure).

**Schema** = the design (it rarely changes). **Instance** = the data at a given moment (it changes constantly).

## SQL command categories

| Category | Commands |
|---|---|
| DDL (definition) | CREATE, ALTER, DROP, TRUNCATE, RENAME |
| DML (manipulation) | SELECT, INSERT, UPDATE, DELETE |
| DCL (control) | GRANT, REVOKE |
| TCL (transaction control) | COMMIT, ROLLBACK, SAVEPOINT |

:::mcq easy
Q: Which of these is a DDL command?
- UPDATE
- [x] CREATE
- GRANT
- COMMIT
> DDL defines structure: CREATE, ALTER, DROP, TRUNCATE.
:::

:::mcq easy
Q: Which of these is a DML command?
- DROP
- [x] UPDATE
- REVOKE
- SAVEPOINT
> DML changes data: SELECT, INSERT, UPDATE, DELETE.
:::

:::mcq easy
Q: Which of these is a TCL command?
- GRANT
- [x] COMMIT
- ALTER
- INSERT
> TCL commands are COMMIT, ROLLBACK and SAVEPOINT.
:::

:::mcq easy
Q: Which command gives a user privileges?
- COMMIT
- [x] GRANT
- CREATE
- SELECT
> GRANT and REVOKE are DCL commands.
:::

:::mcq easy
Q: What is a database "instance"?
- The overall design of the database
- [x] The data stored in the database at a particular moment
- The DBMS software
- An index
> The schema is the design; the instance is the current data.
:::

:::mcq medium
Q: What is physical data independence?
- Changing views without changing tables
- [x] Changing the storage structure without changing the conceptual schema
- Moving the database to another server
- Encrypting data
> Applications and logical schemas are unaffected.
:::

:::mcq easy
Q: What are the three levels of the ANSI/SPARC architecture?
- Logical, physical, network
- [x] External, conceptual, internal
- User, admin, system
- Front-end, back-end, storage
> Views, the logical structure, and physical storage.
:::

:::mcq easy
Q: What is a key advantage of a DBMS over a file system?
- Larger files
- [x] Less redundancy and better consistency
- No need for storage
- Faster typing
> Integrity constraints and a shared schema prevent inconsistent copies.
:::

:::mcq easy
Q: How does the relational model represent data?
- As trees
- [x] As tables (relations) of rows and columns
- As linked records
- As key–value pairs only
> Introduced by E. F. Codd.
:::

:::mcq hard
Q: Why is logical data independence harder to achieve than physical data independence?
- Physical storage rarely changes
- [x] Application programs depend heavily on the logical structure of the data
- Logical schemas are stored on disk
- It requires more RAM
> Changing tables or relationships often forces changes to queries and code.
:::

=== t-er-model | ER Model
summary: Entities, attributes and relationships, cardinality and participation, weak entities and mapping ER diagrams to tables.
---
The **Entity–Relationship (ER) model** is a high-level design tool, drawn before you create tables.

## Notation (Chen)

| Concept | Symbol |
|---|---|
| Entity | rectangle |
| Weak entity | double rectangle |
| Attribute | ellipse |
| Key attribute | underlined ellipse |
| Multivalued attribute | double ellipse |
| Derived attribute | dashed ellipse (e.g. age from DOB) |
| Relationship | diamond |
| Identifying relationship | double diamond |
| Total participation | double line |

## Cardinality

- **1:1:** person – passport
- **1:N:** department – employees
- **M:N:** students – courses

## Weak entities

A weak entity has no key of its own. It is identified by its **owner entity's key plus a partial key** (discriminator). Example: Dependent(name) of an Employee.

## Mapping to tables

- Each strong entity becomes a table, with its key as the primary key.
- **1:N:** put a foreign key on the N side.
- **M:N:** create a **separate table** holding both primary keys (plus any relationship attributes).
- Multivalued attribute: a separate table.

:::mcq easy
Q: How is an entity set drawn in a Chen ER diagram?
- Ellipse
- [x] Rectangle
- Diamond
- Triangle
> Ellipses are attributes and diamonds are relationships.
:::

:::mcq easy
Q: How is an attribute drawn?
- Rectangle
- [x] Ellipse
- Diamond
- Double line
> Ellipses represent attributes.
:::

:::mcq easy
Q: How is a relationship drawn?
- Ellipse
- [x] Diamond
- Rectangle
- Circle
> Diamonds connect entities.
:::

:::mcq easy
Q: How is a weak entity drawn?
- Dashed ellipse
- [x] Double rectangle
- Double diamond
- Shaded rectangle
> Its identifying relationship is a double diamond.
:::

:::mcq medium
Q: An attribute such as "phone numbers" (a person can have several) is a:
- Derived attribute
- [x] Multivalued attribute
- Key attribute
- Composite attribute
> It is drawn as a double ellipse.
:::

:::mcq medium
Q: "Age" computed from "date of birth" is a:
- Multivalued attribute
- [x] Derived attribute
- Key attribute
- Weak attribute
> It is drawn as a dashed ellipse.
:::

:::mcq easy
Q: A student can enrol in many courses, and a course has many students. What is the cardinality?
- 1:1
- 1:N
- [x] M:N
- N:1
> Many-to-many.
:::

:::mcq medium
Q: How is a weak entity identified?
- By its own primary key
- [x] By the owner entity's key plus its partial key
- It cannot be identified
- By a surrogate key only
> For example, (employee_id, dependent_name).
:::

:::mcq medium
Q: How is total participation shown in an ER diagram?
- A dashed line
- [x] A double line
- An arrow
- A thick rectangle
> Every entity in the set takes part in the relationship.
:::

:::mcq hard
Q: How is an M:N relationship mapped to relational tables?
- Put a foreign key in either table
- [x] Create a separate table containing the primary keys of both entities
- Merge both entities into one table
- It cannot be mapped
> For example, Enrolment(student_id, course_id).
:::

=== t-keys | Keys
summary: Superkey, candidate, primary, alternate, foreign, composite and unique keys, and how to count superkeys.
---
| Key | Definition |
|---|---|
| **Superkey** | any set of attributes that uniquely identifies a row |
| **Candidate key** | a *minimal* superkey (no attribute can be removed) |
| **Primary key** | the candidate key chosen to identify rows: **unique and NOT NULL**, one per table |
| **Alternate key** | the candidate keys not chosen as primary |
| **Composite key** | a key made of two or more attributes |
| **Foreign key** | an attribute that references the primary (or a unique) key of another table; enforces **referential integrity** |
| **Unique key** | values must be unique, but NULLs are allowed (how many depends on the DBMS) |

## Counting superkeys

If a single attribute A is the only candidate key in a relation with n attributes, every set containing A is a superkey, so there are **2ⁿ⁻¹** of them.

## Foreign keys and NULL

A foreign key may be NULL unless it is declared NOT NULL. NULL means "no related row".

:::mcq easy
Q: Which property does every primary key have?
- It can contain NULLs
- [x] It is unique and NOT NULL
- It must be numeric
- There can be several per table
> One primary key per table, unique and never NULL.
:::

:::mcq easy
Q: What is a candidate key?
- Any column
- [x] A minimal superkey
- A foreign key
- A NULL-able key
> No attribute can be removed while keeping it unique.
:::

:::mcq easy
Q: What is a superkey?
- The largest column
- [x] Any set of attributes that uniquely identifies a row
- A key in another table
- An index
> Superkeys may contain extra, unnecessary attributes.
:::

:::mcq easy
Q: What does a foreign key do?
- It speeds up queries
- [x] It references a primary or unique key in another table
- It must be unique
- It stores passwords
> It enforces referential integrity.
:::

:::mcq easy
Q: What are candidate keys that were not chosen as the primary key called?
- Super keys
- [x] Alternate keys
- Foreign keys
- Composite keys
> They are still unique identifiers.
:::

:::mcq easy
Q: What is a key made of more than one attribute called?
- Candidate key
- [x] Composite key
- Alternate key
- Partial key
> For example, (order_id, product_id).
:::

:::mcq medium
Q: Can a table have several candidate keys?
- No, only one
- [x] Yes, but only one of them is chosen as the primary key
- Yes, and all of them become primary keys
- Only if it has no foreign keys
> For example, both email and employee_id may be candidate keys.
:::

:::mcq medium
Q: Can a foreign key column contain NULL?
- Never
- [x] Yes, unless it is declared NOT NULL
- Only in the parent table
- Only if it is also the primary key
> NULL means there is no related row.
:::

:::mcq medium
Q: How does a UNIQUE constraint differ from a PRIMARY KEY?
- UNIQUE allows duplicates
- [x] UNIQUE allows NULL values; a primary key doesn't
- UNIQUE must be numeric
- There is no difference
> A table can also have many UNIQUE constraints.
:::

:::mcq hard
Q: R(A, B, C, D) has the dependencies A → B, B → C and C → D. How many superkeys does R have?
- 4
- [x] 8
- 16
- 1
> A is the only candidate key, so every subset containing A is a superkey: 2³ = 8.
:::

=== t-functional-dependencies | Functional Dependencies
summary: X → Y, Armstrong's axioms, attribute closure, partial and transitive dependencies, and finding candidate keys.
---
**X → Y** (X functionally determines Y) means that any two rows with the same X value also have the same Y value.

## Types

- **Trivial:** Y ⊆ X (for example AB → A)
- **Partial:** a non-prime attribute depends on **part** of a composite key
- **Transitive:** a non-prime attribute depends on another **non-prime** attribute (A → B → C)

## Armstrong's axioms

1. **Reflexivity:** if Y ⊆ X, then X → Y.
2. **Augmentation:** if X → Y, then XZ → YZ.
3. **Transitivity:** if X → Y and Y → Z, then X → Z.

Derived rules: **union** (X → Y and X → Z give X → YZ), **decomposition** and **pseudo-transitivity**.

## Attribute closure X⁺

Start with X, then repeatedly add the right-hand side of any dependency whose left-hand side is already included. **If X⁺ contains every attribute, X is a superkey.**

**Example.** F = {A → B, B → C}: A⁺ = {A, B, C}.

## Finding candidate keys

1. Attributes that never appear on a right-hand side **must** be in every key.
2. Compute the closure of that set; if it isn't complete, add attributes one at a time.

:::mcq easy
Q: What does X → Y mean?
- X is a subset of Y
- [x] Each X value is associated with exactly one Y value
- Y determines X
- X and Y are both keys
> Equal X values imply equal Y values.
:::

:::mcq easy
Q: Which of these is a trivial functional dependency?
- A → B
- [x] AB → A
- A → BC
- B → A
> The right-hand side is a subset of the left-hand side.
:::

:::mcq easy
Q: Which of these is NOT one of Armstrong's three basic axioms?
- Reflexivity
- Augmentation
- Transitivity
- [x] Normalisation
> Union and decomposition are derived rules; normalisation isn't an axiom.
:::

:::mcq easy
Q: If A → B and B → C, then A → C. Which rule is this?
- Augmentation
- [x] Transitivity
- Reflexivity
- Union
> It chains dependencies.
:::

:::mcq medium
Q: Given A → B and B → C, what is A⁺?
- {A}
- {A, B}
- [x] {A, B, C}
- {B, C}
> A gives B, and B gives C.
:::

:::mcq medium
Q: What is a partial dependency?
- A non-prime attribute depending on another non-prime attribute
- [x] A non-prime attribute depending on part of a composite candidate key
- A key depending on a non-key
- A trivial dependency
> It violates 2NF.
:::

:::mcq medium
Q: What is a transitive dependency?
- A dependency on the whole key
- [x] A non-prime attribute depending on another non-prime attribute
- A dependency between two keys
- A self-dependency
> It violates 3NF.
:::

:::mcq medium
Q: R(A, B, C, D, E) has the dependencies A → B, C → D and AC → E. What is the candidate key?
- A
- C
- [x] AC
- ACE
> A and C never appear on a right-hand side, and (AC)⁺ = {A, B, C, D, E}.
:::

:::mcq easy
Q: If A → B and A → C, then A → BC. Which rule is this?
- Decomposition
- [x] Union
- Transitivity
- Augmentation
> It combines the right-hand sides.
:::

:::mcq hard
Q: R(A, B, C, D) has F = {AB → C, C → D, D → A}. Which sets are its candidate keys?
- AB only
- AB and C
- [x] AB, BC and BD
- ABCD only
> B is in every key. (AB)⁺, (BC)⁺ and (BD)⁺ each give all four attributes, and no smaller set does.
:::

=== t-normalization | Normalization
summary: 1NF to BCNF, update anomalies, decomposition and when to denormalise.
---
**Normalisation** removes redundancy, which in turn prevents **anomalies**:
- **Insertion:** you can't add a fact without some unrelated data.
- **Update:** the same fact is stored in many rows and may be updated inconsistently.
- **Deletion:** deleting one fact accidentally removes another.

## Normal forms

| Form | Rule |
|---|---|
| **1NF** | every value is atomic (no repeating groups or lists) |
| **2NF** | 1NF + no **partial** dependency of a non-prime attribute on part of a key |
| **3NF** | 2NF + no **transitive** dependency. For every X → A, either X is a superkey or A is prime |
| **BCNF** | for every non-trivial X → Y, X is a **superkey** |

- A 1NF relation whose candidate keys all have a single attribute is automatically in 2NF.
- **BCNF is stricter than 3NF.** 3NF allows X → A when A is prime; BCNF doesn't.
- A decomposition should be **lossless** (the join gives back the original) and ideally **dependency-preserving**. A 3NF decomposition can always achieve both; BCNF may lose dependency preservation.

## Denormalisation

Deliberately adding redundancy (pre-joined or summary tables) to speed up reads, at the cost of extra update work.

:::mcq easy
Q: What does 1NF require?
- No transitive dependencies
- [x] Atomic values, with no repeating groups
- A single-column key
- No NULLs
> Each cell holds one value.
:::

:::mcq easy
Q: What does 2NF add to 1NF?
- No transitive dependencies
- [x] No partial dependencies
- No multivalued dependencies
- No NULLs
> Non-prime attributes must depend on the whole key.
:::

:::mcq easy
Q: What does 3NF add to 2NF?
- No partial dependencies
- [x] No transitive dependencies
- No keys
- No joins
> Non-prime attributes depend only on keys.
:::

:::mcq medium
Q: What is the condition for BCNF?
- Every attribute is atomic
- [x] For every non-trivial dependency X → Y, X is a superkey
- There are no foreign keys
- Every table has one column
> It is stricter than 3NF.
:::

:::mcq easy
Q: What is the main purpose of normalisation?
- Faster writes only
- [x] Reducing redundancy and avoiding anomalies
- Adding more tables for fun
- Encrypting data
> It keeps data consistent.
:::

:::mcq easy
Q: Which of these is NOT a normalisation anomaly?
- Insertion anomaly
- Update anomaly
- Deletion anomaly
- [x] Selection anomaly
> The three anomalies are insertion, update and deletion.
:::

:::mcq medium
Q: A relation in 1NF has only single-attribute candidate keys. Which normal form is it guaranteed to be in?
- 3NF
- [x] 2NF
- BCNF
- None beyond 1NF
> A partial dependency needs a composite key.
:::

:::mcq easy
Q: Which statement about BCNF and 3NF is true?
- 3NF is stricter than BCNF
- [x] BCNF is stricter than 3NF
- They are identical
- They are unrelated
> Every BCNF relation is in 3NF, but not the other way round.
:::

:::mcq medium
Q: What is denormalisation?
- Removing all keys
- [x] Deliberately adding redundancy to improve read performance
- Converting to 1NF
- Deleting duplicate rows
> It is common in reporting and warehousing.
:::

:::mcq hard
Q: R(A, B, C) has F = {AB → C, C → B}. What is its highest normal form?
- 2NF
- [x] 3NF but not BCNF
- BCNF
- 1NF only
> The keys are AB and AC. C → B violates BCNF (C isn't a superkey), but B is prime, so 3NF holds.
:::

=== t-transactions | Transactions and Concurrency
summary: Transaction states, concurrency anomalies, serializability, two-phase locking and isolation levels.
---
A **transaction** is a logical unit of work that must run **completely or not at all** (for example, a funds transfer).

## States

Active → Partially committed → **Committed**, or Active → Failed → **Aborted** (rolled back).

## Concurrency problems

| Problem | What happens |
|---|---|
| **Dirty read** | reading data another transaction hasn't committed yet |
| **Non-repeatable read** | the same row gives different values within one transaction |
| **Phantom read** | re-running a query returns new rows |
| **Lost update** | two transactions overwrite each other's change |

## Serializability

A concurrent schedule is correct if it is equivalent to **some serial order**. **Conflict serializability** is tested with a precedence graph: the schedule is conflict-serializable if the graph has **no cycle**.

## Two-phase locking (2PL)

A transaction first **acquires** locks (the growing phase) and then **releases** them (the shrinking phase), never acquiring a lock after it has released one. This guarantees conflict serializability, but **deadlocks can still occur**.

## Isolation levels (weakest to strongest)

| Level | Dirty read | Non-repeatable read | Phantom read |
|---|---|---|---|
| Read Uncommitted | possible | possible | possible |
| Read Committed | prevented | possible | possible |
| Repeatable Read | prevented | prevented | possible |
| Serializable | prevented | prevented | prevented |

:::mcq easy
Q: What is a transaction?
- A single SELECT statement
- [x] A logical unit of work that executes completely or not at all
- A table backup
- An index
> For example, debiting one account and crediting another.
:::

:::mcq easy
Q: What does ROLLBACK do?
- Saves the changes permanently
- [x] Undoes the changes made by the current transaction
- Deletes the table
- Creates a savepoint
> COMMIT makes changes permanent; ROLLBACK undoes them.
:::

:::mcq easy
Q: What is a dirty read?
- Reading deleted data
- [x] Reading data that another transaction hasn't committed yet
- Reading an index
- Reading the same data twice
> If the other transaction rolls back, the data you read never existed.
:::

:::mcq medium
Q: Two transactions read the same balance, and each writes its own update, so one change is lost. This is called:
- A phantom read
- [x] A lost update
- A dirty read
- A deadlock
> One write overwrites the other.
:::

:::mcq medium
Q: When is a schedule serializable?
- When it runs one transaction at a time
- [x] When its effect equals that of some serial execution of the same transactions
- When it has no reads
- When it uses no locks
> Serializability is the main correctness criterion for concurrency.
:::

:::mcq medium
Q: What does two-phase locking guarantee?
- Freedom from deadlock
- [x] Conflict serializability
- No locks are needed
- Faster queries
> Deadlocks can still occur under 2PL.
:::

:::mcq medium
Q: How do you test a schedule for conflict serializability?
- Count its reads
- [x] Check its precedence graph for cycles
- Check its indexes
- Measure its running time
> No cycle means the schedule is conflict-serializable.
:::

:::mcq medium
Q: Which isolation level prevents dirty reads but still allows non-repeatable reads?
- Read Uncommitted
- [x] Read Committed
- Repeatable Read
- Serializable
> It is the default in many databases.
:::

:::mcq easy
Q: Which isolation level is the strongest?
- Read Committed
- Repeatable Read
- [x] Serializable
- Read Uncommitted
> It prevents dirty, non-repeatable and phantom reads.
:::

:::mcq hard
Q: A transaction re-runs "SELECT * FROM orders WHERE amount > 100" and gets an extra row inserted by another transaction. What is this called?
- A dirty read
- A non-repeatable read
- [x] A phantom read
- A lost update
> New rows that match the condition appear.
:::

=== t-acid | ACID Properties
summary: Atomicity, Consistency, Isolation and Durability, and the database mechanisms that provide each one.
---
| Property | Meaning | Provided by |
|---|---|---|
| **Atomicity** | all or nothing | the recovery manager, using undo logs |
| **Consistency** | moves the database from one valid state to another; constraints hold | integrity constraints plus correct application logic |
| **Isolation** | concurrent transactions don't see each other's intermediate states | concurrency control (locks, MVCC) |
| **Durability** | committed changes survive crashes | write-ahead logging (WAL), redo logs, stable storage |

**Example.** A transfer of ₹500 from A to B:
- If the system crashes after debiting A, **atomicity** rolls the debit back.
- A rule such as "balance ≥ 0" is preserved by **consistency**.
- A concurrent balance report never sees money "in flight": **isolation**.
- After COMMIT, a power cut doesn't lose the transfer: **durability**.

:::note
**Write-ahead logging:** log records are written to stable storage *before* the data pages, so the system can undo or redo after a crash.
:::

:::mcq easy
Q: What does the "A" in ACID stand for?
- Availability
- [x] Atomicity
- Accuracy
- Authentication
> All or nothing.
:::

:::mcq easy
Q: What does the "C" in ACID stand for?
- Concurrency
- [x] Consistency
- Commit
- Cache
> Valid state to valid state.
:::

:::mcq easy
Q: What does the "I" in ACID stand for?
- Integrity
- [x] Isolation
- Indexing
- Insertion
> Transactions don't interfere with each other.
:::

:::mcq easy
Q: What does the "D" in ACID stand for?
- Distribution
- [x] Durability
- Deletion
- Data
> Committed changes persist.
:::

:::mcq medium
Q: During a transfer, the system crashes after debiting account A but before crediting B. Which property ensures the debit is undone?
- Durability
- [x] Atomicity
- Isolation
- Consistency
> Partial transactions are rolled back.
:::

:::mcq easy
Q: A committed order is still there after a power failure. Which property does this show?
- Atomicity
- [x] Durability
- Isolation
- Consistency
> Durability makes commits persistent.
:::

:::mcq medium
Q: Two users run transactions at the same time, and neither sees the other's half-finished changes. Which property is this?
- Atomicity
- [x] Isolation
- Durability
- Consistency
> Intermediate states are hidden.
:::

:::mcq medium
Q: A constraint ensures an account balance never goes negative. Which ACID property does this support?
- Atomicity
- [x] Consistency
- Isolation
- Durability
> Integrity rules are maintained.
:::

:::mcq medium
Q: Which mechanism mainly provides durability?
- Indexing
- [x] Write-ahead logging to stable storage
- Normalisation
- Views
> Logs make redo possible after a crash.
:::

:::mcq hard
Q: Which DBMS component is mainly responsible for isolation?
- The query optimiser
- [x] The concurrency control manager (locking or MVCC)
- The recovery manager
- The storage manager
> The recovery manager handles atomicity and durability.
:::

=== t-indexing | Indexing
summary: Why indexes speed up reads, B+ trees, clustered vs non-clustered, dense vs sparse, hash indexes and the trade-offs.
---
An **index** is an auxiliary structure that lets the DBMS find rows **without scanning the whole table**, like a book's index.

## Structures

- **B+ tree** (the default in most relational databases): balanced, with O(log n) search. All data pointers sit in the **leaves**, which are **linked**, so range queries are efficient.
- **Hash index:** O(1) on average for **equality** lookups, but useless for ranges and ordering.

## Kinds

| Kind | Meaning |
|---|---|
| **Clustered** | the table's rows are physically stored in index order. **Only one per table** (often the primary key) |
| **Non-clustered** | a separate structure with pointers to the rows. **Many per table** |
| **Dense** | an index entry for every record |
| **Sparse** | entries for only some records (or blocks); needs sorted data |
| **Composite** | an index on several columns; the column order matters (leftmost prefix rule) |

## Trade-offs

Indexes speed up SELECTs with WHERE, JOIN and ORDER BY, but **slow down INSERT, UPDATE and DELETE** and take extra storage.

**Good candidates:** columns that are filtered or joined often and have **high selectivity** (many distinct values).

:::warning
Wrapping an indexed column in a function, as in `WHERE LOWER(email) = '…'`, usually prevents the index from being used, unless you create a function-based (expression) index.
:::

:::mcq easy
Q: What is the main purpose of an index?
- To save storage space
- [x] To speed up data retrieval
- To enforce normalisation
- To back up data
> It avoids full table scans.
:::

:::mcq easy
Q: Which data structure do most relational databases use for indexes?
- Linked list
- [x] B+ tree
- Stack
- Queue
> It is balanced, and its linked leaves suit range queries.
:::

:::mcq medium
Q: How many clustered indexes can a table have?
- Unlimited
- [x] One
- Two
- One per column
> The rows can be physically ordered only one way.
:::

:::mcq easy
Q: What is a non-clustered index?
- The physical order of the table
- [x] A separate structure with pointers to the table's rows
- A deleted index
- An index on a view only
> A table can have many of them.
:::

:::mcq easy
Q: What is a downside of adding many indexes?
- Faster inserts
- [x] Slower writes and more storage
- Fewer queries possible
- Data loss
> Every index must be updated on each write.
:::

:::mcq medium
Q: Which queries is a hash index best suited to?
- Range queries such as BETWEEN
- [x] Equality lookups such as id = 42
- ORDER BY
- LIKE '%abc%'
> Hashing destroys ordering.
:::

:::mcq medium
Q: Which column is the best candidate for an index?
- A gender column with two values
- [x] A customer_id column frequently used in WHERE clauses and joins
- A large notes text column that is rarely queried
- A column that is updated every second
> High selectivity and frequent use in filters.
:::

:::mcq medium
Q: What is a dense index?
- An index for only some records
- [x] An index with an entry for every record
- A compressed table
- A hash table
> A sparse index has entries for only some records or blocks.
:::

:::mcq medium
Q: Why are the leaves of a B+ tree linked?
- To save memory
- [x] To make range scans efficient
- To prevent deadlocks
- To store the keys twice
> You can walk along the leaves in order.
:::

:::mcq hard
Q: There is an index on email, and a query uses WHERE LOWER(email) = 'a@b.com'. What usually happens?
- The index is used normally
- [x] The index usually isn't used, unless there is a function-based index on LOWER(email)
- The query fails
- The index is dropped
> Applying a function to the column changes what has to be looked up.
:::

=== t-joins | SQL Joins
summary: INNER, LEFT, RIGHT, FULL OUTER, CROSS, SELF and NATURAL joins, with row counts on sample tables.
---
A **join** combines rows from two tables based on a related column.

| Join | Returns |
|---|---|
| **INNER JOIN** | only the rows that match in both tables |
| **LEFT (OUTER) JOIN** | all rows from the left table, plus matches (NULLs where there is no match) |
| **RIGHT (OUTER) JOIN** | all rows from the right table, plus matches |
| **FULL OUTER JOIN** | all rows from both tables, matched where possible |
| **CROSS JOIN** | every combination (m × n rows) |
| **SELF JOIN** | a table joined with itself (for example, employee and manager) |
| **NATURAL JOIN** | joins automatically on all columns with the same name |

```sql
-- Employees with no department
SELECT e.name
FROM Employees e
LEFT JOIN Departments d ON e.dept_id = d.id
WHERE d.id IS NULL;
```

:::warning
Filtering the **right** table in the WHERE clause after a LEFT JOIN (`WHERE d.name = 'Sales'`) removes the NULL rows and turns it into an inner join. Put that condition in the ON clause instead.
:::

:::context
**Employees**

| id | name | dept_id |
|---|---|---|
| 1 | Asha | 10 |
| 2 | Ben | 20 |
| 3 | Chen | NULL |
| 4 | Dev | 10 |

**Departments**

| id | name |
|---|---|
| 10 | Sales |
| 20 | HR |
| 30 | IT |
:::

:::mcq easy
Q: How many rows does Employees INNER JOIN Departments ON dept_id = id return?
- 2
- [x] 3
- 4
- 5
> Asha, Ben and Dev match. Chen has a NULL dept_id.
:::

:::mcq easy
Q: How many rows does Employees LEFT JOIN Departments return?
- 3
- [x] 4
- 5
- 12
> All four employees appear; Chen's department columns are NULL.
:::

:::mcq medium
Q: How many rows does Employees FULL OUTER JOIN Departments return?
- 4
- [x] 5
- 6
- 7
> 3 matches, plus Chen (no department), plus IT (no employees).
:::

:::mcq easy
Q: Which department has no employees?
- Sales
- HR
- [x] IT
- None
> No employee has dept_id 30.
:::

:::mcq medium
Q: How many rows does Employees CROSS JOIN Departments return?
- 7
- [x] 12
- 3
- 4
> 4 × 3 = 12.
:::

:::context
:::

:::mcq easy
Q: What does a LEFT JOIN return?
- Only matching rows
- [x] All rows from the left table, plus matching rows from the right (NULLs where there's no match)
- All rows from the right table
- Every combination of rows
> Unmatched left rows are kept.
:::

:::mcq easy
Q: When is a self join used?
- To join two databases
- [x] To relate rows within the same table, such as an employee and their manager
- To delete duplicates
- To create an index
> The table is aliased twice.
:::

:::mcq medium
Q: Which query finds employees without a department?
- INNER JOIN … WHERE d.id IS NULL
- [x] LEFT JOIN Departments d ON … WHERE d.id IS NULL
- CROSS JOIN … WHERE d.id = 0
- RIGHT JOIN … WHERE e.id IS NULL
> Keep every employee, then select the ones with no match.
:::

:::mcq medium
Q: How does a NATURAL JOIN decide which columns to join on?
- On the primary keys only
- [x] On all columns with the same name in both tables
- On no columns (cross product)
- On columns you specify with ON
> This can join on columns you didn't intend.
:::

:::mcq hard
Q: After a LEFT JOIN, you add WHERE d.name = 'Sales'. What effect does this have?
- None; it's still a left join
- [x] It removes the unmatched (NULL) rows, so it effectively becomes an inner join
- The query errors
- It returns every row
> Put the filter in the ON clause to keep the left join's behaviour.
:::

=== t-views | Views
summary: Virtual tables, materialized views, security and simplicity benefits, updatable views and WITH CHECK OPTION.
---
A **view** is a **virtual table** defined by a stored query. It holds no data of its own; querying it runs the underlying query.

```sql
CREATE VIEW active_customers AS
SELECT id, name, city
FROM customers
WHERE status = 'active';
```

## Why use views

- **Security:** expose only some columns or rows (for example, hide salaries).
- **Simplicity:** wrap complex joins behind a simple name.
- **Abstraction:** applications keep working when the base tables change.

## Materialized views

These store the query result **physically** and are refreshed on demand or on a schedule. Reads are fast, but the data can be stale.

## Updatable views

Generally a view can be updated if it is based on a **single table** and has **no aggregates, DISTINCT, GROUP BY, HAVING or UNION**, and includes the required NOT NULL columns.

**WITH CHECK OPTION** rejects inserts or updates through the view that would create rows the view itself can't see.

`DROP VIEW` removes only the view definition, never the base data.

:::mcq easy
Q: What is a view?
- A physical copy of a table
- [x] A virtual table defined by a stored query
- An index
- A backup
> It doesn't store data (unless it is materialized).
:::

:::mcq easy
Q: Does a standard (non-materialized) view store data?
- Yes, a full copy
- [x] No; it runs the underlying query when it is used
- Only its primary keys
- Only its first 100 rows
> It is just a saved query.
:::

:::mcq medium
Q: What is a materialized view?
- A view with no columns
- [x] A view whose result is stored physically and refreshed periodically
- A deleted view
- A view on a single row
> Reads are fast, but the data may be stale.
:::

:::mcq easy
Q: What is a key security benefit of views?
- Faster inserts
- [x] Restricting which columns and rows a user can see
- Encrypting the disk
- Removing the need for passwords
> For example, a view without the salary column.
:::

:::mcq medium
Q: Which view is most likely to be updatable?
- One with GROUP BY department
- One using DISTINCT
- [x] A simple view selecting some columns from one table
- One joining five tables with aggregates
> A single table with no aggregation.
:::

:::mcq easy
Q: What is the correct syntax for creating a view?
- MAKE VIEW v FROM SELECT …
- [x] CREATE VIEW v AS SELECT …
- NEW VIEW v = SELECT …
- VIEW v SELECT …
> CREATE VIEW name AS query.
:::

:::mcq easy
Q: What does DROP VIEW v do to the base table's data?
- It deletes the rows
- [x] Nothing; only the view definition is removed
- It truncates the table
- It locks the table
> Views are definitions, not data.
:::

:::mcq medium
Q: The base table's data changes. What does querying a normal view return?
- The old data
- [x] The current data
- An error
- Nothing until the view is recreated
> The query runs fresh each time.
:::

:::mcq medium
Q: What does WITH CHECK OPTION do?
- It speeds up the view
- [x] It blocks inserts or updates through the view that would produce rows the view can't see
- It makes the view read-only
- It checks the SQL syntax
> It keeps writes consistent with the view's filter.
:::

:::mcq hard
Q: Is a view defined with GROUP BY and SUM() generally updatable?
- Yes, always
- [x] No; aggregated rows don't map back to single base rows
- Only in MySQL
- Only with an index
> You can't update a sum directly.
:::

=== t-stored-procedures | Stored Procedures and Functions
summary: Precompiled routines in the database: parameters, procedures vs functions, cursors and their benefits.
---
A **stored procedure** is a named set of SQL statements stored and run **inside the database**.

```sql
-- MySQL
CREATE PROCEDURE raise_salary(IN emp INT, IN pct DECIMAL(5,2))
BEGIN
  UPDATE employees SET salary = salary * (1 + pct/100) WHERE id = emp;
END;

CALL raise_salary(7, 10);
```

## Benefits

- Less network traffic: one call instead of many statements
- Reuse and a single place for business rules
- Security: users can run a procedure without direct table access
- Parameterised execution helps prevent **SQL injection**

## Parameters

**IN** (input), **OUT** (output), **INOUT** (both).

## Procedure vs function

| Procedure | Function |
|---|---|
| called with CALL or EXEC | used in expressions, including SELECT |
| may return zero or more values through OUT parameters | **must return** a value |
| can modify data and control transactions | functions called from SQL usually **can't modify data** |

A **cursor** lets a routine process a query's result **row by row**.

:::mcq easy
Q: What is a stored procedure?
- A table backup
- [x] A named, precompiled set of SQL statements stored in the database
- An index type
- A user account
> It runs on the database server.
:::

:::mcq easy
Q: What is one benefit of stored procedures?
- More network round trips
- [x] Less network traffic and reusable logic
- Slower execution
- No security
> One call can run many statements.
:::

:::mcq medium
Q: How does a function differ from a procedure in SQL?
- A function can't take parameters
- [x] A function must return a value and can be used inside a SELECT
- A procedure must return a value
- There is no difference
> Procedures are invoked with CALL or EXEC.
:::

:::mcq easy
Q: Which parameter mode both passes a value in and returns a value?
- IN
- OUT
- [x] INOUT
- RETURN
> The caller sees the changed value.
:::

:::mcq easy
Q: How do you call a stored procedure in MySQL?
- RUN proc();
- [x] CALL proc();
- SELECT proc;
- DO proc;
> SQL Server uses EXEC.
:::

:::mcq medium
Q: Can a stored procedure contain COMMIT and ROLLBACK?
- Never
- [x] Yes, in most databases
- Only in views
- Only in triggers
> Procedures often manage their own transactions.
:::

:::mcq medium
Q: How can parameterised stored procedures help security?
- By encrypting passwords
- [x] By reducing the risk of SQL injection, since inputs are treated as data
- By removing the need for authentication
- By hiding the database name
> As long as the procedure doesn't build dynamic SQL by string concatenation.
:::

:::mcq medium
Q: What is a cursor used for?
- Moving the mouse pointer
- [x] Processing the result of a query row by row
- Creating indexes
- Locking tables
> Use cursors sparingly; set-based SQL is usually faster.
:::

:::mcq easy
Q: Where are stored procedures kept?
- On the client machine
- [x] In the database (its data dictionary or catalogue)
- In a separate text file only
- In the browser cache
> They are database objects.
:::

:::mcq hard
Q: A function is called inside a SELECT statement. What is it usually NOT allowed to do?
- Return a value
- [x] Modify data with INSERT, UPDATE or DELETE
- Accept parameters
- Use arithmetic
> Functions used in queries should have no side effects.
:::

=== t-triggers | Triggers
summary: Automatic actions on INSERT, UPDATE and DELETE: BEFORE/AFTER/INSTEAD OF, row vs statement level, NEW and OLD.
---
A **trigger** is a routine the database runs **automatically** when an event happens on a table (or view).

```sql
-- MySQL: keep an audit trail of salary changes
CREATE TRIGGER salary_audit
AFTER UPDATE ON employees
FOR EACH ROW
INSERT INTO salary_log(emp_id, old_salary, new_salary, changed_at)
VALUES (OLD.id, OLD.salary, NEW.salary, NOW());
```

## Parts of a trigger

- **Event:** INSERT, UPDATE or DELETE
- **Timing:** BEFORE or AFTER (and **INSTEAD OF**, used mainly on views)
- **Granularity:** **row-level** (FOR EACH ROW, once per affected row) or **statement-level** (once per statement)

## NEW and OLD

| Event | OLD | NEW |
|---|---|---|
| INSERT | not available | the inserted row |
| UPDATE | the row before | the row after |
| DELETE | the deleted row | not available |

A **BEFORE** trigger can **modify NEW** (for example, setting `created_at` or normalising an email) before the row is saved.

## Uses and cautions

Uses: auditing, deriving values, enforcing complex rules, keeping summary tables in sync.
Cautions: hidden logic, harder debugging, cascading or recursive triggers, and a performance cost on bulk writes.

:::mcq easy
Q: What is a trigger?
- A manually run report
- [x] A routine the database runs automatically when a specified event occurs
- A type of index
- A user role
> For example, it can run after every UPDATE on a table.
:::

:::mcq easy
Q: Which events can fire a DML trigger?
- SELECT only
- [x] INSERT, UPDATE and DELETE
- CREATE and DROP only
- GRANT and REVOKE
> Data-changing statements.
:::

:::mcq easy
Q: Which timings are standard for triggers on tables?
- FIRST and LAST
- [x] BEFORE and AFTER
- START and END
- OPEN and CLOSE
> INSTEAD OF is mainly for views.
:::

:::mcq medium
Q: How many times does a row-level trigger fire for an UPDATE that changes 50 rows?
- Once
- [x] 50 times
- Never
- Twice
> Once for each affected row. A statement-level trigger would fire once.
:::

:::mcq easy
Q: What is a common use of triggers?
- Drawing charts
- [x] Writing audit logs of changes
- Compiling code
- Sending HTTP requests from the browser
> They record who changed what, and when.
:::

:::mcq medium
Q: In an UPDATE trigger, what do OLD and NEW refer to?
- Two different tables
- [x] The row's values before and after the update
- The previous and next triggers
- Old and new users
> Both are available for UPDATE.
:::

:::mcq medium
Q: Which reference is NOT available in an INSERT trigger?
- NEW
- [x] OLD
- Both are available
- Neither is available
> There is no previous row.
:::

:::mcq medium
Q: What is a known risk of triggers?
- They make queries impossible
- [x] Hidden business logic and cascading or recursive triggers
- They delete indexes
- They encrypt data
> Logic in triggers is easy to overlook.
:::

:::mcq medium
Q: What is an INSTEAD OF trigger typically used for?
- Speeding up SELECT queries
- [x] Making complex views updatable by defining what an insert or update should do
- Replacing the primary key
- Logging logins
> It runs in place of the original statement.
:::

:::mcq hard
Q: What can a BEFORE INSERT row trigger do that an AFTER INSERT trigger can't?
- Read NEW
- [x] Change NEW's values before the row is saved
- Fire on SELECT
- Run once per statement
> For example, setting NEW.created_at = NOW().
:::
