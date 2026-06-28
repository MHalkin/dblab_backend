const { Lesson } = require('../models/Relations');
const { Event, Teacher, Material } = require("../models/Relations");

const parseDateTime = (dateStr, timeStr) => {
    const [day, month, year] = dateStr.split('.');
    return new Date(`${year}-${month}-${day}T${timeStr}:00`);
};

const parseDate = (dateStr) => {
    const [day, month, year] = dateStr.split('.');
    return new Date(`${year}-${month}-${day}`);
};

const create = async (req, res) => {
    try {
        const { name, lesson_date, lesson_time, link, repeat, end_date } = req.body;
        if (repeat > 0) {
            let lessons = []
            let currentDate = parseDateTime(lesson_date, lesson_time);
            const finalDate = parseDateTime(end_date, lesson_time);
            while (currentDate <= finalDate) {
                lessons.push({
                    name,
                    lesson_date: new Date(currentDate),
                    lesson_time,
                    link
                });
                currentDate.setDate(currentDate.getDate() + parseInt(repeat));
            }
            const createdLessons = await Lesson.bulkCreate(lessons);
            return res.status(201).json(createdLessons);
        } else {
            const parsedDate = parseDate(lesson_date);
            const lesson = await Lesson.create({
                name,
                lesson_date: parsedDate,
                lesson_time,
                link
            });
            return res.status(201).json(lesson);
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
};

const getAll = async (req, res) => {
    getFromDb(req, res);
};

const getFromDb = async (req, res) => {
    try {
        const lessons = await Lesson.findAll({});
        const formattedLessons = lessons.map(lesson => {
            const data = lesson.toJSON();
            return {
                ...data,
                lesson_date: formatDate(data.lesson_date)
            };
        });
        return res.status(200).json(formattedLessons);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getLessonsBetweenDates = async (req, res) => {
    try {
        const formatDate = (date) => {
            const d = new Date(date);
            const day = String(d.getDate()).padStart(2, "0");
            const month = String(d.getMonth() + 1).padStart(2, "0");
            const year = d.getFullYear();
            return `${day}.${month}.${year}`;
        };

        const formatTime = (timeStr) => {
            if (!timeStr) return null;
            return String(timeStr).slice(0, 5);
        };

        const parseDate = (dateStr) => {
            const [day, month, year] = dateStr.split(".");
            return new Date(`${year}-${month}-${day}`);
        };

        const { start_date, end_date } = req.query;

        if (!start_date || !end_date) {
            return res.status(400).json({
                message: "start_date and end_date are required in format dd.mm.yyyy"
            });
        }

        const start = parseDate(start_date);
        const end = parseDate(end_date);

        const lessons = await Lesson.findAll({
            where: {
                lesson_date: {
                    [require("sequelize").Op.between]: [start, end]
                }
            }
        });

        const lessonIds = lessons.map(l => l.lesson_Id);

        const events = await Event.findAll({
            where: {
                lesson_Id: lessonIds
            }
        });

        const teacherIds = events.map(e => e.teacher_Id);
        const eventIds = events.map(e => e.event_Id);

        const teachers = await Teacher.findAll({
            where: {
                teacher_Id: teacherIds
            }
        });

        const materials = await Material.findAll({
            where: {
                event_Id: eventIds
            }
        });

        const result = lessons.map(lesson => {
            const relatedEvents = events.filter(
                e => e.lesson_Id === lesson.lesson_Id
            );

            const eventsFormatted = relatedEvents.map(event => {
                const teacher = teachers.find(
                    t => t.teacher_Id === event.teacher_Id
                );

                const eventMaterials = materials.filter(
                    m => m.event_Id === event.event_Id
                );

                return {
                    ...event.toJSON(),
                    begin_date: formatTime(event.begin_date),
                    teacher_name: teacher?.full_name || null,
                    materials: eventMaterials
                };
            });

            return {
                ...lesson.toJSON(),
                lesson_date: formatDate(lesson.lesson_date),
                lesson_time: formatTime(lesson.lesson_time),
                events: eventsFormatted
            };
        });

        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const deleter = async (req, res) => {
    try {
        const { lesson_Id } = req.params;
        const result = await Lesson.destroy({ where: { lesson_Id } });
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const update = async (req, res) => {
    try {
        const { lesson_Id } = req.params;
        const { name, lesson_date, lesson_time, link } = req.body;
        const lesson = await Lesson.update({ name, lesson_date: parseDate(lesson_date), lesson_time, link }, { where: { lesson_Id } });
        return res.status(200).json(lesson);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = {
    create,
    getAll,
    deleter,
    update,
    getFromDb,
    getLessonsBetweenDates
};