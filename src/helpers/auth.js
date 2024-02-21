export function onAuth(npub, options) {
  console.log("onAuth", npub, options);
  window.localStorage?.setItem("auth", JSON.stringify({
    ...options,
    npub
  }))
}

export function getAuth() {
  try {
    return JSON.parse(window.localStorage?.getItem("auth"))
  } catch {
    return {}
  }
}