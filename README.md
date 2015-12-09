#  Kids Node.js client.

![Build Status](https://travis-ci.org/fatelei/kidsjs.svg)

# Install

```
npm install kidsjs
``` 

# APIs

# Logging

Logging class.

## enableKids

Setup logging handler.

**Parameters**

-   `config` **object** Config
  - port {number}: kids server port
  - host {number}: kids server host
  - topic {string}: kids topic

**Usage**

```
const logging = require('kidsjs');
logging.enableKids({
  port: 6379,
  host: 'localhost',
  topic: 'test
});
```

## debug

Log debug level message.

**Parameters**

-   `message` **string** Log content

**Usage**

```
logging.debug('hehe');
```

## error

Log error level message.

**Parameters**

-   `message` **string** Log content

**Usage**

**Usage**

```
logging.error('hehe');
```

## info

Log info level message.

**Parameters**

-   `message` **string** Log content

**Usage**

**Usage**

```
logging.info('hehe');
```

## warn

Log warn level message.

**Parameters**

-   `message` **string** Log content

**Usage**

```
logging.warn('hehe');
```
