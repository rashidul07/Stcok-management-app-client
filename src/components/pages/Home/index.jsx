import React from "react";
import { FaPhone } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const Home = () => {
    return (
        <div className="flex flex-col items-center w-100">
            <div className="w-full md:w-2/3 lg:w-2/3 flex flex-col items-center justify-center shadow-lg rounded-lg p-8">
                <p className="text-lg text-justify mb-4">
                    Rafi Medicine Center is a trusted pharmacy store located at 668 East
                    Dholairpar, Donia Road, Kadamtoli, Dhaka. We offer a wide range of
                    high-quality medicines and health products to our valued customers.
                </p>
                <p className="text-lg text-justify md:text-left mb-4">
                    Our founder, Razu Ahmed, established the store in 2012 with the goal
                    of providing top-notch products and exceptional customer service. He has {new Date().getFullYear() - 2000} years of experience working in medicine stores, making him a highly knowledgeable and experienced professional in the field.
                </p>
                <p className="text-lg text-justify mb-4">
                    At Rafi Medicine Center, we take pride in our vast collection of
                    products. We carry a wide variety of prescription and over-the-counter
                    medicines, as well as other health and wellness products. Our store is
                    open from 9:00 am to 2:30 pm and 4:30 pm to 12:00 am every day to
                    ensure that our customers can access the products they need at their
                    convenience.
                </p>
                <p className="text-lg text-justify mb-4">
                    We are pleased to offer our customers access to the expertise of Dr.
                    Khalilur Rahman, a professional doctor and medicine specialist who
                    provides treatment to patients. Dr. Rahman is a highly qualified and
                    experienced medical professional who can provide valuable guidance
                    and advice to our customers. While he is not a member of our staff, we
                    are proud to have him associated with our store.
                </p>
                <div className="flex flex-col items-center justify-center">
                    <div className="flex items-center mb-4">
                        <FaPhone className="mr-2" />
                        <a href="tel:01923002686" className="text-lg">
                            01923002686
                        </a>
                    </div>
                    <div className="flex items-center">
                        <MdEmail className="mr-2" />
                        <a href="mailto:rashidul.karim7@gmail.com" className="text-lg">
                            rashidul.karim7@gmail.com
                        </a>
                    </div>
                </div>
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d913.3145641873365!2d90.43785918802135!3d23.702469827010123!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b9c582a4ead5%3A0xe651070381977c11!2z4Kaw4Ka-4Kar4Ka_IOCmruCnh-CmoeCmv-CmuOCmv-CmqCDgprjgp4fgpqjgp43gpp_gpr7gprA!5e0!3m2!1sbn!2sbd!4v1678719409649!5m2!1sbn!2sbd"
                    className="w-full h-96 mt-8"
                    allowFullScreen=""
                    loading="lazy"
                    title="Rafi Medicine Center Location"
                ></iframe>
            </div>
        </div>

    );
};

export default Home;