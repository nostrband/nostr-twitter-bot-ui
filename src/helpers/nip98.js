import { nip19 } from "nostr-tools";
import { getAuth } from "./auth";
import NDK, { NDKEvent, NDKNip07Signer } from "@nostr-dev-kit/ndk";

let signer = null;
let ndk = new NDK({})

async function ensureSigner() {
  if (!signer) signer = new NDKNip07Signer();
}

export async function sendPost({ url, method, headers, body }) {
  const r = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body,
  });
  if (r.status !== 200 && r.status !== 201) {
    console.log("Fetch error", url, method, r.status);
    const body = await r.text();
    throw new Error("Failed to fetch " + url, { cause: { status: r.status, body } });
  }

  return await r.json();
}

function hex(buffer) {
  return [...new Uint8Array(buffer)]
    .map((x) => x.toString(16).padStart(2, "0"))
    .join("");
}

async function sha256(s) {
  return hex(
    await window.crypto.subtle.digest("SHA-256", new TextEncoder().encode(s))
  );
}

export async function sendPostAuthd({ url, method = "GET", body = "" }) {
  const auth = getAuth();
  await ensureSigner();
  const { data: pubkey } = nip19.decode(auth.npub);
  console.log({ auth, signer, pubkey });

  const authEvent = new NDKEvent(ndk, {
    pubkey: pubkey,
    kind: 27235,
    created_at: Math.floor(Date.now() / 1000),
    content: "",
    tags: [
      ["u", url],
      ["method", method],
    ],
  });
  if (body) authEvent.tags.push(["payload", await sha256(body)]);

  console.log("signing");
  authEvent.sig = await authEvent.sign(signer);
  console.log("signed", authEvent);

  const header = btoa(JSON.stringify(authEvent.rawEvent()));

  return await sendPost({
    url,
    method,
    headers: {
      Authorization: `Nostr ${header}`,
    },
    body,
  });
}
