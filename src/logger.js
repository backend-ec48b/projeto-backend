const winston = require("winston");

const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.errors({stack: true}),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({filename: "Logs/Error.log", level:"error"}),
        new winston.transports.File({ filename: "Logs/Info.log", level:"info"})
    ]
});

if (process.env.NODE_ENV !== "production") {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        )
    }));
}


module.exports = logger;