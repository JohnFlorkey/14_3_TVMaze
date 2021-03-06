/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */

const showSearchURL = 'http://api.tvmaze.com/search/shows';
const missingImage = 'https://tinyurl.com/tv-missing';
const episodesSearchURL = 'http://api.tvmaze.com/shows/#showID#/episodes';



async function searchShows(query) {
  // TODO: Make an ajax request to the searchShows api.  Remove
  // hard coded data.

  const response = await axios.get(showSearchURL, {params: {'q': query}});
  const results = response.data.map((x) => (
    {
      'id': x.show.id, 
      'name': x.show.name, 
      'summary': x.show.summary, 
      'image': x.show.image ? x.show.image.original : missingImage
    }
  ));
  
  return results;
}



/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();
  $showsList.on('click', async function handleEpisodes(e) {
    e.preventDefault();
  
    const episodes = await getEpisodes(e.target.parentElement.parentElement.dataset.showId);
  
    populateEpisodes(episodes);
  });

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <img class="card-img-top" src=${show.image}>
             <p class="card-text">${show.summary}</p>
             <button class="btn btn-primary">Episodes</button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($item);
  }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  // TODO: get episodes from tvmaze
  //       you can get this by making GET request to
  //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes

  const url = episodesSearchURL.replace('#showID#', id)
  const response = await axios.get(url, {'params': {'id': id}});

  // TODO: return array-of-episode-info, as described in docstring above
  const result = response.data.map(show => ({
    'id': show.id,
    'name': show.name,
    'season': show.season,
    'number': show.number
    })
  )
  return result;
}

function populateEpisodes(episodes) {
  const $episodesArea = $('#episodes-area');
  const $episodesList = $('#episodes-list');
  if ($episodesArea.is(':hidden')) {
    $episodesArea.toggle();
  }
  $episodesList.empty();
  episodes.forEach(episode => {
    $('<li>')
      .text(`${episode.name} (season ${episode.season}, number ${episode.number})`)
      .appendTo($episodesList)
  })
}