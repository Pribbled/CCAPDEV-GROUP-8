function add(server){
    server.get('/slots', function(req, resp){
        resp.render('slots',{
        layout: 'index',
        title: 'Slot Availability',
        stylesheet: 'slots'
        });
    });
}

module.exports.add = add;