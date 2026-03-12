import type { UnitConverterDictionary } from "../en/unit-converter";

const unitConverterDictionary: UnitConverterDictionary = {
    meta: {
        title: "Convertor Metri | Convertește Metri în Mile, Picioare, Yarzi și Altele",
        description: "Convertor de metri online gratuit. Convertește metri în kilometri, mile, mile nautice, picioare, inci, yarzi și altele. Rezultate instant fără înregistrare.",
        keywords: [
            "convertor metri",
            "metri în picioare",
            "metri în mile",
            "metri în mile nautice",
            "convertor lungime",
            "convertor unități",
            "convertor distanță",
            "metri în yarzi",
            "metri în inci",
        ],
    },
    hero: {
        headline: "Convertor Metri",
        description: "Convertește metrii în orice unitate de lungime instant. Suportă kilometri, mile, mile nautice, picioare, inci, yarzi și altele.",
    },
    converter: {
        fromLabel: "Din",
        toLabel: "În",
        amountPlaceholder: "Introduceți valoarea",
        switchButtonAriaLabel: "Inversează unitățile",
        rateDisplay: "1 {from} = {rate} {to}",
    },
    howItWorks: {
        sectionTitle: "Cum să Convertești Unități de Lungime Online",
        steps: [
            {
                number: 1,
                icon: "keyboard",
                title: "Introduceți Valoarea",
                description: "Tastați valoarea lungimii pe care doriți să o convertiți. Convertorul nostru suportă orice valoare numerică cu precizie ridicată.",
            },
            {
                number: 2,
                icon: "arrowLeftRight",
                title: "Selectați Unitățile",
                description: "Alegeți unitățile sursă și țintă din meniurile derulante. Suportăm 12 unități de lungime, de la milimetri la mile nautice.",
            },
            {
                number: 3,
                icon: "zap",
                title: "Obțineți Rezultate Instant",
                description: "Conversia se calculează automat folosind factori de conversie preciși. Rezultatele se actualizează în timp real pe măsură ce tastați.",
            },
        ],
    },
    ratesTable: {
        sectionTitle: "Conversii Comune de Lungime",
        sectionDescription: "Referință rapidă pentru cele mai utilizate conversii de unități de lungime din metri.",
        headers: {
            pair: "Conversie",
            rate: "Factor",
            inverseRate: "Factor Invers",
        },
    },
    features: {
        sectionTitle: "De Ce Să Folosești Convertorul Nostru de Metri",
        sectionDescription: "Conversii de lungime precise și fiabile pentru inginerie, știință, călătorii și utilizare zilnică.",
        items: [
            {
                icon: "zap",
                title: "Conversie Instantă",
                description: "Rezultatele apar în timp real pe măsură ce tastați. Fără butoane de apăsat, fără reîncărcări de pagină. Doar conversii rapide și precise.",
            },
            {
                icon: "globe",
                title: "12 Unități de Lungime",
                description: "Convertește între unități metrice, imperiale și nautice, inclusiv metri, kilometri, mile, mile nautice, picioare și altele.",
            },
            {
                icon: "shield",
                title: "Precizie Ridicată",
                description: "Factorii noștri de conversie se bazează pe standarde internaționale agreate, asigurând rezultate de încredere pentru utilizare profesională.",
            },
            {
                icon: "calculator",
                title: "Funcționează în Ambele Sensuri",
                description: "Comutați ușor între unități cu un singur clic. Convertiți metri în picioare sau picioare în metri cu același instrument.",
            },
        ],
    },
    educational: {
        sectionTitle: "Înțelegerea Măsurării Lungimii",
        articles: [
            {
                title: "Sistemul Metric și Metrul",
                content: "Metrul este unitatea de bază a lungimii în Sistemul Internațional de Unități (SI). Definit inițial în 1793 ca o zece-milionime din distanța de la ecuator la Polul Nord, acum este definit prin viteza luminii: un metru este distanța pe care lumina o parcurge în vid în 1/299.792.458 dintr-o secundă. Structura zecimală a sistemului metric face conversia între milimetri, centimetri, metri și kilometri ușoară.",
            },
            {
                title: "Imperial vs Metric: O Diviziune Globală",
                content: "În timp ce majoritatea lumii folosește sistemul metric, Statele Unite, Liberia și Myanmar încă folosesc în principal unitățile imperiale pentru măsurătorile de zi cu zi. Sistemul imperial include inci, picioare, yarzi și mile. O milă este egală cu exact 1.609,344 metri. Înțelegerea conversiilor între aceste sisteme este esențială pentru comerțul internațional, călătorii și colaborarea științifică.",
            },
            {
                title: "Milele Nautice: Măsurarea Distanței pe Mare",
                content: "O milă nautică se bazează pe circumferința Pământului și este egală cu exact 1.852 de metri. Este folosită în aviație și navigație maritimă deoarece corespunde unui minut de latitudine. Nodurile, unitatea de viteză pe mare, măsoară milele nautice pe oră. Această relație face calculele de navigație și hărțile nautice simple și intuitive.",
            },
        ],
    },
    faq: {
        sectionTitle: "Întrebări Frecvente",
        items: [
            {
                question: "Câte picioare are un metru?",
                answer: "Un metru este egal cu exact 3,28084 picioare. Această conversie se bazează pe acordul internațional conform căruia un inci este egal cu exact 25,4 milimetri, ceea ce face un picior (12 inci) egal cu 0,3048 metri.",
            },
            {
                question: "Care este diferența dintre o milă și o milă nautică?",
                answer: "O milă terestră este egală cu 1.609,344 metri (5.280 picioare), în timp ce o milă nautică este egală cu exact 1.852 de metri. O milă nautică este cu aproximativ 15% mai lungă decât o milă terestră. Milele nautice sunt folosite în navigația maritimă și aviație deoarece se raportează direct la gradele de latitudine.",
            },
            {
                question: "Cum convertesc metri în kilometri?",
                answer: "Pentru a converti metri în kilometri, împărțiți numărul de metri la 1.000. De exemplu, 5.000 de metri sunt egali cu 5 kilometri. Prefixul 'kilo' înseamnă o mie, deci un kilometru este literalmente o mie de metri.",
            },
            {
                question: "De ce SUA încă folosește unitățile imperiale?",
                answer: "SUA a adoptat unitățile cutumiare bazate pe sistemul imperial înainte ca sistemul metric să fie larg stabilit. Deși guvernul SUA a susținut metricizarea voluntară din 1975, costul și perturbarea schimbării măsurătorilor de zi cu zi au încetinit adoptarea. Multe industrii din SUA, în special știința și medicina, folosesc deja unitățile metrice.",
            },
            {
                question: "Care este cea mai mică unitate de lungime?",
                answer: "În utilizarea de zi cu zi, milimetrii (0,001 metri) sunt printre cele mai mici unități practice. În știință, micrometrii (0,000001 metri) măsoară celulele, nanometrii (0,000000001 metri) măsoară moleculele, iar lungimea Planck (aproximativ 1,6 x 10^-35 metri) este considerată cea mai mică lungime semnificativă în fizică.",
            },
            {
                question: "Cât de precise sunt convertoarele de unități online?",
                answer: "Convertoarele de unități online precum al nostru folosesc factori de conversie standardizați internațional și sunt extrem de precise pentru scopuri practice. Convertorul nostru folosește relațiile exacte, definite oficial, între unități (de ex., 1 inci = exact 25,4 mm), asigurând rezultate suficient de fiabile pentru inginerie și lucrări științifice.",
            },
            {
                question: "Ce este un yard și cum se raportează la un metru?",
                answer: "Un yard este o unitate imperială de lungime egală cu 3 picioare sau 36 de inci. Un yard este egal cu exact 0,9144 metri. Yard-ul a fost definit istoric printr-o bară standard fizică în Anglia, dar acum este definit în termeni de metru pentru precizie.",
            },
            {
                question: "Câți metri are o milă?",
                answer: "O milă este egală cu exact 1.609,344 metri. Aceasta este mila terestră folosită pentru distanțele pe uscat. Pentru a converti mile în metri, înmulțiți numărul de mile cu 1.609,344. De exemplu, o cursă de 5K este aproximativ 3,107 mile.",
            },
            {
                question: "Ce unități folosesc oamenii de știință pentru a măsura lungimea?",
                answer: "Oamenii de știință folosesc sistemul metric, cu metrul ca unitate de bază. În funcție de scală, folosesc kilometri pentru distanțe mari, metri și centimetri pentru obiecte de zi cu zi, milimetri pentru obiecte mici, micrometri pentru celule și nanometri pentru molecule și lungimi de undă ale luminii.",
            },
            {
                question: "Pot folosi acest convertor pe telefonul meu?",
                answer: "Da, convertorul nostru de unități este complet responsiv și funcționează perfect pe smartphone-uri, tablete și calculatoare desktop. Pur și simplu deschideți pagina în browser-ul mobil și începeți să convertiți instant, fără a fi nevoie de descărcarea unei aplicații.",
            },
        ],
    },
    cta: {
        title: "Explorează Celelalte Instrumente Financiare",
        description: "Gestionează fiecare aspect al finanțelor tale cu calculatoarele și urmăritoarele noastre gratuite și ușor de utilizat.",
    },
    options: {
        mm: "Milimetru",
        cm: "Centimetru",
        m: "Metru",
        km: "Kilometru",
        in: "Inci",
        ft: "Picior",
        yd: "Yard",
        mi: "Milă",
        nmi: "Milă Nautică",
        fathom: "Fathom",
        furlong: "Furlong",
        league: "Leghe",
    },
};

export default unitConverterDictionary;
