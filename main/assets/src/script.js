// media content
import { albums } from './albums.js';
import { artists } from './artists.js';

// media controlls
import './style.css';

// Current Track Info
let power = false;
let albumIdx = 0;
let timeElapsed = 0;
let audioElement;

// Select Menus
const artistSelect = document.getElementById('artist-select');
const albumSelect = document.getElementById('album-select');
const trackSelect = document.getElementById('track-select');

let artist;
let album;
let track;

function fetchValues () {
    artist = artistSelect.value;
    if (albumSelect.value !== 'All Albums') {
        album = albums.find((a, i) => a.name === albumSelect.value);
        track = album.tracks.find((t, i) => t.title === trackSelect.value);
    } else {
        album = albums;
        track = album.forEach( a => {
            a.tracks.find((t, i) => t.title === trackSelect.value);
        })
    }
}

// Populate Select Menus
artists.forEach((artist) => {
    let option = document.createElement('option');
    option.text = artist;
    artistSelect.appendChild(option);
})

function refreshAlbums (artist) {
    albumSelect.innerHTML = '';

    if (artist === 'All Artists') {
        albums.forEach((album, i) => {
            let option = document.createElement('option');
            option.text = album.name;
            albumSelect.appendChild(option);
        })
    } else {
        albums.forEach((album, i) => {
            if (album.artist === artist) {
                let option = document.createElement('option');
                option.text = album.name;
                albumSelect.appendChild(option);
            }
        })
    }
}

function refreshTracks (album) {
    trackSelect.innerHTML = '';

    // Album selected
    if ( albumSelect === 'All Albums' ) { 
        albumSelect.options.forEach( albumOption => {
            albums.forEach( (album) => {
                if (album.name === albumOption.value) {
                    album.tracks.forEach((track, i) => {
                        let option = document.createElement('option');
                        option.idx = i;
                        option.value = track.title;
                        option.text = `${option.idx + 1} - ${track.title}` ;
                        trackSelect.appendChild(option);
                    })
                }
            })
        })
    } else {
        album.tracks.forEach((track, i) => {
            let option = document.createElement('option');
            option.idx = i;
            option.value = track.title;
            option.text = `${option.idx + 1} - ${track.title}`;
            trackSelect.appendChild(option);
        })
    }

}

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
    if (!track) return;

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
    console.log('Pausing track:', track)
    playButton.style.display = 'block';
    pauseButton.style.display = 'none';

    audioElement.pause();
    
    clearInterval(intervalID);
}

function back() {
    
    if (playButton.style.display === 'none') {
        if (timeElapsed > 5) {
            timeElapsed = 0;

            console.log('rewinding track: ', track)

            audioElement.pause();
            
            playTrack(track);
    
        } else {
            console.log('back 1 track to: ', album.tracks[albumIdx - 1]);
            
            if (albumIdx > 1) albumIdx--;
            audioElement.pause();
            track = album.tracks[albumIdx]
            audioElement = new Audio(current.file)

            playTrack(current);
        }
    } else {
        console.log('back 1 track to: ', album.tracks[albumIdx - 1]);

        if (albumIdx > 1) albumIdx--;
        track = album.tracks[albumIdx];
        audioElement = new Audio(current.file);
    }
}

function skip(){
    if (playButton.style.display === 'none') {
        console.log('skipped track: ', current);
        
        audioElement.pause();
        albumIdx === album.tracks.length - 1 ? albumIdx = 0 : albumIdx++;
        track = album.tracks[albumIdx]
        audioElement = new Audio(track.file);

        playTrack(track);
    } else {
        console.log('skipped track: ', current)
        albumIdx === album.tracks.length - 1 ? albumIdx = 0 : albumIdx++;
        current = album.tracks[albumIdx];
        audioElement = new Audio(track.file);

        displayTrack(track)
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Buttons
    playButton.addEventListener('click', playTrack);
    pauseButton.addEventListener('click', pauseTrack);
    rewindButton.addEventListener('click', back);
    skipButton.addEventListener('click', skip);
    // User Input
    fetchValues();
    // Display
    displayTrack(track);
})





// theDot.addEventListener('click', ()=>{}); // TODO: updateTimeElapsed()
// theDot.addEventListener('mousedown', () => {
//     track.pause();
// });
// theDot.addEventListener('mouseup', () => {
//     track.play();
// });