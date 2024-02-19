import React, {useEffect, useState} from "react";
import Tabs from "../TabComponent/Tabs";
import Header from "../Header/Header";
import Contents from "../TabComponent/Contents/Contents";

import '../../css/App.css';
import Login from "../Login/Login";

const Home = ({ loggedInUserId }) => {
    return (
        <div className="Home">
            {/*{isLoggedIn ? (*/}
                <>
                    <Header loggedInUserId={loggedInUserId} />
                    <Tabs />
                    <Contents />
                </>
        </div>
    );
}

export default Home;