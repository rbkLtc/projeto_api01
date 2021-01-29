const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const rotaLivros = require('./routes/livros');
const rotaPesquisas = require('./routes/pesquisas');


app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.jsaon());

app.use('/livros', rotaLivros);
app.use('/pesquisas', rotaPesquisas);

app.use((req, res, next) =>{
    const erro = new Error ('deu ruim');
    erro.status = 404;
    next(erro);
});

app.use ((error, req, res, next) =>{
    res.status(error.status || 500);
    return res.send({
        erro:{
            mensagem: error.message
        }
    });
});

module.exports = app;