'use strict'
let express = require('express')
var shakeSensor1
var shakeSensor2
var PORT=3000;
let app = express()
var joinornot1=false;
var joinornot2=false;

app.use('/', express.static(__dirname + '/public'));

// MKR1000 stuffs
let server = require('http').createServer(app)
let io = require('socket.io')(server)
let net = require('net')
let five = require('johnny-five')
let firmata = require('firmata')

server.listen(PORT,function(){
  console.log('Server listening at port ' + PORT);
})

// set options1 to match Firmata config for wifi
// using MKR1000 with WiFi101
const options1 = {
  host: '192.168.1.30',
  port: 3030
}
const options2 = {
  host: '192.168.1.31',
  port: 3031
}

// connection starts here
net.connect(options1, function() { //'connect' listener
  console.log('player1 already connected to server!')

  var socketClient1 = this

  // use the socketClient instead of a serial port for transport
  var boardIo1 = new firmata.Board(socketClient1)

  boardIo1.once('ready', function(){
    console.log('boardIo1 ready')
    boardIo1.isReady = true

    var board1 = new five.Boards([{id:'A',io: boardIo1, repl: true}])

    board1.on('ready', function() {
      console.log(board1.id)
      console.log(board1.host)
      console.log(board1.port)
      // full Johnny-Five support here
      console.log('board1 five ready')

      // setup led on pin 6 --> led pin for MKR1000
      var led = new five.Led({
        pin:6,
        board:this.byId('A')
      })

      // pulse led to indicate the board is communicating
      setInterval(function(){
        pulseLed(led, 2000)
      },4000)

      joinornot1=true
      setInterval(function(){
        emitUserconnection1(joinornot1)
      },1000)
      

      shakeSensor1 = new five.Sensor({
        pin:'A1',
        freq:250,
        board:this.byId('A')
      })
      
      io.on('connection', function (socket) {
        // emit usersCount on new connection
        console.log(socket.id+'player1 open the page')
        // emit usersCount when connection is closed
        socket.on('disconnect', function () {
        console.log(socket.id+'player1 left the game')
        })
      })

       setInterval(function(){
        emitMoveData1(io,shakeSensor1)
      },10)

    })
  })

}).on('error', function (err) {
  joinornot1=false
  setInterval(function(){
    emitUserconnection1(joinornot1)
    },1000)
  console.log('Unable to connect player1!')
  console.log('Please make sure you have the latest StandardFirmataWifi sketch loaded on the MKR1000')
})

function getData1(shakeSensor1){
  return Math.round(shakeSensor1.value/1023*10)
}
function emitUserconnection1(joinornot1) {
  io.sockets.emit('player1join', {
    connection: joinornot1
  })
}
// emit chart data to all sockets
function emitMoveData1(io,shakeSensor1) {
  io.sockets.emit('player1shake', {
    value: getData1(shakeSensor1)
  })
}
//=====================================================//
net.connect(options2, function() { //'connect' listener
  console.log('player2 already connected to server!')

  var socketClient2 = this

  // use the socketClient instead of a serial port for transport
  var boardIo2 = new firmata.Board(socketClient2)

  boardIo2.once('ready', function(){
    console.log('boardIo2 ready')
    boardIo2.isReady = true

    var board2 = new five.Boards([{id:'B',io: boardIo2, repl: true}])

    board2.on('ready', function() {
      // full Johnny-Five support here
      console.log(board2.id)
      console.log(board2.host)
      console.log(board2.port)
      console.log('board five ready')

      // setup led on pin 6 --> led pin for MKR1000
      var led = new five.Led({
        pin:6,
        board:this.byId('B')
      })

      // pulse led to indicate the board is communicating
      setInterval(function(){
        pulseLed(led, 2000)
      },4000)

      joinornot2=true
      setInterval(function(){
        emitUserconnection2(joinornot2)
      },10)
      

      shakeSensor2 = new five.Sensor({
        pin:'A1',
        freq:250,
        board:this.byId('B')
      })
      
      io.on('connection', function (socket) {
        // emit usersCount on new connection
        console.log(socket.id+'player2 open the page')
        // emit usersCount when connection is closed
        socket.on('disconnect', function () {
        console.log(socket.id+'player2 left the game')
        })
      })

       setInterval(function(){
        emitMoveData2(io,shakeSensor2)
      },10)

    })
  })

}).on('error', function (err) {
  joinornot2=false
  setInterval(function(){
    emitUserconnection2(joinornot2)
    },1000)
  console.log('Unable to connect player2!')
  console.log('Please make sure you have the latest StandardFirmataWifi sketch loaded on the MKR1000')
})

function getData2(shakeSensor2){
  return Math.round(shakeSensor2.value/1023*10)
}
function emitUserconnection2(joinornot2) {
  io.sockets.emit('player2join', {
    connection: joinornot2
  })
}

function emitMoveData2(io,shakeSensor2) {
  io.sockets.emit('player2shake', {
    value: getData2(shakeSensor2)
  })

}

// pulse led
function pulseLed(led, duration, cb) {
  led.blink()
  setTimeout(function () {
    led.stop().off()
  }, duration)
}




