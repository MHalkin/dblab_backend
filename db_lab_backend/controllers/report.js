const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, BorderStyle, HeadingLevel, convertInchesToTwip } = require('docx');
const { User, Teacher, Result, ResultType, Conference, Competition, Magazine, Work, Proposal } = require('../models/Relations');
const { Op } = require('sequelize');

// ========================================
// ШАБЛОН ЗВІТУ 1: ПЛАН РОБОТИ ГУРТКА
// ========================================
// Структура:
// 1. Шапка (ВНЗ, ЗАТВЕРДЖУЮ, заголовок)
// 2. Керівники наукового гуртка
// 3. Члени наукового гуртка (таблиця: № з/п, ПІБ студента, Група)
// 4. Мета діяльності гуртка
// 5. Основні завдання діяльності гуртка
// 6. Очікувані результати діяльності гуртка:
//    5.1 Участі у конференціях (планові)
//    5.2 Участь у конкурсах наукових робіт
//    5.3 Участь у конкурсах прикладних застосунків
//    5.4 Створення середовища для міждисциплінарної співпраці
// 7. Підпис (Склав, дата)

// ========================================
// ШАБЛОН ЗВІТУ 2: ЗВІТ З РОБОТИ ГУРТКА
// ========================================
// Структура:
// 1. Заголовок
// 2. Результати діяльності гуртка:
//    1.1 Участі у конференціях (результати згруповані за конференціями)
//    1.2 Участь у конкурсах наукових робіт (порожній рядок якщо немає)
//    1.3 Участь у конкурсах прикладних застосунків (результати конкурсів)
//    1.4 Створення середовища для міждисциплінарної співпраці
//    1.5 Наукові публікації членів гуртка (статті в журналах)
//    1.6 Авторські свідоцтва членів гуртка
//    1.7 Рекомендації щодо підтримки роботи гуртка
// 3. Підпис (Виконали, дата)

// Статичний текст для мети та завдань
const STATIC_GOAL = `Створення інтегрованого освітньо-наукового простору, що сприяє підвищенню якості підготовки здобувачів шляхом залучення їх до наукових досліджень та інноваційної діяльності в області розробки баз даних, що передбачає розвиток інтелектуального потенціалу здобувачів, формування навиків самостійного наукового пошуку, сприяння генерації нових ідей та їх практичного застосування для вирішення актуальних завдань в галузі розробки БД та інформаційних систем.`;

const STATIC_TASKS = [
    `забезпечення синергії між освітнім процесом і науково-дослідною діяльністю через створення сприятливих умов для практичного застосування теоретичних знань, отриманих у процесі навчання;`,
    `розвиток дослідницьких навиків, аналітичного мислення та здатності до прийняття інноваційних рішень здобувачами, шляхом залучення їх до участі у наукових експериментах, проєктах і програмних розробках;`,
    `організація та підтримка періодичних наукових заходів, таких як семінари, майстер-класи чи воркшопи, що сприяють обміну знаннями та досвідом між здобувачами і ІТ-фахівцями в галузі БД;`,
    `стимулювання активної участі здобувачів у дослідницьких проєктах, що мають на меті впровадження інновацій в освітні чи виробничі процеси;`,
    `підготовка здобувачів до роботи в умовах сучасного глобалізованого ринку праці, де знання і досвід у проведенні досліджень, управлінні проєктами та інноваційній діяльності є ключовими факторами успіху;`,
    `сприяння формуванню у здобувачів етичних норм і академічної доброчесності в процесі проведення наукових досліджень та написання наукових праць.`,
    `створення студентських стартапів, бізнес-ідей та проєктів;`,
    `формування лідерських якостей і навичок роботи здобувачів у команді.`
];

const STATIC_ENVIRONMENT = `Планується створення першої версії інформаційного порталу «Лабораторія розробки баз даних DBLAB», що буде вміщувати в собі не тільки типові функції сайту студентського наукового гуртка, але й надасть можливість для професійного зростання здобувачів вищої освіти завдяки інтерактивним картам навичок в області розробки баз даних.`;

const STATIC_ENVIRONMENT_REPORT = `Розроблено інформаційний портал «Лабораторія розробки баз даних DBLAB».V1, що підтримує типові функції сайту студентського наукового гуртка (надання інформація про наукові напрямки, відображення розкладу роботи гуртка, планування подій, реєстрацію учасників), а також надає можливість роботи з картами навичок, що має підтримувати студентів в напрямку професійного зростання в області розробки баз даних.`;

const STATIC_RECOMMENDATIONS = `Наразі членами гуртка ведеться розробка освітньо-наукового порталу гуртка, що планується застосовувати для підтримки професійного розвитку здобувачів, для проведення експертизи студентських проектів баз даних, тощо. 

Успішне функціонування такого порталу потребує його розгортання на стабільно працюючих серверах, де можуть безперервно працювати системи управління базами даних (СУБД) та інші необхідні програмні засоби. Інші науково-практичні проєкти гуртка також потребують відповідних ресурсів.

У зв'язку з послабленою роками воєнного стану ресурсною базою кафедри звертаємося з проханням виділити ресурси для діяльності наукового гуртка на серверах Університету.`;

const createCenteredParagraph = (text, options = {}) => {
    return new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: options.after || 100, before: options.before || 0 },
        children: [
            new TextRun({
                text: text,
                bold: options.bold || false,
                size: options.size || 24, // 12pt = 24 half-points
                italics: options.italics || false,
            })
        ]
    });
};

const createLeftParagraph = (text, options = {}) => {
    return new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { after: options.after || 100, before: options.before || 0 },
        indent: options.indent ? { firstLine: convertInchesToTwip(0.5) } : undefined,
        children: [
            new TextRun({
                text: text,
                bold: options.bold || false,
                size: options.size || 24,
                italics: options.italics || false,
            })
        ]
    });
};

const createBulletParagraph = (text, options = {}) => {
    return new Paragraph({
        bullet: { level: options.level || 0 },
        spacing: { after: options.after || 50 },
        children: [
            new TextRun({
                text: text,
                size: options.size || 24,
            })
        ]
    });
};

const createNumberedParagraph = (number, text, options = {}) => {
    return new Paragraph({
        spacing: { after: options.after || 50 },
        children: [
            new TextRun({
                text: `${number}) `,
                bold: false,
                size: options.size || 24,
            }),
            new TextRun({
                text: text,
                size: options.size || 24,
            })
        ]
    });
};

const createHeading = (text, level = 1) => {
    return new Paragraph({
        text: text,
        heading: level === 1 ? HeadingLevel.HEADING_1 : HeadingLevel.HEADING_2,
        alignment: AlignmentType.CENTER,
        spacing: { after: 200, before: 200 },
    });
};

const createSectionHeading = (number, text) => {
    return new Paragraph({
        spacing: { after: 100, before: 200 },
        children: [
            new TextRun({
                text: `${number}\t${text}`,
                bold: true,
                size: 24,
            })
        ]
    });
};

const createSubSectionHeading = (number, text) => {
    return new Paragraph({
        spacing: { after: 100, before: 150 },
        children: [
            new TextRun({
                text: `${number} ${text}`,
                bold: true,
                size: 24,
            })
        ]
    });
};

const createEmptyLine = () => {
    return new Paragraph({ text: '', spacing: { after: 100 } });
};

const getAcademicYear = (year) => {
    if (year) return year;
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    if (currentMonth >= 9) {
        return `${currentYear} / ${currentYear + 1}`;
    }
    return `${currentYear - 1} / ${currentYear}`;
};

const formatDate = (date, format = 'full') => {
    if (!date) return '';
    const d = new Date(date);
    const months = ['січня', 'лютого', 'березня', 'квітня', 'травня', 'червня', 
                    'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня'];
    
    if (format === 'full') {
        return `« ${d.getDate()} »   _${months[d.getMonth()]}_  ${d.getFullYear()}   р.`;
    }
    return `«_${d.getDate()}_»___${months[d.getMonth()]}___${d.getFullYear()}  р.`;
};

const getCurrentDate = () => {
    const now = new Date();
    const months = ['січня', 'лютого', 'березня', 'квітня', 'травня', 'червня', 
                    'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня'];
    return `«_${now.getDate()}_»___${months[now.getMonth()]}___${now.getFullYear()}  р.`;
};

// --- ГЕНЕРАЦІЯ ПЛАНУ РОБОТИ (ЗВІТ 1) ---
const generatePlan = async (req, res) => {
    try {
        const { academicYear } = req.query;
        const year = getAcademicYear(academicYear);

        const students = await User.findAll({ 
            where: { role: 'student' },
            order: [['nickname', 'ASC']]
        });
        
        const teachers = await Teacher.findAll({
            where: { teacher_role: 'Керівник' },
            order: [['full_name', 'ASC']]
        });

        const conferences = await Conference.findAll({
            order: [['approximate_date', 'ASC']]
        });

        const competitions = await Competition.findAll({
            order: [['approximate_date', 'ASC']]
        });

        const studentTableRows = [
            new TableRow({
                tableHeader: true,
                children: [
                    new TableCell({
                        width: { size: 10, type: WidthType.PERCENTAGE },
                        children: [new Paragraph({ text: '№ з/п', alignment: AlignmentType.CENTER })]
                    }),
                    new TableCell({
                        width: { size: 60, type: WidthType.PERCENTAGE },
                        children: [new Paragraph({ text: 'ПІБ студента', alignment: AlignmentType.CENTER })]
                    }),
                    new TableCell({
                        width: { size: 30, type: WidthType.PERCENTAGE },
                        children: [new Paragraph({ text: 'Група', alignment: AlignmentType.CENTER })]
                    }),
                ],
            }),
        ];

        students.forEach((s, index) => {
            const studentName = s.nickname || s.login || 'Н/Д';
            const studentGroup = s.student_group || '';
            
            studentTableRows.push(new TableRow({
                children: [
                    new TableCell({
                        children: [new Paragraph({ text: (index + 1).toString(), alignment: AlignmentType.CENTER })]
                    }),
                    new TableCell({
                        children: [new Paragraph({ text: studentName })]
                    }),
                    new TableCell({
                        children: [new Paragraph({ text: studentGroup, alignment: AlignmentType.CENTER })]
                    }),
                ],
            }));
        });

        if (students.length === 0) {
            studentTableRows.push(new TableRow({
                children: [
                    new TableCell({ children: [new Paragraph({ text: '' })] }),
                    new TableCell({ children: [new Paragraph({ text: '' })] }),
                    new TableCell({ children: [new Paragraph({ text: '' })] }),
                ],
            }));
        }

        const doc = new Document({
            sections: [{
                properties: {
                    page: {
                        margin: {
                            top: convertInchesToTwip(1),
                            right: convertInchesToTwip(0.75),
                            bottom: convertInchesToTwip(1),
                            left: convertInchesToTwip(1.25),
                        },
                    },
                },
                children: [
                    createCenteredParagraph('Харківський національний університет радіоелектроніки'),
                    createCenteredParagraph('(найменування вузу)', { size: 20, italics: true }),
                    createEmptyLine(),

                    new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [new TextRun({ text: '«ЗАТВЕРДЖУЮ»', bold: true })]
                    }),
                    new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [new TextRun({ text: '_________ Зав. кафедрою ПІ Зоя ДУДАР' })]
                    }),
                    new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        spacing: { after: 50 },
                        children: [new TextRun({ text: '(підпис, прізвище, ініціали)', size: 20, italics: true })]
                    }),
                    new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        spacing: { after: 200 },
                        children: [new TextRun({ text: formatDate(new Date()) })]
                    }),
                    
                    createEmptyLine(),

                    createCenteredParagraph('ПЛАН РОБОТИ СТУДЕНТСЬКОГО НАУКОВОГО ГУРТКА', { bold: true, size: 28 }),
                    createCenteredParagraph('«Лабораторія розробки баз даних DBLAB»', { bold: true, size: 26 }),
                    createCenteredParagraph(`на   ${year} навчальний рік`, { size: 24 }),
                    
                    createEmptyLine(),
                    
                    createLeftParagraph(`План обговорено на засіданні кафедри, протокол №___ від «__» ________ 20__ р.`),
                    
                    createEmptyLine(),

                    createLeftParagraph('Склав: '),
                    ...teachers.map(t => createLeftParagraph(`____________${t.position || ''} ${t.full_name}`, { after: 50 })),
                    ...(teachers.length > 0 ? [createLeftParagraph('(підпис, прізвище, ініціали)', { size: 20, italics: true })] : []),
                    teachers.length === 0 ? createLeftParagraph('____________', { after: 50 }) : createEmptyLine(),
                    createLeftParagraph(getCurrentDate()),
                    
                    createEmptyLine(),

                    createSectionHeading('1.', 'Керівники наукового гуртка:'),
                    ...teachers.length > 0 
                        ? teachers.map(t => {
                            const info = [t.level, t.position, `кафедри ПІ`, t.full_name].filter(Boolean).join(', ');
                            return createBulletParagraph(info);
                        })
                        : [createEmptyLine()],
                    
                    createEmptyLine(),

                    createSectionHeading('2.', 'Члени наукового гуртка:'),
                    new Table({
                        width: { size: 100, type: WidthType.PERCENTAGE },
                        rows: studentTableRows,
                    }),
                    
                    createEmptyLine(),

                    createSectionHeading('3.', 'Мета діяльності гуртка'),
                    createLeftParagraph(STATIC_GOAL, { indent: true }),
                    
                    createEmptyLine(),

                    createSectionHeading('4.', 'Основні завдання діяльності гуртка'),
                    ...STATIC_TASKS.map(task => new Paragraph({
                        spacing: { after: 50 },
                        children: [
                            new TextRun({ text: '- ', size: 24 }),
                            new TextRun({ text: task, size: 24 })
                        ]
                    })),
                    
                    createEmptyLine(),

                    createSectionHeading('5.', 'Очікувані результати діяльності гуртка'),

                    createSubSectionHeading('5.1', 'Участі у міжнародних та національних наукових конференціях.'),
                    createLeftParagraph(`На ${year} н.р. планується участь з результатами студентських наукових досліджень в:`),
                    ...conferences.length > 0 
                        ? conferences.map(c => new Paragraph({
                            spacing: { after: 50 },
                            children: [
                                new TextRun({ text: '-\t', size: 24 }),
                                new TextRun({ text: c.name, size: 24 })
                            ]
                        }))
                        : [createEmptyLine()],
                    
                    createEmptyLine(),

                    createSubSectionHeading('5.2', 'Участь у конкурсах наукових робіт.'),
                    createEmptyLine(), 

                    createSubSectionHeading('5.3', 'Участь у конкурсах прикладних застосунків.'),
                    createLeftParagraph(`На ${year} н.р. планується участь студентських наукових розробок та прикладних застосунків в:`),
                    ...competitions.length > 0 
                        ? competitions.map(c => new Paragraph({
                            spacing: { after: 50 },
                            children: [
                                new TextRun({ text: '-\t', size: 24 }),
                                new TextRun({ text: c.name, size: 24 })
                            ]
                        }))
                        : [createEmptyLine()],
                    
                    createEmptyLine(),

                    createSubSectionHeading('5.4', 'Створення середовища для міждисциплінарної співпраці.'),
                    createLeftParagraph(STATIC_ENVIRONMENT, { indent: true }),
                ],
            }],
        });

        const buffer = await Packer.toBuffer(doc);
        res.setHeader('Content-Disposition', `attachment; filename=Plan_DBLAB_${year.replace(/\s*\/\s*/, '-')}.docx`);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.send(buffer);

    } catch (error) {
        console.error('Error generating plan:', error);
        res.status(500).json({ message: "Error generating plan", error: error.message });
    }
};

// --- ГЕНЕРАЦІЯ ЗВІТУ ПРО РЕЗУЛЬТАТИ (ЗВІТ 2) ---
const generateReport = async (req, res) => {
    try {
        const { academicYear } = req.query;
        const year = getAcademicYear(academicYear);

        const yearParts = year.split('/').map(y => parseInt(y.trim())).filter(y => !isNaN(y));
        const startYear = yearParts.length > 0 ? yearParts[0] : null;
        const endYear = yearParts.length > 1 ? yearParts[1] : yearParts[0];

        const yearCondition = startYear && endYear 
            ? { year: { [Op.between]: [startYear, endYear] } }
            : startYear 
                ? { year: startYear }
                : {};

        const results = await Result.findAll({
            where: { 
                status: 'Підтверджено',
                ...yearCondition
            },
            include: [
                { model: ResultType, attributes: ['name', 'result_type_Id'] },
                { model: Conference, attributes: ['name', 'conference_Id', 'approximate_date', 'city', 'host'] },
                { model: Competition, attributes: ['name', 'competition_Id', 'approximate_date'] },
                { model: Magazine, attributes: ['name', 'magazine_Id', 'publisher', 'city'] },
                { 
                    model: Work, 
                    attributes: ['name', 'work_Id'],
                    include: [{ model: Proposal, attributes: ['name'] }]
                }
            ],
            order: [['year', 'ASC'], ['name', 'ASC']]
        });

        const teachers = await Teacher.findAll({
            where: { teacher_role: 'Керівник' },
            order: [['full_name', 'ASC']]
        });

        console.log(`[Report] Знайдено результатів: ${results.length} для навчального року ${year}`);
        console.log(`[Report] Фільтр за роком:`, yearCondition);

        // Групуємо результати за типами та конференціями/журналами
        const conferenceResults = {};  // Тези, доповіді на конференціях
        const competitionResults = []; // Результати конкурсів
        const magazineResults = [];    // Публікації в журналах (наукові статті)
        const copyrightResults = [];   // Авторські свідоцтва
        const otherResults = [];       // Інші результати

        results.forEach(r => {
            const resultData = r.toJSON();
            const typeName = resultData.ResultType?.name?.toLowerCase() || '';

            if (typeName.includes('свідоцтв') || typeName.includes('авторськ')) {
                copyrightResults.push(resultData);
            }
            else if (resultData.competition_Id && resultData.Competition) {
                competitionResults.push(resultData);
            }
            else if (resultData.magazine_Id && resultData.Magazine) {
                magazineResults.push(resultData);
            }
            else if (resultData.conference_Id && resultData.Conference) {
                const confName = resultData.Conference.name;
                if (!conferenceResults[confName]) {
                    conferenceResults[confName] = {
                        conference: resultData.Conference,
                        results: []
                    };
                }
                conferenceResults[confName].results.push(resultData);
            }
            else {
                otherResults.push(resultData);
            }
        });

        // Логування для діагностики
        console.log(`[Report] Згруповано: конференції=${Object.keys(conferenceResults).length}, конкурси=${competitionResults.length}, журнали=${magazineResults.length}, свідоцтва=${copyrightResults.length}, інші=${otherResults.length}`);

        const documentChildren = [];

        documentChildren.push(
            createCenteredParagraph('Звіт з роботи студентського наукового гуртка', { bold: true, size: 28, after: 200 }),
            createEmptyLine(),
            createCenteredParagraph('«Лабораторія розробки баз даних DBLAB»', { bold: true, size: 26 }),
            createCenteredParagraph(`за ${year} навчальний рік`, { size: 24 }),
            createEmptyLine(),
            createEmptyLine()
        );

        documentChildren.push(
            createLeftParagraph('Результати діяльності гуртка', { bold: true, size: 26, after: 200 }),
            createEmptyLine()
        );

        documentChildren.push(
            createSubSectionHeading('1.1', 'Участі у міжнародних та національних наукових конференціях.')
        );

        const conferenceNames = Object.keys(conferenceResults);
        if (conferenceNames.length > 0) {
            conferenceNames.forEach(confName => {
                const confData = conferenceResults[confName];
                documentChildren.push(
                    createLeftParagraph(`${confName}:`, { bold: true, before: 100 })
                );
                confData.results.forEach((r, idx) => {
                    documentChildren.push(
                        createNumberedParagraph(idx + 1, r.full_name || r.name || 'Без назви')
                    );
                });
            });
        } else {
            documentChildren.push(createEmptyLine());
        }

        const otherConferenceResults = otherResults.filter(r => {
            const typeName = r.ResultType?.name?.toLowerCase() || '';
            return typeName.includes('тези') || typeName.includes('доповід') || typeName.includes('конференц');
        });
        
        if (otherConferenceResults.length > 0) {
            documentChildren.push(
                createLeftParagraph('Інші конференції:', { bold: true, before: 100 })
            );
            otherConferenceResults.forEach((r, idx) => {
                documentChildren.push(
                    createNumberedParagraph(idx + 1, r.full_name || r.name || 'Без назви')
                );
            });
        }

        documentChildren.push(createEmptyLine());

        documentChildren.push(
            createSubSectionHeading('1.2', 'Участь у конкурсах наукових робіт.')
        );
        documentChildren.push(createEmptyLine());

        documentChildren.push(
            createSubSectionHeading('1.3', 'Участь у конкурсах прикладних застосунків.')
        );

        if (competitionResults.length > 0) {
            const competitionGroups = {};
            competitionResults.forEach(r => {
                const compName = r.Competition?.name || 'Інший конкурс';
                if (!competitionGroups[compName]) {
                    competitionGroups[compName] = [];
                }
                competitionGroups[compName].push(r);
            });

            Object.keys(competitionGroups).forEach(compName => {
                documentChildren.push(
                    createLeftParagraph(`${compName}:`, { bold: true, before: 100 })
                );
                competitionGroups[compName].forEach((r, idx) => {
                    documentChildren.push(
                        createNumberedParagraph(idx + 1, r.full_name || r.name || 'Без назви')
                    );
                });
            });
        } else {
            documentChildren.push(createEmptyLine());
        }

        documentChildren.push(createEmptyLine());

        documentChildren.push(
            createSubSectionHeading('1.4', 'Створення середовища для міждисциплінарної співпраці.')
        );
        documentChildren.push(
            createLeftParagraph(STATIC_ENVIRONMENT_REPORT, { indent: true })
        );
        documentChildren.push(createEmptyLine());

        documentChildren.push(
            createSubSectionHeading('1.5', 'Наукові публікації членів гуртка.')
        );

        if (magazineResults.length > 0) {
            magazineResults.forEach((r, idx) => {
                documentChildren.push(
                    createNumberedParagraph(idx + 1, r.full_name || r.name || 'Без назви')
                );
            });
        } else {
            documentChildren.push(createEmptyLine());
        }

        documentChildren.push(createEmptyLine());

        documentChildren.push(
            createSubSectionHeading('1.6', 'Авторські свідоцтва членів гуртка.')
        );

        if (copyrightResults.length > 0) {
            copyrightResults.forEach((r, idx) => {
                documentChildren.push(
                    createNumberedParagraph(idx + 1, r.full_name || r.name || 'Без назви')
                );
            });
        } else {
            documentChildren.push(createEmptyLine());
        }

        documentChildren.push(createEmptyLine());

        documentChildren.push(
            createSubSectionHeading('1.7', 'Рекомендації щодо необхідної підтримки роботи гуртка')
        );
        documentChildren.push(
            createLeftParagraph(STATIC_RECOMMENDATIONS, { indent: true })
        );

        documentChildren.push(createEmptyLine());
        documentChildren.push(createEmptyLine());

        documentChildren.push(
            createLeftParagraph('Виконали: ')
        );
        teachers.forEach(t => {
            documentChildren.push(
                createLeftParagraph(`____________${t.position || ''} ${t.full_name}`, { after: 50 })
            );
        });
        if (teachers.length > 0) {
            documentChildren.push(
                createLeftParagraph('(підпис, прізвище, ініціали)', { size: 20, italics: true })
            );
        } else {
            documentChildren.push(createLeftParagraph('____________', { after: 50 }));
        }
        documentChildren.push(createEmptyLine());
        documentChildren.push(createLeftParagraph(getCurrentDate()));

        const doc = new Document({
            sections: [{
                properties: {
                    page: {
                        margin: {
                            top: convertInchesToTwip(1),
                            right: convertInchesToTwip(0.75),
                            bottom: convertInchesToTwip(1),
                            left: convertInchesToTwip(1.25),
                        },
                    },
                },
                children: documentChildren,
            }],
        });

        const buffer = await Packer.toBuffer(doc);
        res.setHeader('Content-Disposition', `attachment; filename=Report_DBLAB_${year.replace(/\s*\/\s*/, '-')}.docx`);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.send(buffer);

    } catch (error) {
        console.error('Error generating report:', error);
        res.status(500).json({ message: "Error generating report", error: error.message });
    }
};

module.exports = { generatePlan, generateReport };
