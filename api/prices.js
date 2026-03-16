/**
 * Vercel Serverless Function: /api/prices
 *
 * Proxies the Goonmetrics price API and caches the response for 1 hour.
 * Called on button press only – no automatic refresh.
 *
 * Station ID 60003760 = Jita 4-4 Caldari Navy Assembly Plant
 */

const TYPE_IDS = [
  2867, 2868, 2869, 2870, 2871, 2872, 2875, 2876,
  17392, 2344, 2345, 2346, 2348, 2349, 2351, 2352, 2354, 2358,
  2360, 2361, 2366, 2367, 9834, 9846, 9848, 12836, 17136, 17898, 28974,
  3725, 3695, 44, 2312, 2317, 2319, 2321, 2327, 2328, 2329, 2463,
  3689, 3691, 3693, 3697, 3775, 3828, 9830, 9832, 9836, 9838, 9840, 9842, 15317,
  2389, 2390, 2392, 2393, 2395, 2396, 2397, 2398, 2399, 2400, 2401,
  3645, 3683, 3779, 9828,
];

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  // Cache 1 hour at Vercel CDN – fresh prices on next button press after expiry
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=3600");

  try {
    const ids = TYPE_IDS.join(",");
    const upstream = `https://goonmetrics.apps.gnf.lt/api/price_data/?station_id=60003760&type_id=${ids}`;

    const response = await fetch(upstream, {
      headers: { "User-Agent": "EVE-PI-Calculator/1.0 (Xel-matZe)" },
    });

    if (!response.ok) throw new Error(`Upstream HTTP ${response.status}`);

    const xml = await response.text();
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.status(200).send(xml);
  } catch (error) {
    console.error("Price proxy error:", error);
    res.status(502).json({ error: "Failed to fetch prices", detail: error.message });
  }
}
