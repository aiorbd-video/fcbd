export async function onRequest({ request }) {
  const ALLOWED_DOMAIN = "https://bd71.vercel.app";

  const origin = request.headers.get("Origin");
  const referer = request.headers.get("Referer");

  // 🔒 Allow only from bd71.vercel.app
  if (
    !(
      (origin && origin.startsWith(ALLOWED_DOMAIN)) ||
      (referer && referer.startsWith(ALLOWED_DOMAIN))
    )
  ) {
    return new Response("403 Forbidden", { status: 403 });
  }

  const SOURCE =
    "https://raw.githubusercontent.com/IPTVFlixBD/Fancode-BD/refs/heads/main/playlist.m3u";

  const res = await fetch(SOURCE, {
    headers: {
      "User-Agent": "Mozilla/5.0",
    },
  });

  if (!res.ok) {
    return new Response("Source fetch failed", { status: 502 });
  }

  const text = await res.text();
  const lines = text.split("\n");

  let output = [];

  for (let line of lines) {
    line = line.trim();

    // ❌ Remove only these two
    if (
      line.startsWith("#EXTVLCOPT:http-user-agent") ||
      line.startsWith("#EXTHTTP:")
    ) {
      continue;
    }

    // ✅ Keep everything else
    output.push(line);
  }

  return new Response(output.join("\n"), {
    headers: {
      // Allow only bd71.vercel.app in browser
      "Access-Control-Allow-Origin": ALLOWED_DOMAIN,

      // Browser shows text
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": 'inline; filename="playlist.m3u"',
      "Cache-Control": "no-store",
    },
  });
}
