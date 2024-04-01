// media content
import { albums } from './albums.js';
import { artists } from './artists.js';
// media controlls
import playButtonIcon from '../images/play-button.png';
import pauseButtonIcon from '../images/pause-button.png';
import rewindButtonIcon from '../images/rewind-button.png';
import skipButtonIcon from '../images/skip-button.png';


import './style.css';
// 
// Current Track Info
let power = false;
let albumIdx = 0;
let timeElapsed = 0;
let audioElement; 
let album = albums[0];
let artist = albums[0].artist;
let current = album.tracks[albumIdx]

// Select Menus
const artistSelect = document.getElementById('artist-select');
const albumSelect = document.getElementById('album-select');
const trackSelect = document.getElementById('track-select');


// Populate Select Menus
albums.forEach( (album, i) => {
    let option = document.createElement('option');
    option.idx = i;
    option.text = album.name;
    albumSelect.appendChild(option);
})

album.tracks.forEach((track, i) => {
    let option = document.createElement('option');
    option.idx = i;
    option.value = track.title;
    option.text = `${option.idx + 1} - ${track.title}` ;
    trackSelect.appendChild(option);
})

artists.forEach((artist, i) => {
    let option = document.createElement('option');
    option.text = artist;
    option.idx = i;
    artistSelect.appendChild(option);
})

// The selected option, which will be a string, will be used to select the correct object in the album array.
// THe album object will be assgned as the value of album
artistSelect.addEventListener('change', () => {
    artist = artistSelect.value;
    
    albumSelect.innerHTML = ''; // Clear out old options
    albumSelect = albums.forEach((album, i) => { // Add new options
        if (album.artist === artist) {
            const option = document.createElement('option');
            option.text = album.name;
            albumSelect.appendChild(option);
        }
    })
})

albumSelect.addEventListener('change', () => {
    album = albums.find((a, i) => a.name === albumSelect.value);
    console.log(album);
    albumSelect.value = album.name;
    artist = album.name;
    // Make tracklist responsive

    current = album.tracks.find((track, i) => track.title === trackName);
    displayTrack(current);
})

trackSelect.addEventListener('change', () => {

    console.log('trackSelect.value:', trackSelect.value)
    let trackName = trackSelect.value;

    if (playButton.style.display === 'none') {
        
        audioElement.pause();
        current = album.tracks.name;

        displayTrack(current);
        pauseTrack(audioElement);
    } else {
        
        current = album.tracks.find((track, i) => track.title === trackName);
        displayTrack(current);
    }
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
    albumCoverD.src = album.albumArt ? album.albumArt : album.altPhoto;
    trackNameD.innerHTML = track.title;
    trackArtistD.innerHTML = track.artist;
    trackAlbumD.innerHTML = track.album;
}


function playTrack(track){
    if (!power) power = 'on';
    displayTrack(track);
    
    if (!albumSelect.value){ 
        console.log('No track found');
    }
    
    playButton.style.display = 'none';
    pauseButton.style.display = 'block';
    
    if (timeElapsed === 0) {
        audioElement = new Audio(track.file);
    }
    
    audioElement.play().catch(error => console.error("Audio play failed:", error));    
    console.log('Playing track:', current)
    
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
            playTrack(current.tracks[albumIdx]);
        }

    }, 1000);
}

function pauseTrack(audioElement){
    console.log('Pausing track:', current)
    playButton.style.display = 'block';
    pauseButton.style.display = 'none';

    audioElement.pause();
    
    clearInterval(intervalID);
}

function back() {
    
    if (playButton.style.display === 'none') {
        if (timeElapsed > 5) {
            timeElapsed = 0;

            console.log('rewinding track: ', current)

            audioElement.pause();
            
            playTrack(current);
    
        } else {
            console.log('back 1 track to: ', album.tracks[albumIdx - 1]);
            
            if (albumIdx > 1) albumIdx--;
            audioElement.pause();
            current = album.tracks[albumIdx]
            audioElement = new Audio(current.file)

            playTrack(current);
        }
    } else {
        console.log('back 1 track to: ', album.tracks[albumIdx - 1]);

        if (albumIdx > 1) albumIdx--;
        current = album.tracks[albumIdx];
        audioElement = new Audio(current.file);
    }
}

function skip(){
    if (playButton.style.display === 'none') {
        console.log('skipped track: ', current);
        
        audioElement.pause();
        albumIdx === album.tracks.length - 1 ? albumIdx = 0 : albumIdx++;
        current = album.tracks[albumIdx]
        audioElement = new Audio(current.file);

        playTrack(current);
    } else {
        console.log('skipped track: ', current)
        albumIdx === album.tracks.length - 1 ? albumIdx = 0 : albumIdx++;
        current = album.tracks[albumIdx];
        audioElement = new Audio(current.file);

        displayTrack(current)
    }
}

document.addEventListener('DOMContentLoaded', () => {
    playButton.addEventListener('click', ()=>playTrack(current));
    pauseButton.addEventListener('click', ()=>pauseTrack(audioElement));
    rewindButton.addEventListener('click', back);
    skipButton.addEventListener('click', skip);
    displayTrack(current);
    // theDot.addEventListener('click', ()=>{}); // TODO: updateTimeElapsed()
    // theDot.addEventListener('mousedown', () => {
    //     track.pause();
    // });
    // theDot.addEventListener('mouseup', () => {
    //     track.play();
    // });
})