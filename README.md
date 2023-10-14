# @i-xi-dev/pubsub

A JavaScript Pub/Sub Broker.


## Requirement

`Broker` requires [`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) and [`AggregateError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AggregateError).

| Chrome | Edge | Firefox | Safari | Deno | Node.js |
| :---: | :---: | :---: | :---: | :---: | :---: |
| ✅ | ✅ | ✅ | ✅<br />14+ | ✅ | ✅<br />15.0.0+ |


## Installation

### npm

```console
$ npm i @i-xi-dev/pubsub@2.0.11
```

```javascript
import { PubSub } from "@i-xi-dev/pubsub";
```

### CDN

Example for Skypack
```javascript
import { PubSub } from "https://cdn.skypack.dev/@i-xi-dev/pubsub@2.0.11";
```


## Usage

### [`Broker`](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/pubsub.es/2.0.11/mod.ts/~/PubSub.Broker) class

```javascript
const broker = new PubSub.Broker();
const topic1 = Symbol();
const topic2 = Symbol();

const subscriber11 = [];
const subscriber12 = [];
const subscriber21 = [];


// subscribe(
//   topic: symbol | string,
//   callback: (message?: T) => Promise<void>,
//   options?: { once?: boolean, signal?: AbortSignal }
// ): void

broker.subscribe(topic1, (message) => {
  subscriber11.push(message);
});
const callback12 = (message) => {
  subscriber12.push(message);
};
broker.subscribe(topic1, callback12);
broker.subscribe(topic2, (message) => {
  subscriber21.push(message);
});


// publish(
//   topic: symbol | string,
//   message?: T
// ): Promise<void>
// rejects with AggregateError, if one or more callbacks failed.

await broker.publish(topic1, "X");
// → subscriber11: [ "X" ]
//   subscriber12: [ "X" ]
//   subscriber21: []


// unsubscribe(
//   topic: symbol | string,
//   callback: (message?: T) => Promise<void>
// ): void

broker.unsubscribe(topic1, callback12);
await broker.publish(topic1, "X");
// → subscriber11: [ "X", "X" ]
//   subscriber12: [ "X" ]
//   subscriber21: []


// clear(): void

broker.clear();
await broker.publish(topic1, "X");
// → subscriber11: [ "X", "X" ]
//   subscriber12: [ "X" ]
//   subscriber21: []

```

#### Subscribe options

once: boolean
```javascript
let received = "";
broker.subscribe(topic1, (message) => {
  received = message;
}, {
  once: true,
});

await broker.publish(topic1, "Y1");
await broker.publish(topic1, "Y2");
// → received: "Y1"
```

signal: AbortSignal
```javascript
const received = [];
const controller = new AbortController();
broker.subscribe(topic1, (message) => {
  received.push(message);
}, {
  signal: controller.signal,
});

await broker.publish(topic1, "Z1");
await broker.publish(topic1, "Z2");
controller.abort();
await broker.publish(topic1, "Z3");
// → received: [ "Z1", "Z2" ]
```
