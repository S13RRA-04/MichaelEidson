const APEX_HOSTNAME = "michaeleidson.com";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.hostname === `www.${APEX_HOSTNAME}`) {
      url.hostname = APEX_HOSTNAME;
      url.protocol = "https:";
      url.port = "";

      return Response.redirect(url, 301);
    }

    return env.ASSETS.fetch(request);
  },
};
