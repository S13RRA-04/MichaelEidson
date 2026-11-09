import assert from "node:assert/strict";
import test from "node:test";

import worker from "../src/index.mjs";

test("redirects www requests permanently while preserving path and query", async () => {
  const response = await worker.fetch(
    new Request("https://www.michaeleidson.com/books?source=profile"),
    { ASSETS: { fetch: () => assert.fail("assets should not be fetched") } },
  );

  assert.equal(response.status, 301);
  assert.equal(
    response.headers.get("location"),
    "https://michaeleidson.com/books?source=profile",
  );
});

test("serves apex requests through the static assets binding", async () => {
  const expected = new Response("homepage", { status: 200 });
  let receivedRequest;
  const request = new Request("https://michaeleidson.com/");

  const response = await worker.fetch(request, {
    ASSETS: {
      fetch(assetRequest) {
        receivedRequest = assetRequest;
        return expected;
      },
    },
  });

  assert.equal(receivedRequest, request);
  assert.equal(response, expected);
});
