import type { MonthlyBudgetTrackerDictionary } from "../en/monthly-budget-tracker";

const monthlyBudgetTrackerDictionary: MonthlyBudgetTrackerDictionary = {
    meta: {
        title: "Urmăritor Buget Lunar | Planificator Gratuit Venituri și Cheltuieli",
        description: "Urmăritor de buget lunar gratuit. Planifică și urmărește veniturile și cheltuielile, compară cheltuielile planificate cu cele reale și menține controlul finanțelor personale. Fără înregistrare.",
        keywords: [
            "urmăritor buget",
            "buget lunar",
            "urmăritor cheltuieli",
            "urmăritor venituri",
            "planificator buget",
            "finanțe personale",
            "urmăritor cheltuieli",
            "gestionare bani",
        ],
    },
    hero: {
        headline: "Urmăritor Buget Lunar",
        description: "Planifică veniturile și cheltuielile lunare, urmărește cheltuielile reale și vezi exact unde se duc banii tăi. Toate datele rămân în browser-ul tău.",
    },
    tracker: {
        incomeTitle: "Venituri",
        expensesTitle: "Cheltuieli",
        categoryLabel: "Categorie",
        categoryPlaceholder: "Numele categoriei",
        plannedLabel: "Planificat",
        plannedPlaceholder: "0.00",
        actualLabel: "Real",
        actualPlaceholder: "0.00",
        addButtonLabel: "Adaugă categorie",
        removeButtonAriaLabel: "Șterge categorie",
        summaryTitle: "Sumar Lunar",
        totalIncomePlanLabel: "Total Venituri (Planificat)",
        totalIncomeActualLabel: "Total Venituri (Real)",
        totalExpensesPlanLabel: "Total Cheltuieli (Planificat)",
        totalExpensesActualLabel: "Total Cheltuieli (Real)",
        balancePlanLabel: "Balanță (Planificat)",
        balanceActualLabel: "Balanță (Real)",
        differenceLabel: "Diferență",
        resetButtonLabel: "Resetează toate datele",
        resetConfirmMessage: "Ești sigur că vrei să resetezi toate datele bugetare? Această acțiune nu poate fi anulată.",
        noDataMessage: "Adaugă cel puțin o categorie de venituri și una de cheltuieli pentru a vedea sumarul.",
        progressLabel: "{percent}% din planificat",
    },
    defaultCategories: {
        income: [
            { name: "Salariu", planned: 5000 },
            { name: "Freelance / Venit Secundar", planned: 0 },
        ],
        expenses: [
            { name: "Chirie / Rată Casă", planned: 1500 },
            { name: "Utilități", planned: 200 },
            { name: "Alimente", planned: 400 },
            { name: "Transport", planned: 150 },
            { name: "Sănătate", planned: 100 },
            { name: "Divertisment", planned: 100 },
            { name: "Abonamente", planned: 50 },
            { name: "Economii", planned: 500 },
        ],
    },
    howItWorks: {
        sectionTitle: "Cum să Urmărești Bugetul Lunar",
        steps: [
            {
                number: 1,
                icon: "listPlus",
                title: "Configurează Categoriile",
                description: "Începe cu categoriile predefinite de venituri și cheltuieli, sau personalizează-le pentru a se potrivi vieții tale financiare. Adaugă sau elimină categorii oricând.",
            },
            {
                number: 2,
                icon: "pencilLine",
                title: "Introdu Sumele Planificate și Reale",
                description: "La începutul lunii, setează bugetele planificate pentru fiecare categorie. Pe măsură ce cheltuiești și câștigi, actualizează sumele reale pentru a urmări progresul.",
            },
            {
                number: 3,
                icon: "chartBar",
                title: "Analizează Sumarul",
                description: "Sumarul se actualizează instant, arătând venitul total, cheltuielile, balanța și cum se compară cheltuielile reale cu planul. Verde înseamnă pe drumul cel bun, roșu înseamnă depășire buget.",
            },
        ],
    },
    features: {
        sectionTitle: "De Ce Să Folosești Urmăritorul Nostru de Buget",
        sectionDescription: "Instrumente simple dar puternice pentru a prelua controlul finanțelor tale lunare.",
        items: [
            {
                icon: "save",
                title: "Salvare Automată în Browser",
                description: "Datele bugetare sunt salvate automat în memoria locală a browser-ului. Revino oricând și continuă exact de unde ai rămas.",
            },
            {
                icon: "layoutList",
                title: "Categorii Personalizabile",
                description: "Începe cu categorii implicite inteligente sau creează-ți propriile. Adaugă, redenumește sau elimină categorii pentru a se potrivi perfect obiceiurilor tale de cheltuieli.",
            },
            {
                icon: "barChart3",
                title: "Urmărire Planificat vs Real",
                description: "Setează bugetele planificate la începutul lunii și urmărește cheltuielile reale pe parcurs. Vezi instant unde ești sub sau peste buget.",
            },
            {
                icon: "shield",
                title: "Privat și Sigur",
                description: "Toate datele tale financiare rămân în browser-ul tău. Nu colectăm, stocăm sau transmitem niciodată informațiile tale bugetare personale către niciun server.",
            },
        ],
    },
    educational: {
        sectionTitle: "Stăpânirea Bugetului Lunar",
        articles: [
            {
                title: "Regula Bugetară 50/30/20",
                content: "Unul dintre cele mai populare cadre de bugetare alocă 50% din venitul net necesităților (chirie, utilități, alimente), 30% dorințelor (divertisment, ieșiri la restaurant, hobby-uri) și 20% economiilor și rambursării datoriilor. Această regulă simplă oferă un punct de plecare echilibrat pentru oricine este nou în bugetare. Ajustează procentajele pentru a se potrivi situației tale, dar principiul cheie rămâne: prioritizează necesitățile, bucură-te de viață și plătește-te întotdeauna mai întâi prin economii.",
            },
            {
                title: "De Ce Contează Urmărirea Cheltuielilor",
                content: "Cercetările arată că persoanele care urmăresc activ cheltuielile economisesc semnificativ mai mult decât cele care nu o fac. Actul de a înregistra cheltuielile creează conștientizare asupra tiparelor de cheltuieli și reduce achizițiile impulsive. Studiile arată că simpla monitorizare a finanțelor poate reduce cheltuielile inutile cu 15-20%. Un urmăritor de buget lunar face acest proces fără efort, arătând exact unde se duc banii și evidențiind zonele unde poți reduce.",
            },
            {
                title: "Construirea unui Fond de Urgență",
                content: "Experții financiari recomandă economisirea cheltuielilor de trai pe trei până la șase luni într-un fond de urgență ușor accesibil. Începe prin includerea unei categorii de economii în bugetul lunar, chiar dacă poți pune deoparte doar o sumă mică inițial. Consecvența contează mai mult decât suma. Odată ce ai un tampon pentru cheltuieli neașteptate precum reparații auto, facturi medicale sau pierderea locului de muncă, câștigi securitate financiară și liniște sufletească care reduce stresul și îmbunătățește luarea deciziilor.",
            },
        ],
    },
    faq: {
        sectionTitle: "Întrebări Frecvente",
        items: [
            {
                question: "Unde sunt stocate datele bugetare?",
                answer: "Datele bugetare sunt stocate exclusiv în memoria locală a browser-ului tău. Nu trimitem niciodată informațiile tale financiare către vreun server. Aceasta înseamnă că datele tale sunt complet private, dar înseamnă și că ștergerea datelor browser-ului va șterge bugetul. Ia în considerare exportarea periodică a datelor ca backup.",
            },
            {
                question: "Pot personaliza categoriile bugetare?",
                answer: "Da, poți personaliza complet categoriile bugetare. Adaugă categorii noi făcând clic pe butonul 'Adaugă categorie' sub secțiunea Venituri sau Cheltuieli. Poți de asemenea redenumi orice categorie existentă editând câmpul numelui, sau elimina categoriile de care nu ai nevoie.",
            },
            {
                question: "Ce înseamnă culorile din sumar?",
                answer: "Valorile verzi indică rezultate pozitive: venitul real a atins sau a depășit planul, sau cheltuielile reale au rămas în buget. Valorile roșii indică zone care necesită atenție: venitul a fost sub plan, sau cheltuielile au depășit bugetul. Acest sistem vizual face ușoară identificarea problemelor dintr-o privire.",
            },
            {
                question: "Cum încep o lună nouă?",
                answer: "Folosește butonul 'Resetează toate datele' pentru a șterge toate sumele reale și a începe de la zero. Sumele planificate și categoriile vor rămâne ca șablon. Alternativ, poți actualiza manual sumele reale la zero pentru fiecare categorie, păstrând bugetele planificate intacte.",
            },
            {
                question: "Care este diferența dintre sumele planificate și reale?",
                answer: "Sumele planificate reprezintă obiectivele bugetare stabilite la începutul lunii. Sumele reale reflectă ceea ce ai câștigat sau cheltuit cu adevărat. Compararea celor două relevă dacă ești pe drumul cel bun, sub buget sau cheltuiești prea mult în fiecare categorie.",
            },
            {
                question: "Pot folosi acest urmăritor pentru o altă monedă?",
                answer: "Da, urmăritorul funcționează cu orice monedă. Sumele pe care le introduci sunt pur și simplu numere, iar calculele sumarului funcționează la fel indiferent de monedă. În prezent, semnul dolarului ($) este folosit pentru afișare, dar valorile reprezintă orice monedă alegi pentru bugetare.",
            },
            {
                question: "Cum ar trebui să gestionez veniturile neregulate?",
                answer: "Pentru venituri neregulate precum lucrul freelance sau comisioanele, estimează o sumă planificată conservatoare bazată pe câștigurile medii din ultimele câteva luni. Actualizează suma reală pe măsură ce plățile sosesc. Această abordare îți oferă o bază realistă ținând cont de variabilitate.",
            },
            {
                question: "Ce este 'Diferența' din sumar?",
                answer: "Diferența arată cum se compară balanța reală cu balanța planificată. O diferență pozitivă înseamnă că ai performat mai bine decât planificat (ai câștigat mai mult sau ai cheltuit mai puțin). O diferență negativă înseamnă că nu ai atins obiectivele bugetare. Oferă un singur număr pentru a evalua performanța financiară lunară generală.",
            },
            {
                question: "Ar trebui să includ economiile ca cheltuială?",
                answer: "Da, tratarea economiilor ca cheltuială este o strategie de bugetare dovedită numită 'plătește-te mai întâi'. Prin includerea economiilor ca cheltuială planificată, prioritizezi construirea rezervelor financiare înainte de cheltuielile discreționare. Aceasta asigură economisire constantă în fiecare lună, chiar și când alte cheltuieli fluctuează.",
            },
            {
                question: "Pot folosi acest urmăritor pe telefonul meu?",
                answer: "Da, urmăritorul nostru de buget este complet responsiv și funcționează perfect pe smartphone-uri, tablete și calculatoare desktop. Pur și simplu deschide pagina în browser-ul mobil pentru a începe să urmărești bugetul instant, fără a fi nevoie de descărcarea unei aplicații.",
            },
        ],
    },
    cta: {
        title: "Explorează Celelalte Instrumente Financiare",
        description: "Gestionează fiecare aspect al finanțelor tale cu calculatoarele și urmăritoarele noastre gratuite și ușor de utilizat.",
    },
};

export default monthlyBudgetTrackerDictionary;
