function add(server){
    server.get('/slotsLab', function(req, resp){
        resp.render('slotsLab',{
        layout: 'index',
        title: 'Reservations for Today',
        stylesheet: 'slotsLab'
        });
    });
}

module.exports.add = add;