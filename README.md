# simple_stats
Super simple client-side stats logging with no dependencies.

Install via github or npm: 
```
npm install benoneal/simple_stats
// or
npm install simple_stats
```

In your client-side code, include this lib and connect to your statsd server: 
```
var stats = require('simple_stats');

stats.connect({ server: 'http://myappdomain.com/', prefix: 'my_app' });

stats.increment('initialised');
// will give a metric in your logs like: "my_app.initialised.count"
```

After connecting, all stats are queued and aggregated to be sent every 2.5 seconds. If you need to send queued stats immediately (such as before a page transition or in window.onunload), then call the "flush" method:
```
window.onunload = stats.flush
// or
form.submit(function() { 
  stats.flush();
  // other stuff here 
});
```

The timer interface mirrors Lynx's (to make it easier to create isomorphic apps): 
```
var requestTimer = stats.createTimer('get_request');
//...
requestTimer.stop();
// will give something like: "my_app.get_request.timer"
```
