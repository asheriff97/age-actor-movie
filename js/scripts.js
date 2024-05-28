import { config } from './config.js'; //Import API Key

document.addEventListener('DOMContentLoaded', function() {
    // Get references to the form and results container elements
    const form = document.getElementById('searchForm');
    const results = document.getElementById('results');
    // Your TMDb API key
    const apiKey = config.apiKey;

    // Add an event listener to the form for the submit event
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission
        const movieTitle = document.getElementById('movieTitle').value; // Get the movie title from the input field
        searchMovie(movieTitle); // Call the function to search for the movie
    });

    // Function to search for a movie by title
    async function searchMovie(title) {
        results.innerHTML = ''; // Clear previous results
        try {
            const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${title}`);
            const data = await response.json();
            if (data.results.length > 0) {
                const movie = data.results[0]; // Get the first search result
                const movieReleaseYear = new Date(movie.release_date).getFullYear(); // Extract the release year
                getCast(movie.id, movieReleaseYear); // Call the function to get the cast details
            } else {
                results.innerHTML = '<p>No results found</p>'; // Display a message if no results are found
            }
        } catch (error) {
            console.error("Error fetching movie data:", error);
            results.innerHTML = '<p>Error fetching movie data</p>';
        }
    }

    // Function to get the cast of a movie
    async function getCast(movieId, releaseYear) {
        try {
            const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}`);
            const data = await response.json();
            const cast = data.cast.slice(0, 10); // Display only the first 10 actors initially
            displayActors(cast, releaseYear);

            if (data.cast.length > 10) {
                const readMoreButton = document.createElement('button');
                readMoreButton.textContent = 'Read more';
                readMoreButton.addEventListener('click', function() {
                    const remainingCast = data.cast.slice(10, 20); // Load the next 10 actors
                    displayActors(remainingCast, releaseYear);
                    if (data.cast.length > 20) {
                        readMoreButton.textContent = 'Read more';
                    } else {
                        readMoreButton.style.display = 'none'; // Hide the button if no more actors to display
                    }
                });
                results.appendChild(readMoreButton);
            }
        } catch (error) {
            console.error('Error fetching cast data:', error);
            results.innerHTML = '<p>Error fetching cast data</p>';
        }
    }

    // Function to get details of an actor
    async function getActorDetails(actorId) {
        try {
        const response = await fetch(`https://api.themoviedb.org/3/person/${actorId}?api_key=${apiKey}`);
        return await response.json(); // Return the actor details
        } catch (error) {
            console.error('Error fetching actor details:', error);
        }
    }

    // Function to calculate age given a birth date and a reference year
    function calculateAge(birthDate, year) {
        return year - birthDate.getFullYear(); // Calculate the difference in years
    }

    function displayActors(cast, releaseYear) {
        cast.forEach(async (actor) => {
            const actorDetails = await getActorDetails(actor.id); // Fetch actor details
            let actorAge;
            if (actorDetails.birthday) {
                actorAge = calculateAge(new Date(actorDetails.birthday), releaseYear);
            } else {
                actorAge = 'Uknown';
            }
            displayActor(actor.name, actorAge); // Display the actor's name and age
        });
    }

    // Function to display an actor's name and age
    function displayActor(name, age) {
        const actorDiv = document.createElement('div'); // Create a new div element
        actorDiv.classList.add('actor'); // Add the 'actor' class to the div
        actorDiv.innerHTML = `<h3>${name}</h3><p>Age: ${age}</p>`; // Set the inner HTML of the div
        results.appendChild(actorDiv); // Append the div to the results container
    }
});
