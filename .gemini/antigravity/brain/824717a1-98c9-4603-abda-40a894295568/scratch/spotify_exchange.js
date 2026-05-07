const client_id = "44f9a5f574844d31aa0bbaa1e73e08fd";
const client_secret = "a9ecbab60b4a473991b279cd655c9323";
const code = "AQBi5csRxESFUUl_7mFr0Dqqq1PceP_S0NiyU2QhA3p0EExtdddMCPnKDjHGk4UL2fIT9FCMrcgYsdV9snC5Ig5LcpGVqXidXEgeKvdzKqt0I567ZDk5BAAQJNi0rXpEc17L5IXEfkYcZFqCBE2M9IBUHEfw5LPBMlVGiRBpiqj8NaeZwUIDXXOyicAvUOp9e_pMZoJypjACUn7RMxazWj92V0yNOHATQ28oLYwI";
const redirect_uri = "https://example.com";

const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64");

async function exchange() {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri,
    }),
  });

  const data = await response.json();
  console.log(JSON.stringify(data, null, 2));
}

exchange();
