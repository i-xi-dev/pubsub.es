import { assertStrictEquals, assertThrows } from "std/testing/asserts";
import { PubSub } from "../src/pubsub.ts";

Deno.test("PubSub.Broker.prototype.clear", async () => {
  // clear()
  const broker: PubSub.Broker<string> = new PubSub.Broker();

  const t1results1: string[] = [];
  const t1results2: string[] = [];
  const topic1 = "t1";
  const s11 = async (data: string) => {
    t1results1.push(data);
    return;
  };
  broker.subscribe(topic1, s11);
  await broker.publish(topic1, "t1-data1");
  broker.clear();
  broker.subscribe(topic1, async (data) => {
    t1results2.push(data);
    return;
  });
  await broker.publish(topic1, "t1-data2");

  const t2results1: string[] = [];
  const t2results2: string[] = [];
  const topic2 = "t2";
  const s21 = async (data: string) => {
    t2results1.push(data);
    return;
  };
  const s22 = async (data: string) => {
    t2results2.push(data);
    return;
  };
  broker.subscribe(topic2, s21);
  await broker.publish(topic2, "t2-data1");
  //broker.clear();
  broker.subscribe(topic2, s22);
  await broker.publish(topic2, "t2-data2");
  broker.clear();
  await broker.publish(topic2, "t2-data3");

  assertStrictEquals(t1results1.join(","), `t1-data1`);
  assertStrictEquals(t1results2.join(","), `t1-data2`);
  assertStrictEquals(t2results1.join(","), `t2-data1,t2-data2`);
  assertStrictEquals(t2results2.join(","), `t2-data2`);

});

Deno.test("PubSub.Broker.prototype.publish", async () => {
  // publish(string, any)
  const broker = new PubSub.Broker<string>();

  const topic1 = "t1";
  broker.subscribe(topic1, (data: string) => {
    throw new Error(data);
  });

  try {
    await broker.publish(topic1, "t1-data1");
    assertStrictEquals(true, false);
  }
  catch (err) {
    //if (err instanceof AggregateError) {
    if (err instanceof Error) {
      assertStrictEquals(err.name, "AggregateError");
      assertStrictEquals((err as unknown as {errors:Array<Error>}).errors.length, 1);
      assertStrictEquals((err as unknown as {errors:Array<Error>}).errors[0].message, "t1-data1");
    }
    else {
      assertStrictEquals(true, false);
    }
  }

});

Deno.test("PubSub.Broker.prototype.publish - 2", async () => {
  // publish(string, any)
  const broker = new PubSub.Broker<string>();

  const topic1 = "t1";
  broker.subscribe(topic1, (data: string) => {
    throw "ex-err";
  });

  try {
    await broker.publish(topic1, "t1-data1");
    assertStrictEquals(true, false);
  }
  catch (err) {
    //if (err instanceof AggregateError) {
    if (err instanceof Error) {
      assertStrictEquals(err.name, "AggregateError");
      assertStrictEquals((err as unknown as {errors:Array<Error>}).errors.length, 1);
      assertStrictEquals((err as unknown as {errors:Array<Error>}).errors[0].message, "\"ex-err\"");
    }
    else {
      assertStrictEquals(true, false);
    }
  }

});

Deno.test("PubSub.Broker.prototype.subscribe", async () => {
  // subscribe(string, Function)
  const broker = new PubSub.Broker<string>();

  const t1results1: string[] = [];
  const t1results2: string[] = [];
  const topic1 = "t1";
  broker.subscribe(topic1, async (data) => {
    t1results1.push(data);
    return;
  });
  await broker.publish(topic1, "t1-data1");
  broker.subscribe(topic1, async (data) => {
    t1results2.push(data);
    return;
  });
  await broker.publish(topic1, "t1-data2");

  const t2results1: string[] = [];
  const t2results2: string[] = [];
  const topic2 = "t2";
  broker.subscribe(topic2, async (data) => {
    t2results1.push(data);
    return;
  });
  await broker.publish(topic2, "t2-data1");
  broker.subscribe(topic2, async (data) => {
    t2results2.push(data);
    return;
  });
  await broker.publish(topic2, "t2-data2");

  assertStrictEquals(t1results1.join(","), `t1-data1,t1-data2`);
  assertStrictEquals(t1results2.join(","), `t1-data2`);
  assertStrictEquals(t2results1.join(","), `t2-data1,t2-data2`);
  assertStrictEquals(t2results2.join(","), `t2-data2`);

});

Deno.test("PubSub.Broker.prototype.subscribe - 2", async () => {
  // subscribe(symbol, Function)
  const broker = new PubSub.Broker<string>();

  const t1results1: string[] = [];
  const t1results2: string[] = [];
  const topic1 = Symbol();
  broker.subscribe(topic1, async (data) => {
    t1results1.push(data);
    return;
  });
  await broker.publish(topic1, "t1-data1");
  broker.subscribe(topic1, async (data) => {
    t1results2.push(data);
    return;
  });
  await broker.publish(topic1, "t1-data2");

  const t2results1: string[] = [];
  const t2results2: string[] = [];
  const topic2 = Symbol();
  broker.subscribe(topic2, async (data) => {
    t2results1.push(data);
    return;
  });
  await broker.publish(topic2, "t2-data1");
  broker.subscribe(topic2, async (data) => {
    t2results2.push(data);
    return;
  });
  await broker.publish(topic2, "t2-data2");

  assertStrictEquals(t1results1.join(","), `t1-data1,t1-data2`);
  assertStrictEquals(t1results2.join(","), `t1-data2`);
  assertStrictEquals(t2results1.join(","), `t2-data1,t2-data2`);
  assertStrictEquals(t2results2.join(","), `t2-data2`);

});

Deno.test("PubSub.Broker.prototype.subscribe - 3", async () => {
  // subscribe(string, AsyncFunction)
  const broker = new PubSub.Broker<string>();

  const t1results1: string[] = [];
  const t1results2: string[] = [];
  const topic1 = "t1";
  broker.subscribe(topic1, async (data) => {
    t1results1.push(data);
    return;
  });
  await broker.publish(topic1, "t1-data1");
  broker.subscribe(topic1, async (data) => {
    t1results2.push(data);
    return;
  });
  await broker.publish(topic1, "t1-data2");

  const t2results1: string[] = [];
  const t2results2: string[] = [];
  const topic2 = "t2";
  broker.subscribe(topic2, async (data) => {
    t2results1.push(data);
  });
  await broker.publish(topic2, "t2-data1");
  broker.subscribe(topic2, async (data) => {
    t2results2.push(data);
  });
  await broker.publish(topic2, "t2-data2");

  assertStrictEquals(t1results1.join(","), `t1-data1,t1-data2`);
  assertStrictEquals(t1results2.join(","), `t1-data2`);
  assertStrictEquals(t2results1.join(","), `t2-data1,t2-data2`);
  assertStrictEquals(t2results2.join(","), `t2-data2`);

});

Deno.test("PubSub.Broker.prototype.subscribe - 4", async () => {
  // subscribe(string, Function, { once: boolean })
  const broker = new PubSub.Broker<string>();

  const t1results1: string[] = [];
  const t1results2: string[] = [];
  const topic1 = "t1";
  broker.subscribe(topic1, async (data) => {
    t1results1.push(data);
    return;
  }, { once: true });
  await broker.publish(topic1, "t1-data1");
  broker.subscribe(topic1, async (data) => {
    t1results2.push(data);
    return;
  }, { once: true });
  await broker.publish(topic1, "t1-data2");

  const t2results1: string[] = [];
  const t2results2: string[] = [];
  const topic2 = "t2";
  broker.subscribe(topic2, async (data) => {
    t2results1.push(data);
    return;
  }, { once: true });
  await broker.publish(topic2, "t2-data1");
  broker.subscribe(topic2, async (data) => {
    t2results2.push(data);
    return;
  }, { once: true });
  await broker.publish(topic2, "t2-data2");

  assertStrictEquals(t1results1.join(","), `t1-data1`);
  assertStrictEquals(t1results2.join(","), `t1-data2`);
  assertStrictEquals(t2results1.join(","), `t2-data1`);
  assertStrictEquals(t2results2.join(","), `t2-data2`);

});

Deno.test("PubSub.Broker.prototype.subscribe - 5", async () => {
  // subscribe(string, Function, { signal: AbortSignal })
  const broker = new PubSub.Broker<string>();

  const t1results1: string[] = [];
  const t1results2: string[] = [];
  const topic1 = "t1";
  const c1 = new AbortController();
  broker.subscribe(topic1, async (data) => {
    t1results1.push(data);
    return;
  }, { signal: c1.signal });
  await broker.publish(topic1, "t1-data1");
  c1.abort();
  broker.subscribe(topic1, async (data) => {
    t1results2.push(data);
    return;
  }, { signal: c1.signal });
  await broker.publish(topic1, "t1-data2");

  const t2results1: string[] = [];
  const t2results2: string[] = [];
  const topic2 = "t2";
  const c2 = new AbortController();
  broker.subscribe(topic2, async (data) => {
    t2results1.push(data);
    return;
  }, { once: true, signal: c2.signal });
  await broker.publish(topic2, "t2-data1");
  broker.subscribe(topic2, async (data) => {
    t2results2.push(data);
    return;
  }, { once: true, signal: c2.signal });
  await broker.publish(topic2, "t2-data2");
  c2.abort();
  await broker.publish(topic2, "t2-data3");

  assertStrictEquals(t1results1.join(","), `t1-data1`);
  assertStrictEquals(t1results2.join(","), ``);
  assertStrictEquals(t2results1.join(","), `t2-data1`);
  assertStrictEquals(t2results2.join(","), `t2-data2`);

});

Deno.test("PubSub.Broker.prototype.unsubscribe", async () => {
  // unsubscribe(string, Function)
  const broker = new PubSub.Broker<string>();

  const t1results1: string[] = [];
  const t1results2: string[] = [];
  const topic1 = "t1";
  const s11 = async (data: string) => {
    t1results1.push(data);
  };
  broker.subscribe(topic1, s11);
  broker.subscribe(topic1, s11);
  await broker.publish(topic1, "t1-data1");
  broker.unsubscribe(topic1, s11);
  broker.subscribe(topic1, async (data) => {
    t1results2.push(data);
  });
  await broker.publish(topic1, "t1-data2");

  const t2results1: string[] = [];
  const t2results2: string[] = [];
  const topic2 = "t2";
  const s21 = async (data: string) => {
    t2results1.push(data);
  };
  const s22 = async (data: string) => {
    t2results2.push(data);
  };
  broker.subscribe(topic2, s21);
  await broker.publish(topic2, "t2-data1");
  broker.unsubscribe(topic2, s21);
  broker.subscribe(topic2, s22);
  await broker.publish(topic2, "t2-data2");
  broker.unsubscribe(topic2, s22);
  await broker.publish(topic2, "t2-data3");

  assertStrictEquals(t1results1.join(","), `t1-data1`);
  assertStrictEquals(t1results2.join(","), `t1-data2`);
  assertStrictEquals(t2results1.join(","), `t2-data1`);
  assertStrictEquals(t2results2.join(","), `t2-data2`);

});
