import { useEffect, useState } from "react"
import axiosClient from "../../api/axiosConfig"
import Movies from "../movies/Movies"

const Home = ({ updateMovieReview }) => {
    const [movies, setMovies] = useState([])
    const [loading, setLoading] = useState([])
    const [message, setMessage] = useState()


    useEffect(() => {
        const fetchMovies = async () => {
            setLoading(true);
            setMessage("")

            try {
                const response = await axiosClient.get('/movies')
                setMovies(response.data)
                if (response.data.length == 0) {
                    setMessage("There are currently no movies availabke")
                }
            } catch (error) {
                console.log(error, "error fetching movies")
            } finally {
                setLoading(false)
            }


        }
        fetchMovies()

    }, [])
    return (
        <>
            {
                loading ? (
                    <h2>Loading....</h2>
                ) : (
                    <Movies movies={movies} message={message} updateMovieReview={updateMovieReview} />
                )
            }

        </>
    )
}

export default Home