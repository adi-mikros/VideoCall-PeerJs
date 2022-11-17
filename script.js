//buat peer baru
// var peer = new Peer(); //klo pake yg cloud bawaan

//klo pake server sendiri local -> klo mau bikin id sendiri (gag pake acak) ganti undefined dgn misal bizo atau apa (dalam bentuk string)
// var peer = new Peer(undefined, {
//     host: 'localhost',
//     port: 1989,
//     path: '/'
//   });

// //klo pake server sendiri VPS 
// var peer = new Peer(undefined,{
//     host: 'peer.svr-psd.my.id',
//     port: 443,
//     secure: true,
//     proxied: true
// });

var peer = new Peer(undefined, {
    host: '103.189.234.177',
    port: 1989,
    path: '/'
  });

const idsaya = document.getElementById("idsaya");
const idremote = document.getElementById("idremote");
const videoSaya = document.getElementById("videoSaya");
const videoRemote = document.getElementById("videoRemote");

let localStream ; // utk simpan streaming video saya

//tampilkan video dari webcam ke object videoSaya
var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
getUserMedia({video: true, audio: true}, function(stream) {
    videoSaya.srcObject=stream;
    localStream=stream;
    videoSaya.onloadeddata= () => videoSaya.play();
}, function(err) {
  console.log('Failed to get local stream' ,err);
});


//dapatkan peer id saya
peer.on("open", function(data){
    idsaya.value = data;
});


//posisi ketika kita yang manggil kawan
const tmbPanggil = document.getElementById("tmbPanggil");
tmbPanggil.addEventListener("click", function(){
    var call = peer.call(idremote.value, localStream); //panggil kawan dengan remote id
    call.on("stream", stream =>{ //jika kawan sudah bisa dihubungi tampilkan tangkapan kamera lawan
        videoRemote.srcObject=stream;
        videoRemote.onloadeddata= () => videoRemote.play();
    }, function(err){
        console.log(err);
    });
    console.log(idremote.value);
});


//posisi ketika dapat panggilan dari kawan
peer.on("call", function(call){    
    call.answer(localStream); //langsung terima dan kirim stream video kita
    //tampilkan video org yg manggil (remote)
    call.on('stream', function(datastreame){
        videoRemote.srcObject = datastreame;
        videoRemote.onloadeddata = () =>videoRemote.play();
    });
})


