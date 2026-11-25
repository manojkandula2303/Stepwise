=== t-classes-objects | Classes and Objects
summary: Classes as blueprints, objects as instances, fields and methods, static vs instance members, `this` and references.
---
A **class** is a blueprint that defines **state** (fields) and **behaviour** (methods). An **object** is an instance of a class, created at run time (in Java, on the heap with `new`).

```java
class Student {
    String name;            // instance field (one per object)
    static int count = 0;   // static field (shared by all objects)

    Student(String name) {
        this.name = name;   // `this` = the current object
        count++;
    }
    void greet() { System.out.println("Hi, " + name); }
}
```

## Static vs instance members

| Static | Instance |
|---|---|
| belongs to the **class** | belongs to each **object** |
| one shared copy | a separate copy per object |
| accessed as `ClassName.member` | accessed through an object |
| a static method **can't** use instance fields directly | can use both |

## References

Variables of class type hold **references**. `b = a` copies the reference, so both variables point to the **same object**. `==` compares references; `.equals()` compares content (when it is overridden).

**Default field values in Java:** 0 for numbers, false for boolean, null for references (but local variables must be initialised).

:::mcq easy
Q: What is a class?
- An instance of an object
- [x] A blueprint that defines state and behaviour
- A variable
- A method
> Objects are instances of a class.
:::

:::mcq easy
Q: In Java, where is an object created with `new` stored?
- On the stack
- [x] On the heap
- In registers
- In the code segment
> The reference variable may be on the stack.
:::

:::mcq easy
Q: What does `this` refer to?
- The parent class
- [x] The current object
- The main method
- A static field
> It is used to resolve name clashes and to chain constructors.
:::

:::mcq easy
Q: How does a static field behave?
- Each object gets its own copy
- [x] One copy is shared by all objects of the class
- It can't be changed
- It is private by default
> It belongs to the class itself.
:::

:::mcq medium
Q: What does this code print?

```java
class Counter {
    static int count = 0;
    Counter() { count++; }
}
// in main:
new Counter(); new Counter(); new Counter();
System.out.println(Counter.count);
```
- 1
- [x] 3
- 0
- Compile error
> All three constructor calls increment the same static field.
:::

:::mcq easy
Q: What is the default value of an int instance field in Java?
- null
- [x] 0
- Garbage value
- −1
> Fields get default values; local variables don't.
:::

:::mcq medium
Q: Can a static method directly access instance fields?
- Yes, always
- [x] No; it has no `this`, so it needs an object reference
- Only private fields
- Only in Python
> Static methods aren't tied to any particular object.
:::

:::mcq easy
Q: In OOP, an object's state is represented by its:
- Methods
- [x] Fields (attributes)
- Constructors
- Packages
> Methods represent its behaviour.
:::

:::mcq medium
Q: Two separate objects have identical field values. What does `a == b` evaluate to in Java?
- true
- [x] false
- Compile error
- It depends on hashCode
> `==` compares references, and these are two different objects.
:::

:::mcq hard
Q: What does this code print?

```java
class P { int x = 5; }
// in main:
P a = new P();
P b = a;
b.x = 10;
System.out.println(a.x);
```
- 5
- [x] 10
- 0
- Compile error
> a and b refer to the same object.
:::

=== t-encapsulation | Encapsulation
summary: Bundling data with methods and hiding internal state through access modifiers, getters/setters and immutability.
---
**Encapsulation** means bundling data and the methods that act on it into one unit (a class) and **restricting direct access** to the internal state.

```java
class Account {
    private double balance;                 // hidden

    public double getBalance() { return balance; }

    public void deposit(double amt) {       // controlled access
        if (amt <= 0) throw new IllegalArgumentException("Invalid amount");
        balance += amt;
    }
}
```

## Java access modifiers

| Modifier | Same class | Same package | Subclass | Everywhere |
|---|---|---|---|---|
| private | ✔ | ✘ | ✘ | ✘ |
| default (none) | ✔ | ✔ | ✘ (unless in the same package) | ✘ |
| protected | ✔ | ✔ | ✔ | ✘ |
| public | ✔ | ✔ | ✔ | ✔ |

## Benefits

Validation · invariants are protected · the implementation can change without breaking callers · easier debugging.

## Immutable classes

Make the class `final`, its fields `private final`, give it no setters, and return **defensive copies** of mutable fields.

:::warning
Returning an internal mutable object (such as a `List`) straight from a getter breaks encapsulation, because callers can then change it.
:::

**Python** has no enforced private members. By convention `_name` is internal, and `__name` triggers name mangling.

:::mcq easy
Q: What is encapsulation?
- Inheriting from several classes
- [x] Bundling data and methods together and restricting direct access to the data
- Overloading methods
- Converting objects to bytes
> It is data hiding plus controlled access.
:::

:::mcq easy
Q: How is encapsulation usually achieved in Java?
- Public fields
- [x] Private fields with public getters and setters
- Static methods only
- Interfaces only
> Access goes through methods.
:::

:::mcq easy
Q: Which access modifier is the most restrictive?
- public
- protected
- default
- [x] private
> It allows access only within the class.
:::

:::mcq medium
Q: Where are protected members accessible?
- Only within the class
- [x] Within the same package, and in subclasses (even in other packages)
- Everywhere
- Only in subclasses in the same package
> It is wider than default and narrower than public.
:::

:::mcq medium
Q: Where are members with default (package-private) access accessible?
- Everywhere
- [x] Only within the same package
- Only in subclasses
- Only in the same class
> This applies when no modifier is written.
:::

:::mcq easy
Q: What is a key benefit of encapsulation?
- Faster CPU speed
- [x] The class controls and validates changes to its data
- No need for objects
- Automatic inheritance
> For example, rejecting a negative deposit.
:::

:::mcq medium
Q: A setter rejects negative ages. Which principle does this show?
- Polymorphism
- [x] Encapsulation
- Inheritance
- Abstraction only
> Controlled access protects the object's invariants.
:::

:::mcq medium
Q: Which is required for a properly immutable class?
- Public setters
- [x] Private final fields, no setters, and defensive copies of mutable fields
- Static fields only
- An abstract class
> java.lang.String is a classic example.
:::

:::mcq medium
Q: How does Python signal that an attribute is internal?
- The `private` keyword
- [x] A leading underscore (with name mangling for a double underscore)
- The `final` keyword
- It can't be done
> It is a convention, not enforcement.
:::

:::mcq hard
Q: Which practice breaks encapsulation?
- Private fields
- Validation in setters
- [x] A getter that returns a direct reference to an internal mutable list
- Making fields final
> Callers can change the internal list. Return a copy or an unmodifiable view instead.
:::

=== t-inheritance | Inheritance
summary: Reusing and extending classes: types of inheritance, `super`, constructor order, the diamond problem and IS-A vs HAS-A.
---
**Inheritance** lets a subclass acquire the fields and methods of a superclass and then add to or override them. It models an **IS-A** relationship (a Dog IS-A Animal).

```java
class Animal { void eat() { System.out.println("eating"); } }
class Dog extends Animal { void bark() { System.out.println("woof"); } }
```

## Types

Single · multilevel (A → B → C) · hierarchical (B and C both extend A). **Multiple inheritance of classes isn't allowed in Java**, because of the **diamond problem** (ambiguity over which parent's method to use). Java allows multiple inheritance of **interfaces** instead. C++ allows multiple class inheritance.

## super

- `super(...)` calls the parent constructor (it must be the **first statement**).
- `super.method()` calls the parent's version of a method.

## Constructor order

Constructors run **from the top of the hierarchy downwards**: the parent's constructor finishes before the child's body runs.

## Notes

- **Private members** aren't accessible in the subclass (use protected or getters).
- An overriding method **can't reduce visibility** (public → protected is a compile error).
- **Composition (HAS-A)** is often preferred: a Car HAS-A Engine. It is looser coupling and more flexible.

:::mcq easy
Q: Which keyword does a Java class use to inherit from another class?
- implements
- [x] extends
- inherits
- super
> Interfaces are implemented.
:::

:::mcq medium
Q: Why doesn't Java support multiple inheritance of classes?
- It is too slow
- [x] To avoid the diamond problem
- Because of memory limits
- It does support it
> It would be ambiguous which parent implementation to use.
:::

:::mcq easy
Q: What is `super(...)` used for?
- Creating a new object
- [x] Calling the parent class's constructor
- Calling a static method
- Ending inheritance
> It must be the first statement in the constructor.
:::

:::mcq medium
Q: What does this code print?

```java
class A { A() { System.out.print("A"); } }
class B extends A { B() { System.out.print("B"); } }
class C extends B { C() { System.out.print("C"); } }
// in main:
new C();
```
- CBA
- [x] ABC
- C
- AC
> Parent constructors run first.
:::

:::mcq easy
Q: Can a subclass directly access its parent's private fields?
- Yes
- [x] No
- Only in the same package
- Only with super
> Use protected members or getters.
:::

:::mcq easy
Q: Which relationship does inheritance model?
- HAS-A
- [x] IS-A
- USES-A
- PART-OF
> Composition models HAS-A.
:::

:::mcq medium
Q: Why is "favour composition over inheritance" common advice?
- Composition is faster
- [x] Composition gives looser coupling and more flexibility
- Inheritance is deprecated
- Composition removes the need for interfaces
> Behaviour can be swapped without deep class hierarchies.
:::

:::mcq easy
Q: Class C extends B, which extends A. What type of inheritance is this?
- Multiple
- [x] Multilevel
- Hierarchical
- Hybrid
> It is a chain of inheritance.
:::

:::mcq medium
Q: How can a Java class get behaviour from more than one source type?
- By extending two classes
- [x] By implementing several interfaces
- It can't
- With the `multi` keyword
> A class can implement any number of interfaces.
:::

:::mcq hard
Q: A superclass method is public. Can the subclass override it as protected?
- Yes
- [x] No; overriding can't reduce visibility
- Only if the method is static
- Only in the same package
> It would break substitutability.
:::

=== t-polymorphism | Polymorphism
summary: Compile-time (overloading) vs run-time (overriding) polymorphism, upcasting, dynamic dispatch, and why static methods and fields aren't polymorphic.
---
**Polymorphism** means "one interface, many forms": the same call behaves differently depending on the object.

| Kind | Mechanism | Resolved |
|---|---|---|
| **Compile-time** (static) | method **overloading** (and operator overloading in C++) | at compile time |
| **Run-time** (dynamic) | method **overriding** + dynamic dispatch | at run time, by the **actual object** type |

```java
Animal a = new Dog();   // upcasting (implicit)
a.sound();              // calls Dog's sound(): dynamic dispatch
Dog d = (Dog) a;        // downcasting (explicit; may throw ClassCastException)
```

## Things that are NOT polymorphic in Java

- **Static methods** are **hidden**, not overridden. Which one runs depends on the **reference type**.
- **Fields** are resolved by the **reference type**, too.
- **Private and final methods** can't be overridden.

Java has no user-defined operator overloading (only the built-in `+` for strings). C++ and Python (`__add__`) support it.

:::mcq easy
Q: Method overloading is an example of:
- Run-time polymorphism
- [x] Compile-time polymorphism
- Encapsulation
- Abstraction
> The compiler picks the method from the argument types.
:::

:::mcq easy
Q: Run-time polymorphism in Java is achieved through:
- Overloading
- [x] Method overriding (dynamic dispatch)
- Static methods
- Constructors
> The method that runs depends on the actual object's type.
:::

:::mcq medium
Q: What does this code print?

```java
class Animal { void sound() { System.out.println("..."); } }
class Dog extends Animal { void sound() { System.out.println("Woof"); } }
// in main:
Animal a = new Dog();
a.sound();
```
- ...
- [x] Woof
- Compile error
- Nothing
> Dynamic dispatch uses the actual object type, Dog.
:::

:::mcq easy
Q: What is upcasting?
- Converting int to long
- [x] Referring to a subclass object through a superclass reference
- Converting a superclass object to a subclass
- Calling super()
> It is implicit and always safe.
:::

:::mcq medium
Q: What can happen with an incorrect downcast?
- Nothing
- [x] A ClassCastException is thrown at run time
- A compile error always occurs
- Memory leaks
> Check with instanceof before casting.
:::

:::mcq hard
Q: What does this code print?

```java
class A { static void hi() { System.out.println("A"); } }
class B extends A { static void hi() { System.out.println("B"); } }
// in main:
A obj = new B();
obj.hi();
```
- B
- [x] A
- Compile error
- AB
> Static methods are hidden, not overridden, so the reference type (A) decides.
:::

:::mcq hard
Q: What does this code print?

```java
class A { int x = 1; }
class B extends A { int x = 2; }
// in main:
A o = new B();
System.out.println(o.x);
```
- 2
- [x] 1
- 0
- Compile error
> Fields aren't polymorphic; they are resolved by the reference type.
:::

:::mcq easy
Q: Which language supports user-defined operator overloading?
- Java
- [x] C++
- C
- Go
> Python also does, through methods like __add__.
:::

:::mcq medium
Q: In Java, which call is resolved at run time?
- Overloaded method selection
- [x] An overridden instance method call
- A static method call
- A private method call
> Virtual dispatch happens at run time.
:::

:::mcq medium
Q: Which statement about polymorphism is true?
- It requires multiple inheritance
- [x] It lets code written against a supertype work with many subtypes
- It only applies to fields
- It removes the need for classes
> For example, a List<Animal> holding dogs and cats.
:::

=== t-abstraction | Abstraction
summary: Exposing what an object does while hiding how; abstract classes and interfaces; abstraction vs encapsulation.
---
**Abstraction** means showing only the **essential features** and hiding the implementation details. You use `list.sort()` without knowing the sorting algorithm; you drive a car without knowing how the fuel injection works.

## Tools in Java

- **Abstract classes:** can mix abstract methods (no body) with concrete ones.
- **Interfaces:** pure contracts (plus default methods from Java 8).

```java
abstract class Shape {
    abstract double area();          // what: every shape has an area
    void describe() {                // shared behaviour
        System.out.println("Area = " + area());
    }
}
class Circle extends Shape {
    double r;
    Circle(double r) { this.r = r; }
    double area() { return Math.PI * r * r; }   // how
}
```

## Abstraction vs encapsulation

| Abstraction | Encapsulation |
|---|---|
| hides **complexity**: focuses on *what* | hides **data**: protects *how* it is stored |
| designed with interfaces and abstract classes | implemented with access modifiers |
| a design-level concept | an implementation-level concept |

Abstract classes **can't be instantiated**. A class with an abstract method **must be declared abstract**.
In **Python**, use `from abc import ABC, abstractmethod`.

:::mcq easy
Q: What is abstraction?
- Hiding data with private fields
- [x] Showing the essential features while hiding implementation details
- Inheriting from a parent class
- Overloading methods
> It is about what an object does, not how.
:::

:::mcq easy
Q: How is abstraction achieved in Java?
- Only with private fields
- [x] With abstract classes and interfaces
- With static methods
- With constructors
> Both define contracts.
:::

:::mcq medium
Q: What is the main difference between abstraction and encapsulation?
- They are the same
- [x] Abstraction hides complexity (what); encapsulation hides and protects data (how)
- Encapsulation only applies to interfaces
- Abstraction uses access modifiers
> They complement each other.
:::

:::mcq easy
Q: Which real-world example illustrates abstraction?
- Locking your diary
- [x] Driving a car with the steering wheel and pedals without knowing how the engine works
- Copying a file
- Writing in a notebook
> The interface is simple; the internals are hidden.
:::

:::mcq easy
Q: Can you create an object of an abstract class directly?
- Yes
- [x] No
- Only with a default constructor
- Only in the same package
> Instantiate a concrete subclass instead.
:::

:::mcq medium
Q: What is an abstract method?
- A method with an empty body {}
- [x] A method declared without a body, which subclasses must implement
- A static method
- A private method
> For example: abstract double area();
:::

:::mcq medium
Q: Which statement best demonstrates abstraction?
- `private int x;`
- [x] Calling `list.sort()` without knowing which algorithm it uses
- `x = x + 1;`
- Declaring a constant
> You use the behaviour through a simple interface.
:::

:::mcq medium
Q: In Python, how do you declare an abstract base class?
- With the `abstract` keyword
- [x] Subclass ABC and mark methods with @abstractmethod
- With interfaces
- It isn't possible
> These come from the abc module.
:::

:::mcq easy
Q: A Java class contains an abstract method. What must the class be?
- final
- [x] Declared abstract
- static
- private
> Otherwise it won't compile.
:::

:::mcq hard
Q: A subclass of an abstract class doesn't implement all the inherited abstract methods. What must it be?
- final
- [x] Declared abstract itself
- An interface
- static
> Only fully concrete classes can be instantiated.
:::

=== t-constructors | Constructors
summary: Default and parameterised constructors, overloading, this() and super() chaining, private constructors and copy constructors.
---
A **constructor** initialises a new object. In Java it has the **same name as the class** and **no return type**, not even void.

## Kinds

- **Default constructor:** the compiler adds a no-argument constructor **only if you define none**.
- **Parameterised constructor:** takes arguments.
- **Copy constructor:** creates an object from another object of the same type (explicit in Java; built in for C++).

If you define only `A(int x)`, then `new A()` is a **compile error**, because no default constructor is generated.

## Chaining

- `this(...)` calls another constructor in the **same** class.
- `super(...)` calls the **parent** constructor.
- Either must be the **first statement**, so you can't use both in one constructor.

```java
class Point {
    int x, y;
    Point() { this(0, 0); }                 // delegates
    Point(int x, int y) { this.x = x; this.y = y; }
}
```

## Facts

- Constructors are **not inherited**.
- They can be **overloaded**.
- A **private** constructor stops outside code from creating objects (used for singletons and utility classes).

:::mcq easy
Q: What is true of a Java constructor?
- It must return void
- [x] It has the same name as the class and no return type
- It must be static
- It can only be private
> It initialises a new object.
:::

:::mcq easy
Q: When does Java provide a default no-argument constructor?
- Always
- [x] Only when the class defines no constructors at all
- Only for abstract classes
- Never
> Defining any constructor removes it.
:::

:::mcq medium
Q: A class defines only A(int x). What happens with `new A()`?
- It works with x = 0
- [x] Compile error
- Run-time exception
- It calls A(int) with null
> No default constructor exists.
:::

:::mcq easy
Q: Can constructors be overloaded?
- No
- [x] Yes
- Only in C++
- Only if they are private
> They are distinguished by their parameter lists.
:::

:::mcq medium
Q: Where must `this(...)` appear in a constructor?
- Anywhere
- [x] As the first statement
- As the last statement
- Only in static blocks
> The same applies to super(...).
:::

:::mcq easy
Q: Are constructors inherited by subclasses?
- Yes
- [x] No
- Only public ones
- Only no-argument ones
> A subclass has to define its own, calling super(...).
:::

:::mcq medium
Q: Why would you make a constructor private?
- To speed up object creation
- [x] To control instantiation, for example in a singleton
- To allow inheritance
- To return a value
> Objects are then created only through a factory method.
:::

:::mcq medium
Q: Can a constructor call both this(...) and super(...)?
- Yes, in any order
- [x] No; each must be the first statement, so only one is allowed
- Only in abstract classes
- Only if they have no arguments
> super(...) is reached through the this(...) chain instead.
:::

:::mcq easy
Q: What is a copy constructor?
- A constructor that copies files
- [x] A constructor that creates a new object from an existing object of the same class
- The default constructor
- A static factory method
> For example: Point(Point other).
:::

:::mcq hard
Q: What does this code print?

```java
class A {
    int x;
    A() { this(10); System.out.print("A"); }
    A(int x) { this.x = x; System.out.print(x); }
}
// in main:
new A();
```
- A10
- [x] 10A
- A
- 10
> A() first delegates to A(10), which prints 10, then prints A.
:::

=== t-method-overloading | Method Overloading
summary: Same method name with different parameters, compile-time resolution, and the widening, boxing and varargs priority rules.
---
**Overloading** means several methods share a name but differ in their **parameter list** (number, types or order). It is resolved at **compile time**.

```java
int add(int a, int b)          { return a + b; }
double add(double a, double b) { return a + b; }
int add(int a, int b, int c)   { return a + b + c; }
```

## Rules

- A different **return type alone** isn't enough (compile error).
- Static methods and `main` can be overloaded; the JVM still starts from `main(String[])`.

## How Java picks an overload

1. An **exact match**
2. **Widening** of primitives (int → long → float → double, char → int)
3. **Boxing or unboxing** (int ↔ Integer)
4. **Varargs** (int...)

So with `f(long)` and `f(Integer)`, the call `f(5)` picks **f(long)**, because widening beats boxing.

:::mcq easy
Q: What is method overloading?
- The same method in parent and child classes
- [x] Several methods with the same name but different parameter lists in the same class
- Methods with different names
- Changing only the return type
> It is compile-time polymorphism.
:::

:::mcq easy
Q: Can two methods be overloaded if they differ only in return type?
- Yes
- [x] No
- Only if they are static
- Only in interfaces
> The compiler can't choose between them from the call alone.
:::

:::mcq easy
Q: When are overloaded calls resolved?
- At run time
- [x] At compile time
- At class-load time
- Never
> The argument types decide.
:::

:::mcq easy
Q: What does this code print?

```java
static void f(int x)    { System.out.println("int"); }
static void f(double x) { System.out.println("double"); }
// in main:
f(5);
```
- double
- [x] int
- Compile error
- Nothing
> It is an exact match.
:::

:::mcq medium
Q: Only f(int) and f(double) exist. Which one does `f(5L)` call?
- f(int)
- [x] f(double)
- Compile error
- Both
> long can't narrow to int, but it widens to double.
:::

:::mcq medium
Q: Both f(int a, int b) and f(int... a) exist. Which does `f(1, 2)` call?
- The varargs version
- [x] f(int a, int b)
- Compile error (ambiguous)
- Neither
> Varargs has the lowest priority.
:::

:::mcq easy
Q: Can the main method be overloaded in Java?
- No
- [x] Yes, but the JVM only calls main(String[] args) as the entry point
- Only once
- Only if it is private
> Other overloads are ordinary methods.
:::

:::mcq medium
Q: Only f(int) and f(String) exist. Which does `f('a')` call?
- f(String)
- [x] f(int)
- Compile error
- Neither
> char widens to int.
:::

:::mcq easy
Q: Can static methods be overloaded?
- No
- [x] Yes
- Only in abstract classes
- Only with varargs
> Overloading depends only on the signature.
:::

:::mcq hard
Q: Only f(Integer) and f(long) exist. Which does `f(5)` call?
- f(Integer)
- [x] f(long)
- Compile error
- Both
> Primitive widening is preferred over boxing.
:::

=== t-method-overriding | Method Overriding
summary: Redefining an inherited method: the signature rules, @Override, covariant returns, access and exception rules, and super calls.
---
**Overriding** means a subclass provides its own implementation of an inherited instance method with the **same signature**. It is resolved at **run time**.

## Rules (Java)

| Aspect | Rule |
|---|---|
| Name and parameters | exactly the same |
| Return type | the same, or a **subtype** (covariant return) |
| Access | the same or **less restrictive** (can't reduce visibility) |
| Checked exceptions | the same, narrower or none; **not broader** |
| static methods | can't be overridden (they are hidden) |
| final methods | can't be overridden |
| private methods | not inherited, so they can't be overridden |

**@Override** asks the compiler to check that you really are overriding a method. It catches typos such as `tostring()`.

Call the parent's version with `super.method()`.

:::mcq easy
Q: What is method overriding?
- Two methods with the same name in one class
- [x] A subclass providing its own implementation of an inherited method with the same signature
- Changing a method's name
- Making a method static
> It enables run-time polymorphism.
:::

:::mcq easy
Q: What does the @Override annotation do?
- Makes the method faster
- [x] Asks the compiler to verify that the method really overrides a superclass method
- Makes the method final
- Is required for every method
> It catches signature typos.
:::

:::mcq easy
Q: Can a final method be overridden?
- Yes
- [x] No
- Only in the same package
- Only if it is public
> final prevents overriding.
:::

:::mcq medium
Q: Can a static method be overridden?
- Yes
- [x] No; a static method with the same signature in a subclass hides the parent's method
- Only in interfaces
- Only if it is public
> Hiding is resolved by the reference type.
:::

:::mcq medium
Q: Can private methods be overridden?
- Yes
- [x] No; they aren't inherited
- Only with @Override
- Only in nested classes
> A method with the same name in the subclass is simply a new method.
:::

:::mcq medium
Q: What return types may an overriding method have?
- Any type
- [x] The same type or a subtype (covariant return)
- Only void
- Only a supertype
> For example, Animal get() overridden as Dog get().
:::

:::mcq medium
Q: A parent method is protected. Which access may the overriding method have?
- private
- default
- [x] protected or public
- Only protected
> Visibility can't be reduced.
:::

:::mcq medium
Q: The parent method throws IOException. Which checked exception may the overriding method throw?
- Exception
- [x] FileNotFoundException (a subclass), or none
- Throwable
- Any checked exception
> It can't throw broader checked exceptions.
:::

:::mcq easy
Q: How does an overriding method call the parent's version?
- this.method()
- [x] super.method()
- parent.method()
- base.method()
> The super keyword.
:::

:::mcq hard
Q: What does this code print?

```java
class A { void show() { System.out.print("A"); } }
class B extends A {
    void show() { super.show(); System.out.print("B"); }
}
// in main:
A obj = new B();
obj.show();
```
- B
- [x] AB
- A
- BA
> B's show() runs (dynamic dispatch) and calls super.show() first.
:::

=== t-interfaces | Interfaces
summary: Contracts that classes implement: multiple implementation, default and static methods, constants and functional interfaces.
---
An **interface** defines a **contract**: the methods a class promises to provide.

```java
interface Payable {
    double TAX = 0.18;                   // public static final (implicitly)
    double pay();                        // public abstract (implicitly)
    default String currency() { return "INR"; }   // Java 8+
    static Payable zero() { return () -> 0; }      // Java 8+
}

class Salary implements Payable {
    public double pay() { return 50000; }
}
```

## Facts (Java)

- A class can **implement several** interfaces, and an interface can **extend several** interfaces.
- Interface fields are **public static final** (constants).
- Abstract methods are implicitly **public abstract**, so the implementations must be public.
- **Default** and **static** methods are allowed since Java 8, and **private** methods since Java 9.
- You can't instantiate an interface directly, but a lambda or anonymous class can implement one.
- A **functional interface** has exactly **one abstract method** (Runnable, Comparator), which is what lets lambdas implement it.

**Default-method conflict:** if a class gets the same default method from two interfaces, it **must override** the method and can choose one with `A.super.method()`.

:::mcq easy
Q: Which keyword does a class use to adopt an interface?
- extends
- [x] implements
- inherits
- uses
> A class implements; an interface extends another interface.
:::

:::mcq easy
Q: How many interfaces can a Java class implement?
- One
- Two
- [x] Any number
- None
> This is how Java achieves multiple inheritance of type.
:::

:::mcq medium
Q: Fields declared in an interface are implicitly:
- private
- protected
- [x] public static final
- instance variables
> They are constants.
:::

:::mcq medium
Q: Since Java 8, which methods can an interface contain besides abstract ones?
- Constructors
- [x] Default and static methods
- Instance fields
- Synchronised blocks
> Private methods came in Java 9.
:::

:::mcq easy
Q: What is the implicit modifier of an abstract interface method?
- protected abstract
- [x] public abstract
- private
- static
> So implementing classes must make the method public.
:::

:::mcq medium
Q: Can an interface extend another interface?
- No
- [x] Yes, including several interfaces at once
- Only one
- Only abstract classes can
> For example: interface C extends A, B.
:::

:::mcq medium
Q: What is a functional interface?
- An interface with no methods
- [x] An interface with exactly one abstract method
- An interface with only static methods
- Any interface used in a function
> Lambdas can implement functional interfaces.
:::

:::mcq easy
Q: Can you instantiate an interface directly with `new Payable()`?
- Yes
- [x] No (but a lambda or anonymous class can implement it)
- Only if it has default methods
- Only in Java 17
> Interfaces have no constructors.
:::

:::mcq medium
Q: Which of these is a functional interface?
- List
- [x] Runnable
- Serializable
- Map
> It has one abstract method: run().
:::

:::mcq hard
Q: A class implements two interfaces that both provide a default method `hello()`. What must the class do?
- Nothing; Java picks the first one
- [x] Override hello() (it may call A.super.hello())
- It won't compile under any circumstances
- Make hello() static
> The ambiguity must be resolved explicitly.
:::

=== t-abstract-classes | Abstract Classes
summary: Partial implementations: constructors, state, concrete and abstract methods, and choosing between an abstract class and an interface.
---
An **abstract class** is a class that **can't be instantiated** and may contain **both abstract and concrete** members.

```java
abstract class Employee {
    protected String name;
    Employee(String name) { this.name = name; }  // constructors are allowed
    abstract double salary();                    // subclasses must implement
    String badge() { return name + " — " + salary(); }   // shared logic
}
```

## Facts (Java)

- It **can have constructors** (called by subclasses through `super`), fields of any access level, and concrete methods.
- It **can have zero** abstract methods (to prevent instantiation).
- A class can **extend only one** abstract class.
- A subclass that doesn't implement every abstract method must itself be **abstract**.
- Abstract methods **can't be private, static or final**, because they must be overridden.

## Abstract class or interface?

| Choose an abstract class when… | Choose an interface when… |
|---|---|
| closely related classes share **state and code** | unrelated classes share a **capability** (Comparable, Runnable) |
| you need constructors or non-public members | you need multiple inheritance of type |
| there is a base implementation to evolve | you are defining a pure contract or API |

:::mcq easy
Q: Can an abstract class have a constructor?
- No
- [x] Yes; subclasses call it through super
- Only a private one
- Only in Java 17
> It initialises the shared state.
:::

:::mcq easy
Q: Can an abstract class contain concrete (implemented) methods?
- No
- [x] Yes
- Only static ones
- Only private ones
> It mixes abstract and concrete members.
:::

:::mcq easy
Q: Can you instantiate an abstract class?
- Yes
- [x] No
- Only with reflection
- Only if it has no abstract methods
> This holds even when it has no abstract methods.
:::

:::mcq medium
Q: When should you prefer an abstract class to an interface?
- When unrelated classes share a capability
- [x] When closely related classes share state and code
- When you need multiple inheritance
- Never
> For example, a base Employee class.
:::

:::mcq easy
Q: How many abstract classes can a Java class extend?
- Any number
- [x] One
- Two
- None
> Java allows single class inheritance.
:::

:::mcq medium
Q: Can an abstract class have private fields?
- No
- [x] Yes; fields can have any access modifier
- Only static ones
- Only final ones
> Unlike interfaces, whose fields are always public static final.
:::

:::mcq medium
Q: A subclass doesn't implement every abstract method of its abstract parent. What must the subclass be?
- final
- [x] abstract
- an interface
- static
> Otherwise it won't compile.
:::

:::mcq medium
Q: Can an abstract method be private?
- Yes
- [x] No
- Only in nested classes
- Only with @Override
> It must be accessible so that it can be overridden.
:::

:::mcq easy
Q: Can an abstract class have no abstract methods at all?
- No
- [x] Yes
- Only if it is final
- Only in C++
> This is used to stop the class itself being instantiated.
:::

:::mcq hard
Q: Can a method be both abstract and static in Java?
- Yes
- [x] No
- Only in interfaces
- Only if it is public
> Static methods can't be overridden, so they can't be abstract.
:::

=== t-exception-handling | Exception Handling
summary: Checked vs unchecked exceptions, try/catch/finally, throw vs throws, catch order, custom exceptions and try-with-resources.
---
An **exception** is an event that disrupts normal flow. Handling it lets a program recover or fail gracefully.

## Hierarchy (Java)

```
Throwable
├── Error                 (serious: OutOfMemoryError, StackOverflowError; don't catch)
└── Exception
    ├── Checked           (IOException, SQLException: must be caught or declared)
    └── RuntimeException  (unchecked: NullPointerException, ArithmeticException,
                           ArrayIndexOutOfBoundsException, ClassCastException)
```

## Keywords

| Keyword | Use |
|---|---|
| try | code that may throw |
| catch | handle a specific exception |
| finally | always runs (cleanup), even after a return |
| throw | throw an exception object: `throw new IllegalArgumentException()` |
| throws | declare in the method signature: `void read() throws IOException` |

## Rules

- Put catch blocks for **more specific** exceptions before more general ones. Otherwise it is a compile error (the later block is unreachable).
- **try-with-resources** closes `AutoCloseable` resources automatically:
  `try (BufferedReader r = new BufferedReader(...)) { ... }`
- **Custom exceptions:** extend `Exception` (checked) or `RuntimeException` (unchecked).
- `finally` runs even when `try` returns. Avoid returning from `finally`, because it overrides the earlier return.

:::mcq easy
Q: Which of these is an unchecked exception?
- IOException
- SQLException
- [x] NullPointerException
- ClassNotFoundException
> It is a subclass of RuntimeException.
:::

:::mcq easy
Q: What must happen to a checked exception?
- Nothing special
- [x] It must be caught, or declared with throws
- It must be ignored
- It must be rethrown as an Error
> The compiler enforces this.
:::

:::mcq easy
Q: When does a finally block run?
- Only when an exception occurs
- Only when no exception occurs
- [x] Whether or not an exception occurs (barring System.exit or a JVM crash)
- Never with a return statement
> It is used for cleanup.
:::

:::mcq easy
Q: What is the difference between throw and throws?
- No difference
- [x] throw raises an exception object; throws declares exceptions in a method signature
- throws raises an exception object
- throw is only used in catch blocks
> One is an action, the other a declaration.
:::

:::mcq medium
Q: What does this code print?

```java
try {
    int x = 5 / 0;
    System.out.print("A");
} catch (ArithmeticException e) {
    System.out.print("B");
} finally {
    System.out.print("C");
}
```
- AC
- [x] BC
- ABC
- B
> The division throws before "A" is printed. The catch prints B and finally prints C.
:::

:::mcq medium
Q: catch (Exception e) is placed before catch (IOException e). What happens?
- It works fine
- [x] Compile error: the IOException block is unreachable
- Run-time error
- IOException is never thrown
> Put more specific catch blocks first.
:::

:::mcq easy
Q: How do you create a custom checked exception?
- Extend RuntimeException
- [x] Extend Exception
- Extend Error
- Implement Throwable
> Extending RuntimeException makes it unchecked.
:::

:::mcq medium
Q: How does an Error differ from an Exception?
- They are the same
- [x] Errors are serious problems (such as OutOfMemoryError) that applications normally shouldn't catch
- Errors are checked
- Exceptions can't be caught
> Both extend Throwable.
:::

:::mcq easy
Q: What does try-with-resources do?
- Retries the block
- [x] Closes AutoCloseable resources automatically
- Ignores exceptions
- Creates threads
> It was introduced in Java 7.
:::

:::mcq hard
Q: What does this code print?

```java
static int f() {
    try { return 1; }
    finally { System.out.print("F"); }
}
// in main:
System.out.print(f());
```
- 1F
- [x] F1
- 1
- F
> finally runs before f() actually returns, so F is printed first, then 1.
:::
