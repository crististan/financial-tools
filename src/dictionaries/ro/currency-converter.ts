import type { CurrencyConverterDictionary } from "../en/currency-converter";

const currencyConverterDictionary: CurrencyConverterDictionary = {
    meta: {
        title: "Convertor Valutar Gratuit | Cursuri de Schimb în Timp Real",
        description: "Convertește între 10 valute principale cu convertorul nostru valutar online gratuit. Obține cursuri de schimb instant pentru USD, EUR, GBP, JPY și altele.",
        keywords: [
            "convertor valutar",
            "cursuri de schimb",
            "USD în EUR",
            "convertire valută",
            "schimb valutar",
            "calculator valutar",
            "convertor bani",
        ],
    },
    hero: {
        headline: "Convertor Valutar",
        description: "Convertește valutele rapid și sigur cu cursuri de schimb actualizate. Suportă 10 valute principale din lume.",
    },
    converter: {
        fromLabel: "Din",
        toLabel: "În",
        amountPlaceholder: "Introduceți suma",
        switchButtonAriaLabel: "Inversează valutele",
        rateDisplay: "1 {from} = {rate} {to}",
        lastUpdated: "Ultima actualizare: {date}",
    },
    howItWorks: {
        sectionTitle: "Cum să Convertești Valuta Online",
        steps: [
            {
                number: 1,
                icon: "keyboard",
                title: "Introduceți Suma",
                description: "Tastați suma pe care doriți să o convertiți în câmpul de introducere. Convertorul nostru acceptă orice valoare de la 0,01 la 999.999.999.",
            },
            {
                number: 2,
                icon: "arrowLeftRight",
                title: "Selectați Valutele",
                description: "Alegeți valuta sursă și valuta țintă din meniurile derulante. Suportăm 10 valute principale din lume.",
            },
            {
                number: 3,
                icon: "zap",
                title: "Obțineți Rezultate Instant",
                description: "Conversia se calculează automat în timp real. Fără butoane de apăsat, fără așteptare. Rezultatele se actualizează pe măsură ce tastați.",
            },
        ],
    },
    ratesTable: {
        sectionTitle: "Cursuri de Schimb Populare",
        sectionDescription: "Comparați cursurile de schimb între cele mai tranzacționate perechi valutare din lume.",
        headers: {
            pair: "Pereche Valutară",
            rate: "Curs de Schimb",
            inverseRate: "Curs Invers",
        },
    },
    features: {
        sectionTitle: "De Ce Să Folosești Convertorul Nostru Valutar",
        sectionDescription: "Funcționalități de încredere concepute pentru conversii valutare precise și fără bătăi de cap.",
        items: [
            {
                icon: "refreshCw",
                title: "Cursuri de Schimb în Timp Real",
                description: "Cursurile noastre sunt actualizate regulat pentru a reflecta cele mai recente condiții de piață, asigurând conversii mereu precise.",
            },
            {
                icon: "globe",
                title: "10+ Valute Principale",
                description: "Convertește între USD, EUR, GBP, JPY și alte 6 valute principale folosite în comerțul și călătoriile internaționale.",
            },
            {
                icon: "badgeDollarSign",
                title: "100% Gratuit pentru Totdeauna",
                description: "Fără taxe ascunse, fără niveluri premium, fără abonamente. Convertorul nostru valutar este complet gratuit, întotdeauna.",
            },
            {
                icon: "userX",
                title: "Fără Înregistrare Necesară",
                description: "Începeți să convertiți valute instant. Fără creare de cont, fără verificare email, fără colectare de date personale.",
            },
        ],
    },
    educational: {
        sectionTitle: "Înțelegerea Schimbului Valutar",
        articles: [
            {
                title: "Ce Influențează Mișcările Cursurilor de Schimb?",
                content: "Cursurile de schimb sunt influențate de un joc complex de factori economici. Diferențele de rate ale dobânzii între țări, ratele inflației, balanțele comerciale și stabilitatea politică joacă toate roluri semnificative. Când o țară crește ratele dobânzii, moneda sa se întărește de obicei, pe măsură ce investitorii străini caută randamente mai mari. Invers, inflația ridicată erodează puterea de cumpărare și tinde să slăbească o monedă în timp.",
            },
            {
                title: "Cele Mai Tranzacționate Valute din Lume",
                content: "Dolarul american domină piețele globale de schimb valutar, fiind implicat în aproximativ 88% din toate tranzacțiile. Euro urmează ca a doua cea mai tranzacționată valută, reprezentând aproximativ 31% din tranzacții. Yenul japonez, lira sterlină și dolarul australian completează top cinci. Împreună, aceste cinci valute reprezintă marea majoritate din cele 7,5 trilioane de dolari tranzacționate zilnic pe piețele forex.",
            },
            {
                title: "Sfaturi pentru a Obține Cele Mai Bune Cursuri de Schimb",
                content: "Pentru a maximiza valoarea schimbului valutar, comparați cursurile de la mai mulți furnizori înainte de a converti. Evitați schimbul de bani la aeroporturi sau hoteluri, unde cursurile sunt de obicei nefavorabile. Luați în considerare utilizarea convertoarelor online pentru a verifica cursurile înainte de a vizita un birou de schimb fizic. Pentru sume mari, chiar și diferențe mici în cursurile de schimb se pot traduce în economii semnificative.",
            },
        ],
    },
    faq: {
        sectionTitle: "Întrebări Frecvente",
        items: [
            {
                question: "Cum funcționează un convertor valutar?",
                answer: "Un convertor valutar folosește cursurile de schimb actuale pentru a calcula cât valorează o monedă în alta. Introduceți o sumă, selectați valutele sursă și țintă, iar convertorul înmulțește suma cu cursul de schimb pentru a afișa valoarea echivalentă.",
            },
            {
                question: "Ce sunt cursurile de schimb și cum sunt determinate?",
                answer: "Cursurile de schimb reprezintă valoarea unei monede în raport cu alta. Sunt determinate de cererea și oferta de pe piețele valutare, influențate de factori precum ratele dobânzii, inflația, balanțele comerciale și stabilitatea economică.",
            },
            {
                question: "Care este diferența între cursul bid și ask?",
                answer: "Cursul bid este prețul la care un dealer va cumpăra o monedă, în timp ce cursul ask este prețul la care o va vinde. Diferența dintre cele două se numește spread, care reprezintă marja de profit a dealer-ului.",
            },
            {
                question: "De ce fluctuează cursurile de schimb?",
                answer: "Cursurile de schimb fluctuează din cauza schimbărilor în indicatorii economici, evenimentele geopolitice, politicile băncilor centrale, speculația pieței și diferențele de rate ale dobânzii între țări. Acești factori afectează cererea și oferta pentru fiecare monedă.",
            },
            {
                question: "Care sunt cele mai tranzacționate valute din lume?",
                answer: "Cele mai tranzacționate valute sunt Dolarul American (USD), Euro (EUR), Yenul Japonez (JPY), Lira Sterlină (GBP) și Dolarul Australian (AUD). USD este implicat în aproximativ 88% din toate tranzacțiile valutare.",
            },
            {
                question: "Este mai bine să schimbi valuta la bancă sau online?",
                answer: "Serviciile de schimb valutar online oferă de obicei cursuri mai competitive decât băncile, deoarece au costuri operaționale mai mici. Cu toate acestea, băncile oferă securitate suplimentară și sunt potrivite pentru tranzacții mari. Comparați întotdeauna cursurile și comisioanele înainte de a schimba.",
            },
            {
                question: "Ce este o pereche valutară?",
                answer: "O pereche valutară arată cursul de schimb între două monede. Prima monedă listată este moneda de bază, iar a doua este moneda cotată. De exemplu, USD/EUR = 0,92 înseamnă că 1 Dolar American este egal cu 0,92 Euro.",
            },
            {
                question: "Cât de des se actualizează cursurile de schimb?",
                answer: "Cursurile noastre de schimb sunt actualizate regulat pe parcursul zilei pentru a reflecta condițiile actuale ale pieței. Pentru tranzacțiile cele mai sensibile la timp, vă recomandăm să verificați cursurile imediat înainte de conversie, deoarece piețele forex funcționează 24 de ore pe zi, cinci zile pe săptămână.",
            },
            {
                question: "Pot converti valute pe telefonul mobil?",
                answer: "Da, convertorul nostru valutar este complet responsiv și funcționează pe orice dispozitiv, inclusiv smartphone-uri, tablete și calculatoare desktop. Pur și simplu deschideți pagina în browser-ul mobil și începeți să convertiți imediat, fără a fi nevoie de descărcarea unei aplicații.",
            },
            {
                question: "Ce este cursul de schimb mid-market?",
                answer: "Cursul mid-market, numit și cursul interbancar, este punctul de mijloc între prețurile de cumpărare și vânzare ale două monede pe piața globală. Este considerat cel mai corect curs de schimb și este cursul pe care îl afișează convertorul nostru. Băncile și serviciile de schimb adaugă de obicei un adaos la acest curs ca marjă de profit.",
            },
        ],
    },
    cta: {
        title: "Explorează Celelalte Instrumente Financiare",
        description: "Gestionează fiecare aspect al finanțelor tale cu calculatoarele și urmăritoarele noastre gratuite și ușor de utilizat.",
    },
    options: {
        USD: "Dolar American",
        EUR: "Euro",
        GBP: "Liră Sterlină",
        JPY: "Yen Japonez",
        AUD: "Dolar Australian",
        CAD: "Dolar Canadian",
        CHF: "Franc Elvețian",
        CNY: "Yuan Chinezesc",
        SEK: "Coroană Suedeză",
        NZD: "Dolar Neozeelandez",
    },
};

export default currencyConverterDictionary;
