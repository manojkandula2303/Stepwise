=== classes-objects | Classes & Objects
summary: Bundle data and behaviour together — define a class, create objects, use constructors.
---
A **class** is a blueprint; an **object** (instance) is a thing built from it. A class defines **attributes** (data each object holds) and **methods** (functions that operate on that data).

## Defining a class

```python title="A bank account"
class Account:
    def __init__(self, owner, balance=0):    # constructor
        self.owner = owner                    # instance attributes
        self.balance = balance

    def deposit(self, amount):
        self.balance += amount

    def __str__(self):
        return f"{self.owner}: {self.balance}"

a = Account("Ada", 100)
b = Account("Linus")
a.deposit(50)
print(a)
print(b.balance)
```
```java
public class Main {
    static class Account {
        String owner;                         // fields
        int balance;

        Account(String owner, int balance) {  // constructor
            this.owner = owner;
            this.balance = balance;
        }

        Account(String owner) {               // overloaded constructor
            this(owner, 0);
        }

        void deposit(int amount) {
            balance += amount;
        }

        @Override
        public String toString() {
            return owner + ": " + balance;
        }
    }

    public static void main(String[] args) {
        Account a = new Account("Ada", 100);
        Account b = new Account("Linus");
        a.deposit(50);
        System.out.println(a);
        System.out.println(b.balance);
    }
}
```
```output
Ada: 150
0
```

:::compare
- **Constructor:** Python's is `__init__(self, ...)`; Java's has the class name and no return type.
- **The current object:** Python passes it explicitly as the first parameter, conventionally named `self`. Java provides it implicitly as `this`.
- **Fields:** Java declares fields with types up front. Python creates attributes by assigning to `self.x` (usually in `__init__`).
- **Creating objects:** `Account("Ada")` in Python vs `new Account("Ada")` in Java.
- **Printing:** Python calls `__str__`; Java calls `toString()`.
:::

## Class vs instance members

```python
class Counter:
    created = 0                 # class attribute: shared by all instances

    def __init__(self):
        Counter.created += 1
        self.value = 0          # instance attribute: one per object

Counter(); Counter()
print(Counter.created)
```
```java
public class Main {
    static class Counter {
        static int created = 0;   // shared by all instances
        int value = 0;            // one per object

        Counter() { created++; }
    }

    public static void main(String[] args) {
        new Counter();
        new Counter();
        System.out.println(Counter.created);
    }
}
```
```output
2
```

:::quiz
Q: Inside a Python method, how do you refer to the object the method was called on?
- `this`
- [x] `self` (the first parameter)
- `cls`
- `super`
> Python passes the instance explicitly as the first parameter, named `self` by convention. Java uses the implicit `this`.
:::

=== encapsulation | Encapsulation
summary: Hide internal state behind methods so objects stay valid.
---
**Encapsulation** means an object controls access to its own data. Outside code goes through methods, which can validate input and keep the object in a consistent state.

```python title="Validated access"
class Temperature:
    def __init__(self, celsius):
        self._celsius = celsius        # leading underscore: "internal"

    @property
    def celsius(self):
        return self._celsius

    @celsius.setter
    def celsius(self, value):
        if value < -273.15:
            raise ValueError("below absolute zero")
        self._celsius = value

    @property
    def fahrenheit(self):
        return self._celsius * 9 / 5 + 32

t = Temperature(25)
t.celsius = 30          # goes through the setter
print(t.celsius, t.fahrenheit)
try:
    t.celsius = -300
except ValueError as e:
    print("Rejected:", e)
```
```java
public class Main {
    static class Temperature {
        private double celsius;           // not accessible outside the class

        Temperature(double celsius) { setCelsius(celsius); }

        public double getCelsius() { return celsius; }

        public void setCelsius(double value) {
            if (value < -273.15) throw new IllegalArgumentException("below absolute zero");
            celsius = value;
        }

        public double getFahrenheit() { return celsius * 9 / 5 + 32; }
    }

    public static void main(String[] args) {
        Temperature t = new Temperature(25);
        t.setCelsius(30);
        System.out.println(t.getCelsius() + " " + t.getFahrenheit());
        try {
            t.setCelsius(-300);
        } catch (IllegalArgumentException e) {
            System.out.println("Rejected: " + e.getMessage());
        }
    }
}
```
```output-python
30 86.0
Rejected: below absolute zero
```
```output-java
30.0 86.0
Rejected: below absolute zero
```

:::compare
- **Java** enforces access with modifiers: `private` (this class only), *package-private* (no modifier: same package), `protected` (package + subclasses), `public` (everyone). The idiom is private fields with public getters/setters.
- **Python** has no enforced privacy. A single underscore `_x` signals "internal, don't touch"; double underscore `__x` triggers name mangling. `@property` lets you start with a plain attribute and later add validation without changing callers.
:::

=== inheritance | Inheritance
summary: Build specialised classes on top of general ones and reuse their code.
---
**Inheritance** lets a class (the *subclass*) extend another (the *superclass*), inheriting its attributes and methods and adding or overriding behaviour.

```python title="Shapes"
class Shape:
    def __init__(self, name):
        self.name = name

    def area(self):
        return 0

    def describe(self):
        return f"{self.name} with area {self.area():.1f}"

class Rectangle(Shape):
    def __init__(self, w, h):
        super().__init__("Rectangle")   # call the parent constructor
        self.w, self.h = w, h

    def area(self):                     # override
        return self.w * self.h

class Square(Rectangle):
    def __init__(self, side):
        super().__init__(side, side)
        self.name = "Square"

for s in [Rectangle(2, 3), Square(4)]:
    print(s.describe())
print(isinstance(Square(1), Shape))
```
```java
public class Main {
    static class Shape {
        protected String name;
        Shape(String name) { this.name = name; }
        double area() { return 0; }
        String describe() { return String.format("%s with area %.1f", name, area()); }
    }

    static class Rectangle extends Shape {
        protected double w, h;
        Rectangle(double w, double h) {
            super("Rectangle");          // call the parent constructor
            this.w = w;
            this.h = h;
        }
        @Override
        double area() { return w * h; }
    }

    static class Square extends Rectangle {
        Square(double side) {
            super(side, side);
            name = "Square";
        }
    }

    public static void main(String[] args) {
        Shape[] shapes = {new Rectangle(2, 3), new Square(4)};
        for (Shape s : shapes) System.out.println(s.describe());
        System.out.println(new Square(1) instanceof Shape);
    }
}
```
```output-python
Rectangle with area 6.0
Square with area 16.0
True
```
```output-java
Rectangle with area 6.0
Square with area 16.0
true
```

:::compare
- Syntax: `class Rectangle(Shape):` vs `class Rectangle extends Shape`.
- Both call the parent constructor with `super(...)` — in Java it must be the **first** statement of the constructor.
- **Multiple inheritance:** Python allows a class to inherit from several classes (method resolution order decides lookups). Java allows only **one** superclass, but any number of **interfaces**.
- Java's `@Override` annotation asks the compiler to verify you are really overriding a parent method — it catches typos.
- Every Java class ultimately extends `Object`; every Python class extends `object`.
:::

:::tip
Use inheritance for genuine "is-a" relationships (a Square *is a* Rectangle). For "has-a" relationships (a Car *has an* Engine), prefer **composition**: store the other object as a field.
:::

=== polymorphism | Polymorphism
summary: One interface, many implementations — call the same method and get type-specific behaviour.
---
**Polymorphism** means code written against a general type works with any of its specific types. The method that actually runs is chosen at runtime based on the object's real class (*dynamic dispatch*).

```python title="Same call, different behaviour"
class Animal:
    def speak(self):
        return "..."

class Dog(Animal):
    def speak(self):
        return "Woof"

class Cat(Animal):
    def speak(self):
        return "Meow"

class Robot:                 # not an Animal at all
    def speak(self):
        return "Beep"

for thing in [Dog(), Cat(), Robot()]:
    print(thing.speak())
```
```java
public class Main {
    static class Animal { String speak() { return "..."; } }
    static class Dog extends Animal { @Override String speak() { return "Woof"; } }
    static class Cat extends Animal { @Override String speak() { return "Meow"; } }

    public static void main(String[] args) {
        Animal[] animals = {new Dog(), new Cat(), new Animal()};
        for (Animal a : animals) {
            System.out.println(a.speak());   // decided at runtime
        }
    }
}
```
```output-python
Woof
Meow
Beep
```
```output-java
Woof
Meow
...
```

:::compare
- **Java** polymorphism goes through the type system: a variable of type `Animal` can hold a `Dog`, and only methods declared on `Animal` can be called through it.
- **Python** uses **duck typing**: *if it walks like a duck and quacks like a duck…* Any object with a `speak()` method works — `Robot` doesn't need to inherit from `Animal`.
- Java also has **compile-time polymorphism** (method overloading), chosen by the argument types at compile time.
:::

=== interfaces-abstract | Abstract Classes & Interfaces
summary: Define contracts that subclasses must fulfil.
---
An **abstract class** can't be instantiated; it exists to be extended and may leave some methods unimplemented. An **interface** is a pure contract: a set of methods a class promises to provide.

```python title="Abstract base class"
from abc import ABC, abstractmethod

class Shape(ABC):
    @abstractmethod
    def area(self):
        ...

    def report(self):                       # concrete method shared by all
        return f"{type(self).__name__}: {self.area():.2f}"

class Circle(Shape):
    def __init__(self, r):
        self.r = r

    def area(self):
        return 3.14159 * self.r ** 2

print(Circle(1).report())
try:
    Shape()
except TypeError as e:
    print("Cannot instantiate:", type(e).__name__)
```
```java
public class Main {
    interface Drawable {
        String draw();                       // abstract by default
        default String frame() { return "[" + draw() + "]"; }
    }

    static abstract class Shape {
        abstract double area();
        String report() { return String.format("%s: %.2f", getClass().getSimpleName(), area()); }
    }

    static class Circle extends Shape implements Drawable {
        double r;
        Circle(double r) { this.r = r; }
        double area() { return 3.14159 * r * r; }
        public String draw() { return "circle"; }
    }

    public static void main(String[] args) {
        Circle c = new Circle(1);
        System.out.println(c.report());
        System.out.println(c.frame());
        // new Shape();  -> compile error: Shape is abstract
    }
}
```
```output-python
Circle: 3.14
Cannot instantiate: TypeError
```
```output-java
Circle: 3.14
[circle]
```

:::compare
- Java: `abstract class` (can have fields, constructors and concrete methods; single inheritance) vs `interface` (methods only — plus `default` and `static` methods; a class can implement many).
- Python: `abc.ABC` with `@abstractmethod`. Instantiating a class with unimplemented abstract methods raises `TypeError` at runtime. Python's `typing.Protocol` offers interface-like structural typing.
- Java checks at **compile time** that all abstract methods are implemented.
:::

:::java
Key interfaces you'll meet constantly: `Comparable<T>` (natural ordering via `compareTo`), `Comparator<T>`, `Iterable<T>` (enables for-each), `Runnable`, and the collection interfaces `List`, `Set`, `Map`, `Queue`, `Deque`.
:::

=== equality-hashing | Equality, Hashing & Comparison
summary: How objects are compared, hashed and sorted — essential for using them in sets and maps.
---
To put your own objects in a set, use them as dictionary/map keys, or sort them, the language needs to know when two objects are *equal*, how to *hash* them, and how to *order* them.

```python title="Value equality for a custom class"
class Point:
    def __init__(self, x, y):
        self.x, self.y = x, y

    def __eq__(self, other):
        return isinstance(other, Point) and (self.x, self.y) == (other.x, other.y)

    def __hash__(self):
        return hash((self.x, self.y))

    def __lt__(self, other):              # enables sorting
        return (self.x, self.y) < (other.x, other.y)

    def __repr__(self):
        return f"Point({self.x}, {self.y})"

pts = {Point(1, 2), Point(1, 2), Point(0, 5)}
print(len(pts))
print(sorted([Point(3, 1), Point(1, 9), Point(1, 2)]))
```
```java
import java.util.*;

public class Main {
    static class Point implements Comparable<Point> {
        final int x, y;
        Point(int x, int y) { this.x = x; this.y = y; }

        @Override
        public boolean equals(Object o) {
            if (!(o instanceof Point)) return false;
            Point p = (Point) o;
            return x == p.x && y == p.y;
        }

        @Override
        public int hashCode() { return Objects.hash(x, y); }

        @Override
        public int compareTo(Point o) {
            return x != o.x ? Integer.compare(x, o.x) : Integer.compare(y, o.y);
        }

        @Override
        public String toString() { return "Point(" + x + ", " + y + ")"; }
    }

    public static void main(String[] args) {
        Set<Point> pts = new HashSet<>(List.of(new Point(1, 2), new Point(0, 5)));
        pts.add(new Point(1, 2));
        System.out.println(pts.size());
        List<Point> list = new ArrayList<>(List.of(new Point(3, 1), new Point(1, 9), new Point(1, 2)));
        Collections.sort(list);
        System.out.println(list);
    }
}
```
```output
2
[Point(1, 2), Point(1, 9), Point(3, 1)]
```

:::warning
**The contract:** objects that are equal **must** have the same hash code. If you override `equals`/`__eq__` without `hashCode`/`__hash__`, hash-based collections behave incorrectly — duplicates appear, lookups fail. (Python actually makes the object unhashable if you define `__eq__` without `__hash__`.)
:::

:::tip
Java records and Python `@dataclass(frozen=True)` generate `equals`, `hashCode`/`__hash__` and a readable string form for you.
:::
