import {useEffect} from "react";
import intro from "../../assets/img/intro.jpg";


const HomePage = () => {


    useEffect(() => {
        document.title = "CF8 Project";
    }, []);

    return (
        <>

            <img
                src={intro}
                alt="Description"
                className="w-auto max-w-full max-h-[70vh] mx-auto  rounded-lg shadow-2lg"
            />
        </>

    )
}
export default HomePage;