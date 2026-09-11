# MagicMovieStream

A movie review and discovery application built with **Go, Gin, MongoDB, and React**. Users browse a movie catalog, choose favorite genres, read administrator reviews, and receive recommendations based on their preferences and stored movie rankings.

The Go backend also integrates OpenAI through LangChainGo to classify administrator reviews into configured ranking categories. The repository includes a YouTube playback view; its core functionality is movie reviews and recommendations, with no video hosting or transcoding backend.

## Features

- Public movie catalog and genre listing.
- Registration with favorite-genre selection and bcrypt password hashing.
- JWT access and refresh tokens delivered through HTTP-only cookies.
- Authenticated movie details and recommendations filtered by favorite genres, then sorted by ascending ranking value.
- Administrator review updates with a server-side `ADMIN` role check.
- OpenAI-assisted review classification using ranking labels stored in MongoDB.
- React pages for registration, login, reviews, recommendations, and YouTube playback.
- An Axios response interceptor that attempts token refresh and retries failed authenticated requests.

## Technology

| Layer | Technologies |
| --- | --- |
| Backend | Go, Gin, MongoDB Go driver v2, go-playground/validator |
| Authentication | golang-jwt/jwt v5, bcrypt, cookie-based authentication |
| Review classification | LangChainGo, OpenAI |
| Frontend | React 19, Vite 7, React Router, Axios |
| UI and media | Bootstrap, React Bootstrap, ReactPlayer |

## How it works

1. The React client calls the Gin API for movies, genres, and account actions.
2. Gin handlers read and write the `users`, `movies`, `genres`, and `rankings` collections in MongoDB.
3. Login issues access and refresh cookies. Authentication middleware validates the access cookie for protected routes.
4. An administrator submits a review. The backend asks OpenAI to classify it using configured ranking labels and stores the review and resulting ranking on the movie.
5. Recommendations match a user's favorite genres and order the results by `ranking.ranking_value`. This is genre filtering and ranking, rather than a trained recommendation model.

## Project structure

```text
MagicMovieStream/
├── client/magic-stream-client/
│   ├── src/
│   │   ├── api/             # Axios configuration
│   │   ├── components/      # Catalog, auth, review, recommendation and media views
│   │   ├── context/         # Authentication state
│   │   └── hooks/           # Auth access and refresh/retry handling
│   └── package.json
└── server/MagicStreamServer/
    ├── controllers/         # Account, catalog, reviews and recommendations
    ├── database/            # MongoDB connection and collection helpers
    ├── middleware/          # JWT cookie authentication
    ├── models/              # User, movie, genre and ranking models
    ├── routes/              # Public and authenticated routes
    ├── utils/               # JWT generation, validation and persistence
    ├── main.go
    └── go.mod
```

## Local setup

### Prerequisites

- Go compatible with the module's `go 1.24.4` directive and its dependencies; automatic toolchain download may be needed.
- Node.js and npm compatible with Vite 7.
- A reachable MongoDB instance.
- An OpenAI API key for the review-classification feature.

Clone the repository:

```sh
git clone https://github.com/Tarun222999/MagicMovieStream.git
cd MagicMovieStream
```

### Backend configuration

The server reads the following environment variables. Keep real credentials outside version control.

| Variable | Purpose |
| --- | --- |
| `MONGODB_URI` | Required MongoDB connection string. |
| `DATABASE_NAME` | Required MongoDB database name. |
| `SECRET_KEY` | Access-token signing secret; set before starting the Go process. |
| `SECRET_REFRESH_KEY` | Refresh-token signing secret; set before starting the Go process. |
| `ALLOWED_ORIGINS` | Comma-separated browser origins for CORS; defaults to `http://localhost:5173`. |
| `OPEN_API_KEY` | OpenAI API key used for review classification. This is the exact name expected by the code. |
| `BASE_PROMPT_TEMPLATE` | Classification instructions containing `{rankings}`, which is replaced with available labels. Request exactly one matching label; the review text is appended to the template. |
| `RECOMMENDED_MOVIE_LIMIT` | Positive integer recommendation limit; defaults to 5 when omitted. |

Most settings can be placed in `server/MagicStreamServer/.env`, which is loaded relative to the server's working directory. **Set both signing secrets in the process environment before startup**: the current token utility reads them during package initialization, before `main` loads `.env`.

Start the API from the server directory:

```sh
cd server/MagicStreamServer
go mod download
go run .
```

The API listens on port **8080**, currently set in `main.go`. `GET /hello` returns a simple greeting once the server has started successfully.

### Database data

No seed script or sample dataset is included. Populate these collections in the configured database before exploring the full UI:

| Collection | Expected data |
| --- | --- |
| `genres` | Documents with `genre_id` and `genre_name`, used during registration. |
| `rankings` | Documents with `ranking_value` and `ranking_name`, used for classification. A value of 999 is excluded from the labels sent to OpenAI. |
| `movies` | Movie metadata including `imdb_id`, `title`, `poster_path`, `youtube_id`, a `genre` array, `admin_review`, and a `ranking` object. |
| `users` | Created through registration; contains account data and favorite genres. |

See the [movie models](server/MagicStreamServer/models/movie_model.go) and [user models](server/MagicStreamServer/models/user_model.go) for field names and validation rules. An authenticated `POST /addmovie` endpoint is also available. There is no dedicated administrator-provisioning script.

### Frontend configuration

Create `client/magic-stream-client/.env.local` and configure `VITE_API_BASE_URL` to point to your API origin. Restart Vite after changing it. This variable is browser-visible and must not contain credentials.

In a second terminal, from the repository root:

```sh
cd client/magic-stream-client
npm ci
npm run dev
```

Open the local URL printed by Vite, normally `http://localhost:5173`.

### Browser authentication notes

Login cookies are configured with `Secure`, `HttpOnly`, and `SameSite=None`. Use HTTPS for deployed environments; plain HTTP development outside localhost can prevent the browser from storing or sending these cookies. Ensure the frontend origin is included in `ALLOWED_ORIGINS`.

The refresh handler currently hardcodes the cookie domain to `localhost` and uses different cookie options from login. Deployment to another hostname requires reviewing those settings. No deployment configuration is included in this repository.

## API routes

Authentication uses the `access_token` cookie, not an Authorization bearer header.

| Method | Route | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/hello` | Public | Greeting endpoint |
| GET | `/movies` | Public | List movies |
| GET | `/genres` | Public | List genres |
| POST | `/register` | Public | Register an account |
| POST | `/login` | Public | Authenticate and set token cookies |
| POST | `/logout` | Public route | Clear cookies and stored tokens for the supplied `user_id` |
| POST | `/refresh` | Refresh cookie | Issue replacement tokens |
| GET | `/movie/:imdb_id` | Authenticated | Fetch a movie |
| POST | `/addmovie` | Authenticated | Add a movie |
| GET | `/recommendedmovies` | Authenticated | Get genre-based recommendations |
| PATCH | `/updatereview/:imdb_id` | Authenticated, `ADMIN` | Update `admin_review` and classify its ranking |

## Development checks

From `client/magic-stream-client`:

```sh
npm run lint
npm run build
npm run preview
```

`preview` serves the built frontend locally; it does not start the Go API.

From `server/MagicStreamServer`:

```sh
go build ./...
go vet ./...
go test ./...
```

These are available development commands, not a claim that checks currently pass. No Go test files or frontend test script are included at present.

## Current implementation notes

- Review classification currently selects `gpt-3.5-turbo` in code and expects an exact ranking-label response. Model access and output should be verified with the configured OpenAI account.
- Registration currently accepts a role from the request; administrator provisioning is not restricted server-side. The review endpoint checks that role, while movie creation only requires authentication.
- The current database connection helper logs the connection URI. Remove credential-bearing logging before using shared or production logs.
- The media view uses ReactPlayer's `url` prop while the dependency is on major version 3; verify playback compatibility before presenting it as a working feature.

These notes describe the checked-in implementation; this README does not introduce application-code changes.
