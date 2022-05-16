// LOGGER BY FABIAN DENNLER
// https://github.com/foxfabi

const { createLogger, format, transports } = require('winston');

const defaultFormat = format.combine(
  format.splat(),
  format.label({ label: '[API]' }),
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.printf((info) => {
    // if info is an error, append the non-standard stack property
    if (info instanceof Error) {
      info.message = info.stack;
    }
    // if the message is an object, convert it to a string
    if (typeof info.message === 'object') {
      info.message = JSON.stringify(info.message, null, 2);
    }
    return `${info.timestamp} - ${info.label} ${info.level}: ${info.message}`;
  }),
);

const logger = createLogger({
  level: 'info',
  format: defaultFormat,
  transports: [
    // - Write all logs with level `debug` and below to `debug.log`
    new transports.File({
      filename: './logs/debug.log',
      level: 'debug',
      maxsize: 1000000,
    }),
    // - Write all logs with level `error` and below to `error.log`
    new transports.File({ filename: './logs/error.log', level: 'error' }),
    // - Write all logs with level `info` and below to `server.log`
    new transports.File({ filename: './logs/server.log' }),
  ],
  exceptionHandlers: [
    new transports.File({
      filename: './logs/exceptions.log',
      timestamp: true,
      maxsize: 1000000,
    }),
  ],
});

//log everything in console
logger.add(
  new transports.Console({
    format: format.combine(format.colorize(), defaultFormat),
  }),
);

// By default, morgan outputs to the console only, so let’s define a stream function
// that will be able to get morgan-generated output into the winston log files.
logger.stream = {
  write: function (message) {
    // Morgan has a bad habit of ending the message with a \n
    logger.info(message.replace(/\n$/, ''));
  },
};

module.exports = logger;