const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.postCad = (req, res, next) =>{
    mysql.getConnection((error, conn) => {
        if (error) {return res.status(500).send({ error: error})}
        conn.query('SELECT * FROM users WHERE email = ?',
        [req.body.email],
        (error, results) =>{
            if (error) {return res.status(500).send({ error: error})}
            if (results.length > 0){
                res.status(400).send({ nota: "ja cadastro ja"})
            } else {
                bcrypt.hash(req.body.senha, 12, (errBcrypt, hash) => {
                    if (errBcrypt) {return res.status(500).send({ error: error})}
                    conn.query('INSERT INTO users (nome, email, senha) VALUES (?,?,?)',
                    [req.body.nome, req.body.email, hash],
                    (error, results) =>{
                        conn.release();
                        if (error) {return res.status(500).send({ error: error})}
                            response = {
                                nota: 'User cadastrado e pa',
                                userCadastrado: {
                                    id_user: results.insertId,
                                    nome: req.body.nome,
                                    email: req.body.email
                                }
                            }
                            return res.status(201).send(response);
                        })
                });
            }    
        })
    });
};

exports.postLogin = (req, res, next) =>{
    mysql.getConnection((error, conn) => {
        if (error) {return res.status(500).send({ error: error})}
        const query = 'SELECT * FROM users WHERE email = ?';
        conn.query(query, [req.body.email], (error, results, fields) =>{
            conn.release();
            if (error) {return res.status(500).send({ error: error})}
            if (results.length < 1){
                return res.status(401).send({ nota: 'puxa o fusca'})
            }
            bcrypt.compare(req.body.senha, results[0].senha, (errBcrypt, result) =>{
                if (errBcrypt) {
                    return res.status(401).send({ nota: 'senha errada'})
                }
                if (result){
                    const token = jwt.sign({
                        id_user: results[0].id_user,
                        nome: results[0].nome,
                        email: results[0].email                        
                    }, 'password', {expiresIn: "6h"});
                    return res.status(200).send({ nota: "foi", token: token});
                }
            return res.status(401).send({ nota: 'puxa o corsa'})
            })
        });
    });
};

exports.getUsers = (req, res, next) =>{
    mysql.getConnection((error, conn) => {
        if (error) {return res.status(500).send({ error: error})}
        conn.query(
            'SELECT * FROM users;',
            (error, result, fields) => {
                if (error) {return res.status(500).send({ error: error})}
                const response = {
                    quantidade: result.length,
                    users: result.map(us =>{
                        return {
                            id_user: us.id_user,
                            nome: us.nome,
                            email: us.email
                        }
                    })
                }
                return res.status(200).send({response})
            }
        )
    })
};

exports.getUsersById = (req, res, next) =>{
    mysql.getConnection((error, conn) => {
        if (error) {return res.status(500).send({ error: error})}
        conn.query(
            'SELECT * FROM users WHERE id_user = ?;',
            [req.params.id_user],
            (error, result, fields) => {
                if (error) {return res.status(500).send({ error: error})}

                if (result.length == 0) {
                    return res.status(400).send({
                        nota: 'O id inserido é invalido muyTriste.'
                    })
                }
                const response = {
                    user: {
                        id_user: result[0].id_user,
                        nome: result[0].nome,
                        email: result[0].email
                    }
                }
                return res.status(200).send(response);
            }
        )
    });
};

exports.upDateUsers = (req, res, next) =>{
    mysql.getConnection((error, conn) => {
        if (error) {return res.status(500).send({ error: error})}
        conn.query(
            `UPDATE users 
                SET 
                    nome = ?,
                    email = ?
                WHERE id_user = ?`,            
            [
                req.body.nome, 
                req.body.email, 
                req.body.id_user
            ],
            (error, result, field) => {
                conn.release();
                if (error) {return res.status(500).send({ error: error})}
                res.status(202).send ({nota: 'update user show'});
            }
        )
    });
};

exports.deleteUsers = (req, res, next) =>{
    mysql.getConnection((error, conn) => {
        if (error) {return res.status(500).send({ error: error})}
        conn.query('SELECT * FROM users WHERE id_user = ?',
        [req.body.id_user],
        (error, results) =>{
            if (error) {return res.status(500).send({ error: error})}
            if (results.length < 1){
                res.status(400).send({ nota: "id nao encontrado q pena"})
            }else{
                conn.query(
                'DELETE FROM users WHERE id_user = ?',            
                [req.body.id_user],
                (error, resultado, field) => {
                    conn.release();
                    if (error) {return res.status(500).send({ error: error})}
                    return res.status(202).send({ nota: 'deletado com success circulando'})
                });
            }
        })
    })
};