import type { LoanRepaymentCalculatorDictionary } from "../en/loan-repayment-calculator";

const loanRepaymentCalculatorDictionary: LoanRepaymentCalculatorDictionary = {
    meta: {
        title: "Calculator Rate Împrumut | Rată Lunară și Grafic Amortizare",
        description: "Calculator de rate gratuit. Calculează ratele lunare, dobânda totală și vizualizează un grafic complet de amortizare pentru orice împrumut. Suportă credite ipotecare, auto și personale.",
        keywords: [
            "calculator rate",
            "calculator rambursare împrumut",
            "calculator rată lunară",
            "calculator ipotecar",
            "grafic amortizare",
            "calculator dobândă",
            "calculator credit auto",
            "calculator credit personal",
        ],
    },
    hero: {
        headline: "Calculator Rate Împrumut",
        description: "Calculează ratele lunare ale împrumutului, dobânda totală și vizualizează un grafic detaliat de amortizare. Funcționează pentru credite ipotecare, auto, personale și altele.",
    },
    calculator: {
        loanAmountLabel: "Suma Împrumutului",
        loanAmountPlaceholder: "ex. 250000",
        interestRateLabel: "Rata Anuală a Dobânzii (%)",
        interestRatePlaceholder: "ex. 6.5",
        loanTermLabel: "Durata Împrumutului",
        loanTermPlaceholder: "ex. 30",
        termUnitLabel: "Unitate Durată",
        termUnitYears: "Ani",
        termUnitMonths: "Luni",
        monthlyPaymentLabel: "Rata Lunară",
        totalPaymentLabel: "Total Plătit",
        totalInterestLabel: "Total Dobândă",
    },
    amortizationTable: {
        sectionTitle: "Grafic de Amortizare",
        sectionDescription: "Vezi cum fiecare plată este împărțită între principal și dobândă pe toată durata împrumutului.",
        toggleLabel: "Afișează graficul de amortizare",
        headers: {
            month: "Luna",
            payment: "Rata",
            principal: "Principal",
            interest: "Dobândă",
            balance: "Sold Rămas",
        },
    },
    howItWorks: {
        sectionTitle: "Cum să Calculezi Rambursarea Împrumutului",
        steps: [
            {
                number: 1,
                icon: "dollarSign",
                title: "Introduceți Suma Împrumutului",
                description: "Tastați suma totală pe care intenționați să o împrumutați. Acesta este soldul principal înainte de aplicarea oricărei dobânzi.",
            },
            {
                number: 2,
                icon: "percent",
                title: "Setați Dobânda și Durata",
                description: "Introduceți rata anuală a dobânzii și durata împrumutului în ani sau luni. Calculatorul face conversia automat.",
            },
            {
                number: 3,
                icon: "chartBar",
                title: "Analizați Rezultatele",
                description: "Vedeți instant rata lunară, suma totală plătită și dobânda totală. Extindeți tabelul de amortizare pentru o detaliere lună cu lună.",
            },
        ],
    },
    features: {
        sectionTitle: "De Ce Să Folosești Calculatorul Nostru de Rate",
        sectionDescription: "Funcționalități puternice pentru a înțelege și planifica strategia de rambursare a împrumutului.",
        items: [
            {
                icon: "zap",
                title: "Calcul Instant",
                description: "Rezultatele se actualizează în timp real pe măsură ce ajustați orice valoare. Fără butoane de apăsat, fără reîncărcări de pagină. Doar calcule rapide și precise.",
            },
            {
                icon: "table",
                title: "Grafic Complet de Amortizare",
                description: "Vizualizați o detaliere lună cu lună care arată cum fiecare plată este împărțită între principal și dobândă pe toată durata împrumutului.",
            },
            {
                icon: "arrowLeftRight",
                title: "Unități de Durată Flexibile",
                description: "Introduceți durata împrumutului în ani sau luni. Calculatorul convertește automat, oferindu-vă flexibilitate totală pentru a modela orice scenariu.",
            },
            {
                icon: "shield",
                title: "Precis și Transparent",
                description: "Folosește formula standard de amortizare utilizată de bănci și creditori din întreaga lume. Fără taxe ascunse, fără surprize în calculele noastre.",
            },
        ],
    },
    educational: {
        sectionTitle: "Înțelegerea Rambursării Împrumutului",
        articles: [
            {
                title: "Cum Funcționează Amortizarea",
                content: "Amortizarea este procesul de rambursare a unui împrumut prin plăți lunare regulate. Fiecare plată acoperă două părți: dobânda percepută pe soldul rămas și o porțiune care reduce principalul. În primii ani ai unui împrumut, cea mai mare parte a fiecărei plăți se duce către dobândă. Pe măsură ce soldul scade, mai mult din fiecare plată se duce către principal. De aceea, efectuarea plăților suplimentare la începutul unui împrumut poate reduce semnificativ dobânda totală plătită.",
            },
            {
                title: "Împrumuturi cu Rată Fixă vs Rată Variabilă",
                content: "Un împrumut cu rată fixă blochează rata dobânzii pentru întreaga durată, făcând plățile lunare predictibile și ușor de bugetat. Un împrumut cu rată variabilă (sau ajustabilă) începe cu o rată mai mică care se poate schimba periodic în funcție de condițiile pieței. Ratele fixe oferă stabilitate, în timp ce ratele variabile pot economisi bani dacă ratele dobânzii scad. Calculatorul nostru modelează împrumuturi cu rată fixă, care sunt cel mai comun tip pentru credite ipotecare și auto.",
            },
            {
                title: "Costul Real al Împrumutului",
                content: "Costul total al unui împrumut se extinde cu mult dincolo de suma împrumutată. La un credit ipotecar pe 30 de ani de 300.000 $ la 6,5% dobândă, ați plăti aproximativ 382.000 $ doar în dobândă, aproape dublând împrumutul original. Duratele mai scurte reduc dramatic dobânda totală: același împrumut pe 15 ani ar costa aproximativ 170.000 $ în dobândă. Înțelegerea acestei relații între durata termenului și costul total este esențială pentru decizii informate de împrumut.",
            },
        ],
    },
    faq: {
        sectionTitle: "Întrebări Frecvente",
        items: [
            {
                question: "Cum se calculează rata lunară?",
                answer: "Rata lunară se calculează folosind formula standard de amortizare: M = P × [r(1+r)^n] / [(1+r)^n – 1], unde P este suma împrumutului, r este rata lunară a dobânzii (rata anuală împărțită la 12), iar n este numărul total de plăți lunare. Această formulă asigură plăți egale pe toată durata împrumutului.",
            },
            {
                question: "Ce se întâmplă dacă rata dobânzii este 0%?",
                answer: "Cu o rată a dobânzii de 0%, rata lunară este pur și simplu suma împrumutului împărțită la numărul de luni. Nu există nicio taxă de dobândă, deci plătiți doar principalul. Acest scenariu este comun la ofertele de finanțare promoționale ale comercianților sau dealerilor auto.",
            },
            {
                question: "Care este diferența dintre rata dobânzii și DAE?",
                answer: "Rata dobânzii este costul împrumutării sumei principale. DAE (Dobânda Anuală Efectivă) include rata dobânzii plus alte costuri precum comisioane de acordare, costuri de închidere și asigurare. DAE oferă o imagine mai completă a costului total al împrumutului și este de obicei mai mare decât rata de bază a dobânzii.",
            },
            {
                question: "Cum afectează durata împrumutului costul total?",
                answer: "Duratele mai lungi ale împrumutului rezultă în rate lunare mai mici, dar dobândă totală semnificativ mai mare. O durată mai scurtă înseamnă rate lunare mai mari, dar mai puțină dobândă totală. De exemplu, un împrumut de 200.000 $ la 6% costă aproximativ 231.000 $ în dobândă pe 30 de ani, dar doar aproximativ 103.000 $ în dobândă pe 15 ani.",
            },
            {
                question: "Pot rambursa împrumutul anticipat?",
                answer: "Majoritatea împrumuturilor permit rambursarea anticipată, deși unele pot avea penalități de rambursare anticipată. Efectuarea plăților suplimentare către principal reduce dobânda totală și scurtează durata împrumutului. Chiar și plăți lunare suplimentare mici pot economisi mii de dolari pe durata unui credit ipotecar.",
            },
            {
                question: "Ce este un grafic de amortizare?",
                answer: "Un grafic de amortizare este un tabel care arată fiecare plată lunară descompusă în porțiunile de principal și dobândă, împreună cu soldul rămas. Ilustrează cum soldul împrumutului scade în timp și cum proporția fiecărei plăți care merge către principal crește pe măsură ce împrumutul avansează.",
            },
            {
                question: "Este acest calculator precis pentru creditul meu ipotecar?",
                answer: "Acest calculator oferă estimări precise pentru împrumuturi cu rată fixă folosind formula standard de amortizare. Cu toate acestea, plățile efective ale creditului ipotecar pot diferi ușor din cauza impozitelor pe proprietate, asigurării locuinței, PMI (asigurare ipotecară privată) și taxelor HOA, care sunt adesea incluse în plata lunară totală dar nu fac parte din calculul împrumutului în sine.",
            },
            {
                question: "Pentru ce tipuri de împrumuturi funcționează acest calculator?",
                answer: "Acest calculator funcționează pentru orice împrumut amortizabil cu rată fixă, inclusiv credite ipotecare, credite auto, credite personale, credite studențești și credite de afaceri. Calculează plățile pe baza metodei standard de amortizare cu plăți egale utilizată de majoritatea creditorilor.",
            },
            {
                question: "De ce cea mai mare parte a plății inițiale merge către dobândă?",
                answer: "Dobânda se calculează pe soldul rămas în fiecare lună. Când soldul este mare la începutul împrumutului, taxa de dobândă este mare, lăsând mai puțin din fiecare plată pentru reducerea principalului. Pe măsură ce plătiți soldul, porțiunea de dobândă scade și mai mult din fiecare plată merge către principal. Aceasta este o caracteristică naturală a împrumuturilor amortizabile.",
            },
            {
                question: "Pot folosi acest calculator pe telefonul meu?",
                answer: "Da, calculatorul nostru de rate este complet responsiv și funcționează perfect pe smartphone-uri, tablete și calculatoare desktop. Pur și simplu deschideți pagina în browser-ul mobil și începeți să calculați instant, fără a fi nevoie de descărcarea unei aplicații.",
            },
        ],
    },
    cta: {
        title: "Explorează Celelalte Instrumente Financiare",
        description: "Gestionează fiecare aspect al finanțelor tale cu calculatoarele și urmăritoarele noastre gratuite și ușor de utilizat.",
    },
};

export default loanRepaymentCalculatorDictionary;
