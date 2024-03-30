import BlueHawaii from './albums.js';

// Media Info
const trackName = document.querySelector('.track');
const trackArtist = document.querySelector('.artist');
const trackAlbum = document.querySelector('.album');

// Media Controller
const playButton = document.getElementById('play-button');
const pauseButton = document.getElementById('pause-button');
const rewindButton = document.getElementById('rwd-button');
const fastforwardButton = document.getElementById('ff-button');
const theBar = document.getElementById('the-bar');
const theDot = document.getElementById('the-dot');
const albumCover = document.getElementById('album-cover');
const artistPhoto = document.getElementById('artist-photo');

const track = {
    name: BlueHawaii.tracks[0].name,
    artist: BlueHawaii.tracks[0].artist,
    album: BlueHawaii.tracks[0].album,
    src: BlueHawaii.tracks[0].src,
    img: BlueHawaii.albumArt ? BlueHawaii.albumArt : BlueHawaii.altPhoto
}

function displayProgress() {
    
}

function back() {}

function playTrack(){
    track.play()
}

function pauseTrack(){}
function skip(){}


document.addEventListener('DOMContentLoaded', () => {
    track.name = album.tracks[0].file;
    track.artist = album.tracks[0].artist;
    track.album = album.artist
    track.img = 

    playButton.addEventListener('click', playTrack);
    pauseButton.addEventListener('click', pauseTrack);
    rewindButton.addEventListener('click', back);
    fastforwardButton.addEventListener('click', skip);
    progressBar.addEventListener('click', displayProgress);
    theDot.addEventListener('mousedown', () => {
        track.pause();
    });
    theDot.addEventListener('mouseup', () => {
        track.play();
    });
})