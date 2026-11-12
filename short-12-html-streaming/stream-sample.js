// videos/shorts/12-html-streaming/code/stream-sample.js
// Compiles and runs in Node / modern JS environments

export async function oldWayInnerHtml(response, container) {
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    // Bug: wipes & reparses full DOM on every token
    container.innerHTML += decoder.decode(value);
  }
}

export async function newWayWhatwg(response, container) {
  // WHATWG PR #12758: Native streaming insertion
  await response.textStream().pipeTo(
    container.streamAppendHTML()
  );
}
