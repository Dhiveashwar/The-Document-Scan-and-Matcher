const db = require("../Config/db");

const getAdminAnalytics = (req, res) => {
    //For gettng the total scans,username,credits for admin use
    db.all(
        `SELECT users.id, users.username, COUNT(documents.id) AS total_scans, users.credits 
         FROM users 
         LEFT JOIN documents ON users.id = documents.user_id 
         WHERE users.role != 'admin'  -- Exclude admin user
         GROUP BY users.id 
         ORDER BY total_scans DESC`,
        (err, users) => {
            if (err) {
                console.error("Error fetching analytics:", err);
                return res.status(500).json({ message: "Error fetching analytics" });
            }

            db.all(
                `SELECT content, COUNT(*) as count FROM documents GROUP BY content ORDER BY count DESC LIMIT 5`,
                (err, topics) => {
                    if (err) {
                        console.error("Error fetching document topics:", err);
                        return res.status(500).json({ message: "Error fetching document topics" });
                    }

                    res.json({
                        totalUsers: users.length,
                        userStats: users,
                        topTopics: topics,
                    });
                }
            );
        }
    );
};

module.exports = { getAdminAnalytics };
