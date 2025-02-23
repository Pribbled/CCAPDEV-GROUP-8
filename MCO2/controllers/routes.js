function add(server){
    server.get('/', function(req, resp){
        resp.render('main',{
        layout: 'index',
        title: 'Computer Lab Slot Reservation',
        stylesheet: 'home'
        });
    });
}