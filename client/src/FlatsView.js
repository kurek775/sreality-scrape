import {useCallback, useState, useEffect} from "react";
import axios from "axios";


const FlatsView = () => {
    const [values, setValues] = useState([]);
    const [page, setPage] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const getAllFlats = useCallback(async () => {

        const data = await axios.get(`/api/flats/${page}`)

        setValues(data["data"]);
    }, [page]);

    const scrapeAllFlats = useCallback(async () => {

        const data = await axios.get("/api/scrape");

    }, []);


    useEffect(() => {

        scrapeAllFlats();
        getAllFlats();
    }, []);
    useEffect(() => {
        getAllFlats();

    }, [page]);
    return (<div className="content">
        <div>
            <h1>SREALITY PROJECT</h1>
            <h2>Momentálně se nacházíte na stránce číslo {page + 1}</h2>
        </div>
        <div className="pagination">
            {isLoading ? (<p>Loading...</p>) : (<>
                <button className="btn-prev"
                        disabled={page === 0}
                        onClick={() => setPage((prevState) => prevState - 1)}
                >&#8249;
                </button>

                <button className="btn-next"
                        disabled={page === 25}
                        onClick={() => setPage((prevState) => prevState + 1)}>
                    &#8250;
                </button>
            </>)}
        </div>
        <div className="container">
            {values.map(item => <div className="flat" key={item.id}>
                <div className="flat-info"><h3>{item.title}</h3>
                    <h4>{item.locality}</h4></div>
                <img src={item.image}/>

            </div>)}
        </div>


    </div>);
};

export default FlatsView;
