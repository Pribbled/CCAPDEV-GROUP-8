function add(server){
    server.get('/reservationPageLabtech', function(req, resp){
        resp.render('reservationPageLabtech',{
        layout: 'index',
        title: 'Reserve a Slot',
        stylesheet: 'reservePageLabtech'
        });
    });
}

module.exports.add = add;