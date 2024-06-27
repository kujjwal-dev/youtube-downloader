import React from "react";
import { FaHouseUser, FaInfo} from "react-icons/fa";
import { IoMdContact } from "react-icons/io";
export const MenuItems = [
    {
        title: "Home",
        url: "/",
        cName: "nav-links",
        icon: <FaHouseUser />
    },
    {
        title: "About",
        url: "/about",
        cName: "nav-links",
        icon: <FaInfo />
    },
    {
        title: "Contact",
        url: "/contact",
        cName: "nav-links",
        icon: <IoMdContact />
    },
];
