# Movie List	:movie_camera:
***A simple web application for movie fanatic***

![GitHub Logo](/photo/index.png)

## Features	:briefcase:
- [x] listing movies from movie api
- [x] searching movies by title
- [x] add movies to your favorite list
- [x] manage your favorite list

### Searching :mag_right:
type the title of the movies in search bar
### Favorite List	:heart:
In index page, press the `+` button on the movie to keep it into favorite list.
You can checkout the favorite list in `favorite.html`
press `x` to remove it from favorite list

## API REFERENCE
 API | Method | Router | Note
-----|--------|--------|-----
Index | GET | /movies | 提供所有電影的清單，包含片名、分類、發行日、劇情大綱、海報。
Show | GET | /movies/:id | 提供單一部電影的片名、分類、發行日、劇情大綱、導演、主要角色及演員。