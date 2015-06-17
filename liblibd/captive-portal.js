// @param httpRequest
// @return bool - Is this a captive portal detection request

module.exports = function (req) {
  var ok = true

  function headerTester (headerAttr) {
    return function (regex) {
      if (regex.test(req.headers[headerAttr])) ok = false
    }
  }
  // user-agents
  [/CaptiveNetworkSupport/].forEach(headerTester('user-agent'))

  // hosts
  [/clients3\.google\.com/].forEach(headerTester('host'))

  return ok 
}
