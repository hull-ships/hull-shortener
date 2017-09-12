/* global describe, it */
import buildRedirect from "../server/build_redirect";
import * as assert from "assert";

const query = {};

const query_with_utm = {
  utm_campaign: "foo",
  utm_source: "bar",
};
const query_string = "utm_campaign=foo&utm_source=bar";

const organization = "test.hullbeta.io";

const referrer = "https://referrer.com";
const referrer_with_utm = "https://referrer.com?utm_campaign=referrerCampaign&utm_source=referrerSource";
const referrer_with_utm_and_url = `${referrer_with_utm}&url=http://wrong.url`;

const long_url = "https://test.com";
const long_url_with_utm = "https://test.com?utm_campaign=baz&utm_source=bat";

const long_url_with_utm_from_short = "https://test.com?utm_campaign=foo&utm_source=bar";

describe("Build Redirect", () => {
  it("Should work with minimal parameters", () => {
    const out = buildRedirect({ organization, long_url });
    assert.equal(out, `https://${organization}/r?url=${encodeURIComponent(long_url)}`);
  });

  it("Should build a simple redirect URL properly", () => {
    const out = buildRedirect({
      organization,
      referrer,
      long_url,
      query
    });
    assert.equal(out, `https://${organization}/r?referrer=${encodeURIComponent(referrer)}&url=${encodeURIComponent(long_url)}`);
  });

  it("Should forward UTM from long URL", () => {
    const out = buildRedirect({
      organization,
      referrer,
      long_url: long_url_with_utm,
      query
    });
    assert.equal(out, `https://${organization}/r?referrer=${encodeURIComponent(referrer)}&url=${encodeURIComponent(long_url_with_utm)}`);
  });

  it("Should use UTM from Short URL if available", () => {
    const out = buildRedirect({
      organization,
      referrer,
      long_url,
      query: query_with_utm
    });
    assert.equal(out, `https://${organization}/r?referrer=${encodeURIComponent(referrer)}&url=${encodeURIComponent(long_url_with_utm_from_short)}&${query_string}`);
  });

  it("Short use UTMs from Short URL if both short and long are present", () => {
    const out = buildRedirect({
      organization,
      referrer,
      long_url: long_url_with_utm,
      query: query_with_utm
    });
    assert.equal(out, `https://${organization}/r?referrer=${encodeURIComponent(referrer)}&url=${encodeURIComponent(long_url_with_utm_from_short)}&${query_string}`);
  });

  it("Should not leak params from referrer in long URL", () => {
    const out = buildRedirect({
      organization,
      referrer: referrer_with_utm_and_url,
      long_url,
      query
    });
    assert.equal(out, `https://${organization}/r?referrer=${encodeURIComponent(referrer_with_utm_and_url)}&url=${encodeURIComponent(long_url)}`);
  });

  it("Should not leak params from referrer in long URL, but properly merge querystring params", () => {
    const out = buildRedirect({
      organization,
      referrer: referrer_with_utm_and_url,
      long_url,
      query: query_with_utm
    });
    assert.equal(out, `https://${organization}/r?referrer=${encodeURIComponent(referrer_with_utm_and_url)}&url=${encodeURIComponent(long_url_with_utm_from_short)}&${query_string}`);
  });

  it("Should not leak params from referrer in long URL with UTM", () => {
    const out = buildRedirect({
      organization,
      referrer: referrer_with_utm_and_url,
      long_url: long_url_with_utm,
      query
    });
    assert.equal(out, `https://${organization}/r?referrer=${encodeURIComponent(referrer_with_utm_and_url)}&url=${encodeURIComponent(long_url_with_utm)}`);
  });
});
