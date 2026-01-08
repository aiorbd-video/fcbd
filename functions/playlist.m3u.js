export async function onRequest({ request }) {
  const ua = request.headers.get("user-agent") || "";
  const referer = request.headers.get("referer") || "";

  // 🌐 Detect browser
  const isBrowser =
    /Chrome|Firefox|Safari|Edg|OPR|MSIE/i.test(ua);

  // 📱 Detect IPTV / media apps
  const isIPTV =
    /IPTV|VLC|OTT|ExoPlayer|TiviMate|PerfectPlayer|Kodi/i.test(ua);

  // 🔒 Allow only your website
  const isYourSite = referer.includes("bd71.vercel.app");

  // ❌ Block rules
  if (
    (isBrowser && !isYourSite) || // browser but not your site
    (!isBrowser && !isIPTV)       // not browser & not IPTV app
  ) {
    return new Response(null, {
      status: 302,
      headers: {
        Location: "https://t.me/allonebd",
      },
    });
  }

  const SOURCE =
    "https://raw.githubusercontent.com/IPTVFlixBD/Fancode-BD/refs/heads/main/playlist.m3u";

  const res = await fetch(SOURCE, {
    headers: {
      "User-Agent": ua,
    },
  });

  const text = await res.text();

  return new Response(text, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": 'inline; filename="playlist.m3u"',
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
