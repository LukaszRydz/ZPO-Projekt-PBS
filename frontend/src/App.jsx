import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"


import { Navbar } from "./_navbar/Navbar";
import { Notes } from "./_notes/Notes";

import "./App.scss";
import languages from "../public/translations/languages.json";


import { getIdToken, getLang, getLocalId } from "./api/api_App";
import { Habits } from "./_habits/Habits";
import { Settings } from "./__settings/Settings";
import { Activities } from "./_activities/Activities";

const queryClient = new QueryClient();


export const App = () => {
    const [page, setPage] = useState("habits");
    const [lang, setLang] = useState(getLang());
    const langPack = lang === "pl" ? languages["pl-PL"] : languages["en-US"];


    // Check uid in session storage
    getLocalId()
    getIdToken()

    const handlePageChange = (page) => {
        setPage(page);
    };

    return (
        <QueryClientProvider client={queryClient}>
            <div className="app">
                <Navbar handlePageChange={handlePageChange} page={page}/>
                <div className="pages">
                    <>
                        {page === "notes" && <Notes langPack={langPack} />}
                        {page === "habits" && <Habits langPack={langPack}/>}
                        {page === "activities" && <Activities langPack={langPack}/>}
                        {page === "settings" && <Settings langPack={langPack} setLang={setLang}/>}
                    </>
                </div>
            </div>
        </QueryClientProvider>
    );
};
