import { useSelector } from "react-redux";
import axios from "axios";
import { useEffect, useState } from "react";
import classes from "./Leaderboard.module.css";
import { useNavigate } from "react-router-dom";
import Card from "../UI/Card";
import Premium from "../Premium/Premium";

const Leaderboard = () => {
    const isPremium = useSelector(state => state.premium.isPremium);
    const navigate = useNavigate();
    const [leaderBoard, setLeaderBoard] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(9);
    const [totalPages, setTotalPages] = useState(1);
    const token = useSelector(state => state.auth.token);

    useEffect(() => {
        const getLeaderBoard = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:3001/premium/leadership?page=${page}&pageSize=${limit}`,
                    {
                        headers: {
                            'Authorization': token,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                console.log(response.data);
                setLeaderBoard(response.data.leaderboardofuser);
                setTotalPages(Math.ceil(response.data.totalUser));
            } catch (error) {
                console.error("Error fetching leaderboard:", error);
            }
        };

        getLeaderBoard();
    }, [isPremium, navigate, page, limit, token]);

    const handleChangeLimit = (e) => {
        if (e.target.value > 0 && (page * e.target.value) <= totalPages) {
            setLimit(e.target.value);
        }
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    return (
        <Card>
            <section className={classes.leaderboard}>
                <div className={classes.header}>
                    <h1>Leaderboard</h1>
                </div>

                {isPremium ? (
                    <div className={classes.content}>
                        <div className={classes.controls}>
                            <label htmlFor="itemsPerPage">Items per page:</label>
                            <input
                                id="itemsPerPage"
                                type="number"
                                value={limit}
                                onChange={handleChangeLimit}
                                min="1"
                                max="20"
                            />
                        </div>

                        <div className={classes.tableContainer}>
                            <table className={classes.table}>
                                <thead>
                                    <tr>
                                        <th>Rank</th>
                                        <th>Email</th>
                                        <th>Total Expense</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leaderBoard.map((user, index) => (
                                        <tr key={index}>
                                            <td className={classes.rank}>
                                                {(page - 1) * limit + index + 1}
                                            </td>
                                            <td>{user.email}</td>
                                            <td className={classes.expense}>
                                                ₹{user.totalExpense.toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className={classes.pagination}>
                            <button
                                disabled={page === 1}
                                onClick={() => handlePageChange(page - 1)}
                                className={classes.paginationBtn}
                            >
                                Previous
                            </button>
                            <span className={classes.pageInfo}>
                                Page {page} of {Math.ceil(totalPages / limit)}
                            </span>
                            <button
                                disabled={((page * limit) >= totalPages)}
                                onClick={() => handlePageChange(page + 1)}
                                className={classes.paginationBtn}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                ) : (
                    <Premium />
                )}
            </section>
        </Card>
    );
};

export default Leaderboard;