import {useEffect} from "react";
import intro from "../../assets/img/intro.png";


const HomePage = () => {


    useEffect(() => {
        document.title = "CF8 Project";
    }, []);

    return (
        <div className="flex justify-center items-start w-full">
            <img
                src={intro}
                alt="Description"
                className="max-w-full max-h-[80vh] object-contain"
            />
        </div>
    )
}
export default HomePage;