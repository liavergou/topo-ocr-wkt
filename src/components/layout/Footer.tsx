const Footer = () =>{
    const currentYear:number = new Date().getFullYear();
    return(

        <>
            <footer className="bg-gray-800 text-white">
                <div>
                    &copy;{currentYear} Vergou Enangelia. Developed as final project of Coding Factory 8
                </div>
            </footer>

        </>
    )
}

export default Footer;
