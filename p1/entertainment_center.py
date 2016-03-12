import fresh_tomatoes
import media

fresh_tomatoes.open_movies_page([
    media.Movie('The Shawshank Redemption',
        'https://upload.wikimedia.org/wikipedia/en/8/81/ShawshankRedemptionMoviePoster.jpg',  # NOQA
        'https://www.youtube.com/watch?v=6hB3S9bIaco',
        'Frank Darabont'),
    media.Movie('The Godfather',
        'https://upload.wikimedia.org/wikipedia/en/1/1c/Godfather_ver1.jpg',
        'https://www.youtube.com/watch?v=sY1S34973zA',
        'Francis Ford Coppola'),
    media.Movie('The Dark Knight',
        'https://upload.wikimedia.org/wikipedia/en/archive/8/8a/20160129142054!Dark_Knight.jpg',  # NOQA
        'https://www.youtube.com/watch?v=EXeTwQWrcwY',
        'Christopher Nolan')
])
