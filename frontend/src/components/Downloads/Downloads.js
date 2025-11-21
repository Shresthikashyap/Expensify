import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from 'axios';
import classes from './Downloads.module.css'
import Card from "../UI/Card";
import Premium from "../Premium/Premium";
import { DownloadIcon } from "lucide-react";

const Downloads = () => {
    const [downloads, setDownloads] = useState([]);
    const token = useSelector(state => state.auth.token);
    const isPremium = useSelector(state => state.premium.isPremium);

    useEffect(() => {
        const getDownloads = async () => {
            try {
                const response = await axios.get(`https://expensify-j424.onrender.com/downloadedFiles/all`, {
                    headers: {
                        'Authorization': token,
                        'Content-Type': 'application/json'
                    }
                });
                console.log('Downloads fetched:', response);
                setDownloads(response.data);
            } catch (error) {
                console.error("Error fetching downloads:", error);
            }
        };

        if (isPremium) {
            getDownloads();
        }
    }, [token, isPremium]);

    const extractDate = (url) => {
        try {
            // Match pattern like Mon_Oct_20_2025_15_13_09
            const match = url.match(/(\w{3})_(\w{3})_(\d{2})_(\d{4})_(\d{2})_(\d{2})_(\d{2})/);
            if (match) {
                const [_, day, month, date, year, hour, minute] = match;
                return `${month} ${date}, ${year} at ${hour}:${minute}`;
            }
        } catch {
            return '';
        }
        return '';
    };

    const handleDownloadClick = (url) => {
        window.open(url, '_blank');
    };

    const truncateUrl = (url, maxLength = 60) => {
        if (url.length <= maxLength) return url;
        return url.substring(0, maxLength) + '...';
    };

    return (
        <Card>
            <section className={classes.downloads}>
                <div className={classes.header}>
                    <h1>Downloads</h1>
                </div>

                {isPremium && downloads.length > 0 && (
                    <ul>
                        {downloads.map((download, index) => (
                            <li key={index}>
                                <div className={classes.downloadItem}>
                                    <span className={classes.fileIcon}>📄</span>
                                    
                                    <div className={classes.fileInfo}>
                                        <div className={classes.fileUrl} title={download}>
                                            {truncateUrl(download)}
                                        </div>
                                        {extractDate(download) && (
                                            <div className={classes.fileDate}>
                                                Downloaded: {extractDate(download)}
                                            </div>
                                        )}
                                    </div>

                                    <button 
                                        // className={classes.downloadButton}
                                        onClick={() => handleDownloadClick(download)}
                                    >
                                        <span><DownloadIcon/></span> 
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}

                {isPremium && downloads.length === 0 && (
                    <div className={classes.emptyState}>
                        <div className={classes.emptyIcon}>📂</div>
                        <h2>No Downloads Yet</h2>
                        <p>Your downloaded expense reports will appear here. Start by downloading your first report from the Expenses page!</p>
                    </div>
                )}

                {!isPremium && <Premium />}
            </section>
        </Card>
    );
}

export default Downloads;