function add(server){
    server.get('/reservationPage', function(req, resp){
        resp.render('reservationPage',{
        layout: 'index',
        title: 'Reserve a Slot',
        stylesheet: 'reservePage'
        });
    });
}

module.exports.add = add;