    const winston = require("winston")

    //Error: Falha critica
    //Warn: Atenção
    //Info: Mensagem de rotina, ex: usuário logado ou cadastrado com sucesso
    // Debug: Acompanhar a execução do programa

    const consoleFormat = winston.format.combine(
        winston.format.colorize(), //Adiciona cor ao log ex: info na cor verde e error na cor vermelha
        winston.format.timestamp({
            format: 'YYYY-MM--DD HH:mm:ss' //Data e Horario
        }),
        winston.format.simple()
    )

    const logger = winston.createLogger({
        level: "info",
        format: winston.format.json(), // Exibe em JSON

        transports: [new winston.transports.Console({ // Através do winston.transports.Console diz que vai enviar os logs no console
            format: consoleFormat

            //Essa seria uma opção para salvar os logs num arquivo
            //new winston.transports.File({
              //  filename: 'combined.log',
              // level:'error', Ao passar o level:error exemplifica que nesse combined.log salva somente coisas mais "graves" 
            //}),
        })],
    });

    module.exports = logger;