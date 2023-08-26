# API Documentation

## Endpoints

### ALL `/directlink`

Returns a direct link to a resource. Requires a `videoId` either as a query parameter or in the request body, where `videoId` is the id of the movie or episode. If the `videoId` is not provided, a 400 status code with an error message "videoId is required" is returned. If the resource is not found, a 404 status code is returned.

Example: [`https://faselhdapi.onrender.com/directlink?id=3890f76cbf7bb5e15abc52f93a2619b0`](https://faselhdapi.onrender.com/directlink?id=3890f76cbf7bb5e15abc52f93a2619b0)

### ALL `/search`

Performs a search. Requires a `query` either as a query parameter or in the request body. Optional parameters include `page` and `pageSize`. If the `query` is not provided, a 400 status code with an error message "query is required" is returned. If the search does not yield any results, a 404 status code is returned.

Example: [`https://faselhdapi.onrender.com/search?query=avengers&page=1&pageSize=10`](https://faselhdapi.onrender.com/search?query=avengers&page=1&pageSize=10)

### GET `/movie/:id`

Returns information about a movie. Requires an `id` as a path parameter. If the `id` is not provided, a 400 status code with an error message "id is required" is returned. If the movie is not found or the `id` does not correspond to a movie, a 404 status code is returned.

Example: [`https://faselhdapi.onrender.com/movie/222139`](https://faselhdapi.onrender.com/movie/222139)

### GET `/tv/:id`

Returns information about a TV series. Requires an `id` as a path parameter. If the `id` is not provided, a 400 status code with an error message "id is required" is returned. If the TV series is not found or the `id` does not correspond to a TV series, a 404 status code is returned.

Example: [`https://faselhdapi.onrender.com/tv/120078`](https://faselhdapi.onrender.com/tv/120078)

### GET `/tv/:id/episode/:episodeNumber`

Returns information about a specific episode of a TV series. Requires an `id` and `episodeNumber` as path parameters. If the `id` or `episodeNumber` is not provided, a 400 status code with an error message "id and episodeNumber are required" is returned. If the episode is not found, a 404 status code is returned.

Example: [`https://faselhdapi.onrender.com/tv/120078/episode/1`](https://faselhdapi.onrender.com/tv/120078/episode/1)

### GET `/discover/:category?`

Returns a list of items from a specific category. The `category` is an optional path parameter. If not provided, defaults to "movies". Optional query parameters include `page` and `pageSize`. If the category is not found, a 404 status code is returned.

Example: [`https://faselhdapi.onrender.com/discover/movies?page=1&pageSize=10`](https://faselhdapi.onrender.com/discover/movies?page=1&pageSize=10)

### GET `/allCategories`

Returns a list of all categories. If the categories are not found, a 404 status code is returned.

Example: [`https://faselhdapi.onrender.com/allCategories`](https://faselhdapi.onrender.com/allCategories)

### GET `/categories/:id`

Returns information about a specific category. Requires an `id` as a path parameter. If the `id` is not provided, a 400 status code with an error message "id is required" is returned. If the category is not found, a 404 status code is returned.

Example: [`https://faselhdapi.onrender.com/categories/1`](https://faselhdapi.onrender.com/categories/1)
