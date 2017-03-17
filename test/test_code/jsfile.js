function reportEvent(event) {
    var data = JSON.stringify({ event: event, time: performance.now()  });
    navigator.sendBeacon('/collector', data);
}
