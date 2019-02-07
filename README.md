# autobind
With this little helper you can bind methods to 'this' easier.

# Installation
```
npm install @teronis/ts-auto-bind-es6 --save
```

# Usage
```
import { autoBind, getMethodNames } from "@teronis/ts-auto-bind-es6";

export class Child { }

export class Example extends Child {
    public constructor() {
        super();
        /** We bind each function (not arrow) to this except the child, because they are already overriden and referenced to connectors */
        autoBind(this, undefined, {
            excludedMethodNames: getMethodNames(Object.create(Child))
        });
    }
}
```