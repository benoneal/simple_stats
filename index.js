// Modified from godmodelabs/statsc

'use strict';

var POST_INTERVAL = 2500;
var namespace = '';
var server = 'http://localhost:8127/';
var queue = [];

function compact(array) { // stolen shamelessly from lodash
  var index = -1,
      length = array ? array.length : 0,
      resIndex = -1,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (value) {
      result[++resIndex] = value;
    }
  }
  return result;
}

function sendQueue() {
  var head = document.getElementsByTagName('head')[0];
  if (queue.length > 0) {
    var tag = document.createElement('script');
    tag.src = server + JSON.stringify(queue);
    tag.onload = tag.onreadystatechange = function() {
      if (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') {
        head.removeChild(tag);
      }
    }
    head.appendChild(tag);
    queue = [];
  }
}

function fromNow(date) {
  return new Date() - date;
}

function addToQueue(arr) {
  queue.push(compact(arr));
}

function prefix(str) {
  return prefix + str;
}

function trailingSlash(url) {
  return url && (url[url.length - 1] !== '/' ? url += '/' : url);
}

module.exports = {
  connect: function(options) {
    server = trailingSlash(options.server) || server;
    namespace = options.prefix ? options.prefix += '.' || namespace;
    setInterval(sendQueue, options.interval || POST_INTERVAL);
  },

  increment: function(stat, sampleRate) {
    addToQueue(['i', prefix(stat), sampleRate]);
  },

  decrement: function(stat, sampleRate) {
    addToQueue(['d', prefix(stat), sampleRate]);
  },

  gauge: function(stat, value, sampleRate) {
    addToQueue(['g', prefix(stat), value, sampleRate]);
  },

  timing: function(stat, time, sampleRate) {
    if (typeof time === 'number') {
      return addToQueue(['t', prefix(stat), time, sampleRate]);
    }
    if (time instanceof Date) {
      return addToQueue(['t', prefix(stat), fromNow(time), sampleRate]);
    }
    if (typeof time === 'function') {
      var start = new Date();
      time();
      addToQueue(['t', prefix(stat), fromNow(start), sampleRate]);
    }
  },

  createTimer: function(stat, sampleRate) {
    var start = new Date().getTime();

    return {
      stop: function() {
        addToQueue(['t', prefix(stat), fromNow(start), sampleRate])
      }
    }
  },

  flush: sendQueue
}
