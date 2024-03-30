import { albums } from './albums.js';
import { artists } from './artists.js';

// Current Track Info
let albumIdx = 0;
let timeElapsed = 0;
let audioElement; 
let album = albums[0];
let artist = albums[0].artist;
let current = album.tracks[albumIdx]

// Select Menus
const albumSelect = document.getElementById('album-select');
const artistSelect = document.getElementById('artist-select');


// Populate Select Menus
albums.forEach( (album, i) => {
    let option = document.createElement('option');
    option.text = album.name;
    option.idx = i;
    albumSelect.appendChild(option);
    

})

artists.forEach((artist, i) => {
    let option = document.createElement('option');
    option.text = artist;
    option.idx = i;
    artistSelect.appendChild(option);
})

// The selected option, which will be a string, will be used to select the correct object in the album array.
// THe album object will be assgned as the value of album
albumSelect.addEventListener('change', () => {
    album = albums.find((a, i) => a.name === albumSelect.value);
    console.log(album);
    albumSelect.value = album.name;
    artist = album.name;
    artistSelect.value = album.artist;
    current = album.tracks[0];
})

artistSelect.addEventListener('change', () => {
    artist = artists.find((artist, i) => artist === artistSelect.value);
    artistSelect.value = artist;
})

// Media Info
const trackNameD = document.querySelector('.track');
const trackArtistD = document.querySelector('.artist');
const trackAlbumD = document.querySelector('.album');
const albumCoverD = document.getElementById('album-cover');

// Media Controller
const playButton = document.getElementById('play-button');
const pauseButton = document.getElementById('pause-button');
const rewindButton = document.getElementById('rwd-button');
const fastforwardButton = document.getElementById('ff-button');
const theBar = document.getElementById('the-bar');
const theDot = document.getElementById('the-dot');

// IntervalID used for play & pause buttons
let intervalID;

function displayTrack (track) {
    albumCoverD.src = album.albumArt ? album.albumArt : album.altPhoto;
    trackNameD.textContent = track.title;
    trackArtistD.textContent = track.artist;
    trackAlbumD.textContent = track.album;
}


function playTrack(track){

    console.log(track)

    if (!albumSelect.value){ 
        console.log('No track found');
    }

    playButton.style.display = 'none';
    pauseButton.style.display = 'block';
    displayTrack(track);
    audioElement = new Audio(track.src);
    audioElement.play().catch(error => console.error("Audio play failed:", error));    displayTrack(track);
    intervalID = setInterval(() => {
        timeElapsed++;
        let durationSplit = track.duration.split(':');
        let durationSeconds = durationSplit[0] * 60 + durationSplit[1];
        theDot.style.left = `${timeElapsed / durationSeconds * 100}%`;
        
        if (timeElapsed === durationSeconds) {
            timeElapsed = 0;
            albumIdx++;
            playTrack(album.tracks[albumIdx]);
        }

    }, 1000);
}

function pauseTrack(audioElement){
    playButton.style.display = 'block';
    pauseButton.style.display = 'none';
    audioElement.pause();
    clearInterval(intervalID)
}

function back() {
    if (timeElapsed > 5) {
        timeElapsed = 0;
        playTrack(album.tracks[albumIdx]);
    } else {
        albumIdx--;
        playTrack(album.tracks[albumIdx]);
    }
}

function skip(){
    albumIdx++;
    playTrack(album.tracks[albumIdx]);
}

document.addEventListener('DOMContentLoaded', () => {
    playButton.addEventListener('click', ()=>playTrack(current));
    pauseButton.addEventListener('click', ()=>pauseTrack(audioElement));
    rewindButton.addEventListener('click', back);
    fastforwardButton.addEventListener('click', skip);
    // theDot.addEventListener('click', ()=>{}); // TODO: updateTimeElapsed()
    // theDot.addEventListener('mousedown', () => {
    //     track.pause();
    // });
    // theDot.addEventListener('mouseup', () => {
    //     track.play();
    // });
})