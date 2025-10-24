
import {useEffect} from "react";

const HomePage = () => {


    useEffect(()=> {
        document.title = "CF8 Project";
    }, []);

    return (
        <>

            test Home Page
        </>
    )
}
export default HomePage;