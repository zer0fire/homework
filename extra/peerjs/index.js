var peer= new Peer()
peer.on('open', function(id) {
    console.log('My peer ID is: ' + id)
})



var conn = peer.connect('dest-peer-id')

conn.on('open', function (){ 
    conn.send('hello')
})


peer.on('connection', function(conn) {
    conn.on('data', function (data) {
        console.log('Received', data)
    })
});


// btn.onclick(() => {
//     const val = input.value
//     conn.send('hello')
// })

