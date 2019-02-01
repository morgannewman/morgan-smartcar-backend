# Documentation [![Build Status](https://travis-ci.com/morgannewman/smartcar-backend.svg?branch=master)](https://travis-ci.com/morgannewman/smartcar-backend)

Adapting different car APIs to the Smartcar API adds complexity. This project is an attempt to demonstrate one way to manage this complexity using the strategy pattern and type safety.

I made a few simplifying assumptions:

1. It is very important for my API to easily support new car APIs

2. All car API adapters must implement or extend the Smartcar interface

3. The vehicle manufacturer can be derived from the ID

These are things that probably merit more discussion in a real-world application.

Table of Contents
=================
* [Motivation](#motivation)
    * [Benefits](#benefits)
    * [Drawbacks](#drawbacks)
* [Request Lifecycle Example](#request-lifecycle-example)
* [Core API](#core-api)
* [Errors](#errors)
* [Future Improvements](#future-improvements)
    * [More Modularization](#more-modularization)
    * [Improve Controller Factory](#improve-controller-factory)
    * [Smarter Error Handling](#smarter-error-handling)
    * [More Flexible Adapters](#more-flexible-adapters)
    * [Test GM's Backend](#test-gm's-backend)

---

## Motivation

The heart of this architecture is the strategy pattern. 

The controller identifies the car manufacturer of the request and uses this to select the right adapter strategy. This works because all adapters are required to implement the Smartcar API interface (defined in `api/apiMethods.ts`).

```ts
interface BaseApiMethods {
  getVehicleInfo: (id: string) => Promise<vehicleInfo>;
  getDoorState: (id: string) => Promise<doorLockState>;
  getBatteryState: (id: string) => Promise<batteryState>;
  getFuelState: (id: string) => Promise<fuelState>;
  setEngineState: (id: string, action: engineAction) => Promise<engineState>;
}
```

### Benefits

1. It is now very easy to add new adapters, so adding support for new car manufacturers is trivial.

2. Adapter I/O is very consistent since they all implement the same interface.

3. It easy to unit test adapters.


### Drawbacks

1. More complexity for a smaller application, but more extensible as new car manufacturers are added.

2. Hard to unit test controllers w/o mocking when using strategy pattern.

## Request Lifecycle Example

Imagine a GET request to retrieve vehicle information comes in. 

- This request starts out in `server.ts` where it is routed to the right controller in `api/controller.ts`.

- After deriving the vehicle manufacturer from the ID, the controller identifies the correct adapter to use in `api/adapters` and pipes the inputs through the adapter.

- The adapter returns normalized output that is ready to be returned to the client.

## Core API

Implemented 1:1 according to the problem spec.

```text
.
├── /vehicles/:id
│   │
│   └── GET   <- Returns vehicle info summary
│
├── /vehicles/:id/doors
│   │
│   └── GET   <- Returns the lock status of all doors
│
├── /vehicles/:id/fuel
│   │
│   └── GET   <- Returns fuel status (or null if not applicable)
│
├── /vehicles/:id/battery
│   │
│   └── GET   <- Returns battery status (or null if not applicable)
│
└── /vehicles/:id/engine
    │
    └── POST  <- Sets vehicle state and returns new state.
```

## Errors

Status Code | Reason
--- | ---
400 | Malformed request
404 | Resource not found

All errors return with the following shape:

```ts
{
    message: string,
    status: number
}
```

## Future Improvements

### More Modularization

This app would need more modularization if it were to get any bigger, especially the controller, routes, and tests.

### Improve Controller Factory

As it is now, my controller is brittle. You cannot easily extend functionality for individual layers. If I expected to want to customize each controller layer, it would probably be better to define the base controller as a class and extend/override functionality as needed.

### Smarter Error Handling

This application is pretty dumb when it comes to handling errors.

### More Flexible Adapters
As it is designed now, all adapters would have to implement the `BaseApiMethods` interface. This is great if you want all endpoints to be available at all times, but if you want to heavily customize each adapter, this probably isn't the best strategy.

For reference:
```ts
interface BaseApiMethods {
  getVehicleInfo: (id: string) => Promise<vehicleInfo>;
  getDoorState: (id: string) => Promise<doorLockState>;
  getBatteryState: (id: string) => Promise<batteryState>;
  getFuelState: (id: string) => Promise<fuelState>;
  setEngineState: (id: string, action: engineAction) => Promise<engineState>;
}
```

Adding significantly more supported methods to the interface would be painful. For example, if we wanted to support more methods for each endpoint (e.g. `POST`, `PUT`, etc.), it might be better to make the modules deeper. For example:

```ts
interface engine {  
  /* BEFORE */
  setEngineState: (id: string, action: engineAction) => Promise<engineState>;

  /* AFTER */
  engine: {
      getState:(id: string) => Promise<engineState>;
      setState:(id: string, action: engineAction) => Promise<engineState>;
  }
}
```

### Test GM's Backend

Types allow high confidence, but directly unit testing the adapter endpoints (i.e. the ones going to 'Generic Motors') would be very important in a production context.