function isStringExcluded(stringContent: string, excludedStrings?: StringExclusionTypes) {
    if (typeof excludedStrings === "undefined") {
        return false;
    } else if (typeof excludedStrings === "string") {
        return stringContent === excludedStrings
    } else if (Array.isArray(excludedStrings)) {
        excludedStrings.indexOf(stringContent) !== -1;
    } else {
        return excludedStrings(stringContent);
    }
}

function filterStringArray(stringContents: string[], excludedStrings?: StringExclusionTypes) {
    if (typeof excludedStrings === "undefined") {
        return stringContents;
    } else {
        return stringContents.filter(stringContent => !isStringExcluded(stringContent, excludedStrings));
    }
}

function getMethodNames(context: any, options: AutoBindInputContainer & AutoBindOptions = {}): string[] {
    let prototype = Object.getPrototypeOf(context);
    const methodNames: string[] = [];

    do {
        Object.getOwnPropertyNames(prototype).forEach((value) => {
            const methodNameIndex = methodNames.indexOf(value);
            const hasntMethodName = methodNameIndex === -1;

            if (hasntMethodName &&
                typeof prototype[value] === "function" &&
                value !== "constructor" &&
                !isStringExcluded(value, options.excludedMethodNames)) {
                methodNames.push(value);
            }
        });

        // Reflect.ownKeys(context).forEach(test => console.log(test));
    } while (options.includeSuperMethodNames && (prototype = Object.getPrototypeOf(prototype)) && prototype !== Object.prototype);

    return methodNames;
}

export interface IStringExclusionFunction {
    /** If the result is true, then the string is excluded. */
    (stringContent: string): boolean;
}

export type AutoBindInputContainer = {
    includeSuperMethodNames?: boolean;
};

export type StringExclusionTypes = string | string[] | IStringExclusionFunction;

export type AutoBindOptions = {
    /** If you pass a string validation function, then returning true means exclusion. */
    excludedMethodNames?: StringExclusionTypes
}

export function autoBind(context: any, input: string | string[] | AutoBindInputContainer = {}, options: AutoBindOptions = {}): void {
    let methodNames: string[] = [];
    let areNamesValidated = false;

    if (typeof input === "string") {
        return autoBind(context, [input], options);
    } else if (Array.isArray(input)) {
        methodNames = filterStringArray(input, options.excludedMethodNames);
    } else {
        let container = Object.assign(input, options);
        methodNames = getMethodNames(context, container);
        areNamesValidated = true;
    }

    methodNames.forEach((methodName) => {
        const member: Function = context[methodName];

        if (areNamesValidated || typeof member === "function") {
            context[methodName] = member.bind(context);
        } else {
            console.warn("The object member '" + methodName + "' has been skipped while auto-binding: it is not a function");
        }
    });
}