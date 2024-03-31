import { albums } from './albums.js';
import { artists } from './artists.js';

// Current Track Info
let albumIdx = 0;
let timeElapsed = 0;
let audioElement; 
let album = albums[0];
let artist = albums[0].artist;
console.log(artist);
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
const trackNameD = document.querySelector('#track-title');
const trackArtistD = document.querySelector('#track-artist');
const trackAlbumD = document.querySelector('#track-album');
const albumCoverD = document.getElementById('album-cover');

// Media Controller
const playButton = document.getElementById('play-button');
const pauseButton = document.getElementById('pause-button');
const rewindButton = document.getElementById('rwd-button');
const skipButton = document.getElementById('ff-button');
const theBar = document.getElementById('the-bar');
const theDot = document.getElementById('the-dot');

// IntervalID used for play & pause buttons
let intervalID;

function displayTrack (track) {
    console.log(track)
    albumCoverD.src = album.albumArt ? album.albumArt : album.altPhoto;
    trackNameD.innerHTML = track.title;
    trackArtistD.innerHTML = track.artist;
    trackAlbumD.innerHTML = track.album;
}


function playTrack(track){

    console.log('track: ' + track)
    displayTrack(track);

    if (!albumSelect.value){ 
        console.log('No track found');
    }

    playButton.style.display = 'none';
    pauseButton.style.display = 'block';

    if (timeElapsed === 0) {
        audioElement = new Audio(track.src);
    }

    audioElement.play().catch(error => console.error("Audio play failed:", error));    
    
    // Keep track of time elapsed
    intervalID = setInterval(() => {
        
        timeElapsed++;

        let durationSplit = track.duration.split(':');
        let durationSeconds = parseInt(durationSplit[0] * 60) + parseInt(durationSplit[1]);
        theDot.style.left = `${timeElapsed / durationSeconds * 100}%`;
        
        // End of Track behavior
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
    
    clearInterval(intervalID);
}

function back(audioElement) {
    if (timeElapsed > 5) {
        audioElement.pause();

        timeElapsed = 0;

        playTrack(current);

    } else {
        audioElement.pause();
        albumIdx--;
        current = album.tracks[albumIdx]
        playTrack(current);
    }
}

function skip(){
    audioElement.pause();
    albumIdx++;
    current = album.tracks[albumIdx]
    console.log(current);
    playTrack(current);
}

document.addEventListener('DOMContentLoaded', () => {
    playButton.addEventListener('click', ()=>playTrack(current));
    pauseButton.addEventListener('click', ()=>pauseTrack(audioElement));
    rewindButton.addEventListener('click', back);
    skipButton.addEventListener('click', skip);
    // theDot.addEventListener('click', ()=>{}); // TODO: updateTimeElapsed()
    // theDot.addEventListener('mousedown', () => {
    //     track.pause();
    // });
    // theDot.addEventListener('mouseup', () => {
    //     track.play();
    // });
})