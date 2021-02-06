const mysql = require('../mysql').pool;

exports.postAval = (req, res, next) =>{
    mysql.getConnection((error, conn) => {
        if (error) {return res.status(500).send({ error: error})}
        conn.query('SELECT * FROM livros WHERE id_livro = ?', 
        [req.body.id_livro], 
        (error, result, field) => {
            if (error) {return res.status(500).send({ error: error})}
            if (result.length == 0) {
                return res.status(400).send({
                    nota: 'nao foi encontrado livro com esse id'
                })
            }
            conn.query(
                'INSERT INTO aval (id_livro, nota, coment) VALUES (?,?,?)',
                [req.body.id_livro, req.body.nota, req.body.coment],
                (error, result, field) => {
                    conn.release();
                    if (error) {return res.status(500).send({ error: error})}
                    const response = {
                        nota: 'avaliacao arquivada e pah',
                        avalArquivada: {
                                id_aval: result.id_aval,
                                id_livro: req.body.id_livro,
                                nota: req.body.nota,
                                coment: req.body.coment
                            }
                        }
                    return res.status(201).send(response);
                }
            )
        })
    });
};

exports.getAval = (req, res, next) =>{
    mysql.getConnection((error, conn) => {
        if (error) {return res.status(500).send({ error: error})}
        conn.query(
            `SELECT
                aval.id_aval,
                aval.nota,
                aval.coment,
                aval.when,
                livros.id_livro,
                livros.titulo,
                livros.autor,
                livros.categ
            FROM aval
            INNER JOIN livros ON
            livros.id_livro = aval.id_livro;`,            
            (error, result, fields) => {
                if (error) {return res.status(500).send({ error: error})}
                if (result.length < 1) {return res.status(404).send({ nota: 'olha e o vazio'})}
                const response = {
                    aval: result.map(aval =>{
                        return {
                            id_aval: aval.id_aval,
                            nota: aval.nota,
                            coment: aval.coment,
                            when: aval.when,
                            livro: {
                                id_livro: aval.id_livro,
                                titulo: aval.titulo,
                                autor: aval.autor,
                                categ: aval.categ
                            }
                        }
                    })
                }
                return res.status(200).send({response})
            }
        )
    })
};

exports.getAvalbyId = (req, res, next) =>{
    mysql.getConnection((error, conn) => {
        if (error) {return res.status(500).send({ error: error})}
        conn.query(
            'SELECT * FROM aval WHERE id_aval = ?;',
            [req.params.id_aval],
            (error, result, fields) => {
                if (error) {return res.status(500).send({ error: error})}
                if (result.length == 0) {
                    return res.status(400).send({
                        nota: 'id da avaliacao invalido cholamAsRosas' 
                    })
                }
                const response = {
                    aval: {
                        id_aval: result[0].id_aval,
                        id_livro: result[0].id_livro,
                        nota: result[0].nota,
                        coment: result[0].coment,
                        when: result[0].when
                    }
                }
                return res.status(200).send(response);
            }
        )
    });
};

exports.deleteAval = (req, res, next) =>{
    mysql.getConnection((error, conn) => {
        if (error) {return res.status(500).send({ error: error})}
        conn.query('SELECT * FROM aval WHERE id_aval = ?',
        [req.body.id_aval],
        (error, results) =>{
            if (error) {return res.status(500).send({ error: error})}
            if (results.length < 1){
                res.status(400).send({ nota: "id nao encontrado q pena"})
            }else{
                conn.query(
                'DELETE FROM aval WHERE id_aval = ?',            
                [req.body.id_aval],
                (error, resultado, field) => {
                    conn.release();
                    if (error) {return res.status(500).send({ error: error})}
                    return res.status(202).send({ nota: 'deletado com success circulando'})
                });
            }
        })
    })
};