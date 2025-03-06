function add(server){
    server.get('/login', function(req, resp){
        resp.render('login',{
        layout: 'index',
        title: 'Log In',
        stylesheet: 'login'
        });
    });
}

module.exports.add = add;