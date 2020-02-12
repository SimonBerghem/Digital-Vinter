const authorization = require('./authorization').pool;
const {SHA256} = require("sha2");


module.exports = {
    /*
    ALL FUNCTIONS SHOULD RETURN SOMETHING
    If status, see specific one at
    https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
    */

   login : function(req, res){
  
        authorization.getConnection(function(err, conn){
            if (err) throw err
            
            let secret_key = [SHA256("keon135ntaik304ngaop3" + req.body.secret_key).toString("hex")];
            console.log(secret_key);
            //2a0db2eba7e496f9daf3f7dbe6aa533a7fb7e2c8b9e658003e2006eeba5f0050 = secret
            let sql = 'SELECT * FROM secrets WHERE password = ?';
            conn.query(sql, "2a0db2eba7e496f9daf3f7dbe6aa533a7fb7e2c8b9e658003e2006eeba5f0050", function (err, results) {
                

                if(results && results.length > 0) {
                    req.session.loggedin = true;
                    res.redirect('/map');
                } else {
                    res.send('Incorrect secret!');
                }
                res.end();
                conn.release();
                

                if (err) throw err
            });
        });
    }
};
