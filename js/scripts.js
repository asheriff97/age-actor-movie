document.addEventListener('DOMContentLoaded', function() {
    // Get references to the form and results container elements
    const form = document.getElementById('searchForm');
    const results = document.getElementById('results');
    
    // Your TMDb API key
    const apiKey = '749a1c6e8e89d81d30ec57b93025e397';

    // Add an event listener to the form for the submit event
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission
        const movieTitle = document.getElementById('movieTitle').value; // Get the movie title from the input field
        searchMovie(movieTitle); // Call the function to search for the movie
    });

    // Function to search for a movie by title
    async function searchMovie(title) {
        results.innerHTML = ''; // Clear previous results
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${title}`);
        const data = await response.json();
        if (data.results.length > 0) {
            const movie = data.results[0]; // Get the first search result
            const movieReleaseYear = new Date(movie.release_date).getFullYear(); // Extract the release year
            getCast(movie.id, movieReleaseYear); // Call the function to get the cast details
        } else {
            results.innerHTML = '<p>No results found</p>'; // Display a message if no results are found
        }
    }

    // Function to get the cast of a movie
    async function getCast(movieId, releaseYear) {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}`);
        const data = await response.json();
        data.cast.forEach(async (actor) => {
            const actorDetails = await getActorDetails(actor.id); // Fetch actor details
            const actorAge = calculateAge(new Date(actorDetails.birthday), releaseYear); // Calculate the actor's age at the time of the movie release
            displayActor(actor.name, actorAge); // Display the actor's name and age
        });
    }

    // Function to get details of an actor
    async function getActorDetails(actorId) {
        const response = await fetch(`https://api.themoviedb.org/3/person/${actorId}?api_key=${apiKey}`);
        return await response.json(); // Return the actor details
    }

    // Function to calculate age given a birth date and a reference year
    function calculateAge(birthDate, year) {
        return year - birthDate.getFullYear(); // Calculate the difference in years
    }

    // Function to display an actor's name and age
    function displayActor(name, age) {
        const actorDiv = document.createElement('div'); // Create a new div element
        actorDiv.classList.add('actor'); // Add the 'actor' class to the div
        actorDiv.innerHTML = `<h3>${name}</h3><p>Age: ${age}</p>`; // Set the inner HTML of the div
        results.appendChild(actorDiv); // Append the div to the results container
    }
});
