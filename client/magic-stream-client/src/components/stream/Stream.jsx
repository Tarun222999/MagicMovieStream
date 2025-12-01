import { useParams } from 'react-router-dom';
import ReactPlayer from 'react-player';
import './StreamMovie.css';

const StreamMovie = () => {
    let params = useParams();
    let key = params.yt_id;
    console.log(key, "key")

    return (
        <div className="react-player-container">
            {(key != null) ? (
                <ReactPlayer
                    controls={true}
                    playing={false}
                    url={`https://www.youtube.com/watch?v=${key}`}
                    width='100%'
                    height='100%'
                    onError={(error) => console.error('Player error:', error)}
                />
            ) : null}
        </div>
    )
}

export default StreamMovie