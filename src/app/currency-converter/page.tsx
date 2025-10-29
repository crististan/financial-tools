'use client';

import type { ChangeEvent } from 'react';
import { useState, useEffect } from 'react';
import Section from "@/components/section";
import Container from "@/components/container";
import DefaultHero from "@/components/default-hero";
import CurrencyInput from '@/components/tools/currency-converter/currency-input';

export default function CurrencyConverter() {
    const currencies = [
        { code: 'usd', name: 'USD - US Dollar'},
        { code: 'eur', name: 'EUR - Euro'},
        { code: 'gbp', name: 'GBP - British Pound'},
        { code: 'jpy', name: 'JPY - Japanese Yen'},
        { code: 'aud', name: 'AUD - Australian Dollar'},
        { code: 'cad', name: 'CAD - Canadian Dollar'},
        { code: 'chf', name: 'CHF - Swiss Franc'},
        { code: 'cny', name: 'CNY - Chinese Yuan'},
        { code: 'sek', name: 'SEK - Swedish Krona'},
        { code: 'nzd', name: 'NZD - New Zealand Dollar'}
    ];

    const [amount, setAmount] = useState(0);
    const [from, setFrom] = useState(currencies[0].code);
    const [to, setTo] = useState(currencies[1].code);
    const [result, setResult] = useState(0);

    function changeAmount(e: ChangeEvent<HTMLInputElement>) {
        setAmount(parseFloat(e.target.value));
    }

    function changeCurrency(e: ChangeEvent<HTMLSelectElement>, type: 'from' | 'to') {
        if (type === 'from') {
            setFrom(e.target.value);
        } else {
            setTo(e.target.value);
        }
    }

    function switchCurrencies() {
        let a = to;
        setTo(from);
        setFrom(a);
    }

    useEffect(() => {
        setResult(amount * 1.2);

        console.log(`Convert ${amount} from ${from} to ${to}.`);
    }, [amount, from, to]);

    return (
        <>
            <DefaultHero
                headline="Currency converter"
                description="Convert currencies quickly and reliably with up-to-date exchange rates."
            />
            <Section>
                <Container>
                    <div className="w-full max-w-[320px] mx-auto bg-[var(--clr-neutral-1000)] border-1 border-[var(--clr-neutral-900)] rounded-lg p-1">
                        <form>
                            <CurrencyInput
                                label="From"
                                value={amount}
                                currencies={currencies}
                                selectedCurrency={from}
                                onChangeInput={changeAmount}
                                onChangeSelect={(e) => changeCurrency(e, 'from')}
                            />
                            <div className="my-1 bg-[var(--clr-neutral-800)] relative">
                                <button 
                                    type="button"
                                    className="w-10 h-10 rounded-[50%] bg-[var(--clr-green-500)] grid place-items-center absolute top-3/6 left-2/4 -translate-1/2 rotate-0 hover:rotate-180 hover:cursor-pointer transition-all duration-500"
                                    onClick={switchCurrencies}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="var(--clr-neutral-1000)" className="bi bi-arrow-repeat" viewBox="0 0 16 16">
                                        <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41m-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9"/>
                                        <path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5 5 0 0 0 8 3M3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9z"/>
                                    </svg>
                                </button>
                            </div>
                            <CurrencyInput
                                label="To"
                                value={result}
                                currencies={currencies}
                                selectedCurrency={to}
                                isReadOnly={true}
                                onChangeSelect={(e) => changeCurrency(e, 'to')}
                            />
                        </form>
                    </div>
                </Container>
            </Section>
        </>
    );
}