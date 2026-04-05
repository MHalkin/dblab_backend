const { Sequelize } = require('sequelize');
const db = require('../config/db.config.js');

// Статистика 1: Аналіз результатів по журналах
const getMagazineStatistics = async (req, res) => {
    try {
        const query = `
            SELECT 
                m.magazine_Id,
                m.name AS magazine_name,
                m.publisher,
                m.city,
                COUNT(r.result_Id) AS publications_count,
                COALESCE(AVG(r.pages), 0) AS avg_pages,
                MAX(r.year) AS last_publication_year
            FROM magazine m
            LEFT JOIN result r ON m.magazine_Id = r.magazine_Id
            GROUP BY m.magazine_Id, m.name, m.publisher, m.city
            ORDER BY publications_count DESC, m.name ASC;
        `;

        const [results] = await db.sequelize.query(query);
        
        return res.status(200).json(results);
    } catch (error) {
        console.error('Error in getMagazineStatistics:', error);
        return res.status(500).json({ message: error.message });
    }
};

// Статистика 2: Аналіз результатів за період (з датами)
const getPeriodStatistics = async (req, res) => {
    try {
        const { startYear, endYear } = req.body;

        if (!startYear || !endYear) {
            return res.status(400).json({ 
                message: 'Потрібно вказати початковий та кінцевий рік' 
            });
        }

        const query = `
            SELECT 
                r.result_Id,
                r.name,
                r.year,
                r.pages,
                r.full_name,
                rt.name AS result_type_name,
                COALESCE(m.name, conf.name, comp.name) AS publication_source,
                CASE 
                    WHEN r.magazine_Id IS NOT NULL THEN 'Журнал'
                    WHEN r.conference_Id IS NOT NULL THEN 'Конференція'
                    WHEN r.competition_Id IS NOT NULL THEN 'Конкурс'
                    ELSE 'Не вказано'
                END AS publication_type
            FROM result r
            LEFT JOIN result_type rt ON r.result_type_Id = rt.result_type_Id
            LEFT JOIN magazine m ON r.magazine_Id = m.magazine_Id
            LEFT JOIN conference conf ON r.conference_Id = conf.conference_Id
            LEFT JOIN competition comp ON r.competition_Id = comp.competition_Id
            WHERE r.year BETWEEN :startYear AND :endYear
            ORDER BY r.year DESC, r.name ASC;
        `;

        const [results] = await db.sequelize.query(query, {
            replacements: { startYear: parseInt(startYear), endYear: parseInt(endYear) }
        });

        return res.status(200).json({
            data: results,
            period: {
                startYear: parseInt(startYear),
                endYear: parseInt(endYear)
            },
            totalCount: results.length,
            generatedAt: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error in getPeriodStatistics:', error);
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getMagazineStatistics,
    getPeriodStatistics
};

