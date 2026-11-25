=== t-sdlc | Software Development Life Cycle
summary: The SDLC phases, their outputs, and how process models such as Waterfall, V-model, Spiral and Agile organise them.
---
The **SDLC** is the structured process for building software, from the idea through to maintenance.

## Phases

| Phase | Key output |
|---|---|
| 1. Requirement gathering and analysis | **SRS** (Software Requirements Specification) |
| 2. Feasibility study | technical, economic and operational feasibility report |
| 3. Design | high-level (architecture) and low-level (module) design documents |
| 4. Implementation (coding) | source code |
| 5. Testing | test reports, defect logs |
| 6. Deployment | released product |
| 7. Maintenance | patches and enhancements |

## Requirements

- **Functional:** what the system does ("the user can reset the password").
- **Non-functional:** how well it does it (performance, security, usability, scalability).

## Common models

| Model | Key idea | Best when |
|---|---|---|
| Waterfall | sequential phases | requirements are clear and stable |
| V-model | each development phase has a matching test phase | high-reliability systems |
| Spiral | iterative, **risk-driven** cycles | large, high-risk projects |
| Incremental / iterative | build in pieces, refine each time | early partial delivery is valuable |
| Prototype | build a quick model to clarify requirements | requirements are unclear |
| Agile | short iterations, continuous feedback | requirements change often |

**Maintenance** is usually the longest and most expensive phase. Its types are corrective (fixing bugs), adaptive (adjusting to a new environment), perfective (improvements) and preventive.

:::mcq easy
Q: What is the main output of the requirements phase?
- Source code
- [x] The SRS (Software Requirements Specification)
- Test cases only
- A deployment script
> It records what the system must do.
:::

:::mcq easy
Q: Which of these is a non-functional requirement?
- The user can log in
- [x] Pages must load within 2 seconds
- The admin can delete users
- Users can export reports
> It describes how well the system works, not what it does.
:::

:::mcq medium
Q: Which SDLC model is risk-driven?
- Waterfall
- [x] Spiral
- Big bang
- V-model
> Each loop starts with risk analysis.
:::

:::mcq easy
Q: Which phase usually consumes the most cost over a product's lifetime?
- Design
- Coding
- [x] Maintenance
- Requirements
> Software lives and changes for years.
:::

:::mcq medium
Q: Which model pairs each development phase with a corresponding testing phase?
- Spiral
- [x] V-model
- Prototype
- RAD
> Unit testing pairs with module design, system testing with requirements, and so on.
:::

:::mcq medium
Q: Requirements are unclear and the client wants to "see something" first. Which model fits best?
- Waterfall
- [x] Prototype
- V-model
- Big bang
> A quick model helps the client clarify what they need.
:::

:::mcq medium
Q: Changing software to work on a new operating system version is which type of maintenance?
- Corrective
- [x] Adaptive
- Perfective
- Preventive
> It adapts the software to a changed environment.
:::

:::mcq easy
Q: Which feasibility check asks whether the project is worth its cost?
- Technical
- [x] Economic
- Operational
- Legal
> Cost–benefit analysis.
:::

:::mcq medium
Q: In which phase are the architecture and module interfaces decided?
- Requirements
- [x] Design
- Testing
- Deployment
> High-level and low-level design.
:::

:::mcq hard
Q: Why does fixing a defect cost far more when it is found late in the SDLC?
- Late-stage developers are paid more
- [x] Every phase built on the faulty requirement or design must be reworked and retested
- Testing tools are expensive
- Defects grow by themselves
> An error in the requirements spreads into the design, code and tests.
:::

=== t-waterfall | Waterfall Model
summary: Strictly sequential phases, its documentation-heavy strengths, its weaknesses with changing requirements, and when to use it.
---
The **Waterfall model** runs the SDLC phases **one after another**: requirements → design → implementation → testing → deployment → maintenance. Each phase starts only when the previous one is complete and signed off.

## Strengths

- Simple to understand and manage, with clear milestones
- Thorough documentation at each stage
- Works well when requirements are **clear, fixed and well understood** (for example, regulated or contract-based projects)

## Weaknesses

- **Changes are expensive**: going back to an earlier phase is hard
- Working software appears **only late**
- Testing happens late, so defects are found late
- The customer gives little feedback during development

:::tip
In interviews, contrast it with Agile: Waterfall is predictable and plan-driven; Agile is adaptive and feedback-driven.
:::

:::mcq easy
Q: How does the Waterfall model proceed through its phases?
- In parallel
- [x] Sequentially, with each phase completed before the next begins
- Randomly
- In two-week sprints
> Like water flowing down steps.
:::

:::mcq easy
Q: When is Waterfall most suitable?
- When requirements change weekly
- [x] When requirements are clear, stable and well understood
- For research prototypes
- When the customer wants frequent demos
> Changes are costly in Waterfall.
:::

:::mcq easy
Q: What is a major drawback of Waterfall?
- Too many releases
- [x] It is hard and expensive to accommodate changes late in the project
- No documentation
- No planning
> Going back up the waterfall is costly.
:::

:::mcq medium
Q: When does working software first appear in Waterfall?
- After the first week
- [x] Late, near the end of the project
- During requirements
- Every sprint
> Implementation and testing come late.
:::

:::mcq easy
Q: Which is a strength of Waterfall?
- Constant customer involvement
- [x] Clear milestones and thorough documentation
- Easy to change requirements
- Early working software
> It is easy to manage and audit.
:::

:::mcq medium
Q: In Waterfall, when is testing performed?
- Throughout, from day one
- [x] After implementation is complete
- Before requirements
- Never
> This is why defects are discovered late.
:::

:::mcq medium
Q: Which project suits Waterfall best?
- A start-up app exploring product–market fit
- [x] A payroll system built to a fixed government specification
- An experimental AI research tool
- A game whose features are decided by weekly user polls
> The requirements are fixed and well defined.
:::

:::mcq easy
Q: Who introduced the model that became known as Waterfall (in a 1970 paper)?
- Kent Beck
- [x] Winston Royce
- Barry Boehm
- Ken Schwaber
> Royce actually described it with warnings about its risks.
:::

:::mcq medium
Q: Why is customer feedback limited in Waterfall?
- Customers aren't allowed in
- [x] The customer sees working software only near the end
- There is no requirements phase
- It uses no documentation
> Feedback arrives too late to change much cheaply.
:::

:::mcq hard
Q: Which model is commonly described as an extension of Waterfall that adds a verification step for each phase?
- Spiral
- [x] V-model
- Scrum
- Kanban
> Each development phase has a matching test phase.
:::

=== t-agile | Agile
summary: The Agile Manifesto values and principles, iterative delivery, user stories and how Agile differs from plan-driven methods.
---
**Agile** is a family of iterative methods (Scrum, Kanban, XP) that deliver working software in **short cycles** and adapt to feedback.

## The Agile Manifesto (2001): four values

We value:
1. **Individuals and interactions** over processes and tools
2. **Working software** over comprehensive documentation
3. **Customer collaboration** over contract negotiation
4. **Responding to change** over following a plan

(The items on the right still matter; those on the left matter more.)

## Key principles (from the 12)

- Deliver working software **frequently**, in weeks rather than months
- **Welcome changing requirements**, even late
- Business people and developers work together **daily**
- Working software is the primary measure of progress
- Teams reflect regularly and improve (**retrospectives**)

## Practices

- **User stories:** "As a *student*, I want *to bookmark lessons* so that *I can revisit them*." Each has acceptance criteria.
- **Iterations or sprints**, a backlog, daily stand-ups, continuous integration, test-driven development (TDD) in XP.

| Agile | Waterfall |
|---|---|
| iterative and incremental | sequential |
| embraces change | resists change |
| working software early and often | working software at the end |
| customer involved throughout | customer involved at the start and end |

:::mcq easy
Q: Which value is part of the Agile Manifesto?
- Processes and tools over individuals
- [x] Working software over comprehensive documentation
- Following a plan over responding to change
- Contract negotiation over collaboration
> The manifesto has four values like this.
:::

:::mcq easy
Q: How does Agile deliver software?
- All at once at the end
- [x] In short, frequent iterations
- Only after full documentation
- Once a year
> Small, working increments.
:::

:::mcq easy
Q: What is Agile's attitude to changing requirements?
- Changes are forbidden
- [x] Changes are welcome, even late in development
- Changes need a new contract
- Changes only happen in maintenance
> It is designed to adapt.
:::

:::mcq medium
Q: Which is a correctly formatted user story?
- "The database must use PostgreSQL."
- [x] "As a customer, I want to track my order so that I know when it arrives."
- "Fix bug 42."
- "Build login page by Monday."
> Role, goal and benefit.
:::

:::mcq easy
Q: According to Agile, what is the primary measure of progress?
- Lines of code
- [x] Working software
- Documents produced
- Hours worked
> One of the 12 principles.
:::

:::mcq medium
Q: Which of these is NOT an Agile framework?
- Scrum
- Kanban
- Extreme Programming (XP)
- [x] Waterfall
> Waterfall is plan-driven and sequential.
:::

:::mcq medium
Q: What is the purpose of a retrospective?
- To demo the product to the client
- [x] For the team to reflect on how it worked and decide what to improve
- To assign blame for bugs
- To write the requirements
> It encourages continuous improvement.
:::

:::mcq medium
Q: In which year was the Agile Manifesto published?
- 1995
- [x] 2001
- 2010
- 1970
> Seventeen practitioners wrote it in Utah.
:::

:::mcq medium
Q: What are acceptance criteria in a user story?
- The developer's salary
- [x] The conditions that must be met for the story to be considered done
- The list of bugs
- The project budget
> For example: "Given…, when…, then…".
:::

:::mcq hard
Q: Does Agile mean "no documentation"?
- Yes, documentation is banned
- [x] No; it values working software more, but writes documentation that is actually useful
- Yes, except for contracts
- Only in Scrum
> "Over" means a priority, not an exclusion.
:::

=== t-scrum | Scrum
summary: Scrum roles, events and artifacts: sprints, backlogs, stand-ups, reviews, retrospectives and the definition of done.
---
**Scrum** is the most widely used Agile framework. Work happens in fixed-length **sprints**, usually **1–4 weeks** (often 2).

## Roles (accountabilities)

| Role | Responsibility |
|---|---|
| **Product Owner** | owns and prioritises the **product backlog**; maximises value |
| **Scrum Master** | coaches the team in Scrum and **removes impediments**; a servant leader, not a manager |
| **Developers** | self-organising team that builds the increment |

## Events

| Event | Purpose | Timebox (for a 1-month sprint) |
|---|---|---|
| **Sprint planning** | choose backlog items and plan how to build them | up to 8 h |
| **Daily scrum** (stand-up) | inspect progress towards the sprint goal | **15 min** |
| **Sprint review** | demo the increment to stakeholders and get feedback | up to 4 h |
| **Sprint retrospective** | improve how the team works | up to 3 h |

## Artifacts

- **Product backlog:** the ordered list of everything the product might need
- **Sprint backlog:** the items chosen for this sprint, plus the plan
- **Increment:** the usable, potentially releasable product at the end of the sprint

**Definition of Done (DoD):** the shared checklist that every increment must meet (coded, reviewed, tested, documented).

**Velocity:** the amount of work (often in story points) a team completes per sprint, used for forecasting. A **burndown chart** shows the work remaining over time.

:::mcq easy
Q: Who prioritises the product backlog?
- Scrum Master
- [x] Product Owner
- Developers
- Project manager
> The Product Owner maximises value.
:::

:::mcq easy
Q: What is the Scrum Master's main role?
- Assigning tasks to developers
- [x] Coaching the team in Scrum and removing impediments
- Writing all the code
- Approving the budget
> A servant leader, not a boss.
:::

:::mcq easy
Q: How long is the daily scrum?
- 1 hour
- [x] 15 minutes
- 30 minutes
- No limit
> It is timeboxed.
:::

:::mcq easy
Q: What is the typical length of a sprint?
- 1 day
- [x] 1–4 weeks
- 3–6 months
- 1 year
> Two weeks is the most common.
:::

:::mcq medium
Q: Which event demonstrates the increment to stakeholders?
- Sprint planning
- Daily scrum
- [x] Sprint review
- Sprint retrospective
> Stakeholders give feedback on what was built.
:::

:::mcq medium
Q: What is the sprint retrospective for?
- Planning the next release date
- [x] Improving how the team works
- Demoing features
- Estimating the backlog
> People, process and tools.
:::

:::mcq medium
Q: What is the Definition of Done?
- The project end date
- [x] A shared checklist every increment must satisfy to count as complete
- The Scrum Master's job description
- The product vision
> It ensures consistent quality.
:::

:::mcq easy
Q: What does the sprint backlog contain?
- Every idea for the product
- [x] The items selected for the current sprint and the plan to deliver them
- Only bugs
- Last sprint's work
> It is owned by the developers.
:::

:::mcq medium
Q: A team completed 20, 24 and 22 story points in the last three sprints. What is a reasonable velocity estimate for the next sprint?
- 66
- [x] About 22
- 30
- 10
> The average of 20, 24 and 22 is 22.
:::

:::mcq hard
Q: What does a burndown chart show?
- Team salaries
- [x] The work remaining in the sprint over time
- Bugs per developer
- Server load
> Ideally the line trends steadily to zero.
:::

=== t-software-testing | Software Testing Fundamentals
summary: Verification vs validation, the testing levels, functional vs non-functional testing, regression, and the defect life cycle.
---
**Testing** checks whether software meets its requirements and finds defects before users do.

## Verification vs validation

- **Verification:** "Are we building the product **right**?" Reviews, inspections, walkthroughs; static, without running code.
- **Validation:** "Are we building the **right** product?" Executing and testing against user needs; dynamic.

## Terms

- **Error** (a human mistake) → **defect / bug** (a fault in the code) → **failure** (incorrect behaviour at run time).
- **Test case:** inputs, preconditions, steps and expected result.

## Levels

**Unit → Integration → System → Acceptance (UAT)**

## Types

| Functional | Non-functional |
|---|---|
| does each feature work? (smoke, sanity, regression) | performance, load, stress, security, usability, compatibility |

- **Smoke testing:** a quick check that the build's critical functions work at all.
- **Sanity testing:** a narrow check that a specific fix works.
- **Regression testing:** re-running tests to make sure new changes haven't broken existing features.
- **Alpha** testing is done in-house; **beta** testing by real users before release.

## Defect life cycle

New → Assigned → Open → Fixed → Retest → **Closed** (or Reopened / Rejected / Deferred).

**Severity** = the impact on the system. **Priority** = how urgently it should be fixed.

:::mcq easy
Q: "Are we building the product right?" describes:
- Validation
- [x] Verification
- Deployment
- Maintenance
> Validation asks whether it is the right product.
:::

:::mcq easy
Q: Which testing ensures that new changes haven't broken existing functionality?
- Smoke testing
- [x] Regression testing
- Alpha testing
- Load testing
> Re-run the existing tests after every change.
:::

:::mcq easy
Q: What is the correct order of the testing levels?
- System → Unit → Integration → Acceptance
- [x] Unit → Integration → System → Acceptance
- Acceptance → System → Unit → Integration
- Integration → Unit → Acceptance → System
> From the smallest pieces to the whole product.
:::

:::mcq medium
Q: What is smoke testing?
- Testing for security holes
- [x] A quick check that a new build's critical functions work before deeper testing
- Testing under extreme load
- Testing by end users
> If it fails, the build is rejected.
:::

:::mcq easy
Q: Which of these is non-functional testing?
- Login works with valid credentials
- [x] Load testing with 10,000 concurrent users
- The cart total updates correctly
- Password reset sends an email
> It tests performance, not features.
:::

:::mcq medium
Q: How do severity and priority differ?
- They are the same
- [x] Severity is the impact on the system; priority is how urgently it should be fixed
- Priority is set by developers only
- Severity applies only to UI bugs
> A typo in the company name is low severity but high priority.
:::

:::mcq medium
Q: What is beta testing?
- Testing by developers
- [x] Testing by real users in a real environment before the final release
- Unit testing
- Code review
> Alpha testing is done in-house.
:::

:::mcq easy
Q: Which is a static (verification) technique?
- Running unit tests
- [x] A code review or inspection
- Load testing
- Beta testing
> Static techniques don't execute the code.
:::

:::mcq medium
Q: A fixed bug is retested and still fails. Which state does it move to?
- Closed
- [x] Reopened
- Deferred
- Rejected
> It goes back to the developer.
:::

:::mcq hard
Q: "Exhaustive testing is impossible" is a testing principle. What does it imply?
- Testing is pointless
- [x] Use risk and techniques such as equivalence partitioning to choose a representative set of tests
- Test only the UI
- Only test after release
> You can't try every input combination.
:::

=== t-unit-testing | Unit Testing
summary: Testing individual units in isolation, AAA structure, mocks and stubs, code coverage, TDD and testing frameworks.
---
**Unit testing** checks the smallest testable parts (functions, methods, classes) **in isolation**. It is usually written by developers and run automatically.

## Structure: Arrange–Act–Assert

```java
@Test
void appliesTenPercentDiscount() {
    Cart cart = new Cart();          // Arrange
    cart.add(new Item(1000));
    double total = cart.totalWithDiscount(10);   // Act
    assertEquals(900, total, 0.001);             // Assert
}
```

## Isolation with test doubles

| Double | Purpose |
|---|---|
| **Stub** | returns canned answers |
| **Mock** | also verifies that expected calls happened |
| **Fake** | a lightweight working implementation (an in-memory database) |

## Good unit tests are FIRST

**F**ast, **I**ndependent, **R**epeatable, **S**elf-validating, **T**imely.

## Coverage

The percentage of code exercised by tests (statement, branch, path). High coverage helps, but **100% coverage doesn't mean bug-free**: tests must assert the right things.

## Test-Driven Development (TDD)

**Red → Green → Refactor**: write a failing test, write the minimum code to pass it, then clean up.

**Frameworks:** JUnit and TestNG (Java), pytest and unittest (Python), Jest (JavaScript). Mockito is the common Java mocking library.

:::mcq easy
Q: What does unit testing test?
- The whole system
- [x] Individual functions or classes in isolation
- The user interface only
- Network performance
> The smallest testable pieces.
:::

:::mcq easy
Q: Who usually writes unit tests?
- End users
- [x] Developers
- Sales team
- Only QA managers
> They are written alongside the code.
:::

:::mcq medium
Q: What does AAA stand for in unit tests?
- Analyse, Approve, Archive
- [x] Arrange, Act, Assert
- Assert, Act, Arrange
- Add, Alter, Assess
> Set up, perform the action, check the result.
:::

:::mcq medium
Q: How does a mock differ from a stub?
- They are identical
- [x] A mock also verifies that expected interactions happened; a stub only returns canned data
- A stub verifies calls
- Mocks are only for databases
> Mocks check behaviour; stubs supply state.
:::

:::mcq easy
Q: What is the TDD cycle?
- Code → Test → Deploy
- [x] Red → Green → Refactor
- Design → Code → Document
- Plan → Build → Ship
> Write a failing test first.
:::

:::mcq medium
Q: Does 100% code coverage guarantee bug-free code?
- Yes
- [x] No; tests may not assert the right things or cover every input combination
- Yes, for Java
- Only with mocks
> Coverage shows which code ran, not that it is correct.
:::

:::mcq easy
Q: Which is a Java unit-testing framework?
- Selenium
- [x] JUnit
- JMeter
- Postman
> Selenium is for UI automation and JMeter for load testing.
:::

:::mcq medium
Q: What does the "I" in the FIRST principles mean?
- Integrated
- [x] Independent: tests don't depend on each other or on run order
- Incremental
- Interactive
> Each test sets up its own state.
:::

:::mcq medium
Q: Why are external services such as databases replaced with test doubles in unit tests?
- Databases are illegal in tests
- [x] To keep tests fast, isolated and deterministic
- To increase coverage numbers
- Because mocks are more accurate
> The unit itself is what is under test.
:::

:::mcq hard
Q: Which Python framework is widely used for unit testing with simple assert statements?
- JUnit
- [x] pytest
- Mockito
- Cypress
> pytest discovers test_*.py files automatically.
:::

=== t-integration-testing | Integration Testing
summary: Testing how modules work together: big bang, top-down and bottom-up approaches, stubs and drivers, and API/contract tests.
---
**Integration testing** checks the **interfaces and interactions** between modules that each passed unit testing: data passed correctly, calls made in the right order, errors handled across boundaries.

## Approaches

| Approach | How | Needs |
|---|---|---|
| **Big bang** | integrate everything at once, then test | nothing special, but faults are hard to locate |
| **Top-down** | start from the top modules and add lower ones gradually | **stubs** for the lower modules not yet ready |
| **Bottom-up** | start from the lowest modules and move up | **drivers** to call the lower modules |
| **Sandwich (hybrid)** | top-down and bottom-up at the same time | both |

- **Stub:** a dummy *called* module (it stands in for something below).
- **Driver:** a dummy *calling* module (it stands in for something above).

## In modern systems

- **API testing:** check the endpoints, request and response formats and status codes (Postman, REST Assured).
- **Contract testing:** make sure a service and its consumers agree on the interface (Pact).
- Integration tests often use real databases in containers (Testcontainers).

:::mcq easy
Q: What does integration testing check?
- Single functions in isolation
- [x] The interfaces and interactions between modules
- Only the UI design
- Hardware performance
> It finds interface defects.
:::

:::mcq medium
Q: Which approach integrates all modules at once?
- Top-down
- Bottom-up
- [x] Big bang
- Sandwich
> It is simple, but faults are hard to isolate.
:::

:::mcq medium
Q: Top-down integration needs which test doubles for missing lower-level modules?
- Drivers
- [x] Stubs
- Mocks of the UI
- Nothing
> Stubs stand in for the called modules.
:::

:::mcq medium
Q: Bottom-up integration needs which test doubles?
- Stubs
- [x] Drivers
- Fakes only
- None
> Drivers call the lower modules under test.
:::

:::mcq medium
Q: What is the main drawback of big bang integration?
- It is too slow to set up
- [x] It is hard to locate the source of a failure
- It needs too many stubs
- It can't be automated
> Everything changes at once.
:::

:::mcq easy
Q: Which tool is commonly used for manual and automated API testing?
- Photoshop
- [x] Postman
- Excel
- Figma
> REST Assured is a Java alternative.
:::

:::mcq medium
Q: What is a driver in integration testing?
- A hardware device
- [x] A dummy module that calls the module under test
- A dummy module called by the module under test
- A database connection
> It simulates a higher-level caller.
:::

:::mcq medium
Q: What does contract testing verify?
- Legal agreements
- [x] That a service provider and its consumers agree on the API's requests and responses
- Database schemas only
- UI layouts
> For example, with Pact.
:::

:::mcq easy
Q: What comes immediately after unit testing?
- Acceptance testing
- [x] Integration testing
- Beta testing
- Maintenance
> Unit → integration → system → acceptance.
:::

:::mcq hard
Q: The sandwich (hybrid) approach combines:
- Unit and system testing
- [x] Top-down and bottom-up integration
- Alpha and beta testing
- Smoke and sanity testing
> It integrates towards a middle layer from both ends.
:::

=== t-system-testing | System and Acceptance Testing
summary: Testing the complete system against requirements, the non-functional test types, and user acceptance testing.
---
**System testing** tests the **complete, integrated** system against the requirements (the SRS), in an environment close to production. It is usually done by an independent QA team, using **black-box** techniques.

## What system testing covers

| Type | Checks |
|---|---|
| Functional | every feature works end to end |
| **Performance** | response time and throughput under expected load |
| **Load** | behaviour at the expected peak number of users |
| **Stress** | behaviour **beyond** the limits; how it fails and recovers |
| **Security** | authentication, authorisation, vulnerabilities |
| Usability | ease of use |
| Compatibility | browsers, devices, operating systems |
| Recovery | recovering after crashes or failures |

## Acceptance testing

**User Acceptance Testing (UAT)** is done by the **client or end users** to confirm that the system meets business needs before go-live. Forms include **alpha** (at the developer's site), **beta** (real users in their own environment), contract acceptance and regulatory acceptance.

**End-to-end (E2E) testing** follows complete user journeys across the system (for example with Selenium, Cypress or Playwright).

:::mcq easy
Q: What does system testing test?
- Individual functions
- [x] The complete, integrated system against the requirements
- A single module's interface
- Only the source code style
> It treats the whole product as a black box.
:::

:::mcq easy
Q: Who performs user acceptance testing?
- Only developers
- [x] The client or end users
- The compiler
- The database administrator
> It confirms that the system meets business needs.
:::

:::mcq medium
Q: How does stress testing differ from load testing?
- They are the same
- [x] Stress testing goes beyond expected limits to see how the system fails and recovers; load testing checks the expected peak
- Load testing checks security
- Stress testing is only for databases
> Stress means pushing past the breaking point.
:::

:::mcq easy
Q: Which kind of testing do system testers mainly use?
- White-box
- [x] Black-box
- Unit testing
- Code review
> They test behaviour against requirements without looking at the code.
:::

:::mcq medium
Q: Checking that a website works in Chrome, Firefox and Safari on phones and desktops is:
- Load testing
- [x] Compatibility testing
- Unit testing
- Regression testing
> Across browsers, devices and operating systems.
:::

:::mcq medium
Q: Which test checks whether the system restores data correctly after a crash?
- Usability testing
- [x] Recovery testing
- Smoke testing
- Sanity testing
> It forces failures deliberately.
:::

:::mcq easy
Q: Which tool is used for browser-based end-to-end test automation?
- JUnit
- [x] Selenium
- Git
- Docker
> Cypress and Playwright are alternatives.
:::

:::mcq medium
Q: Where does alpha testing take place?
- At customer sites
- [x] At the developer's site, by internal users or testers
- Only in production
- After release
> Beta testing takes place at users' sites.
:::

:::mcq easy
Q: Which comes last before go-live?
- Unit testing
- Integration testing
- [x] Acceptance testing
- Code review
> It is the final sign-off.
:::

:::mcq hard
Q: Measuring that 95% of requests complete in under 300 ms with 1,000 concurrent users is:
- Functional testing
- [x] Performance (load) testing
- Usability testing
- Unit testing
> It tests response time under expected load.
:::

=== t-black-white-box | Black-Box and White-Box Testing
summary: Testing from the specification vs from the code: equivalence partitioning, boundary values, decision tables, statement and branch coverage, and cyclomatic complexity.
---
| Black-box | White-box (glass-box) |
|---|---|
| based on **requirements**; the code is not seen | based on the **internal code** structure |
| done by testers | done mainly by developers |
| used at system and acceptance level | used at unit and integration level |
| techniques: EP, BVA, decision tables, state transitions | techniques: statement, branch and path coverage |

**Grey-box** testing uses partial knowledge of the internals.

## Black-box techniques

- **Equivalence partitioning (EP):** split the inputs into classes that should behave the same, and test one value from each.
  - Age valid between 18 and 60 → partitions <18, 18–60, >60.
- **Boundary value analysis (BVA):** errors cluster at the edges, so test the boundaries.
  - For 18–60: test **17, 18, 60, 61** (some testers add 19 and 59).
- **Decision tables:** list every combination of conditions and the expected actions.
- **State transition testing:** check the valid and invalid transitions between states (for example, 3 wrong PINs lock the card).

## White-box techniques

- **Statement coverage:** every statement runs at least once.
- **Branch (decision) coverage:** every true/false outcome of each decision runs. It is **stronger** than statement coverage.
- **Path coverage:** every possible path, the strongest and often impractical.
- **Cyclomatic complexity** V(G) = E − N + 2P (edges, nodes, connected components) = **number of decisions + 1**. It gives the number of independent paths, which is the minimum number of tests for basis-path coverage.

:::mcq easy
Q: What is black-box testing based on?
- The internal code structure
- [x] The requirements and specifications, without looking at the code
- Compiler output
- Database indexes
> Testers check inputs and outputs only.
:::

:::mcq easy
Q: White-box testing requires knowledge of:
- Only the UI
- [x] The internal code and logic
- Only the business requirements
- The users' personal data
> It is also called glass-box or structural testing.
:::

:::mcq medium
Q: A field accepts ages 18 to 60. Which values does boundary value analysis test?
- 30 and 45
- [x] 17, 18, 60 and 61
- 0 and 100
- 18 only
> Values just inside and just outside each boundary.
:::

:::mcq medium
Q: For valid ages 18–60, how many equivalence partitions are there (valid and invalid)?
- 1
- 2
- [x] 3
- 43
> Below 18, 18 to 60, and above 60.
:::

:::mcq medium
Q: Which is stronger: statement coverage or branch coverage?
- Statement coverage
- [x] Branch coverage
- They are equal
- Neither measures anything
> 100% branch coverage implies 100% statement coverage, but not the other way round.
:::

:::mcq medium
Q: A function has 3 independent if statements and no loops. What is its cyclomatic complexity?
- 3
- [x] 4
- 8
- 1
> Number of decisions + 1.
:::

:::mcq easy
Q: Which technique is black-box?
- Statement coverage
- Path coverage
- [x] Decision table testing
- Cyclomatic complexity analysis
> It works from the specification's rules.
:::

:::mcq medium
Q: Testing that an ATM card is locked after three wrong PINs is best designed with:
- Statement coverage
- [x] State transition testing
- Boundary value analysis only
- Load testing
> It models the states and the events between them.
:::

:::mcq easy
Q: What is grey-box testing?
- Testing with no knowledge at all
- [x] Testing with partial knowledge of the internals
- Testing only colour themes
- Testing by end users only
> It combines both perspectives.
:::

:::mcq hard
Q: A control-flow graph has 9 edges, 7 nodes and 1 connected component. What is its cyclomatic complexity?
- 2
- [x] 4
- 16
- 3
> V(G) = E − N + 2P = 9 − 7 + 2 = 4.
:::

=== t-git | Git and Version Control
summary: Repositories, commits, branches, merge vs rebase, remotes, pull requests, conflicts and the everyday commands.
---
**Git** is a **distributed** version control system: every clone holds the full history.

## The three areas

**Working directory** → (`git add`) → **staging area** → (`git commit`) → **local repository** → (`git push`) → **remote**.

## Everyday commands

| Command | Does |
|---|---|
| `git init` / `git clone <url>` | create a repository, or copy an existing one |
| `git status` | show changed and staged files |
| `git add <file>` | stage changes |
| `git commit -m "msg"` | record a snapshot |
| `git log` | show the history |
| `git branch` / `git switch -c feature` | list branches, or create and switch to one |
| `git merge feature` | combine a branch into the current one |
| `git pull` | **fetch + merge** from the remote |
| `git fetch` | download remote changes **without** merging |
| `git push` | upload commits |
| `git stash` | shelve uncommitted changes temporarily |
| `git revert <commit>` | make a new commit that undoes an earlier one (safe on shared history) |
| `git reset` | move the branch pointer (can rewrite history; avoid on shared branches) |

## Merge vs rebase

- **Merge** keeps history as it happened and adds a merge commit.
- **Rebase** replays your commits on top of another branch, giving a **linear** history. Don't rebase commits others have already pulled.

## Conflicts

When two branches change the same lines, Git marks the conflict with `<<<<<<<`, `=======` and `>>>>>>>`. Edit the file, `git add` it and commit.

**Pull request (PR):** a request to merge a branch, used for code review on GitHub or GitLab. `.gitignore` lists files Git shouldn't track (build outputs, secrets).

:::mcq easy
Q: What kind of version control system is Git?
- Centralised
- [x] Distributed
- File-locking
- Cloud-only
> Every clone contains the full history.
:::

:::mcq easy
Q: Which command stages changes for the next commit?
- git commit
- [x] git add
- git push
- git stage-all
> Then commit the staged snapshot.
:::

:::mcq medium
Q: What is the difference between git fetch and git pull?
- No difference
- [x] fetch downloads remote changes without merging; pull fetches and then merges
- pull only downloads
- fetch pushes changes
> pull = fetch + merge.
:::

:::mcq easy
Q: Which command uploads local commits to the remote?
- git pull
- [x] git push
- git clone
- git fetch
> It sends your commits to the server.
:::

:::mcq medium
Q: What does git stash do?
- Deletes the branch
- [x] Temporarily shelves uncommitted changes so you can switch context
- Pushes to the remote
- Creates a tag
> Bring them back later with git stash pop.
:::

:::mcq medium
Q: Which is the safest way to undo a commit that has already been pushed to a shared branch?
- git reset --hard and force push
- [x] git revert <commit>
- Delete the repository
- git stash
> It adds a new commit and doesn't rewrite shared history.
:::

:::mcq medium
Q: What does rebasing do?
- Deletes old commits permanently
- [x] Replays your commits on top of another branch, giving a linear history
- Creates a merge commit
- Clones the repository
> Avoid rebasing commits others already have.
:::

:::mcq easy
Q: What is .gitignore for?
- Listing collaborators
- [x] Listing files and patterns Git shouldn't track
- Storing passwords
- Logging commits
> For example node_modules, build outputs and .env files.
:::

:::mcq medium
Q: Git shows <<<<<<< and >>>>>>> markers in a file. What does this mean?
- The file is corrupted
- [x] There is a merge conflict to resolve by hand
- The commit succeeded
- The file is ignored
> Edit the file, then git add and commit.
:::

:::mcq hard
Q: Which command creates a new branch and switches to it in one step?
- git branch -d feature
- [x] git switch -c feature (or git checkout -b feature)
- git merge feature
- git push feature
> -c means create.
:::
