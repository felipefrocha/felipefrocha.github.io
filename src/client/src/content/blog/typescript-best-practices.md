---
title: TypeScript Best Practices in 2025
excerpt: A comprehensive guide to writing type-safe TypeScript code with modern patterns and utilities.
date: 2025-11-20
readTime: 6 min read
category: TypeScript
tags:
  - typescript
  - javascript
  - types
featured: false
---

# TypeScript Best Practices in 2025

TypeScript continues to evolve, and with it, the best practices for writing type-safe code. Here's what you need to know in 2025.

## Strict Mode is Non-Negotiable

Always enable strict mode in your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

These settings catch bugs at compile time that would otherwise slip through to runtime.

## Type Inference Over Annotation

Let TypeScript infer types when possible. Over-annotating makes code harder to read and maintain:

```typescript
// Too verbose
const numbers: number[] = [1, 2, 3];
const sum: number = numbers.reduce((a: number, b: number): number => a + b, 0);

// Better - let TypeScript infer
const numbers = [1, 2, 3];
const sum = numbers.reduce((a, b) => a + b, 0);
```

## Utility Types Are Your Friends

Master the built-in utility types:

```typescript
// Pick specific properties
type UserPreview = Pick<User, 'id' | 'name' | 'avatar'>;

// Make all properties optional
type PartialUser = Partial<User>;

// Make all properties required
type RequiredUser = Required<User>;

// Extract return type of a function
type ApiResponse = Awaited<ReturnType<typeof fetchUser>>;
```

## Discriminated Unions for State

Use discriminated unions to model state machines:

```typescript
type RequestState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

function handleState(state: RequestState<User>) {
  switch (state.status) {
    case 'idle':
      return <Idle />;
    case 'loading':
      return <Spinner />;
    case 'success':
      return <UserCard user={state.data} />;
    case 'error':
      return <Error message={state.error.message} />;
  }
}
```

## Const Assertions

Use `as const` for literal types:

```typescript
const ROUTES = {
  HOME: '/',
  BLOG: '/blog',
  PORTFOLIO: '/portfolio',
} as const;

type Route = typeof ROUTES[keyof typeof ROUTES];
// Type: '/' | '/blog' | '/portfolio'
```

## Template Literal Types

Create dynamic string types:

```typescript
type EventName = `on${Capitalize<string>}`;
type ColorShade = `${Color}-${100 | 200 | 300 | 400 | 500}`;

// Results in types like 'onClick', 'onSubmit', etc.
// And 'blue-100', 'red-500', etc.
```

## Branded Types for Type Safety

Create distinct types for values that share the same underlying type:

```typescript
type UserId = string & { readonly brand: unique symbol };
type PostId = string & { readonly brand: unique symbol };

function createUserId(id: string): UserId {
  return id as UserId;
}

function getUser(id: UserId) { /* ... */ }
function getPost(id: PostId) { /* ... */ }

const userId = createUserId('123');
getUser(userId); // OK
getPost(userId); // Error! Can't use UserId where PostId is expected
```

## Conclusion

TypeScript's type system is incredibly powerful. By following these patterns, you'll catch more bugs at compile time and create self-documenting code that's easier to maintain and refactor.
