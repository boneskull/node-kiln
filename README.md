node-kiln
=========
**Overview:** Provides Kiln API functionality.
Very little here at the moment.  You can login but can't do anything.
`kiln.watchActivity()` works well, but you have to deal with the objects
returned by Feedparser yourself.

module kiln
===========
kiln.login()
------------
Logs into Kiln.  Saves a token.

kiln.watchActivity(dataHandler, metaHandler, ms)
------------------------------------------------
Watches RSS feed and callbacks when we have data.  Saves data GUIDs in Redis.  Asynchronous.

**Parameters**

**dataHandler**:  *function*,  Callback for when we have data

**metaHandler**:  *function*,  Callback for when we have metadata.  This should only happen once per call.

**ms**:  *number=30000*,  How often to poll in ms (defaults to 30s)

