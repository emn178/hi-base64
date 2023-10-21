var imported = false;
onmessage = function(e) {
  if (imported) {
    postMessage(base64.encode(e.data));
    if (typeof exports !== 'undefined') {
      imported = false;
    }
  } else {
    imported = true;
    importScripts(e.data);
  }
}
