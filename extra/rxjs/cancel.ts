import { Mutex, Semaphore } from "async-mutex";
let clientLock = new Mutex();
let clientSemaphore = new Semaphore(2);

async function sleep() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(null);
    }, 5000);
  });
}

let observables = [
  "https://httpbin.org/ip",
  "https://httpbin.org/user-agent",
  "https://httpbin.org/user-agent",
];

async function post(url: RequestInfo | URL) {
  let r = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ page: 200, pageSize: 111 }),
  });
  await sleep();
  return r.text();
}

async function execute() {
  let res = await Promise.all(
    observables.map(async (url) => {
      let [setNumber, releaseSemaphore] = await clientSemaphore.acquire();
      let r = await post(url);
      releaseSemaphore();
      return r;
    })
  );
  console.log("res -> ", res);
}
execute();
