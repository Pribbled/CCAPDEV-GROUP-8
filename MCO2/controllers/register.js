function add(server){
    server.get('/register', function(req, resp){
        resp.render('register',{
        layout: 'index',
        title: 'Register',
        stylesheet: 'register'
        });
    });
}

module.exports.add = add;