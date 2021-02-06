const mysql = require('../mysql').pool;

exports.postLivros = (req, res, next) =>{
    console.log(req.user)
    mysql.getConnection((error, conn) => {
        if (error) {return res.status(500).send({ error: error})}
        conn.query(
            'INSERT INTO livros (titulo, autor, ano, categ) VALUES (?,?,?,?)',
            [req.body.titulo, req.body.autor, req.body.ano, req.body.categ],
            (error, result, field) => {
                conn.release();
                if (error) {return res.status(500).send({ error: error})}
                const response = {
                    nota: 'Menino livro inserido e nois familia',
                    livroInserido: {
                            id_livro: result.id_livro,
                            titulo: req.body.titulo,
                            autor: req.body.autor,
                            ano:  req.body.ano,
                            categoria: req.body.categ
                        }
                    }
                return res.status(201).send(response)
            }
        )
    });
};

exports.getLivros = (req, res, next) =>{
    mysql.getConnection((error, conn) => {
        if (error) {return res.status(500).send({ error: error})}
        conn.query(
            'SELECT * FROM livros;',
            (error, result, fields) => {
                if (error) {return res.status(500).send({ error: error})}
                const response = {
                    quantidade: result.length,
                    livros: result.map(liv =>{
                        return {
                            id_livro: liv.id_livro,
                            titulo: liv.titulo,
                            autor: liv.autor,
                            ano: liv.ano,
                            categoria: liv.categ
                        }
                    })
                }
                return res.status(200).send({response})
            }
        )
    })
};

exports.getLivrosById = (req, res, next) =>{
    mysql.getConnection((error, conn) => {
        if (error) {return res.status(500).send({ error: error})}
        conn.query(
            'SELECT * FROM livros WHERE id_livro = ?;',
            [req.params.id_livro],
            (error, result, fields) => {
                if (error) {return res.status(500).send({ error: error})}

                if (result.length == 0) {
                    return res.status(400).send({
                        nota: 'O id inserido é invalido muyTriste.'
                    })
                }
                const response = {
                    livro: {
                        id_livro: result[0].id_livro,
                        titulo: result[0].titulo,
                        autor: result[0].autor,
                        ano: result[0].ano,
                        categoria: result[0].categ
                    }
                }
                return res.status(200).send(response);
            }
        )
    });
};

exports.upDateLivros = (req, res, next) =>{
    mysql.getConnection((error, conn) => {
        if (error) {return res.status(500).send({ error: error})}
        conn.query(
            `UPDATE livros 
                SET 
                    titulo = ?,
                    autor = ?,
                    ano = ?,
                    categ = ?
                WHERE id_livro = ?`,            
            [
                req.body.titulo, 
                req.body.autor, 
                req.body.ano, 
                req.body.categ, 
                req.body.id_livro
            ],
            (error, result, field) => {
                conn.release();
                if (error) {return res.status(500).send({ error: error})}

                res.status(202).send ({
                    nota: 'Alterado o menino livro com tranquilidade'
                });
            }
        )
    });
};

exports.deleteLivros = (req, res, next) =>{
    mysql.getConnection((error, conn) => {
        if (error) {return res.status(500).send({ error: error})}
        conn.query('SELECT * FROM livros WHERE id_livro = ?',
        [req.body.id_livro],
        (error, results) =>{
            if (error) {return res.status(500).send({ error: error})}
            if (results.length < 1){
                res.status(400).send({ nota: "id nao encontrado q pena"})
            }else{
                conn.query(
                'DELETE FROM livros WHERE id_livro = ?',            
                [req.body.id_livro],
                (error, resultado, field) => {
                    conn.release();
                    if (error) {return res.status(500).send({ error: error})}
                    return res.status(202).send({ nota: 'deletado com success circulando'})
                });
            }
        })
    })
};