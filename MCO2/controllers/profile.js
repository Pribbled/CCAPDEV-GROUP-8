function add(server){
    server.get('/profile', function(req, resp){
        resp.render('profile',{
        layout: 'index',
        title: 'Profile',
        stylesheet: 'profile'
        });
    });
}

module.exports.add = add;