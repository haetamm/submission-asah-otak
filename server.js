import http from 'http';
import mysql from 'mysql2'

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'asah_otak'
});

connection.connect((error) => {
    if (error) {
        console.error('Error connecting database');
        return;
    }
    console.log('Connected database')
});

const errorRes = (res, code, message) => {
    res.writeHead(code, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: message }));
    return;
}

const setCORSHeaders = (res) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
};

const requestListener = (req, res) => {

    setCORSHeaders(res);
    
    const { url, method } = req;

    if (method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    if (url.startsWith('/api/kata')) {
        if (method === 'GET') {
            const id = url.split('/').pop();

            connection.query('SELECT * FROM master_kata WHERE id = ?', [id], (err, results) => {
                if (err) {
                    errorRes(res, 500, 'Error fetching data');
                }
          
                if (results.length === 0) {
                    errorRes(res, 404, 'Data not found');
                } 
                else {
                    const result = results[0];
                    const originalKata = result.kata;

                    const kataArray = originalKata.split('').map((char, index) => {
                        if (index + 1 === 3 || index + 1 === 7) {
                            return char;
                        } 
                        else {
                            return '';
                        }
                    });

                    result.kata = kataArray;
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(result));
                }
            });
        }
        else if (method === 'POST') {
            const id = url.split('/').pop();
            let body = [];

            req.on('data', (chunk) => {
                body.push(chunk);
            });

            req.on('end', () => {
                body = Buffer.concat(body).toString();
                const parsedBody = JSON.parse(body);

                const kata = parsedBody.kata;
                
                connection.query('SELECT * FROM master_kata WHERE id = ?', [id], (err, results) => {
                    if (err) {
                        errorRes(res, 500, 'Error fetching data');
                    }
              
                    if (results.length === 0) {
                        errorRes(res, 404, 'Data not found');
                    } else {
                        
                        const result = results[0];
                        const originalKata = result.kata;
                        let score = 0;

                        for (let i = 0; i < Math.max(originalKata.length, kata.length); i++) {
                            if (kata[i].toUpperCase() === originalKata[i].toUpperCase()) {
                                score += 10;
                            } else {
                                score -= 2
                            }
                        }
    
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({score: score}));
                    }
                });
            });
        }
        else {
            errorRes(res, 400, `Route tidak dapat diakses dengan method ${method}`);
        }
    }
    else if (url.startsWith('/api/score')) {
        if (method === 'POST') {

            let body = [];
            req.on('data', (chunk) => {
                body.push(chunk);
            });

            req.on('end', () => {
                body = Buffer.concat(body).toString();
                const parsedBody = JSON.parse(body);

                const nama_user = parsedBody.nama_user;
                const total_point = parsedBody.total_point;
                
                connection.query('INSERT INTO point_game SET nama_user = ?, total_point = ?', [nama_user, total_point], (err, results) => {
                    if (err) {
                        errorRes(res, 500, `Score gagal disimpan`);
                    }
                    else {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({messsage: "score berhasil disimpan"}));
                    }
                });
            });
        } 
        else {
            res.statusCode = 400;
            res.end(JSON.stringify({
                message: `Route tidak dapat diakses dengan method ${method}`
            }));
        }
    }
    else {
        errorRes(res, 404, `Route tidak ditemukan`);
    }
}

const server = http.createServer(requestListener);

const port = 5000;
const host = 'localhost';

server.listen(port, host, () => {
    console.log(`Server berjalan pada http://${host}:${port}`);
});
