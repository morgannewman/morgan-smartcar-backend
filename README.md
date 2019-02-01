# Morgan Smartcar Backend Documentation

## Walkthrough

This application is structured as follows:

- `server.ts` is the entry point that wires the application together.
  1. Routes are linked to the controller
  2. Errors are handled
  3. The server is started

- `controller/index.ts` is where the controller is centralized.

## Core API

```text
/vehicles/:id
.
├── /vehicles/:id
│   │
│   └── GET   <- Return vehicle info summary
│
├── /vehicles/:id/doors
│   │
│   └── GET   <- Return the security status of all doors
│
├── /vehicles/:id/fuel
│   │
│   └── GET   <- Return vehicle info summary
│
├── /vehicles/:id/battery
│   │
│   └── GET   <- Return vehicle info summary
│
└── /vehicles/:id/engine
    │
    └── POST  <- Return vehicle info summary
```

## Errors
Status Code | Reason
--- | ---
400 | Malformed request
404 | Resource not found

### Error Examples

All errors will return with the following shape:

```ts
{
    message: string,
    status: number
}
```

Example: `GET /vehicles/:someInvalidId`

```js
{
    message: "Vehicle not found",
    status: 404
}
```

Example: Sending the wrong command to start vehicle engine => 400 status.

```js
{
  message: 'Body must be formatted as {"action": "START|STOP"}.',
  status: 400
}
```