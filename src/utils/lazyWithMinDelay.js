import { lazy } from "react";

export function lazyWithMinDelay(importFn, minDelay = 200) {
  return lazy(async () => {
    return Promise.all([
      await importFn(),
      await new Promise((resolve) => setTimeout(resolve, minDelay)),
    ]).then(([moduleExports]) => moduleExports);
  });
}